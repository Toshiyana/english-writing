import { Button } from "@/components/ui/button";
import type { Attempt } from "@/lib/types";
import { QUESTION_TYPE_LABEL } from "@/lib/types";
import { cn, formatClock } from "@/lib/utils";
import { TASK2_MIN_WORDS } from "@/lib/word-count";
import { Pause, Play } from "lucide-react";

type WriteViewProps = {
  attempt: Attempt;
  paused: boolean;
  remainingSeconds: number;
  onBody: (body: string) => void;
  onTogglePause: () => void;
  onSubmit: () => void;
};

export function WriteView({
  attempt,
  paused,
  remainingSeconds,
  onBody,
  onTogglePause,
  onSubmit,
}: WriteViewProps) {
  const overtime = remainingSeconds <= 0;
  const warn = remainingSeconds > 0 && remainingSeconds <= 5 * 60;
  const reached = attempt.wordCount >= TASK2_MIN_WORDS;

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-3xl flex-col gap-4 py-4">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <div className="flex items-baseline gap-3">
          <span
            className={cn(
              "font-mono text-2xl tabular-nums",
              (overtime || warn) && "text-warn",
            )}
          >
            {formatClock(remainingSeconds)}
          </span>
          <span className="text-xs text-ink-muted">
            / {Math.round(attempt.durationSeconds / 60)}分
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onTogglePause}>
            {paused ? (
              <>
                <Play className="size-3.5" />
                再開
              </>
            ) : (
              <>
                <Pause className="size-3.5" />
                一時停止
              </>
            )}
          </Button>
          <Button size="sm" onClick={onSubmit}>
            提出する
          </Button>
        </div>
      </header>

      {paused ? (
        <p className="rounded-md bg-paper-raised px-3 py-2 text-sm text-ink-muted">
          一時停止中です。タイマーは進みません。
        </p>
      ) : null}
      {warn && !paused ? (
        <p className="rounded-md bg-warn-soft px-3 py-2 text-sm text-warn">
          残り5分です。
        </p>
      ) : null}
      {overtime && !paused ? (
        <p className="rounded-md bg-warn-soft px-3 py-2 text-sm text-warn">
          制限時間を超えました。提出するか、このまま書き続けられます。
        </p>
      ) : null}

      <section className="rounded-lg border border-line bg-paper-raised p-4">
        <p className="text-xs text-ink-muted">
          {QUESTION_TYPE_LABEL[attempt.promptType]} · 最低 {TASK2_MIN_WORDS}語
        </p>
        <p className="mt-2 font-serif text-sm leading-7 text-ink">
          {attempt.promptTitle}
        </p>
      </section>

      <textarea
        value={attempt.body}
        onChange={(event) => onBody(event.target.value)}
        placeholder="Write your essay here."
        className="min-h-[28rem] flex-1 resize-none rounded-lg border border-line bg-paper-raised p-4 font-serif text-base leading-8 text-ink outline-none placeholder:text-ink-muted/50 focus:border-accent"
      />

      <footer className="flex items-center justify-between text-sm">
        <span className={reached ? "text-ok" : "text-ink-muted"}>
          {attempt.wordCount} / {TASK2_MIN_WORDS} words
          {reached ? " · 最低語数に到達" : " · 不足"}
        </span>
        <span className="text-xs text-ink-muted">自動保存しています</span>
      </footer>
    </div>
  );
}
