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
- `GET /messages` / `POST /messages` — テーブルの読み書き例。どちらも `Authorization: Bearer <ADMIN_TOKEN>` が必要です。portal の「環境変数」で 32 文字以上の `ADMIN_TOKEN`(例: `openssl rand -hex 32`)を設定するまでは常に 401 です。

> 訪問者からの入力(お問い合わせなど)を公開で受け付ける場合は、このルートを認証なしにせず、portal の「フォーム」機能(https://portal.com-intro.com/dev/docs/forms)を使ってください。`job.js` は「定期実行」に登録したときだけ動き、削除した行は元に戻せません。

ローカルで試す場合: `DATABASE_URL=postgres://… ADMIN_TOKEN=$(openssl rand -hex 32) npm start`

詳しい説明: https://portal.com-intro.com/dev/docs/node

中国語ドキュメント: https://portal.com-intro.com/dev/docs/zh/node

---

## 中文

# COM INTRO 站点模板(Node 应用)

基于 Express + PostgreSQL(`pg`)的小型模板,可在 `<前缀>.com-intro.com` 上运行。

### 开始使用

1. 在本页点击 **「Use this template」**,创建你自己的仓库。
2. 在 portal(https://portal.com-intro.com/dev/)以类型 **「Node アプリ」(Node 应用)** 创建站点(如需使用数据库,请同时选择「数据库」)。设置码只会显示一次。
3. 在克隆下来的仓库文件夹中执行 `npm install`。添加或更改依赖后,请同时提交 `package-lock.json`(workflow 使用 `npm ci`)。
4. 在同一文件夹中执行下面的命令并粘贴设置码(提示信息可用 `COMINTRO_LANG=zh` 切换为中文)。
   ```
   npx comintro init
   ```
5. 执行 `git commit && git push`,Actions 会构建并部署。

`.github/workflows/comintro.yml` 由 `npx comintro init` 生成,因此本模板中不包含。`Dockerfile` 由 workflow 自动生成(请不要自己放置)。

### 结构

- `server.js` — `npm start`。启动时先执行迁移(创建 `messages` 表),然后监听 `$PORT`。`GET /` 返回 200。
- `db.js` — 连接与迁移。没有 `DATABASE_URL` 时会输出日志并仅停用数据库功能(应用仍会启动)。
- `job.js` — `npm run job`。可登记到 portal「定期执行」的示例(删除 30 天前的行)。
- `GET /messages` / `POST /messages` — 读写该表的示例。两者都需要 `Authorization: Bearer <ADMIN_TOKEN>`。在 portal「环境变量」里设置 32 个字符以上的 `ADMIN_TOKEN`(例: `openssl rand -hex 32`)之前一律返回 401。

> 如需公开接收访客输入(咨询等),请不要去掉这条路由的认证,而是使用 portal 的「表单」功能(https://portal.com-intro.com/dev/docs/zh/forms)。`job.js` 只有登记到「定期执行」后才会运行,删除的行无法恢复。

本地试用: `DATABASE_URL=postgres://… ADMIN_TOKEN=$(openssl rand -hex 32) npm start`

详细说明: https://portal.com-intro.com/dev/docs/zh/node
