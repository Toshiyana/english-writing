import { z } from "zod";
import { writingAssessmentSchema } from "@/lib/writing-assessment";

export const writingTaskSchema = z.enum(["task1", "task2"]);

export const task1VisualTypeSchema = z.enum([
  "bar",
  "line",
  "pie",
  "table",
  "process",
  "map",
  "mixed",
]);

export const task2QuestionTypeSchema = z.enum([
  "opinion",
  "discussion",
  "problem-solution",
  "two-part",
]);

export const visualAssetSchema = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const promptBaseSchema = z.object({
  id: z.string(),
  topic: z.string(),
  title: z.string(),
});

export const task1PromptSchema = promptBaseSchema.extend({
  task: z.literal("task1"),
  type: task1VisualTypeSchema,
  visual: visualAssetSchema,
});

export const task2PromptSchema = promptBaseSchema.extend({
  task: z.literal("task2"),
  type: task2QuestionTypeSchema,
});

export const promptSchema = z.discriminatedUnion("task", [
  task1PromptSchema,
  task2PromptSchema,
]);

export const attemptStatusSchema = z.enum([
  "in_progress",
  "completed",
  "time_up",
]);

export const attemptSchema = z.object({
  id: z.string(),
  task: writingTaskSchema,
  promptId: z.string(),
  promptTitle: z.string(),
  promptType: z.union([task1VisualTypeSchema, task2QuestionTypeSchema]),
  promptVisual: visualAssetSchema.nullable(),
  body: z.string(),
  startedAt: z.string(),
  submittedAt: z.string().nullable(),
  elapsedSeconds: z.number().int().nonnegative(),
  durationSeconds: z.number().int().positive(),
  wordCount: z.number().int().nonnegative(),
  status: attemptStatusSchema,
  sourceAttemptId: z.string().nullable(),
  assessment: writingAssessmentSchema.nullable(),
});

export type WritingTask = z.infer<typeof writingTaskSchema>;
export type Task1VisualType = z.infer<typeof task1VisualTypeSchema>;
export type Task2QuestionType = z.infer<typeof task2QuestionTypeSchema>;
export type PromptType = Task1VisualType | Task2QuestionType;
export type VisualAsset = z.infer<typeof visualAssetSchema>;
export type Task1Prompt = z.infer<typeof task1PromptSchema>;
export type Task2Prompt = z.infer<typeof task2PromptSchema>;
export type Prompt = z.infer<typeof promptSchema>;
export type AttemptStatus = z.infer<typeof attemptStatusSchema>;
export type Attempt = z.infer<typeof attemptSchema>;

export type View = "home" | "write" | "result" | "history" | "tips";

export const TASK_LABEL: Record<WritingTask, string> = {
  task1: "Task 1",
  task2: "Task 2",
};

export const PROMPT_TYPE_LABEL: Record<PromptType, string> = {
  bar: "棒グラフ",
  line: "折れ線",
  pie: "円グラフ",
  table: "表",
  process: "工程図",
  map: "地図",
  mixed: "複合",
  opinion: "意見",
  discussion: "議論",
  "problem-solution": "問題と解決",
  "two-part": "二部構成",
};

export const TASK_CONFIG = {
  task1: {
    defaultDurationMinutes: 20,
    durationOptions: [10, 20, 30],
    minWords: 150,
  },
  task2: {
    defaultDurationMinutes: 40,
    durationOptions: [20, 40, 60],
    minWords: 250,
  },
} as const satisfies Record<
  WritingTask,
  {
    defaultDurationMinutes: number;
    durationOptions: readonly number[];
    minWords: number;
  }
>;
