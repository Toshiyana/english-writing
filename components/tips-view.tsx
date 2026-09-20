import { Button } from "@/components/ui/button";
import type { WritingTask } from "@/lib/types";
import { ArrowLeft, Check, Clock3 } from "lucide-react";
import type { ReactNode } from "react";

type TipsViewProps = { task: WritingTask; onTask: (task: WritingTask) => void; onBack: () => void };

const SCORE_CRITERIA = [
  { title: "Task Achievement / Response", description: "設問の要求を正確に満たし、Task 1では主要な特徴とoverview、Task 2では明確な立場と十分な説明を示す。" },
  { title: "Coherence & Cohesion", description: "情報や考えを論理的な順序で段落に分け、自然に結び付ける。" },
  { title: "Lexical Resource", description: "話題と目的に合う語彙を、意味と用法を確かめながら使う。" },
  { title: "Grammatical Range & Accuracy", description: "文の形に変化を持たせつつ、正確さと読みやすさを保つ。" },
] as const;

export function TipsView({ task, onTask, onBack }: TipsViewProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 pb-12">
      <header>
        <Button variant="ghost" size="sm" onClick={onBack} className="-ml-3"><ArrowLeft className="size-3.5" />ホームへ</Button>
        <p className="mt-6 text-xs tracking-[0.18em] text-ink-muted uppercase">IELTS Academic</p>
        <h1 className="mt-1 font-serif text-3xl text-ink">Writing 攻略ガイド</h1>
      </header>

      <div className="grid grid-cols-2 rounded-lg border border-line bg-paper-raised p-1">
        {(["task1", "task2"] as const).map((item) => <button key={item} type="button" onClick={() => onTask(item)} className={`rounded-md py-2.5 text-sm ${task === item ? "bg-accent text-accent-foreground" : "text-ink-muted"}`}>{item === "task1" ? "Task 1" : "Task 2"}</button>)}
      </div>

      {task === "task1" ? <Task1Guide /> : <Task2Guide />}

      <section>
        <p className="text-xs tracking-[0.16em] text-ink-muted uppercase">Scoring</p>
        <h2 className="mt-1 font-serif text-2xl text-ink">4つの評価基準</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {SCORE_CRITERIA.map((criterion) => <article key={criterion.title} className="rounded-lg border border-line bg-paper-raised p-4"><h3 className="font-medium text-ink">{criterion.title}</h3><p className="mt-2 text-sm leading-6 text-ink-muted">{criterion.description}</p></article>)}
        </div>
      </section>
      <Button size="lg" onClick={onBack}>練習問題へ戻る</Button>
    </div>
  );
}

function Task1Guide() {
  return <>
    <section className="grid grid-cols-3 overflow-hidden rounded-lg border border-line bg-paper-raised"><Fact value="20分" label="目安時間" /><Fact value="150語" label="最低語数" /><Fact value="Overview" label="必須要素" /></section>
    <GuideSection number="01" title="最初の3分で図表を読む"><p>タイトル、単位、期間、カテゴリーを確認し、最大・最小、全体の傾向、交差や例外を探します。すべての数字を書くのではなく、overviewと詳細段落で扱う情報を選びます。</p></GuideSection>
    <GuideSection number="02" title="4段落を基本にする"><ol className="grid gap-3"><StructureItem label="Introduction" text="設問を正確に言い換える。" /><StructureItem label="Overview" text="最も重要な傾向や変化を、細かい数値なしでまとめる。" /><StructureItem label="Details 1" text="関連する項目をグループ化し、数値で比較する。" /><StructureItem label="Details 2" text="残りの主要項目と例外を比較する。" /></ol></GuideSection>
    <GuideSection number="03" title="客観的に報告する"><ul className="grid gap-3">{["データにない原因や個人的な意見を書かない", "数値には単位、年代、比較対象を付ける", "地図は位置と変化、工程図は順序と主要段階を示す", "conclusionよりも明確なoverviewを優先する"].map((item) => <li key={item} className="flex gap-3"><Check className="mt-0.5 size-4 shrink-0 text-ok" /><span>{item}</span></li>)}</ul></GuideSection>
    <GuideSection number="04" title="20分を配分する"><div className="grid gap-3 sm:grid-cols-3"><TimeBlock time="0–3分" title="分析・グループ化" /><TimeBlock time="3–17分" title="執筆" /><TimeBlock time="17–20分" title="数値と文法の確認" /></div></GuideSection>
  </>;
}

function Task2Guide() {
  return <>
    <section className="grid grid-cols-3 overflow-hidden rounded-lg border border-line bg-paper-raised"><Fact value="40分" label="目安時間" /><Fact value="250語" label="最低語数" /><Fact value="2倍" label="Task 1比の配点" /></section>
    <GuideSection number="01" title="最初の5分で設計する"><p>トピック、指示語、答えるべき項目を確認し、自分の立場を一文で決めます。その後、各Body段落の主張と具体例を短くメモします。</p></GuideSection>
    <GuideSection number="02" title="4段落を基本にする"><ol className="grid gap-3"><StructureItem label="Introduction" text="設問を言い換え、立場を明確にする。" /><StructureItem label="Body 1" text="一つ目の主張を、理由・説明・具体例で展開する。" /><StructureItem label="Body 2" text="二つ目の主張を、理由・説明・具体例で展開する。" /><StructureItem label="Conclusion" text="立場と主要点をまとめ、新しい論点は加えない。" /></ol></GuideSection>
    <GuideSection number="03" title="40分を配分する"><div className="grid gap-3 sm:grid-cols-3"><TimeBlock time="0–5分" title="分析・構成" /><TimeBlock time="5–35分" title="執筆" /><TimeBlock time="35–40分" title="見直し" /></div></GuideSection>
  </>;
}

function Fact({ value, label }: { value: string; label: string }) { return <div className="border-r border-line px-2 py-4 text-center last:border-r-0"><p className="font-mono text-xl text-ink sm:text-2xl">{value}</p><p className="mt-1 text-[0.65rem] text-ink-muted sm:text-xs">{label}</p></div>; }
function GuideSection({ number, title, children }: { number: string; title: string; children: ReactNode }) { return <section className="border-t border-line pt-6"><div className="flex items-baseline gap-3"><span className="font-mono text-xs text-accent">{number}</span><h2 className="font-serif text-2xl text-ink">{title}</h2></div><div className="mt-4 text-sm leading-7 text-ink">{children}</div></section>; }
function StructureItem({ label, text }: { label: string; text: string }) { return <li className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-3"><span className="font-medium text-accent">{label}</span><span>{text}</span></li>; }
function TimeBlock({ time, title }: { time: string; title: string }) { return <div className="rounded-md border border-line bg-paper-raised p-3"><Clock3 className="size-4 text-accent" /><p className="mt-3 font-mono text-base text-ink">{time}</p><p className="mt-1 text-xs text-ink-muted">{title}</p></div>; }
