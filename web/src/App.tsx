import { useMemo, useState } from "react";
import questionsData from "./data/questions.json";
import type { ExamAnswer, ExamConfig, Question, QuestionBank } from "./types";
import { buildPaper, grade, saveResult, recordOfflineAttempt } from "./lib/exam";
import { sendResult } from "./lib/api";
import { loadProfile } from "./lib/profile";
import Home from "./screens/Home";
import Setup from "./screens/Setup";
import Exam from "./screens/Exam";
import Results, { type GradedDetail } from "./screens/Results";
import Review from "./screens/Review";
import ChatDrawer from "./chat/ChatDrawer";

type Screen = "home" | "setup" | "exam" | "results" | "review";

export default function App() {
  const bank = questionsData as QuestionBank;
  const all = useMemo(() => bank.questions, [bank]);

  const [screen, setScreen] = useState<Screen>("home");
  const [paper, setPaper] = useState<Question[]>([]);
  const [detail, setDetail] = useState<GradedDetail[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatQuestion, setChatQuestion] = useState<string | null>(null);

  const launch = (cfg: ExamConfig) => {
    setPaper(buildPaper(all, cfg));
    setDetail([]);
    setScreen("exam");
  };

  const finish = (answers: ExamAnswer[]) => {
    const g = grade(answers, paper);
    setDetail(g.detail);
    saveResult({
      score: g.score,
      total: g.total,
      percent: g.percent,
      subject: bank.subject,
      at: Date.now(),
    });
    recordOfflineAttempt({
      score: g.score,
      total: g.total,
      percent: g.percent,
      subject: bank.subject,
      at: Date.now(),
    });
    const prof = loadProfile();
    if (prof.name || prof.phone) {
      void sendResult(prof.phone, prof.name, bank.subject, g.score, g.total);
    }
    setScreen("results");
  };

  const openChatWithQuestion = (q: string | null) => {
    setChatQuestion(q && q.length > 240 ? q.slice(0, 240) : q);
    setChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {screen === "home" && (
        <Home
          questionCount={all.length}
          onStart={() => setScreen("setup")}
          onChat={() => openChatWithQuestion(null)}
        />
      )}
      {screen === "setup" && (
        <Setup total={all.length} onLaunch={launch} onBack={() => setScreen("home")} />
      )}
      {screen === "exam" && (
        <Exam questions={paper} secondsPerQuestion={60} onSubmit={finish} />
      )}
      {screen === "results" && (
        <Results
          detail={detail}
          onReview={() => setScreen("review")}
          onRetake={() => setScreen("setup")}
          onHome={() => setScreen("home")}
        />
      )}
      {screen === "review" && (
        <Review
          detail={detail}
          onBack={() => setScreen("results")}
          onChatQuestion={(q) => openChatWithQuestion(q)}
        />
      )}
      <ChatDrawer
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        subject={bank.subject}
        initialQuestion={chatQuestion}
        onConsumed={() => {}}
      />
    </div>
  );
}