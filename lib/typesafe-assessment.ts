import { prompts } from "@/data/prompts";
import type { WritingTask } from "@/lib/types";
import { countWords } from "@/lib/word-count";
import {
  type AssessmentCriterionId,
  assessmentCriterionSchema,
  writingAssessmentSchema,
  type WritingAssessment,
} from "@/lib/writing-assessment";
import { z } from "zod";

const TYPESAFE_ENDPOINT = "https://api.typesafe.ai/v1/systemone";
const TYPESAFE_MODEL = "jev-latest";
const BAND_LEVELS = 9;

export const assessmentRequestSchema = z.object({
  promptId: z.string().min(1).max(100),
  body: z.string().max(20_000),
});

export type AssessmentRequest = z.infer<typeof assessmentRequestSchema>;

const scoreAnswerSchema = z.object({
  type: z.literal("score"),
  score: z.number().min(0).max(BAND_LEVELS - 1),
  confidence: z.number().min(0).max(1),
  probabilities: z.record(z.string(), z.number().min(0).max(1)),
  legend: z.record(z.string(), z.unknown()),
});

const typesafeResponseSchema = z.object({
  model: z.string(),
  answers: z.object({
    taskAchievement: scoreAnswerSchema,
    coherenceCohesion: scoreAnswerSchema,
    lexicalResource: scoreAnswerSchema,
    grammaticalRangeAccuracy: scoreAnswerSchema,
  }),
});

type ScoreAnswer = z.infer<typeof scoreAnswerSchema>;

const TASK_ACHIEVEMENT_LEVELS: Record<WritingTask, string[]> = {
  task1: [
    "Band 1: Uses only isolated words or fragments and does not meaningfully address the visual-information reporting task.",
    "Band 2: Makes a minimal attempt; almost no relevant features or usable information are communicated.",
    "Band 3: Misunderstands substantial parts of the task; reports very few features and lacks a meaningful overview.",
    "Band 4: Attempts the task but misses important requirements; selects few key features and may be inaccurate, repetitive, or inappropriate.",
    "Band 5: Generally addresses the task but coverage is incomplete; an overview or key-feature selection is limited, unclear, or insufficiently supported.",
    "Band 6: Addresses the main requirements with a relevant overview; selects key features and comparisons, though some details may be insufficient or inaccurate.",
    "Band 7: Covers the task requirements with a clear overview; identifies and compares the main features, with only minor omissions or imprecision.",
    "Band 8: Covers all requirements sufficiently; presents a skilful overview and well-selected, accurately supported key features.",
    "Band 9: Fully satisfies the task with a precise overview and expertly selected, accurate, and well-supported key features and comparisons.",
  ],
  task2: [
    "Band 1: Uses only isolated words or fragments and does not meaningfully answer the question.",
    "Band 2: Makes a minimal attempt; no clear position or developed relevant idea is communicated.",
    "Band 3: Misunderstands substantial parts of the question; presents very few relevant ideas and no workable position.",
    "Band 4: Attempts the question but misses major requirements; the position is unclear and ideas are limited, repetitive, or weakly supported.",
    "Band 5: Addresses the question only partly; a position is present but development, relevance, or support is uneven and incomplete.",
    "Band 6: Addresses the main parts of the question with a relevant position; main ideas are generally supported but some are insufficiently developed.",
    "Band 7: Addresses every part of the question with a clear position; relevant main ideas are developed and supported, with only minor gaps.",
    "Band 8: Sufficiently addresses all requirements; maintains a clear, well-developed position with relevant, extended, and well-supported ideas.",
    "Band 9: Fully and insightfully addresses the question; presents a precise position with thoroughly developed, relevant, and compelling support.",
  ],
};

const COHERENCE_LEVELS = [
  "Band 1: Communicates no sequence of ideas and provides no usable organisation.",
  "Band 2: Shows extremely limited organisation; relationships between ideas are largely absent.",
  "Band 3: Some ideas can be identified, but there is little logical arrangement or progression.",
  "Band 4: Shows some organisation, but progression is unclear; linking and paragraphing are basic, repetitive, or inaccurate.",
  "Band 5: Has visible organisation, but progression is uneven; cohesive devices or paragraphing are overused, limited, or inconsistent.",
  "Band 6: Is coherent overall with generally clear progression; cohesion and paragraphing work, though they may be mechanical or occasionally faulty.",
  "Band 7: Organises information and ideas logically with clear progression, appropriate cohesion, and effective paragraphing.",
  "Band 8: Sequences ideas logically and manages cohesion skilfully; paragraphing is sufficient and consistently purposeful.",
  "Band 9: Achieves effortless coherence with fully controlled progression, cohesion, referencing, and paragraphing.",
];

const LEXICAL_LEVELS = [
  "Band 1: Uses only isolated words, with no assessable vocabulary control.",
  "Band 2: Uses an extremely limited vocabulary that cannot communicate the task meaningfully.",
  "Band 3: Uses a very limited range; frequent word-choice and spelling problems seriously impede meaning.",
  "Band 4: Uses basic, repetitive vocabulary; frequent inappropriate choices, formation errors, or spelling problems strain comprehension.",
  "Band 5: Uses a limited but minimally adequate range; noticeable repetition and errors sometimes reduce precision or readability.",
  "Band 6: Uses an adequate range for the task; meaning is generally clear despite some imprecision, awkward collocation, or spelling and formation errors.",
  "Band 7: Uses a sufficient range with some flexibility and precision; less common language appears, with occasional errors that do not impede communication.",
  "Band 8: Uses a wide, flexible, and precise range with skilful collocation; errors are rare and minor.",
  "Band 9: Demonstrates full flexibility and precise, natural vocabulary control; any errors are extremely rare slips.",
];

const GRAMMAR_LEVELS = [
  "Band 1: Produces no assessable sentence-level language.",
  "Band 2: Produces almost no correct sentence forms, so meaning is largely inaccessible.",
  "Band 3: Attempts sentences, but severe and frequent grammatical and punctuation errors dominate and impede meaning.",
  "Band 4: Uses a narrow range of structures; errors are frequent and may cause difficulty for the reader.",
  "Band 5: Uses a limited range with some correct sentences; complex attempts often contain errors, and punctuation may be faulty.",
  "Band 6: Uses both simple and complex forms with some flexibility; errors occur but rarely prevent understanding.",
  "Band 7: Uses a variety of complex structures with generally good control; many sentences are error-free and remaining errors do not impede meaning.",
  "Band 8: Uses a wide range of structures flexibly and accurately; most sentences are error-free and errors are rare.",
  "Band 9: Uses a full range of structures naturally, flexibly, and accurately; punctuation and grammar are consistently controlled apart from rare slips.",
];

const QUESTION_LEVELS: Record<AssessmentCriterionId, string[]> = {
  taskAchievement: [],
  coherenceCohesion: COHERENCE_LEVELS,
  lexicalResource: LEXICAL_LEVELS,
  grammaticalRangeAccuracy: GRAMMAR_LEVELS,
};

function buildQuestions(task: WritingTask) {
  return {
    taskAchievement: {
      type: "score",
      instructions:
        task === "task1"
          ? "Rate how well `response` fulfils this IELTS Academic Writing Task 1 prompt. Judge overview, selection of main features, relevant comparisons, accuracy that can be checked from the supplied text, and objective reporting. Do not infer unseen chart values."
          : "Rate how well `response` fulfils this IELTS Academic Writing Task 2 prompt. Judge whether every part is answered, the position is clear and consistent, and relevant main ideas are extended and supported.",
      criteria: TASK_ACHIEVEMENT_LEVELS[task],
    },
    coherenceCohesion: {
      type: "score",
      instructions:
        "Rate the coherence and cohesion of `response` as an IELTS Writing response. Judge organisation, logical progression, paragraphing, referencing, and cohesive devices—not the quality of its vocabulary or grammar by itself.",
      criteria: QUESTION_LEVELS.coherenceCohesion,
    },
    lexicalResource: {
      type: "score",
      instructions:
        "Rate the lexical resource of `response` as an IELTS Writing response. Judge range, precision, appropriacy, collocation, word formation, and spelling—not idea quality or grammatical structure by itself.",
      criteria: QUESTION_LEVELS.lexicalResource,
    },
    grammaticalRangeAccuracy: {
      type: "score",
      instructions:
        "Rate the grammatical range and accuracy of `response` as an IELTS Writing response. Judge sentence variety, complex structures, grammatical control, and punctuation—not vocabulary sophistication or idea quality by itself.",
      criteria: QUESTION_LEVELS.grammaticalRangeAccuracy,
    },
  } as const;
}

function roundToHalf(value: number): number {
  return Math.round(value * 2) / 2;
}

function floorToHalf(value: number): number {
  return Math.floor(value * 2) / 2;
}

function ceilToHalf(value: number): number {
  return Math.ceil(value * 2) / 2;
}

function toProbabilityArray(answer: ScoreAnswer): number[] {
  const probabilities = Array.from({ length: BAND_LEVELS }, (_, index) =>
    answer.probabilities[String(index)] ?? 0,
  );
  const total = probabilities.reduce((sum, value) => sum + value, 0);

  if (total <= 0) {
    throw new Error("TypeSafe returned an empty score distribution.");
  }

  return probabilities.map((value) => value / total);
}

function probabilityBand(probabilities: number[], quantile: number): number {
  let cumulative = 0;
  for (let index = 0; index < probabilities.length; index += 1) {
    cumulative += probabilities[index];
    if (cumulative >= quantile) return index + 1;
  }
  return BAND_LEVELS;
}

function toCriterion(answer: ScoreAnswer) {
  const probabilities = toProbabilityArray(answer);
  const band = answer.score + 1;
  return assessmentCriterionSchema.parse({
    band,
    displayBand: roundToHalf(band),
    confidence: answer.confidence,
    probabilities,
  });
}

function shortResponseAssessment(wordCount: number): WritingAssessment {
  const band = wordCount === 0 ? 0 : 1;
  const probabilities = Array.from(
    { length: BAND_LEVELS },
    (_, index) => (band === index + 1 ? 1 : 0),
  );
  const criterion = {
    band,
    displayBand: band,
    confidence: 1,
    probabilities,
  };

  return writingAssessmentSchema.parse({
    model: "IELTS short-response rule",
    assessedAt: new Date().toISOString(),
    source: "short-response-rule",
    criteria: {
      taskAchievement: criterion,
      coherenceCohesion: criterion,
      lexicalResource: criterion,
      grammaticalRangeAccuracy: criterion,
    },
    overallBand: band,
    estimatedRange: { min: band, max: band },
    averageConfidence: 1,
  });
}

async function fetchTypeSafe(
  apiKey: string,
  request: AssessmentRequest,
  task: WritingTask,
  promptTitle: string,
  promptType: string,
  promptVisualAlt: string | null,
  wordCount: number,
): Promise<z.infer<typeof typesafeResponseSchema>> {
  const body = {
    model: TYPESAFE_MODEL,
    state: {
      task:
        task === "task1"
          ? "IELTS Academic Writing Task 1"
          : "IELTS Academic Writing Task 2",
      prompt: promptTitle,
      prompt_type: promptType,
      visual_description: promptVisualAlt,
      response_word_count: wordCount,
      response: request.body,
      limitation:
        task === "task1"
          ? "The chart image itself is unavailable. Judge only facts supported by the prompt and visual description, and do not invent or verify unseen numeric values."
          : null,
    },
    questions: buildQuestions(task),
  };

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(TYPESAFE_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (response.ok) {
      return typesafeResponseSchema.parse(await response.json());
    }

    if ((response.status === 429 || response.status === 529) && attempt < 2) {
      await new Promise((resolve) =>
        setTimeout(resolve, 500 * 2 ** attempt),
      );
      continue;
    }

    throw new Error(`TypeSafe request failed with status ${response.status}.`);
  }

  throw new Error("TypeSafe request failed after retries.");
}

export async function assessWriting(
  apiKey: string,
  rawRequest: unknown,
): Promise<WritingAssessment> {
  const request = assessmentRequestSchema.parse(rawRequest);
  const prompt = prompts.find((candidate) => candidate.id === request.promptId);
  if (!prompt) {
    throw new AssessmentInputError("Unknown prompt id.");
  }
  const wordCount = countWords(request.body);

  if (wordCount <= 20) {
    return shortResponseAssessment(wordCount);
  }

  const response = await fetchTypeSafe(
    apiKey,
    request,
    prompt.task,
    prompt.title,
    prompt.type,
    prompt.task === "task1" ? prompt.visual.alt : null,
    wordCount,
  );
  const criteria = {
    taskAchievement: toCriterion(response.answers.taskAchievement),
    coherenceCohesion: toCriterion(response.answers.coherenceCohesion),
    lexicalResource: toCriterion(response.answers.lexicalResource),
    grammaticalRangeAccuracy: toCriterion(
      response.answers.grammaticalRangeAccuracy,
    ),
  };
  const values = Object.values(criteria);
  const rawOverall =
    values.reduce((sum, criterion) => sum + criterion.band, 0) / values.length;
  const lower =
    values.reduce(
      (sum, criterion) =>
        sum + probabilityBand(criterion.probabilities, 0.15),
      0,
    ) / values.length;
  const upper =
    values.reduce(
      (sum, criterion) =>
        sum + probabilityBand(criterion.probabilities, 0.85),
      0,
    ) / values.length;

  return writingAssessmentSchema.parse({
    model: response.model,
    assessedAt: new Date().toISOString(),
    source: "typesafe",
    criteria,
    overallBand: roundToHalf(rawOverall),
    estimatedRange: {
      min: Math.min(roundToHalf(rawOverall), floorToHalf(lower)),
      max: Math.max(roundToHalf(rawOverall), ceilToHalf(upper)),
    },
    averageConfidence:
      values.reduce((sum, criterion) => sum + criterion.confidence, 0) /
      values.length,
  });
}

export class AssessmentInputError extends Error {
  override name = "AssessmentInputError";
}
