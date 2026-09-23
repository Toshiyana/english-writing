import { z } from "zod";

export const assessmentCriterionIdSchema = z.enum([
  "taskAchievement",
  "coherenceCohesion",
  "lexicalResource",
  "grammaticalRangeAccuracy",
]);

export type AssessmentCriterionId = z.infer<
  typeof assessmentCriterionIdSchema
>;

export const ASSESSMENT_CRITERION_LABEL: Record<
  AssessmentCriterionId,
  string
> = {
  taskAchievement: "Task Achievement / Response",
  coherenceCohesion: "Coherence & Cohesion",
  lexicalResource: "Lexical Resource",
  grammaticalRangeAccuracy: "Grammatical Range & Accuracy",
};

export const assessmentCriterionSchema = z.object({
  band: z.number().min(0).max(9),
  displayBand: z.number().min(0).max(9),
  confidence: z.number().min(0).max(1),
  probabilities: z.array(z.number().min(0).max(1)).length(9),
});

export const writingAssessmentSchema = z.object({
  model: z.string(),
  assessedAt: z.string(),
  source: z.enum(["typesafe", "short-response-rule"]),
  criteria: z.object({
    taskAchievement: assessmentCriterionSchema,
    coherenceCohesion: assessmentCriterionSchema,
    lexicalResource: assessmentCriterionSchema,
    grammaticalRangeAccuracy: assessmentCriterionSchema,
  }),
  overallBand: z.number().min(0).max(9),
  estimatedRange: z.object({
    min: z.number().min(0).max(9),
    max: z.number().min(0).max(9),
  }),
  averageConfidence: z.number().min(0).max(1),
});

export type WritingAssessment = z.infer<typeof writingAssessmentSchema>;
