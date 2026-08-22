import { type Attempt, attemptSchema } from "@/lib/types";
import { z } from "zod";

const KEY = "ew.attempts";

function readAll(): Attempt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = z.array(attemptSchema).safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

function writeAll(attempts: Attempt[]) {
  window.localStorage.setItem(KEY, JSON.stringify(attempts));
}

export function listAttempts(): Attempt[] {
  return readAll().sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1));
}

export function getAttempt(id: string): Attempt | null {
  return readAll().find((attempt) => attempt.id === id) ?? null;
}

export function saveAttempt(attempt: Attempt): Attempt {
  const parsed = attemptSchema.parse(attempt);
  const rest = readAll().filter((item) => item.id !== parsed.id);
  writeAll([...rest, parsed]);
  return parsed;
}

export function findInProgress(): Attempt | null {
  return (
    readAll()
      .filter((attempt) => attempt.status === "in_progress")
      .sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1))[0] ?? null
  );
}
