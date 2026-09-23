import { Button } from "@/components/ui/button";
import { AuthMenu } from "@/components/auth-menu";
import { PromptVisual } from "@/components/prompt-visual";
import { WritingComparison } from "@/components/writing-comparison";
import type { Attempt } from "@/lib/types";
import { PROMPT_TYPE_LABEL, TASK_CONFIG, TASK_LABEL } from "@/lib/types";
import { formatClock, formatDateTime } from "@/lib/utils";
import {
  ASSESSMENT_CRITERION_LABEL,
  type AssessmentCriterionId,
  type WritingAssessment,
} from "@/lib/writing-assessment";
import { LoaderCircle, Sparkles } from "lucide-react";

type ResultViewProps = {
  attempt: Attempt;
  sourceAttempt: Attempt | null;
  sourceAssessment: WritingAssessment | null;
  assessment: WritingAssessment | null;
  assessmentLoading: boolean;
  assessmentError: string | null;
  isAuthenticated: boolean;
  onAssess: () => void;
  onHome: () => void;
  onAnother: () => void;
  onRewrite: () => void;
};

export function ResultView({
  attempt,
  sourceAttempt,
  sourceAssessment,
  assessment,
  assessmentLoading,
  assessmentError,
  isAuthenticated,
  onAssess,
  onHome,
  onAnother,
  onRewrite,
}: ResultViewProps) {
  const minWords = TASK_CONFIG[attempt.task].minWords;
  const reached = attempt.wordCount >= minWords;
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
          value={`${attempt.wordCount} / ${minWords}`}
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

      <AssessmentPanel
        task={attempt.task}
        assessment={assessment}
        loading={assessmentLoading}
        error={assessmentError}
        onAssess={onAssess}
      />

      {sourceAttempt ? (
        <WritingComparison
          before={sourceAttempt}
          after={attempt}
          beforeAssessment={sourceAssessment}
          afterAssessment={assessment}
        />
      ) : null}

      <section className="rounded-lg border border-line bg-paper-raised p-5">
        <p className="text-xs text-ink-muted">
          {TASK_LABEL[attempt.task]} · {PROMPT_TYPE_LABEL[attempt.promptType]}
        </p>
        {attempt.promptVisual ? <div className="mt-4"><PromptVisual visual={attempt.promptVisual} compact /></div> : null}
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

      {!isAuthenticated ? (
        <section className="rounded-lg border border-line bg-paper-raised p-4">
          <p className="text-sm font-medium text-ink">この回答を履歴に残す</p>
          <p className="mt-1 text-sm leading-6 text-ink-muted">
            ログインすると、この回答を保存し、次回から途中経過と履歴を利用できます。
          </p>
          <div className="mt-3">
            <AuthMenu />
          </div>
        </section>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button onClick={onRewrite}>この答案を書き直す</Button>
        <Button onClick={onAnother}>もう1題</Button>
        <Button variant="outline" onClick={onHome}>
          ホーム
        </Button>
      </div>
    </div>
  );
}

const ASSESSMENT_CRITERIA = [
  "taskAchievement",
  "coherenceCohesion",
  "lexicalResource",
  "grammaticalRangeAccuracy",
] as const satisfies readonly AssessmentCriterionId[];

function AssessmentPanel({
  task,
  assessment,
  loading,
  error,
  onAssess,
}: {
  task: Attempt["task"];
  assessment: WritingAssessment | null;
  loading: boolean;
  error: string | null;
  onAssess: () => void;
}) {
  return (
    <section
      aria-busy={loading}
      className="rounded-lg border border-line bg-paper-raised p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs tracking-[0.16em] text-accent uppercase">
            <Sparkles className="size-3.5" aria-hidden="true" />
            AI Practice Estimate
          </p>
          <h2 className="mt-1 font-serif text-2xl text-ink">参考バンドスコア</h2>
        </div>
        {assessment && !loading ? (
          <Button variant="ghost" size="sm" onClick={onAssess}>
            再評価
          </Button>
        ) : null}
      </div>

      {loading ? (
        <div
          role="status"
          className="mt-6 flex items-center gap-3 text-sm text-ink-muted"
        >
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          4つの評価基準を分析しています…
        </div>
      ) : null}

      {!loading && error ? (
        <div className="mt-5 rounded-md bg-warn-soft p-4">
          <p role="alert" className="text-sm text-warn">
            {error}
          </p>
          <Button className="mt-3" variant="outline" size="sm" onClick={onAssess}>
            再試行
          </Button>
        </div>
      ) : null}

      {!loading && !error && !assessment ? (
        <div className="mt-5">
          <p className="text-sm leading-6 text-ink-muted">
            IELTS Writingの4つの評価基準に沿って、練習用の参考値を算出します。
          </p>
          <Button className="mt-3" size="sm" onClick={onAssess}>
            参考バンドを算出
          </Button>
        </div>
      ) : null}

      {!loading && assessment ? (
        <div className="mt-6">
          <div className="flex flex-wrap items-end gap-x-5 gap-y-2 border-b border-line pb-5">
            <div>
              <p className="text-xs text-ink-muted">このTaskの参考バンド</p>
              <p className="mt-1 font-mono text-4xl text-ink">
                {assessment.overallBand.toFixed(1)}
              </p>
            </div>
            <p className="pb-1 text-sm text-ink-muted">
              推定範囲 {assessment.estimatedRange.min.toFixed(1)}–
              {assessment.estimatedRange.max.toFixed(1)}
            </p>
          </div>

          <dl className="mt-4 grid gap-2">
            {ASSESSMENT_CRITERIA.map((criterionId) => {
              const criterion = assessment.criteria[criterionId];
              return (
                <div
                  key={criterionId}
                  className="flex items-center justify-between gap-4 rounded-md border border-line px-3 py-2.5"
                >
                  <dt className="text-sm text-ink-muted">
                    {ASSESSMENT_CRITERION_LABEL[criterionId]}
                  </dt>
                  <dd className="font-mono text-lg text-ink">
                    {criterion.displayBand.toFixed(1)}
                  </dd>
                </div>
              );
            })}
          </dl>

          {assessment.source === "typesafe" ? (
            <p className="mt-4 text-xs leading-5 text-ink-muted">
              判定のまとまり {Math.round(assessment.averageConfidence * 100)}%
              。これは正答率ではなく、候補バンドへの確率分布がどの程度集中したかを示します。
            </p>
          ) : (
            <p className="mt-4 text-xs leading-5 text-ink-muted">
              20語以下の答案に適用される短文ルールによる判定です。
            </p>
          )}
          {task === "task1" && assessment.source === "typesafe" ? (
            <p className="mt-2 text-xs leading-5 text-warn">
              Task 1は図表画像内の数値をAIが直接確認していないため、Task Achievementの数値精度は評価対象外です。
            </p>
          ) : null}
          <p className="mt-2 text-xs leading-5 text-ink-muted">
            AIによる練習用の推定です。IELTS公式スコアや試験官による採点ではありません。
          </p>
        </div>
      ) : null}
    </section>
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
