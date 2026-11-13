# COM INTRO サイトテンプレート(Node アプリ)

Express + PostgreSQL(`pg`)の小さなひな形です。`<プレフィックス>.com-intro.com` で動きます。

## はじめかた

1. このページの **「Use this template」** で、自分のリポジトリを作ります。
2. portal(https://portal.com-intro.com/dev/)で、種類 **「Node アプリ」**(データベースを使うなら「データベース」も選択)でサイトを作成します。セットアップコードは一度しか表示されません。
3. リポジトリをクローンしたフォルダで `npm install` を実行します。依存を追加・変更したら `package-lock.json` も一緒にコミットしてください(workflow は `npm ci` を使います)。
4. 同じフォルダで次を実行し、セットアップコードを貼り付けます。
   ```
   npx comintro init
   ```
5. `git commit && git push` で、Actions がビルドしてデプロイします。

`.github/workflows/comintro.yml` は `npx comintro init` が作るため、このテンプレートには含まれていません。`Dockerfile` は workflow が自動で書き出します(自分で置かないでください)。

## 構成

- `server.js` — `npm start`。起動時にマイグレーション(`messages` テーブルを作成)を実行してから `$PORT` で待ち受けます。`GET /` は 200 を返します。
- `db.js` — 接続とマイグレーション。`DATABASE_URL` が無い場合はログを出して DB 機能だけ無効になります(アプリは起動します)。
- `job.js` — `npm run job`。portal の「定期実行」に登録できるサンプル(30 日より古い行を削除)。
- `GET /messages` / `POST /messages` — テーブルの読み書き例。

ローカルで試す場合: `DATABASE_URL=postgres://… npm start`

詳しい説明: https://portal.com-intro.com/dev/docs/node
