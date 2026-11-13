'use strict';
// portal の「定期実行」に `npm run job` を登録すると、定期的に実行されます(例: 古いデータの削除)。
// 登録しなければ実行されません。削除は元に戻せないため、実データで使う前に条件を見直してください。
const { pool } = require('./db');

(async () => {
  if (!pool) { console.log('[job] DATABASE_URL が未設定のため何もしません。'); return; }
  const r = await pool.query("DELETE FROM messages WHERE created_at < now() - interval '30 days'");
  console.log('[job] 30 日より古いメッセージを ' + r.rowCount + ' 件削除しました。');
  await pool.end();
})().catch(e => { console.error('[job] 失敗:', e.message); process.exit(1); });
