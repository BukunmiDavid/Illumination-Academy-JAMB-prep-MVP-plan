import { useEffect, useMemo, useRef, useState } from "react";
import type { Question, ExamAnswer } from "../types";
import MathText from "../components/MathText";
import { letter } from "../lib/exam";

export default function Exam({
  questions,
  secondsPerQuestion,
  onSubmit,
}: {
  questions: Question[];
  secondsPerQuestion: number;
  onSubmit: (answers: ExamAnswer[]) => void;
}) {
  const totalSeconds = useMemo(() => questions.length * secondsPerQuestion, [questions, secondsPerQuestion]);
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [submitted, setSubmitted] = useState(false);
  const submittedRef = useRef(false);

  const submit = () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitted(true);
    const answers: ExamAnswer[] = questions.map((q) => ({
      qid: q.id,
      chosen: picks[q.id] ?? null,
    }));
    onSubmit(answers);
  };

  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  useEffect(() => {
    const onBefore = (e: BeforeUnloadEvent) => {
      if (!submittedRef.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", onBefore);
    return () => window.removeEventListener("beforeunload", onBefore);
  }, []);

  const q = questions[idx];
  const answered = Object.keys(picks).length;
  const answeredCount = answered;
  const mm = Math.floor(timeLeft / 60);
  const ss = String(timeLeft % 60).padStart(2, "0");
  const urgent = timeLeft <= 60;

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-4">
      <div className="flex items-center justify-between">
        <button
          onClick={submit}
          className="rounded-lg bg-slate-900 px-3 py-1.5 text-white text-sm"
        >
          Submit
        </button>
        <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <span>Question {idx + 1}/{questions.length}</span>
        </span>
        <span
          className={
            "font-mono text-lg font-bold tabular-nums " +
            (urgent ? "text-red-600" : "text-slate-800")
          }
        >
          {submitted ? "00:00" : `${mm}:${ss}`}
        </span>
      </div>

      <div className="mt-2 h-2 w-full overflow-hidden rounded bg-slate-100">
        <div
          className="h-full bg-[#0d122b] transition-all"
          style={{ width: `${(answeredCount / questions.length) * 100}%` }}
        />
      </div>

      <div className="mt-4 flex-1">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wide text-amber-600">
            {q.topic} · {q.year}
          </span>
          <div className="mt-2 text-lg text-slate-900">
            <MathText text={q.question} />
          </div>
          <div className="mt-4 space-y-2">
            {q.options.map((opt, i) => {
              const L = letter(i);
              const chosen = picks[q.id] === L;
              return (
                <button
                  key={i}
                  onClick={() => {
                    setPicks((p) => ({ ...p, [q.id]: L }));
                    if (idx < questions.length - 1) setTimeout(() => setIdx(idx + 1), 150);
                  }}
                  className={
                    "flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left text-slate-800 transition " +
                    (chosen
                      ? "border-[#0d122b] bg-[#0d122b] text-white"
                      : "border-slate-200 bg-white hover:border-slate-300")
                  }
                >
                  <span
                    className={
                      "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-sm font-bold " +
                      (chosen ? "border-white/40 bg-white/10" : "border-slate-300")
                    }
                  >
                    {L}
                  </span>
                  <span className="min-w-0">
                    <MathText text={opt} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={() => setIdx(Math.max(0, idx - 1))}
          disabled={idx === 0}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 disabled:opacity-40"
        >
          Previous
        </button>
        {idx < questions.length - 1 ? (
          <button
            onClick={() => setIdx(idx + 1)}
            className="flex-1 rounded-xl bg-slate-800 px-4 py-3 font-semibold text-white"
          >
            Next
          </button>
        ) : (
          <button
            onClick={submit}
            className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white"
          >
            Finish Exam
          </button>
        )}
      </div>
    </div>
  );
}