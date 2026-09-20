import type { Question } from "../types";

export interface GradedDetail {
  q: Question;
  chosen: string | null;
  ok: boolean;
}

export default function Results({
  detail,
  onReview,
  onRetake,
  onHome,
}: {
  detail: GradedDetail[];
  onReview: () => void;
  onRetake: () => void;
  onHome: () => void;
}) {
  const score = detail.filter((d) => d.ok).length;
  const total = detail.length;
  const percent = total ? Math.round((score / total) * 100) : 0;
  const passed = percent >= 50;
  const msg = passed
    ? "Well done! You are on your way. Review your mistakes to lock it in."
    : "Good try. Go through the questions you missed and retry — you will improve.";

  return (
    <div className="mx-auto max-w-xl px-4 py-8 text-center">
      <div
        className={
          "mx-auto flex h-28 w-28 items-center justify-center rounded-full text-4xl font-black text-white " +
          (passed ? "bg-emerald-500" : "bg-rose-500")
        }
      >
        {percent}%
      </div>
      <p className="mt-6 text-2xl font-bold text-slate-900">
        {score} / {total} correct
      </p>
      <p className="mt-1 text-sm text-slate-600">{passed ? "Passed" : "Below pass mark"} — JAMB pass is 50%</p>
      <p className="mt-4 text-slate-600">{msg}</p>

      <div className="mt-2 grid grid-cols-2 gap-2 text-sm font-semibold">
        <div className="rounded-xl bg-emerald-50 py-3 text-emerald-700">{score} correct</div>
        <div className="rounded-xl bg-rose-50 py-3 text-rose-700">{total - score} wrong</div>
      </div>

      <div className="mt-8 grid gap-3">
        <button
          onClick={onReview}
          className="rounded-xl bg-amber-400 px-4 py-4 text-lg font-bold text-[#0d122b] active:scale-[.99]"
        >
          View Review — see what you missed
        </button>
        <button
          onClick={onRetake}
          className="rounded-xl bg-[#0d122b] px-4 py-4 text-lg font-bold text-white active:scale-[.99]"
        >
          Retake
        </button>
        <button onClick={onHome} className="rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-600">
          Back to Home
        </button>
      </div>

      <p className="mt-6 text-xs text-slate-400">
        Results are saved on this device and work fully offline.
      </p>
      {detail.length > 0 && (
        <div className="mt-2 flex flex-wrap justify-center gap-1.5">
          {detail.map((d) => (
            <span
              key={d.q.id}
              title={`Q${d.q.id} — ${d.ok ? "correct" : "wrong"}`}
              className={
                "flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold " +
                (d.ok ? "bg-emerald-500 text-white" : "bg-rose-400 text-white")
              }
            >
              {d.chosen ?? "–"}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}