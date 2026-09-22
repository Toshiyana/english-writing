import { AuthMenu } from "@/components/auth-menu";
import { PromptVisual } from "@/components/prompt-visual";
import { Button } from "@/components/ui/button";
import type { Attempt, Prompt, PromptType, Task1VisualType, Task2QuestionType, WritingTask } from "@/lib/types";
import { PROMPT_TYPE_LABEL, TASK_CONFIG, TASK_LABEL } from "@/lib/types";
import { RefreshCw } from "lucide-react";

const TASK1_FILTERS: Array<Task1VisualType | "all"> = ["all", "bar", "line", "pie", "table", "process", "map", "mixed"];
const TASK2_FILTERS: Array<Task2QuestionType | "all"> = ["all", "opinion", "discussion", "problem-solution", "two-part"];

type HomeViewProps = {
  task: WritingTask;
  prompt: Prompt;
  typeFilter: PromptType | "all";
  durationMinutes: number;
  inProgress: Attempt | null;
  isAuthenticated: boolean;
  onTask: (task: WritingTask) => void;
  onTypeFilter: (type: PromptType | "all") => void;
  onShuffle: () => void;
  onDuration: (minutes: number) => void;
  onStart: () => void;
  onResume: () => void;
  onHistory: () => void;
  onTips: () => void;
};

export function HomeView({ task, prompt, typeFilter, durationMinutes, inProgress, isAuthenticated, onTask, onTypeFilter, onShuffle, onDuration, onStart, onResume, onHistory, onTips }: HomeViewProps) {
  const filters = task === "task1" ? TASK1_FILTERS : TASK2_FILTERS;
  const config = TASK_CONFIG[task];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.18em] text-ink-muted uppercase">IELTS Academic</p>
          <h1 className="mt-1 font-serif text-3xl text-ink">Writing 練習</h1>
        </div>
        <div className="flex items-center gap-1"><AuthMenu /><Button variant="ghost" onClick={onTips}>Tips</Button><Button variant="ghost" onClick={onHistory}>履歴</Button></div>
      </header>

      {!isAuthenticated ? (
        <section className="rounded-lg border border-line bg-paper-raised px-4 py-3 text-sm leading-6 text-ink-muted">
          <p className="font-medium text-ink">ゲストとして練習できます</p>
          <p>
            未ログイン中は、この画面を閉じると回答が消え、履歴や途中保存も利用できません。ログインするとSupabaseへ自動保存されます。
          </p>
        </section>
      ) : null}

      {inProgress ? (
        <section className="rounded-lg border border-line bg-paper-raised p-4">
          <p className="text-xs text-ink-muted">途中の練習があります · {TASK_LABEL[inProgress.task]}</p>
          <p className="mt-2 line-clamp-2 font-serif text-sm leading-relaxed">{inProgress.promptTitle}</p>
          <Button className="mt-4" onClick={onResume}>続きから</Button>
        </section>
      ) : null}

      <section className="grid grid-cols-2 rounded-lg border border-line bg-paper-raised p-1">
        {(["task1", "task2"] as const).map((item) => (
          <button key={item} type="button" onClick={() => onTask(item)} className={`rounded-md py-3 text-sm font-medium transition-colors ${task === item ? "bg-accent text-accent-foreground" : "text-ink-muted hover:text-ink"}`}>
            {TASK_LABEL[item]}<span className="ml-2 text-xs opacity-75">{TASK_CONFIG[item].defaultDurationMinutes}分 / {TASK_CONFIG[item].minWords}語</span>
          </button>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <p className="text-xs text-ink-muted">出題タイプ</p>
        <div className="flex flex-wrap gap-2">
          {filters.map((type) => (
            <button key={type} type="button" onClick={() => onTypeFilter(type)} className={`h-8 rounded-full px-3 text-xs ${typeFilter === type ? "bg-accent text-accent-foreground" : "border border-line text-ink-muted hover:bg-paper-raised"}`}>
              {type === "all" ? "すべて" : PROMPT_TYPE_LABEL[type]}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-line bg-paper-raised p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-ink-muted">{TASK_LABEL[prompt.task]} · {PROMPT_TYPE_LABEL[prompt.type]}</span>
          <Button variant="ghost" size="sm" onClick={onShuffle}><RefreshCw className="size-3.5" />別のお題</Button>
        </div>
        {prompt.task === "task1" ? <div className="mt-4"><PromptVisual visual={prompt.visual} compact /></div> : null}
        <p className="mt-4 font-serif text-[1.05rem] leading-8 text-ink">{prompt.title}</p>
      </section>

      <section className="flex flex-col gap-3">
        <p className="text-xs text-ink-muted">制限時間</p>
        <div className="flex gap-2">
          {config.durationOptions.map((minutes) => (
            <button key={minutes} type="button" onClick={() => onDuration(minutes)} className={`h-10 flex-1 rounded-md text-sm ${durationMinutes === minutes ? "bg-accent text-accent-foreground" : "border border-line text-ink-muted hover:bg-paper-raised"}`}>
              {minutes}分{minutes === config.defaultDurationMinutes ? "（本番）" : ""}
            </button>
          ))}
        </div>
      </section>
      <Button size="lg" onClick={onStart}>このお題で書き始める</Button>
    </div>
  );
}
