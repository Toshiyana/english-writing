"use client";

import { HistoryView } from "@/components/history-view";
import { HomeView } from "@/components/home-view";
import { ResultView } from "@/components/result-view";
import { TipsView } from "@/components/tips-view";
import { WriteView } from "@/components/write-view";
import { pickPrompt } from "@/data/prompts";
import { task1Prompts } from "@/data/task1-prompts";
import {
  findInProgress,
  listAttempts,
  saveAttempt,
} from "@/lib/storage";
import type { Attempt, Prompt, PromptType, View, WritingTask } from "@/lib/types";
import { TASK_CONFIG } from "@/lib/types";
import { countWords } from "@/lib/word-count";
import { useEffect, useState } from "react";

export default function Page() {
  const [view, setView] = useState<View>("home");
  const [task, setTask] = useState<WritingTask>("task1");
  const [typeFilter, setTypeFilter] = useState<PromptType | "all">("all");
  const [prompt, setPrompt] = useState<Prompt>(task1Prompts[0]);
  const [durationMinutes, setDurationMinutes] = useState<number>(TASK_CONFIG.task1.defaultDurationMinutes);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [paused, setPaused] = useState(false);
  const [inProgress, setInProgress] = useState<Attempt | null>(null);
  const [history, setHistory] = useState<Attempt[]>([]);

  useEffect(() => {
    setPrompt(pickPrompt("task1"));
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
      task: prompt.task,
      promptId: prompt.id,
      promptTitle: prompt.title,
      promptType: prompt.type,
      promptVisual: prompt.task === "task1" ? prompt.visual : null,
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

  function changeTask(nextTask: WritingTask) {
    setTask(nextTask);
    setTypeFilter("all");
    setDurationMinutes(TASK_CONFIG[nextTask].defaultDurationMinutes);
    setPrompt(pickPrompt(nextTask));
  }

  return (
    <main className="min-h-[100dvh] px-4 py-8 sm:px-6">
      {view === "home" ? (
        <HomeView
          task={task}
          prompt={prompt}
          typeFilter={typeFilter}
          durationMinutes={durationMinutes}
          inProgress={inProgress}
          onTask={changeTask}
          onTypeFilter={(type) => {
            setTypeFilter(type);
            setPrompt(pickPrompt(task, type));
          }}
          onShuffle={() => setPrompt(pickPrompt(task, typeFilter))}
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
            setTask(attempt.task);
            setTypeFilter("all");
            setDurationMinutes(TASK_CONFIG[attempt.task].defaultDurationMinutes);
            setPrompt(pickPrompt(attempt.task));
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

      {view === "tips" ? <TipsView task={task} onTask={changeTask} onBack={() => setView("home")} /> : null}
    </main>
  );
}
