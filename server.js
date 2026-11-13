'use strict';
const crypto = require('crypto');
const express = require('express');
const { pool, migrate } = require('./db');

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' }));

// 動作確認用のトップページ(プラットフォームの HTTP ヘルスチェックはありません。プロセスが動いていれば正常とみなされます)
app.get('/', (req, res) => {
  res.type('text/plain; charset=utf-8').send('COM INTRO Node アプリが動いています。/messages を見てください。\n');
});

// /messages の読み書きには、portal の「環境変数」で設定した ADMIN_TOKEN(32 文字以上)が必要です。
// 未設定・32 文字未満なら常に 401。生成例: openssl rand -hex 32
// 例: curl -H 'Authorization: Bearer <ADMIN_TOKEN>' https://<プレフィックス>.com-intro.com/messages
// 訪問者からの入力を公開で受け付けたい場合は、このルートを公開せず portal の「フォーム」機能を使ってください。
function requireAdmin(req, res, next) {
  const token = process.env.ADMIN_TOKEN || '';
  const m = /^Bearer (\S+)$/.exec(req.get('authorization') || '');
  const a = crypto.createHash('sha256').update(m ? m[1] : '').digest();
  const b = crypto.createHash('sha256').update(token).digest();
  if (token.length < 32 || !m || !crypto.timingSafeEqual(a, b)) return res.status(401).json({ error: 'unauthorized' });
  next();
}

app.get('/messages', requireAdmin, async (req, res, next) => {
  if (!pool) return res.status(503).json({ error: 'database_not_configured' });
  try {
    const { rows } = await pool.query('SELECT id, body, created_at FROM messages ORDER BY id DESC LIMIT 20');
    res.json(rows);
  } catch (e) { next(e); }
});

// 例: curl -X POST -H 'Authorization: Bearer <ADMIN_TOKEN>' -H 'Content-Type: application/json' -d '{"body":"こんにちは"}' https://<プレフィックス>.com-intro.com/messages
app.post('/messages', requireAdmin, async (req, res, next) => {
  if (!pool) return res.status(503).json({ error: 'database_not_configured' });
  const body = req.body && typeof req.body.body === 'string' ? req.body.body.trim() : '';
  if (!body || body.length > 500) return res.status(400).json({ error: 'invalid_body' });
  try {
    const { rows } = await pool.query('INSERT INTO messages (body) VALUES ($1) RETURNING id', [body]);
    res.status(201).json({ id: rows[0].id });
  } catch (e) { next(e); }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'internal_error' });
});

migrate()
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, '0.0.0.0', () => console.log('listening on ' + port));
  })
  .catch(e => { console.error('[db] マイグレーションに失敗しました:', e.message); process.exit(1); });
