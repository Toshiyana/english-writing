# IELTS Academic Writing 練習

Next.jsで作られたIELTS Academic Writing Task 1・Task 2の練習アプリです。ログインしなくても練習できますが、途中経過と履歴をSupabase Databaseへ保存するにはログインが必要です。

## ローカル起動

```bash
node .codex/setup.mjs
pnpm dev
```

[http://localhost:3000](http://localhost:3000) を開いてください。

## Supabaseの設定

1. Supabaseでプロジェクトを作成します。
2. Supabase Dashboardの **Connect** からProject URLとPublishable keyを取得します。Secret keyや`service_role` keyはブラウザへ公開しないでください。
3. `.env.example`を`.env.local`へコピーし、値を設定します。

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-key
```

4. Supabase Dashboardの **Authentication > URL Configuration** でSite URLを設定します。ローカル開発では `http://localhost:3000`、本番では実際の公開URLを指定してください。
5. 必要に応じてRedirect URLsへローカルURLと本番URLを追加します。
6. **Authentication > Providers > Email** が有効になっていることを確認します。Anonymous Sign-InsとManual Linkingは使用しません。
7. `supabase/migrations/20260922160751_create_writing_attempts.sql`を適用します（接続済みの`english-writing-app`プロジェクトには適用済みです）。
8. 開発サーバーを再起動します。

未ログインでもTask 1・Task 2を最後まで利用できますが、回答は現在のタブのメモリだけに保持されます。再読み込みやタブを閉じると消え、履歴と途中再開は利用できません。ログイン中の練習だけがSupabaseへ自動保存されます。練習中や提出後にログインした場合は、その時点で開いている回答も保存されます。

メール確認とパスワード再設定はSite URL／Redirect URLs設定を使用します。本番運用では、AuthenticationのSMTP SettingsからカスタムSMTPを設定してください。

## AI参考バンドスコア

提出した答案は、TypeSafeのSystem Oneモデルを使ってIELTS Writingの4つの評価基準ごとの参考バンドを算出できます。これは練習用のAI推定であり、IELTS公式スコアや試験官による採点ではありません。

TypeSafeでAPIキーを作成し、`.env.local`へサーバー専用の環境変数として設定してください。`NEXT_PUBLIC_`は付けないでください。

```dotenv
TYPESAFE_API_KEY=your-typesafe-api-key
```

評価リクエストは`/api/assess`からサーバー側で送信され、APIキーはブラウザへ公開されません。Task 1では現在、図表画像内の数値をモデルへ渡していないため、数値の正確性は参考バンドの評価対象外です。

評価基準は[IELTS Writing Band Descriptors](https://ielts.org/cdn/ielts-guides/ielts-writing-band-descriptors.pdf)を参考にした要約です。

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
