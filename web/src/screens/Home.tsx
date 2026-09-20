import type { SavedResult } from "../types";
import { lastResult } from "../lib/exam";

export default function Home({
  onStart,
  onChat,
  questionCount,
}: {
  onStart: () => void;
  onChat: () => void;
  questionCount: number;
}) {
  const saved: SavedResult | null = lastResult();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400 text-2xl font-black text-[#0d122b]">
          IA
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Illumination Academy</h1>
        <p className="mt-1 text-slate-600">Prepare for JAMB. Practice offline. Learn with your AI teacher.</p>
      </header>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Mathematics — 1983</h2>
            <p className="text-sm text-slate-500">{questionCount} practice questions &nbsp;·&nbsp; works offline</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-[#0d122b] text-white flex items-center justify-center font-bold">
            M
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={onStart}
            className="rounded-xl bg-[#0d122b] px-4 py-3 font-semibold text-white active:scale-[.98]"
          >
            Start Practice
          </button>
          <button
            onClick={onChat}
            className="rounded-xl bg-amber-400 px-4 py-3 font-semibold text-[#0d122b] active:scale-[.98]"
          >
            Ask a Teacher
          </button>
        </div>
      </div>

      {saved && (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm text-emerald-700">Last practice</p>
          <p className="text-3xl font-bold text-emerald-900">
            {saved.percent}%
            <span className="ml-2 text-base font-medium text-emerald-600">
              {saved.score}/{saved.total} · {saved.subject}
            </span>
          </p>
        </div>
      )}

      <p className="mt-8 text-center text-xs text-slate-400">
        Exam mode works without internet. Ask a Teacher needs a data connection.
      </p>
    </div>
  );
}