"use client";

import { HistoryView } from "@/components/history-view";
import { HomeView } from "@/components/home-view";
import { ResultView } from "@/components/result-view";
import { TipsView } from "@/components/tips-view";
import { WriteView } from "@/components/write-view";
import { pickPrompt } from "@/data/prompts";
import { task1Prompts } from "@/data/task1-prompts";
import { listAttempts, saveAttempt } from "@/lib/storage";
import { supabase } from "@/lib/supabase/client";
import type { Attempt, Prompt, PromptType, View, WritingTask } from "@/lib/types";
import { TASK_CONFIG } from "@/lib/types";
import { countWords } from "@/lib/word-count";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

const subscribeToClient = () => () => {};
let initialClientPrompt: Prompt | undefined;

function getInitialClientPrompt() {
  initialClientPrompt ??= pickPrompt("task1");
  return initialClientPrompt;
}

function getInitialServerPrompt() {
  return task1Prompts[0];
}

export default function Page() {
  const [view, setView] = useState<View>("home");
  const [task, setTask] = useState<WritingTask>("task1");
  const [typeFilter, setTypeFilter] = useState<PromptType | "all">("all");
  const initialPrompt = useSyncExternalStore(
    subscribeToClient,
    getInitialClientPrompt,
    getInitialServerPrompt,
  );
  const [selectedPrompt, setPrompt] = useState<Prompt | null>(null);
  const prompt = selectedPrompt ?? initialPrompt;
  const [durationMinutes, setDurationMinutes] = useState<number>(TASK_CONFIG.task1.defaultDurationMinutes);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [storageLoading, setStorageLoading] = useState(true);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const inProgress =
    attempts.find((item) => item.status === "in_progress") ?? null;

  const refreshAttempts = useCallback(async () => {
    try {
      const next = await listAttempts();
      setAttempts(next);
      setStorageError(null);
    } catch (error) {
      setStorageError(
        error instanceof Error ? error.message : "履歴を読み込めませんでした。",
      );
    } finally {
      setStorageLoading(false);
    }
  }, []);

  const cacheAttempt = useCallback((saved: Attempt) => {
    setAttempts((current) => {
      const rest = current.filter((item) => item.id !== saved.id);
      return [saved, ...rest].sort((a, b) =>
        a.startedAt < b.startedAt ? 1 : -1,
      );
    });
  }, []);

  const persistAttempt = useCallback(
    async (target: Attempt) => {
      if (!userId) return;

      try {
        const saved = await saveAttempt(target);
        if (saved) cacheAttempt(saved);
        setStorageError(null);
      } catch (error) {
        setStorageError(
          error instanceof Error ? error.message : "自動保存に失敗しました。",
        );
      }
    },
    [cacheAttempt, userId],
  );

  useEffect(() => {
    const client = supabase;
    const initialLoad = window.setTimeout(() => {
      if (!client) {
        void refreshAttempts();
        return;
      }

      void client.auth.getSession().then(async ({ data, error }) => {
        if (error) {
          setStorageError(error.message);
          setStorageLoading(false);
          return;
        }

        if (data.session?.user.is_anonymous) {
          await client.auth.signOut();
          setUserId(null);
        } else {
          setUserId(data.session?.user.id ?? null);
        }
        await refreshAttempts();
      });
    }, 0);
    if (!client) return () => window.clearTimeout(initialLoad);

    const { data } = client.auth.onAuthStateChange((_event, session) => {
      if (session?.user.is_anonymous) {
        void client.auth.signOut();
        return;
      }
      setUserId(session?.user.id ?? null);
      void refreshAttempts();
    });
    return () => {
      window.clearTimeout(initialLoad);
      data.subscription.unsubscribe();
    };
  }, [refreshAttempts]);

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
    if (!attempt || !userId) return;
    const timer = window.setTimeout(() => {
      void persistAttempt(attempt);
    }, 800);
    return () => window.clearTimeout(timer);
  }, [attempt, persistAttempt, userId]);

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
    void persistAttempt(next);
    setAttempt(next);
    setPaused(false);
    setView("write");
  }

  function resume(target = inProgress) {
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
    void persistAttempt(next);
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
      {storageLoading ? (
        <p className="mx-auto mb-4 max-w-3xl text-sm text-ink-muted">
          履歴を読み込んでいます…
        </p>
      ) : null}
      {storageError ? (
        <p
          role="alert"
          className="mx-auto mb-4 max-w-3xl rounded-md bg-warn-soft px-3 py-2 text-sm text-warn"
        >
          データを保存できません: {storageError}
        </p>
      ) : null}
      {view === "home" ? (
        <HomeView
          task={task}
          prompt={prompt}
          typeFilter={typeFilter}
          durationMinutes={durationMinutes}
          inProgress={inProgress}
          isAuthenticated={Boolean(userId)}
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
          isAuthenticated={Boolean(userId)}
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
          isAuthenticated={Boolean(userId)}
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
          attempts={attempts}
          isAuthenticated={Boolean(userId)}
          onBack={() => setView("home")}
          onOpen={openAttempt}
        />
      ) : null}

      {view === "tips" ? <TipsView task={task} onTask={changeTask} onBack={() => setView("home")} /> : null}
    </main>
  );
}
