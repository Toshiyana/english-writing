import { supabase } from "@/lib/supabase/client";
import { type Attempt, attemptSchema } from "@/lib/types";
import type { Session } from "@supabase/supabase-js";

type AttemptRow = {
  id: string;
  task: Attempt["task"];
  prompt_id: string;
  prompt_title: string;
  prompt_type: Attempt["promptType"];
  prompt_visual: Attempt["promptVisual"];
  body: string;
  started_at: string;
  submitted_at: string | null;
  elapsed_seconds: number;
  duration_seconds: number;
  word_count: number;
  status: Attempt["status"];
};

async function getSession(): Promise<Session | null> {
  if (!supabase) {
    throw new Error("Supabaseの環境変数が設定されていません。");
  }

  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

function fromRow(row: AttemptRow): Attempt {
  return attemptSchema.parse({
    id: row.id,
    task: row.task,
    promptId: row.prompt_id,
    promptTitle: row.prompt_title,
    promptType: row.prompt_type,
    promptVisual: row.prompt_visual,
    body: row.body,
    startedAt: row.started_at,
    submittedAt: row.submitted_at,
    elapsedSeconds: row.elapsed_seconds,
    durationSeconds: row.duration_seconds,
    wordCount: row.word_count,
    status: row.status,
  });
}

function toRow(attempt: Attempt, userId: string): AttemptRow & { user_id: string } {
  return {
    id: attempt.id,
    user_id: userId,
    task: attempt.task,
    prompt_id: attempt.promptId,
    prompt_title: attempt.promptTitle,
    prompt_type: attempt.promptType,
    prompt_visual: attempt.promptVisual,
    body: attempt.body,
    started_at: attempt.startedAt,
    submitted_at: attempt.submittedAt,
    elapsed_seconds: attempt.elapsedSeconds,
    duration_seconds: attempt.durationSeconds,
    word_count: attempt.wordCount,
    status: attempt.status,
  };
}

export async function listAttempts(): Promise<Attempt[]> {
  const session = await getSession();
  if (!session || session.user.is_anonymous) return [];
  const { data, error } = await supabase!
    .from("writing_attempts")
    .select(
      "id, task, prompt_id, prompt_title, prompt_type, prompt_visual, body, started_at, submitted_at, elapsed_seconds, duration_seconds, word_count, status",
    )
    .eq("user_id", session.user.id)
    .order("started_at", { ascending: false });

  if (error) throw error;
  return (data as AttemptRow[]).map(fromRow);
}

export async function getAttempt(id: string): Promise<Attempt | null> {
  const session = await getSession();
  if (!session || session.user.is_anonymous) return null;
  const { data, error } = await supabase!
    .from("writing_attempts")
    .select(
      "id, task, prompt_id, prompt_title, prompt_type, prompt_visual, body, started_at, submitted_at, elapsed_seconds, duration_seconds, word_count, status",
    )
    .eq("user_id", session.user.id)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? fromRow(data as AttemptRow) : null;
}

export async function saveAttempt(attempt: Attempt): Promise<Attempt | null> {
  const parsed = attemptSchema.parse(attempt);
  const session = await getSession();
  if (!session || session.user.is_anonymous) return null;
  const { error } = await supabase!
    .from("writing_attempts")
    .upsert(toRow(parsed, session.user.id), { onConflict: "id" });

  if (error) throw error;
  return parsed;
}

export async function findInProgress(): Promise<Attempt | null> {
  const attempts = await listAttempts();
  return attempts.find((attempt) => attempt.status === "in_progress") ?? null;
}
