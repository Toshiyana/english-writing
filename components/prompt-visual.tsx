"use client";

import type { VisualAsset } from "@/lib/types";
import { Maximize2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type PromptVisualProps = { visual: VisualAsset; compact?: boolean };

export function PromptVisual({ visual, compact = false }: PromptVisualProps) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    function close(event: KeyboardEvent) {
      if (event.key === "Escape") setExpanded(false);
    }
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [expanded]);

  return (
    <>
      <div className="relative overflow-hidden rounded-md border border-line bg-white">
        <Image src={visual.src} alt={visual.alt} width={visual.width} height={visual.height} sizes={compact ? "(max-width: 768px) 100vw, 640px" : "(max-width: 1024px) 100vw, 50vw"} className="h-auto w-full" priority />
        <button type="button" onClick={() => setExpanded(true)} className="absolute right-2 bottom-2 inline-flex h-9 items-center gap-2 rounded-md border border-line bg-paper-raised/95 px-3 text-xs text-ink shadow-sm hover:bg-paper" aria-label="図表を拡大する">
          <Maximize2 className="size-3.5" />拡大
        </button>
      </div>

      {expanded ? (
        <div role="dialog" aria-modal="true" aria-label="拡大した図表" className="fixed inset-0 z-50 flex items-center justify-center bg-ink/75 p-3 sm:p-8" onMouseDown={(event) => { if (event.currentTarget === event.target) setExpanded(false); }}>
          <div className="relative max-h-full w-full max-w-6xl overflow-auto rounded-lg bg-white p-2 shadow-2xl sm:p-4">
            <button type="button" onClick={() => setExpanded(false)} className="absolute top-3 right-3 z-10 grid size-10 place-items-center rounded-full bg-ink text-white" aria-label="拡大表示を閉じる" autoFocus>
              <X className="size-5" />
            </button>
            <Image src={visual.src} alt={visual.alt} width={visual.width} height={visual.height} sizes="100vw" className="h-auto w-full" />
          </div>
        </div>
      ) : null}
    </>
  );
}
