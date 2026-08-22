import { Button } from "@/components/ui/button";
import type { Attempt } from "@/lib/types";
import { QUESTION_TYPE_LABEL } from "@/lib/types";
import { formatClock, formatDateTime } from "@/lib/utils";
import { TASK2_MIN_WORDS } from "@/lib/word-count";

type ResultViewProps = {
  attempt: Attempt;
  onHome: () => void;
  onAnother: () => void;
};

export function ResultView({ attempt, onHome, onAnother }: ResultViewProps) {
  const reached = attempt.wordCount >= TASK2_MIN_WORDS;
  const withinTime = attempt.elapsedSeconds <= attempt.durationSeconds;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <header>
        <p className="text-xs tracking-[0.18em] text-ink-muted uppercase">
          Result
        </p>
        <h1 className="mt-1 font-serif text-3xl text-ink">提出しました</h1>
        <p className="mt-2 text-sm text-ink-muted">
          {formatDateTime(attempt.submittedAt ?? attempt.startedAt)}
        </p>
      </header>

      <dl className="grid grid-cols-2 gap-3">
        <Stat
          label="語数"
          value={`${attempt.wordCount} / ${TASK2_MIN_WORDS}`}
          ok={reached}
          note={reached ? "到達" : "不足"}
        />
        <Stat
          label="所要時間"
          value={`${formatClock(attempt.elapsedSeconds)} / ${Math.round(attempt.durationSeconds / 60)}:00`}
          ok={withinTime}
          note={withinTime ? "制限内" : "超過"}
        />
      </dl>

      <section className="rounded-lg border border-line bg-paper-raised p-5">
        <p className="text-xs text-ink-muted">
          {QUESTION_TYPE_LABEL[attempt.promptType]}
        </p>
        <p className="mt-2 font-serif text-sm leading-7 text-ink">
          {attempt.promptTitle}
        </p>
      </section>

      <section>
        <h2 className="text-xs text-ink-muted">本文</h2>
        <p className="mt-3 whitespace-pre-wrap font-serif text-base leading-8 text-ink">
          {attempt.body || "（未入力）"}
        </p>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button onClick={onAnother}>もう1題</Button>
        <Button variant="outline" onClick={onHome}>
          ホーム
        </Button>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  ok,
  note,
}: {
  label: string;
  value: string;
  ok: boolean;
  note: string;
}) {
  return (
    <div className="rounded-lg border border-line bg-paper-raised p-4">
      <dt className="text-xs text-ink-muted">{label}</dt>
      <dd className="mt-1 font-mono text-lg text-ink">{value}</dd>
      <p className={`mt-1 text-xs ${ok ? "text-ok" : "text-warn"}`}>{note}</p>
    </div>
  );
}
