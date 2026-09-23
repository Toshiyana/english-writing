import { Button } from "@/components/ui/button";
import { AuthMenu } from "@/components/auth-menu";
import type { Attempt } from "@/lib/types";
import { PROMPT_TYPE_LABEL, TASK_CONFIG, TASK_LABEL } from "@/lib/types";
import { formatClock, formatDateTime } from "@/lib/utils";

const STATUS_LABEL = {
  in_progress: "途中",
  completed: "提出",
  time_up: "時間切れ",
} as const;

type HistoryViewProps = {
  attempts: Attempt[];
  isAuthenticated: boolean;
  onBack: () => void;
  onOpen: (attempt: Attempt) => void;
};

export function HistoryView({ attempts, isAuthenticated, onBack, onOpen }: HistoryViewProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-ink">履歴</h1>
        <Button variant="ghost" onClick={onBack}>
          戻る
        </Button>
      </header>

      {!isAuthenticated ? (
        <section className="rounded-lg border border-line bg-paper-raised p-5">
          <p className="text-sm font-medium text-ink">履歴の利用にはログインが必要です</p>
          <p className="mt-1 text-sm leading-6 text-ink-muted">
            ゲスト中の回答は保存されません。ログイン後の練習は自動保存されます。
          </p>
          <div className="mt-4">
            <AuthMenu />
          </div>
        </section>
      ) : attempts.length === 0 ? (
        <p className="text-sm text-ink-muted">まだ提出した練習はありません。</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {attempts.map((attempt) => (
            <li key={attempt.id}>
              <button
                type="button"
                onClick={() => onOpen(attempt)}
                className="w-full rounded-lg border border-line bg-paper-raised px-4 py-3 text-left hover:border-accent"
              >
                <div className="flex items-center justify-between gap-3 text-xs text-ink-muted">
                  <span>{formatDateTime(attempt.startedAt)}</span>
                  <span>{attempt.sourceAttemptId ? "書き直し · " : ""}{STATUS_LABEL[attempt.status]}</span>
                </div>
                <p className="mt-2 line-clamp-2 font-serif text-sm leading-6 text-ink">
                  {attempt.promptTitle}
                </p>
                <p className="mt-2 text-xs text-ink-muted">
                  {TASK_LABEL[attempt.task]} · {PROMPT_TYPE_LABEL[attempt.promptType]} · {attempt.wordCount}{" "}
                  / {TASK_CONFIG[attempt.task].minWords}語 · {formatClock(attempt.elapsedSeconds)}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
