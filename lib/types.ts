import { z } from "zod";

export const questionTypeSchema = z.enum([
  "opinion",
  "discussion",
  "problem-solution",
  "two-part",
]);

export const promptSchema = z.object({
  id: z.string(),
  type: questionTypeSchema,
  topic: z.string(),
  title: z.string(),
});

export const attemptStatusSchema = z.enum([
  "in_progress",
  "completed",
  "time_up",
]);

export const attemptSchema = z.object({
  id: z.string(),
  promptId: z.string(),
  promptTitle: z.string(),
  promptType: questionTypeSchema,
  body: z.string(),
  startedAt: z.string(),
  submittedAt: z.string().nullable(),
  elapsedSeconds: z.number().int().nonnegative(),
  durationSeconds: z.number().int().positive(),
  wordCount: z.number().int().nonnegative(),
  status: attemptStatusSchema,
});

export type QuestionType = z.infer<typeof questionTypeSchema>;
export type Prompt = z.infer<typeof promptSchema>;
export type AttemptStatus = z.infer<typeof attemptStatusSchema>;
export type Attempt = z.infer<typeof attemptSchema>;

export type View = "home" | "write" | "result" | "history";

export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  opinion: "意見",
  discussion: "議論",
  "problem-solution": "問題と解決",
  "two-part": "二部構成",
};

export const DURATION_OPTIONS = [20, 40, 60] as const;
export const DEFAULT_DURATION_MINUTES = 40;
