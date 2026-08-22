import { Button } from "@/components/ui/button";
import type { Attempt, Prompt, QuestionType } from "@/lib/types";
import {
  DEFAULT_DURATION_MINUTES,
  DURATION_OPTIONS,
  QUESTION_TYPE_LABEL,
} from "@/lib/types";
import { RefreshCw } from "lucide-react";

const TYPE_FILTERS: Array<QuestionType | "all"> = [
  "all",
  "opinion",
  "discussion",
  "problem-solution",
  "two-part",
];

type HomeViewProps = {
  prompt: Prompt;
  typeFilter: QuestionType | "all";
  durationMinutes: number;
  inProgress: Attempt | null;
  onTypeFilter: (type: QuestionType | "all") => void;
  onShuffle: () => void;
  onDuration: (minutes: number) => void;
  onStart: () => void;
  onResume: () => void;
  onHistory: () => void;
};

export function HomeView({
  prompt,
  typeFilter,
  durationMinutes,
  inProgress,
  onTypeFilter,
  onShuffle,
  onDuration,
  onStart,
  onResume,
  onHistory,
}: HomeViewProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.18em] text-ink-muted uppercase">
            IELTS Academic
          </p>
          <h1 className="mt-1 font-serif text-3xl text-ink">Task 2 練習</h1>
        </div>
        <Button variant="ghost" onClick={onHistory}>
          履歴
        </Button>
      </header>

      {inProgress ? (
        <section className="rounded-lg border border-line bg-paper-raised p-4">
          <p className="text-xs text-ink-muted">途中の練習があります</p>
          <p className="mt-2 line-clamp-2 font-serif text-sm leading-relaxed">
            {inProgress.promptTitle}
          </p>
          <Button className="mt-4" onClick={onResume}>
            続きから
          </Button>
        </section>
      ) : null}

      <section className="flex flex-col gap-3">
        <p className="text-xs text-ink-muted">出題タイプ</p>
        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onTypeFilter(type)}
              className={`h-8 rounded-full px-3 text-xs ${
                typeFilter === type
                  ? "bg-accent text-accent-foreground"
                  : "border border-line text-ink-muted hover:bg-paper-raised"
              }`}
            >
              {type === "all" ? "すべて" : QUESTION_TYPE_LABEL[type]}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-line bg-paper-raised p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-ink-muted">
            {QUESTION_TYPE_LABEL[prompt.type]}
          </span>
          <Button variant="ghost" size="sm" onClick={onShuffle}>
            <RefreshCw className="size-3.5" />
            別のお題
          </Button>
        </div>
        <p className="mt-4 font-serif text-[1.05rem] leading-8 text-ink">
          {prompt.title}
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <p className="text-xs text-ink-muted">制限時間</p>
        <div className="flex gap-2">
          {DURATION_OPTIONS.map((minutes) => (
            <button
              key={minutes}
              type="button"
              onClick={() => onDuration(minutes)}
              className={`h-10 flex-1 rounded-md text-sm ${
                durationMinutes === minutes
                  ? "bg-accent text-accent-foreground"
                  : "border border-line text-ink-muted hover:bg-paper-raised"
              }`}
            >
              {minutes}分
              {minutes === DEFAULT_DURATION_MINUTES ? "（本番）" : ""}
            </button>
          ))}
        </div>
      </section>

      <Button size="lg" onClick={onStart}>
        このお題で書き始める
      </Button>
    </div>
  );
}
