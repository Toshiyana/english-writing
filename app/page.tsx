"use client";

import { HistoryView } from "@/components/history-view";
import { HomeView } from "@/components/home-view";
import { ResultView } from "@/components/result-view";
import { TipsView } from "@/components/tips-view";
import { WriteView } from "@/components/write-view";
import { pickPrompt, prompts } from "@/data/prompts";
import {
  findInProgress,
  listAttempts,
  saveAttempt,
} from "@/lib/storage";
import type { Attempt, QuestionType, View } from "@/lib/types";
import { DEFAULT_DURATION_MINUTES } from "@/lib/types";
import { countWords } from "@/lib/word-count";
import { useEffect, useState } from "react";

export default function Page() {
  const [view, setView] = useState<View>("home");
  const [typeFilter, setTypeFilter] = useState<QuestionType | "all">("all");
  const [prompt, setPrompt] = useState(prompts[0] ?? pickPrompt("all"));
  const [durationMinutes, setDurationMinutes] = useState(
    DEFAULT_DURATION_MINUTES,
  );
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [paused, setPaused] = useState(false);
  const [inProgress, setInProgress] = useState<Attempt | null>(null);
  const [history, setHistory] = useState<Attempt[]>([]);

  useEffect(() => {
    setPrompt(pickPrompt("all"));
    setInProgress(findInProgress());
    setHistory(listAttempts());
  }, []);

  useEffect(() => {
    setInProgress(findInProgress());
    setHistory(listAttempts());
  }, [view]);

  const isWriting =
    view === "write" && attempt !== null && !paused && attempt.submittedAt === null;

  useEffect(() => {
    if (!isWriting) return;
    const timer = window.setInterval(() => {
      setAttempt((current) => {
        if (!current || current.submittedAt) return current;
        const elapsedSeconds = current.elapsedSeconds + 1;
        return {
          ...current,
          elapsedSeconds,
          status:
            elapsedSeconds >= current.durationSeconds
              ? "time_up"
              : current.status,
        };
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isWriting]);

  useEffect(() => {
    if (!attempt) return;
    const timer = window.setTimeout(() => {
      saveAttempt(attempt);
    }, 800);
    return () => window.clearTimeout(timer);
  }, [attempt]);

  function start() {
    const next: Attempt = {
      id: crypto.randomUUID(),
      promptId: prompt.id,
      promptTitle: prompt.title,
      promptType: prompt.type,
      body: "",
      startedAt: new Date().toISOString(),
      submittedAt: null,
      elapsedSeconds: 0,
      durationSeconds: durationMinutes * 60,
      wordCount: 0,
      status: "in_progress",
    };
    saveAttempt(next);
    setAttempt(next);
    setPaused(false);
    setView("write");
  }

  function resume(target = findInProgress()) {
    if (!target) return;
    setAttempt(target);
    setPaused(false);
    setView("write");
  }

  function submit() {
    if (!attempt) return;
    const next: Attempt = {
      ...attempt,
      submittedAt: new Date().toISOString(),
      wordCount: countWords(attempt.body),
      status:
        attempt.elapsedSeconds >= attempt.durationSeconds
          ? "time_up"
          : "completed",
    };
    saveAttempt(next);
    setAttempt(next);
    setView("result");
  }

  function openAttempt(target: Attempt) {
    if (target.status === "in_progress") {
      resume(target);
      return;
    }
    setAttempt(target);
    setView("result");
  }

  return (
    <main className="min-h-[100dvh] px-4 py-8 sm:px-6">
      {view === "home" ? (
        <HomeView
          prompt={prompt}
          typeFilter={typeFilter}
          durationMinutes={durationMinutes}
          inProgress={inProgress}
          onTypeFilter={(type) => {
            setTypeFilter(type);
            setPrompt(pickPrompt(type));
          }}
          onShuffle={() => setPrompt(pickPrompt(typeFilter))}
          onDuration={setDurationMinutes}
          onStart={start}
          onResume={() => resume()}
          onHistory={() => setView("history")}
          onTips={() => setView("tips")}
        />
      ) : null}

      {view === "write" && attempt ? (
        <WriteView
          attempt={attempt}
          paused={paused}
          remainingSeconds={attempt.durationSeconds - attempt.elapsedSeconds}
          onBody={(body) =>
            setAttempt({ ...attempt, body, wordCount: countWords(body) })
          }
          onTogglePause={() => setPaused((value) => !value)}
          onSubmit={submit}
        />
      ) : null}

      {view === "result" && attempt ? (
        <ResultView
          attempt={attempt}
          onHome={() => setView("home")}
          onAnother={() => {
            setPrompt(pickPrompt(typeFilter));
            setView("home");
          }}
        />
      ) : null}

      {view === "history" ? (
        <HistoryView
          attempts={history}
          onBack={() => setView("home")}
          onOpen={openAttempt}
        />
      ) : null}

      {view === "tips" ? <TipsView onBack={() => setView("home")} /> : null}
    </main>
  );
}
