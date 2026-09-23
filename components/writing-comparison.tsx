"use client";

import type { Attempt } from "@/lib/types";
import { diffWords, type DiffPart } from "@/lib/text-diff";
import {
  ASSESSMENT_CRITERION_LABEL,
  type AssessmentCriterionId,
  type WritingAssessment,
} from "@/lib/writing-assessment";
import { useMemo } from "react";

const CRITERIA = [
  "taskAchievement",
  "coherenceCohesion",
  "lexicalResource",
  "grammaticalRangeAccuracy",
] as const satisfies readonly AssessmentCriterionId[];

type WritingComparisonProps = {
  before: Attempt;
  after: Attempt;
  beforeAssessment: WritingAssessment | null;
  afterAssessment: WritingAssessment | null;
};

function formatChange(value: number): string {
  if (value > 0) return `+${value.toFixed(1)}`;
  return value.toFixed(1);
}

function changeClass(value: number): string {
  if (value > 0) return "text-ok";
  if (value < 0) return "text-warn";
  return "text-ink-muted";
}

function DiffText({ parts, side }: { parts: DiffPart[]; side: "before" | "after" }) {
  return (
    <p className="mt-3 whitespace-pre-wrap font-serif text-sm leading-7 text-ink">
      {parts
        .filter((part) =>
          side === "before" ? part.type !== "added" : part.type !== "removed",
        )
        .map((part, index) => {
          const changed = part.type !== "equal";
          return (
            <span
              key={`${part.type}-${index}`}
              className={
                changed
                  ? side === "before"
                    ? "rounded-sm bg-warn-soft px-0.5 text-warn line-through"
                    : "rounded-sm bg-emerald-100 px-0.5 text-ok"
                  : undefined
              }
            >
              {index > 0 ? " " : ""}
              {part.words.join(" ")}
            </span>
          );
        })}
    </p>
  );
}

export function WritingComparison({
  before,
  after,
  beforeAssessment,
  afterAssessment,
}: WritingComparisonProps) {
  const parts = useMemo(
    () => diffWords(before.body, after.body),
    [before.body, after.body],
  );
  const wordChange = after.wordCount - before.wordCount;

  return (
    <section className="rounded-lg border border-line bg-paper-raised p-5">
      <p className="text-xs tracking-[0.16em] text-accent uppercase">Rewrite comparison</p>
      <h2 className="mt-1 font-serif text-2xl text-ink">初稿との比較</h2>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-md border border-line p-3">
          <p className="text-xs text-ink-muted">初稿</p>
          <p className="mt-1 font-mono text-2xl text-ink">
            {beforeAssessment ? beforeAssessment.overallBand.toFixed(1) : "—"}
          </p>
          <p className="mt-1 text-xs text-ink-muted">{before.wordCount}語</p>
        </div>
        <div className="rounded-md border border-line p-3">
          <p className="text-xs text-ink-muted">書き直し</p>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="font-mono text-2xl text-ink">
              {afterAssessment ? afterAssessment.overallBand.toFixed(1) : "—"}
            </p>
            {beforeAssessment && afterAssessment ? (
              <p className={`font-mono text-sm ${changeClass(afterAssessment.overallBand - beforeAssessment.overallBand)}`}>
                {formatChange(afterAssessment.overallBand - beforeAssessment.overallBand)}
              </p>
            ) : null}
          </div>
          <p className={`mt-1 text-xs ${changeClass(wordChange)}`}>
            {after.wordCount}語（{wordChange >= 0 ? "+" : ""}{wordChange}語）
          </p>
        </div>
      </div>

      {beforeAssessment && afterAssessment ? (
        <dl className="mt-4 grid gap-2">
          {CRITERIA.map((criterionId) => {
            const oldBand = beforeAssessment.criteria[criterionId].displayBand;
            const newBand = afterAssessment.criteria[criterionId].displayBand;
            const change = newBand - oldBand;
            return (
              <div key={criterionId} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-md border border-line px-3 py-2.5">
                <dt className="text-sm text-ink-muted">{ASSESSMENT_CRITERION_LABEL[criterionId]}</dt>
                <dd className="font-mono text-sm text-ink">{oldBand.toFixed(1)} → {newBand.toFixed(1)}</dd>
                <dd className={`w-10 text-right font-mono text-sm ${changeClass(change)}`}>{formatChange(change)}</dd>
              </div>
            );
          })}
        </dl>
      ) : (
        <p className="mt-4 text-sm leading-6 text-ink-muted">
          両方の参考バンドが算出されると、評価基準ごとの変化を表示します。
        </p>
      )}

      <div className="mt-6 flex items-center gap-4 text-xs text-ink-muted">
        <span><span className="mr-1 inline-block size-2 rounded-sm bg-warn-soft" />削除</span>
        <span><span className="mr-1 inline-block size-2 rounded-sm bg-emerald-100" />追加</span>
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <article className="rounded-md border border-line p-4">
          <h3 className="text-xs font-medium text-ink-muted">初稿</h3>
          <DiffText parts={parts} side="before" />
        </article>
        <article className="rounded-md border border-line p-4">
          <h3 className="text-xs font-medium text-ink-muted">書き直し</h3>
          <DiffText parts={parts} side="after" />
        </article>
      </div>
    </section>
  );
}
