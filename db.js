'use strict';
// DATABASE_URL は portal で「データベース」を選んだサイトに自動で設定されます。
const { Pool } = require('pg');

const pool = process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL, max: 3 }) : null;

// 起動のたびに実行しても安全な(冪等な)マイグレーション
async function migrate() {
  if (!pool) {
    console.log('[db] DATABASE_URL が未設定です。データベース機能は無効です(portal で「データベース」を選んで作成したサイトでのみ使えます)。');
    return;
  }
  try {
    await pool.query('CREATE TABLE IF NOT EXISTS messages (id serial PRIMARY KEY, body text NOT NULL, created_at timestamptz NOT NULL DEFAULT now())');
  } catch (e) {
    // 25006 = read_only_sql_transaction:容量が 1.5GB を超えて読み取り専用になっている。
    // ここで落ちると再起動を繰り返すだけなので、読み込みだけで動き続ける(書き込みは失敗する)
    if (e && e.code === '25006') {
      console.error('[db] データベースが読み取り専用のため、マイグレーションをスキップしました。書き込みはできません(不要なデータを削除すると解除されます)。');
      return;
    }
    throw e;
  }
  console.log('[db] マイグレーション完了');
}

module.exports = { pool, migrate };
