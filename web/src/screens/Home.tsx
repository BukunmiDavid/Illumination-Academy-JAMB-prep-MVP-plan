import type { SavedResult } from "../types";
import { lastResult } from "../lib/exam";
import WhatsAppCard from "../components/WhatsAppCard";
import { waStartUrl, WHATSAPP_NUMBER } from "../lib/wa";

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
  const waUrl = waStartUrl();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400 text-2xl font-black text-[#0d122b]">
          IA
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Illumination Academy</h1>
        <p className="mt-1 text-slate-600">Prepare for JAMB. Practice offline. Learn with your AI teacher.</p>
      </header>

      {saved && (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm text-emerald-700">Last practice</p>
          <p className="text-3xl font-bold text-emerald-900">
            {saved.percent}%
            <span className="ml-2 text-base font-medium text-emerald-600">
              {saved.score}/{saved.total} · {saved.subject}
            </span>
          </p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4">
        <button
          onClick={onStart}
          className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm active:scale-[.99]"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0d122b] text-2xl">
            📝
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900">Take an exam</h2>
            <p className="text-sm text-slate-500">
              {questionCount} practice questions · works offline · instant results + review
            </p>
          </div>
          <span className="text-slate-300 group-active:translate-x-1">→</span>
        </button>

        <button
          onClick={onChat}
          className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm active:scale-[.99]"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-2xl">
            🎓
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900">Speak to a teacher</h2>
            <p className="text-sm text-slate-500">
              Ask questions, get step-by-step lessons, even talk with your voice
            </p>
          </div>
          <span className="text-slate-300 group-active:translate-x-1">→</span>
        </button>

        {(WHATSAPP_NUMBER !== "") ? (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-2xl border border-emerald-200 bg-white p-5 text-left shadow-sm active:scale-[.99]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-2xl">
              💬
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-slate-900">Continue on WhatsApp</h2>
              <p className="text-sm text-slate-500">
                Take quizzes and get help from the AI teacher inside WhatsApp
              </p>
            </div>
            <span className="text-slate-300 group-active:translate-x-1">↗</span>
          </a>
        ) : (
          <div className="flex items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-left opacity-80">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-2xl">
              💬
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-slate-900">Continue on WhatsApp</h2>
              <p className="text-sm text-slate-500">WhatsApp chat coming soon</p>
            </div>
          </div>
        )}
      </div>

      <WhatsAppCard />

      <p className="mt-8 text-center text-xs text-slate-400">
        Exam mode works without internet. Talk to a teacher and WhatsApp need a data connection.
      </p>
    </div>
  );
}