import { PromptVisual } from "@/components/prompt-visual";
import { Button } from "@/components/ui/button";
import type { Attempt } from "@/lib/types";
import { PROMPT_TYPE_LABEL, TASK_CONFIG, TASK_LABEL } from "@/lib/types";
import { cn, formatClock } from "@/lib/utils";
import { Pause, Play } from "lucide-react";

type WriteViewProps = {
  attempt: Attempt;
  paused: boolean;
  remainingSeconds: number;
  onBody: (body: string) => void;
  onTogglePause: () => void;
  onSubmit: () => void;
};

const TASK1_CHECKS = [
  "主な特徴を選び、overviewを考えた",
  "比較するグループを決めた",
  "数値・単位・年代を確認した",
  "データにない原因や意見を加えない",
] as const;

const TASK2_CHECKS = [
  "設問のすべての指示を確認した",
  "自分の立場を一文で言える",
  "各段落の中心となる主張を決めた",
  "最後の数分を見直しに残す",
] as const;

export function WriteView({ attempt, paused, remainingSeconds, onBody, onTogglePause, onSubmit }: WriteViewProps) {
  const overtime = remainingSeconds <= 0;
  const warn = remainingSeconds > 0 && remainingSeconds <= 5 * 60;
  const minWords = TASK_CONFIG[attempt.task].minWords;
  const reached = attempt.wordCount >= minWords;
  const checks = attempt.task === "task1" ? TASK1_CHECKS : TASK2_CHECKS;

  return (
    <div className={cn("mx-auto flex min-h-[100dvh] w-full flex-col gap-4 py-4", attempt.task === "task1" ? "max-w-7xl" : "max-w-3xl")}>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <div className="flex items-baseline gap-3">
          <span className={cn("font-mono text-2xl tabular-nums", (overtime || warn) && "text-warn")}>{formatClock(remainingSeconds)}</span>
          <span className="text-xs text-ink-muted">/ {Math.round(attempt.durationSeconds / 60)}分 · {TASK_LABEL[attempt.task]}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onTogglePause}>{paused ? <><Play className="size-3.5" />再開</> : <><Pause className="size-3.5" />一時停止</>}</Button>
          <Button size="sm" onClick={onSubmit}>提出する</Button>
        </div>
      </header>

      {paused ? <p className="rounded-md bg-paper-raised px-3 py-2 text-sm text-ink-muted">一時停止中です。タイマーは進みません。</p> : null}
      {warn && !paused ? <p className="rounded-md bg-warn-soft px-3 py-2 text-sm text-warn">残り5分です。</p> : null}
      {overtime && !paused ? <p className="rounded-md bg-warn-soft px-3 py-2 text-sm text-warn">制限時間を超えました。提出するか、このまま書き続けられます。</p> : null}

      <div className={cn("grid min-h-0 flex-1 gap-4", attempt.task === "task1" && "lg:grid-cols-[minmax(0,1fr)_minmax(26rem,0.85fr)]")}>
        <section className={cn("rounded-lg border border-line bg-paper-raised p-4", attempt.task === "task1" && "self-start lg:sticky lg:top-4")}>
          <p className="text-xs text-ink-muted">{PROMPT_TYPE_LABEL[attempt.promptType]} · 最低 {minWords}語</p>
          {attempt.promptVisual ? <div className="mt-3"><PromptVisual visual={attempt.promptVisual} /></div> : null}
          <p className="mt-3 font-serif text-sm leading-7 text-ink">{attempt.promptTitle}</p>
          <details className="group mt-4 border-t border-line pt-3">
            <summary className="cursor-pointer list-none text-xs font-medium text-accent marker:content-none"><span className="inline-flex items-center gap-2"><span aria-hidden="true" className="text-base leading-none group-open:rotate-45">＋</span>書く前に確認</span></summary>
            <ul className="mt-3 grid gap-2 text-xs leading-5 text-ink-muted sm:grid-cols-2">
              {checks.map((check) => <li key={check}>□ {check}</li>)}
            </ul>
          </details>
        </section>

        <div className="flex min-h-[34rem] flex-col gap-3">
          <textarea value={attempt.body} onChange={(event) => onBody(event.target.value)} placeholder={attempt.task === "task1" ? "Write your report here." : "Write your essay here."} className="min-h-[30rem] flex-1 resize-none rounded-lg border border-line bg-paper-raised p-4 font-serif text-base leading-8 text-ink outline-none placeholder:text-ink-muted/50 focus:border-accent" />
          <footer className="flex items-center justify-between text-sm">
            <span className={reached ? "text-ok" : "text-ink-muted"}>{attempt.wordCount} / {minWords} words{reached ? " · 最低語数に到達" : " · 不足"}</span>
            <span className="text-xs text-ink-muted">自動保存しています</span>
          </footer>
        </div>
      </div>
    </div>
  );
}
