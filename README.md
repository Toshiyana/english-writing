# IELTS Academic Writing 練習

Next.jsで作られたIELTS Academic Writing Task 1・Task 2の練習アプリです。ログインしなくてもすべての練習機能を利用でき、Supabase Authを設定すると任意でアカウントを作成・ログインできます。

## ローカル起動

```bash
node .codex/setup.mjs
pnpm dev
```

[http://localhost:3000](http://localhost:3000) を開いてください。

## Supabase Authの設定

1. Supabaseでプロジェクトを作成します。
2. Supabase Dashboardの **Connect** からProject URLとPublishable keyを取得します。Secret keyや`service_role` keyはブラウザへ公開しないでください。
3. `.env.example`を`.env.local`へコピーし、値を設定します。

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-key
```

4. Supabase Dashboardの **Authentication > URL Configuration** でSite URLを設定します。ローカル開発では `http://localhost:3000`、本番では実際の公開URLを指定してください。
5. 必要に応じてRedirect URLsへローカルURLと本番URLを追加します。
6. 開発サーバーを再起動します。

メール確認が有効な場合、新規登録後に確認メールが送信されます。パスワード再設定メールも同じSite URL／Redirect URLs設定を使用するため、本番URLが許可されていることを確認してください。本番運用では、AuthenticationのSMTP SettingsからカスタムSMTPを設定してください。

未ログイン時の練習履歴は引き続きブラウザのローカルストレージに保存されます。ログイン済み履歴のクラウド同期はまだ行いません。

## Secret scanning

[Betterleaks](https://github.com/betterleaks/betterleaks)は、コミット前にステージ済みの変更を、CIではGit履歴全体を検査します。ローカルフックを利用する場合はpre-commitとDockerをインストールし、次を実行してください。

```bash
pre-commit install
```

手動で実行する場合：

```bash
pre-commit run betterleaks
```

## 確認コマンド

```bash
pnpm lint
pnpm typecheck
pnpm build
```
