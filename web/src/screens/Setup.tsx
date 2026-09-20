import { useState } from "react";
import type { ExamConfig } from "../types";
import { letter } from "../lib/exam";

export default function Setup({
  total,
  onLaunch,
  onBack,
}: {
  total: number;
  onLaunch: (cfg: ExamConfig) => void;
  onBack: () => void;
}) {
  const [count, setCount] = useState(20);
  const [seconds, setSeconds] = useState(60);
  const [shuffle, setShuffle] = useState(true);
  const counts = [10, 20, total];
  const timers = [40, 60, 90];

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <button onClick={onBack} className="text-sm font-medium text-slate-500 hover:text-slate-700">
        &larr; Back
      </button>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">Exam Setup</h1>
      <p className="text-sm text-slate-500">Mathematics · {total} questions available</p>

      <div className="mt-6">
        <p className="text-sm font-semibold text-slate-700">Number of questions</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {counts.map((c) => (
            <button
              key={c}
              onClick={() => setCount(c)}
              className={
                "rounded-xl border px-4 py-3 font-semibold " +
                (count === c
                  ? "border-[#0d122b] bg-[#0d122b] text-white"
                  : "border-slate-200 bg-white text-slate-700")
              }
            >
              {c === total ? `All (${total})` : c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold text-slate-700">Time per question</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {timers.map((t) => (
            <button
              key={t}
              onClick={() => setSeconds(t)}
              className={
                "rounded-xl border px-4 py-3 font-semibold " +
                (seconds === t
                  ? "border-[#0d122b] bg-[#0d122b] text-white"
                  : "border-slate-200 bg-white text-slate-700")
              }
            >
              {t === 60 ? "1 min" : `${Math.floor(t / 60)}m${t % 60}s`}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Total time: {Math.round((count * seconds) / 60)} min · auto-submits when time runs out
        </p>
      </div>

      <label className="mt-6 flex items-center gap-3">
        <input
          type="checkbox"
          checked={shuffle}
          onChange={(e) => setShuffle(e.target.checked)}
          className="h-4 w-4 accent-[#0d122b]"
        />
        <span className="text-sm text-slate-700">Shuffle question order</span>
      </label>

      <div className="mt-8 flex gap-3">
        <button
          onClick={() => onLaunch({ count, secondsPerQuestion: seconds, shuffle })}
          className="flex-1 rounded-xl bg-[#0d122b] px-4 py-4 text-lg font-bold text-white active:scale-[.99]"
        >
          Begin Exam
          <span className="ml-2 text-sm font-normal text-slate-300">
            via {letter(0)} {count} questions · {seconds}s each
          </span>
        </button>
      </div>
    </div>
  );
}