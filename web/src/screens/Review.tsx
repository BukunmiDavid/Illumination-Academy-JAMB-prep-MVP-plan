import { useMemo, useState } from "react";
import type { GradedDetail } from "./Results";
import MathText from "../components/MathText";
import { letter } from "../lib/exam";

type Filter = "all" | "correct" | "wrong";

export default function Review({
  detail,
  onBack,
  onChatQuestion,
}: {
  detail: GradedDetail[];
  onBack: () => void;
  onChatQuestion: (q: string) => void;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  const filtered = useMemo(
    () => detail.filter((d) => (filter === "all" ? true : filter === "correct" ? d.ok : !d.ok)),
    [detail, filter],
  );

  const toggle = (qid: number) =>
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(qid)) next.delete(qid);
      else next.add(qid);
      return next;
    });

  const chips: { key: Filter; label: string }[] = [
    { key: "all", label: `All (${detail.length})` },
    { key: "correct", label: `Correct (${detail.filter((d) => d.ok).length})` },
    { key: "wrong", label: `Wrong (${detail.filter((d) => !d.ok).length})` },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <button onClick={onBack} className="text-sm font-medium text-slate-500 hover:text-slate-700">
        &larr; Back to results
      </button>
      <h1 className="mt-1 text-2xl font-bold text-slate-900">Question Review</h1>

      <div className="mt-4 flex gap-2">
        {chips.map((c) => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={
              "rounded-full border px-3 py-1.5 text-sm font-semibold " +
              (filter === c.key
                ? "border-[#0d122b] bg-[#0d122b] text-white"
                : "border-slate-200 bg-white text-slate-600")
            }
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-4 pb-24">
        {filtered.map(({ q, chosen, ok }) => {
          const show = revealed.has(q.id);
          return (
            <div key={q.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Q{q.id} · {q.topic} · {q.year}
                </span>
                <span
                  className={
                    "rounded-full px-2 py-0.5 text-xs font-bold " +
                    (ok ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700")
                  }
                >
                  {ok ? "Correct" : "Wrong"}
                </span>
              </div>

              <div className="mt-2 text-slate-900">
                <MathText text={q.question} />
              </div>

              <div className="mt-3 grid gap-1 text-sm">
                {q.options.map((opt, i) => {
                  const L = letter(i);
                  const isRight = L === q.correct;
                  const isChosen = chosen === L;
                  return (
                    <div
                      key={i}
                      className={
                        "flex items-center gap-2 rounded-lg px-2 py-1 " +
                        (isRight
                          ? "bg-emerald-50 text-emerald-900"
                          : isChosen
                            ? "bg-rose-50 text-rose-900 line-through"
                            : "text-slate-600")
                      }
                    >
                      <span className="w-5 font-bold">{L}.</span>
                      <MathText text={opt} />
                      {isRight && <span className="ml-auto text-xs font-bold text-emerald-600">✓ correct</span>}
                      {isChosen && !isRight && <span className="ml-auto text-xs font-bold text-rose-600">your pick</span>}
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => toggle(q.id)}
                  className="rounded-lg bg-[#0d122b] px-3 py-1.5 text-sm font-semibold text-white"
                >
                  {show ? "Hide explanation" : "Show answer & explanation"}
                </button>
                <button
                  onClick={() => onChatQuestion(q.question)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600"
                >
                  Ask teacher about this
                </button>
              </div>

              {show && (
                <div className="mt-3 rounded-xl bg-amber-50 p-4">
                  <p className="text-sm font-bold text-[#0d122b]">
                    Correct answer: {q.correct}
                  </p>
                  <div className="mt-1 text-sm text-slate-800">
                    <MathText text={q.explanation} />
                  </div>
                  {q.source_note && (
                    <p className="mt-2 text-xs italic text-slate-500">Note: {q.source_note}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}