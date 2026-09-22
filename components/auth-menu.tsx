"use client";

import { Button } from "@/components/ui/button";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { LogIn, LogOut, UserRound, X } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";

type AuthMode =
  | "sign-in"
  | "sign-up"
  | "forgot-password"
  | "update-password"
  | "password-updated";

const MODE_COPY: Record<
  AuthMode,
  { title: string; description: string }
> = {
  "sign-in": {
    title: "ログイン",
    description:
      "ログインは任意です。閉じても、すべての練習機能をそのまま利用できます。",
  },
  "sign-up": {
    title: "アカウント作成",
    description:
      "メールアドレスとパスワードでアカウントを作成します。",
  },
  "forgot-password": {
    title: "パスワードを再設定",
    description:
      "登録したメールアドレスへ、パスワード再設定用のリンクを送ります。",
  },
  "update-password": {
    title: "新しいパスワード",
    description: "新しいパスワードを入力してください。",
  },
  "password-updated": {
    title: "変更しました",
    description: "新しいパスワードを設定しました。ログイン状態は継続します。",
  },
};

export function AuthMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const initialInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!supabase) return;

    void supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === "PASSWORD_RECOVERY") {
        setMode("update-password");
        setOpen(true);
        setError(null);
        setMessage(null);
      }
    });

    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!open) return;
    if (initialInputRef.current) {
      initialInputRef.current.focus();
    } else {
      dialogRef.current?.focus();
    }
  }, [mode, open]);

  function closeDialog() {
    if (pending) return;
    setOpen(false);
    setError(null);
    setMessage(null);
    setPassword("");
    setPasswordConfirmation("");
    setMode("sign-in");
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError(null);
    setMessage(null);
    setPassword("");
    setPasswordConfirmation("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    setPending(true);
    setError(null);
    setMessage(null);

    if (mode === "forgot-password") {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo: window.location.origin },
      );

      setPending(false);
      if (resetError) {
        setError(resetError.message);
        return;
      }

      setMessage(
        "該当するアカウントがある場合、再設定用のメールを送信しました。",
      );
      return;
    }

    if (mode === "update-password") {
      if (password !== passwordConfirmation) {
        setPending(false);
        setError("パスワードが一致しません。");
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      setPending(false);
      if (updateError) {
        setError(updateError.message);
        return;
      }

      setPassword("");
      setPasswordConfirmation("");
      setMode("password-updated");
      return;
    }

    const result =
      mode === "sign-in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: window.location.origin },
          });

    setPending(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    if (mode === "sign-up" && !result.data.session) {
      setMessage("確認メールを送信しました。メール内のリンクを開いてください。");
      setPassword("");
      return;
    }

    setOpen(false);
    setPassword("");
  }

  async function cancelRecovery() {
    if (!supabase || pending) return;
    setPending(true);
    const { error: signOutError } = await supabase.auth.signOut();
    setPending(false);
    if (signOutError) {
      setError(signOutError.message);
      return;
    }
    setUser(null);
    closeDialog();
  }

  async function signOut() {
    if (!supabase) return;
    setPending(true);
    const { error: signOutError } = await supabase.auth.signOut();
    setPending(false);
    if (signOutError) {
      setError(signOutError.message);
      return;
    }
    setUser(null);
  }

  const isRecoveryFlow =
    mode === "update-password" || mode === "password-updated";
  const copy = MODE_COPY[mode];

  if (user && !isRecoveryFlow) {
    return (
      <div className="flex items-center gap-2">
        <span
          className="hidden max-w-44 truncate text-xs text-ink-muted sm:inline"
          title={user.email}
        >
          {user.email}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          disabled={pending}
          aria-label="ログアウト"
        >
          <LogOut className="size-3.5" />
          ログアウト
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <LogIn className="size-3.5" />
        ログイン
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/35 px-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isRecoveryFlow) {
              closeDialog();
            }
          }}
        >
          <section
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
            tabIndex={-1}
            className="w-full max-w-md rounded-xl border border-line bg-paper-raised p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs tracking-[0.16em] text-ink-muted uppercase">
                  Account
                </p>
                <h2 id="auth-title" className="mt-1 font-serif text-2xl text-ink">
                  {copy.title}
                </h2>
              </div>
              {!isRecoveryFlow ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeDialog}
                  aria-label="閉じる"
                >
                  <X className="size-4" />
                </Button>
              ) : null}
            </div>

            <p className="mt-3 text-sm leading-6 text-ink-muted">
              {copy.description}
            </p>

            {!isSupabaseConfigured ? (
              <p className="mt-5 rounded-md bg-warn-soft px-3 py-2 text-sm text-warn">
                Supabaseの環境変数が未設定です。READMEの手順に沿って設定してください。
              </p>
            ) : (
              <form className="mt-5 grid gap-4" onSubmit={submit}>
                {mode !== "update-password" &&
                mode !== "password-updated" ? (
                  <label className="grid gap-1.5 text-sm">
                    <span className="text-ink-muted">メールアドレス</span>
                    <input
                      ref={initialInputRef}
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="h-11 rounded-md border border-line bg-paper px-3 text-ink outline-none focus:border-accent"
                    />
                  </label>
                ) : null}

                {mode === "sign-in" ||
                mode === "sign-up" ||
                mode === "update-password" ? (
                  <label className="grid gap-1.5 text-sm">
                    <span className="text-ink-muted">
                      {mode === "update-password"
                        ? "新しいパスワード"
                        : "パスワード"}
                    </span>
                    <input
                      ref={mode === "update-password" ? initialInputRef : undefined}
                      type="password"
                      autoComplete={
                        mode === "sign-in" ? "current-password" : "new-password"
                      }
                      required
                      minLength={6}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="h-11 rounded-md border border-line bg-paper px-3 text-ink outline-none focus:border-accent"
                    />
                  </label>
                ) : null}

                {mode === "update-password" ? (
                  <label className="grid gap-1.5 text-sm">
                    <span className="text-ink-muted">新しいパスワード（確認）</span>
                    <input
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={6}
                      value={passwordConfirmation}
                      onChange={(event) =>
                        setPasswordConfirmation(event.target.value)
                      }
                      className="h-11 rounded-md border border-line bg-paper px-3 text-ink outline-none focus:border-accent"
                    />
                  </label>
                ) : null}

                {error ? (
                  <p role="alert" className="text-sm text-warn">
                    {error}
                  </p>
                ) : null}
                {message ? (
                  <p role="status" className="text-sm text-ok">
                    {message}
                  </p>
                ) : null}

                {mode === "password-updated" ? (
                  <Button type="button" onClick={closeDialog}>
                    続ける
                  </Button>
                ) : (
                  <Button type="submit" disabled={pending}>
                    <UserRound className="size-4" />
                    {pending
                      ? "処理中…"
                      : mode === "sign-in"
                        ? "ログインする"
                        : mode === "sign-up"
                          ? "登録する"
                          : mode === "forgot-password"
                            ? "再設定メールを送る"
                            : "パスワードを変更する"}
                  </Button>
                )}
              </form>
            )}

            {isSupabaseConfigured && mode === "sign-in" ? (
              <div className="mt-4 grid gap-2 text-center text-sm">
                <button
                  type="button"
                  onClick={() => switchMode("forgot-password")}
                  className="text-accent hover:underline"
                >
                  パスワードを忘れた場合
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("sign-up")}
                  className="text-accent hover:underline"
                >
                  初めての方はアカウントを作成
                </button>
              </div>
            ) : null}

            {isSupabaseConfigured &&
            (mode === "sign-up" || mode === "forgot-password") ? (
              <button
                type="button"
                onClick={() => switchMode("sign-in")}
                className="mt-4 w-full text-center text-sm text-accent hover:underline"
              >
                ログインへ戻る
              </button>
            ) : null}

            {mode === "update-password" ? (
              <button
                type="button"
                onClick={cancelRecovery}
                disabled={pending}
                className="mt-4 w-full text-center text-sm text-ink-muted hover:text-ink disabled:opacity-40"
              >
                キャンセルしてログアウト
              </button>
            ) : null}
          </section>
        </div>
      ) : null}
    </>
  );
}
