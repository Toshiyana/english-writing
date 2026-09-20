import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Clock3 } from "lucide-react";
import type { ReactNode } from "react";

type TipsViewProps = {
  onBack: () => void;
};

const SCORE_CRITERIA = [
  {
    title: "Task Response",
    description: "設問の全パートに直接答え、立場を明確にして、主張を十分に説明する。",
  },
  {
    title: "Coherence & Cohesion",
    description: "考えを論理的な順序で並べ、段落ごとに一つの中心的な考えを展開する。",
  },
  {
    title: "Lexical Resource",
    description: "話題に合う語彙を、意味と用法を確かめながら自然に使う。",
  },
  {
    title: "Grammatical Range & Accuracy",
    description: "文の形に変化を持たせつつ、正確さと読みやすさを優先する。",
  },
] as const;

const REVIEW_ITEMS = [
  "設問のすべてのパートに答えているか",
  "自分の立場が序論から結論まで一貫しているか",
  "各Body段落に、主張・説明・具体例があるか",
  "話題から外れた文や、同じ内容の繰り返しがないか",
  "冠詞、単複、動詞の形、スペル、句読点に誤りがないか",
] as const;

export function TipsView({ onBack }: TipsViewProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 pb-12">
      <header>
        <Button variant="ghost" size="sm" onClick={onBack} className="-ml-3">
          <ArrowLeft className="size-3.5" />
          ホームへ
        </Button>
        <p className="mt-6 text-xs tracking-[0.18em] text-ink-muted uppercase">
          IELTS Academic
        </p>
        <h1 className="mt-1 font-serif text-3xl text-ink">Task 2 攻略ガイド</h1>
        <p className="mt-3 text-sm leading-6 text-ink-muted">
          難しい表現を増やす前に、設問へ正確に答え、考えを読みやすく展開することを意識しましょう。
        </p>
      </header>

      <section className="grid grid-cols-3 overflow-hidden rounded-lg border border-line bg-paper-raised">
        <Fact value="40分" label="目安時間" />
        <Fact value="250語" label="最低語数" />
        <Fact value="2倍" label="Task 1比の配点" />
      </section>

      <GuideSection number="01" title="最初の5分で設計する">
        <p>
          設問のトピック、指示語、答えるべき項目を確認し、自分の立場を一文で決めます。その後、Body段落ごとの主張と例を短くメモします。
        </p>
        <div className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 rounded-md bg-paper px-4 py-3 text-sm">
          <span className="font-medium text-accent">Topic</span>
          <span>何について書くか</span>
          <span className="font-medium text-accent">Instruction</span>
          <span>何をするよう求められているか</span>
          <span className="font-medium text-accent">Parts</span>
          <span>答える項目はいくつあるか</span>
          <span className="font-medium text-accent">Position</span>
          <span>自分の立場は何か</span>
        </div>
      </GuideSection>

      <GuideSection number="02" title="4段落を基本に組み立てる">
        <ol className="grid gap-3">
          <StructureItem label="Introduction" text="設問を自分の言葉で示し、立場を明確にする。" />
          <StructureItem label="Body 1" text="一つ目の主張を、理由・説明・具体例で展開する。" />
          <StructureItem label="Body 2" text="二つ目の主張を、理由・説明・具体例で展開する。" />
          <StructureItem label="Conclusion" text="立場と主要点を簡潔にまとめる。新しい論点は加えない。" />
        </ol>
      </GuideSection>

      <GuideSection number="03" title="40分を使い切る">
        <div className="grid gap-3 sm:grid-cols-3">
          <TimeBlock time="0–5分" title="分析・構成" />
          <TimeBlock time="5–35分" title="執筆" />
          <TimeBlock time="35–40分" title="見直し" />
        </div>
        <p className="mt-3 text-xs text-ink-muted">
          時間配分は練習用の目安です。自分の書く速さに合わせて調整してください。
        </p>
      </GuideSection>

      <section>
        <p className="text-xs tracking-[0.16em] text-ink-muted uppercase">Scoring</p>
        <h2 className="mt-1 font-serif text-2xl text-ink">4つの評価基準</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {SCORE_CRITERIA.map((criterion) => (
            <article key={criterion.title} className="rounded-lg border border-line bg-paper-raised p-4">
              <h3 className="font-medium text-ink">{criterion.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-muted">{criterion.description}</p>
            </article>
          ))}
        </div>
      </section>

      <GuideSection number="04" title="最後に見直す">
        <ul className="grid gap-3">
          {REVIEW_ITEMS.map((item) => (
            <li key={item} className="flex gap-3">
              <Check className="mt-0.5 size-4 shrink-0 text-ok" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </GuideSection>

      <section className="rounded-lg border border-warn/30 bg-warn-soft p-5">
        <h2 className="font-serif text-xl text-warn">避けたい書き方</h2>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-warn">
          <li>・暗記した文章を設問に合わせず使う</li>
          <li>・難しい単語や長い文を、正確さを犠牲にして使う</li>
          <li>・具体例だけを書き、主張との関係を説明しない</li>
          <li>・語数を増やすために、無関係な内容や同じ主張を加える</li>
        </ul>
      </section>

      <Button size="lg" onClick={onBack}>練習問題へ戻る</Button>
    </div>
  );
}

function Fact({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-r border-line px-2 py-4 text-center last:border-r-0">
      <p className="font-mono text-xl text-ink sm:text-2xl">{value}</p>
      <p className="mt-1 text-[0.65rem] text-ink-muted sm:text-xs">{label}</p>
    </div>
  );
}

function GuideSection({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line pt-6">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-xs text-accent">{number}</span>
        <h2 className="font-serif text-2xl text-ink">{title}</h2>
      </div>
      <div className="mt-4 text-sm leading-7 text-ink">{children}</div>
    </section>
  );
}

function StructureItem({ label, text }: { label: string; text: string }) {
  return (
    <li className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-3">
      <span className="font-medium text-accent">{label}</span>
      <span>{text}</span>
    </li>
  );
}

function TimeBlock({ time, title }: { time: string; title: string }) {
  return (
    <div className="rounded-md border border-line bg-paper-raised p-3">
      <Clock3 className="size-4 text-accent" />
      <p className="mt-3 font-mono text-base text-ink">{time}</p>
      <p className="mt-1 text-xs text-ink-muted">{title}</p>
    </div>
  );
}
