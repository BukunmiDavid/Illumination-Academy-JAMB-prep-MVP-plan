import { useCallback, useEffect, useRef, useState } from "react";
import MathText from "../components/MathText";
import { sendChat, transcribeAudio, type ChatMsg } from "../lib/api";
import { loadProfile, saveProfile, chatKey, firstName, type Profile } from "../lib/profile";

function loadHistory(key: string): DrawerMsg[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const arr = JSON.parse(raw) as DrawerMsg[];
      return arr.filter((m) => m && (m.role === "user" || m.role === "assistant") && m.content);
    }
  } catch {
    /* ignore */
  }
  return [];
}

export const LANGUAGES: { code: string; label: string; hint: string }[] = [
  { code: "en", label: "English", hint: "en" },
  { code: "pcm", label: "Pidgin", hint: "en" },
  { code: "yo", label: "Yorùbá", hint: "yo" },
  { code: "ig", label: "Igbo", hint: "ig" },
  { code: "ha", label: "Hausa", hint: "ha" },
];

interface DrawerMsg extends ChatMsg {
  pending?: boolean;
}

export default function ChatDrawer({
  open,
  onClose,
  subject,
  initialQuestion,
  onConsumed,
}: {
  open: boolean;
  onClose: () => void;
  subject: string;
  initialQuestion: string | null;
  onConsumed: () => void;
}) {
  const [profile, setProfile] = useState<Profile>(() => loadProfile());
  const [msgs, setMsgs] = useState<DrawerMsg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [language, setLanguage] = useState("en");
  const [editing, setEditing] = useState<{ text: string } | null>(null);
  const [awaitingName, setAwaitingName] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const seededRef = useRef(false);

  const pushUser = (text: string) => setMsgs((m) => [...m, { role: "user", content: text }]);

  const ask = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      if (!text || busy) return;
      if (awaitingName) {
        const p = { ...loadProfile(), name: text.slice(0, 60) };
        saveProfile(p);
        setProfile(p);
        setAwaitingName(false);
        pushUser(text);
        setInput("");
        setEditing(null);
        setMsgs((m) => [
          ...m,
          {
            role: "assistant",
            content: `Nice to meet you, ${firstName(p)}! 🎓 Ask me anything about ${subject} — or tap the mic to speak. I’ll remember you.`,
          },
        ]);
        return;
      }
      pushUser(text);
      setInput("");
      setEditing(null);
      setBusy(true);
      const history: ChatMsg[] = msgs.slice(-10).map((m) => ({ role: m.role, content: m.content }));
      let acc = "";
      setMsgs((m) => [...m, { role: "assistant", content: "", pending: true }]);
      try {
        await sendChat(
          [...history, { role: "user", content: text }],
          subject,
          language,
          (d) => {
            acc += d;
            setMsgs((m) => {
              const copy = [...m];
              const last = copy[copy.length - 1];
              if (last?.role === "assistant") copy[copy.length - 1] = { ...last, content: acc, pending: false };
              return copy;
            });
          },
          () => setBusy(false),
          firstName(profile),
        );
      } catch {
        setMsgs((m) => {
          const copy = [...m];
          copy[copy.length - 1] = {
            role: "assistant",
            content: "No connection to the teacher right now. Check your data and try again.",
          };
          return copy;
        });
        setBusy(false);
      }
    },
    [msgs, busy, subject, language, awaitingName, profile],
  );

  useEffect(() => {
    if (open && initialQuestion && !seededRef.current && firstName(profile)) {
      seededRef.current = true;
      const q = initialQuestion;
      void ask(`Can you explain this question to me step by step? ${q}`);
      onConsumed();
    }
  }, [open, initialQuestion, ask, onConsumed, profile]);

  useEffect(() => {
    if (!open) return;
    if (msgs.length === 0) {
      const key = chatKey(profile);
      const saved = loadHistory(key);
      const known = firstName(profile);
      if (saved.length > 0) {
        setMsgs([...saved, { role: "assistant", content: `Welcome back, ${known} 👋 — continuing where you left off.` }]);
        return;
      }
      if (known) {
        setMsgs([
          {
            role: "assistant",
            content:
              `Welcome back, ${known}! I am your ${subject} teacher at Illumination Academy. ` +
              "Ask me anything — or tap the mic and speak. You can use English, Pidgin, Yorùbá, Igbo or Hausa.",
          },
        ]);
      } else {
        setAwaitingName(true);
        setMsgs([
          {
            role: "assistant",
            content:
              `Hello! I am your ${subject} teacher at Illumination Academy. 🎓 ` +
              "First, what is your name? I will remember you from now on. (You can also skip by giving any question.)",
          },
        ]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, msgs.length, subject, profile]);

  const key = chatKey(profile);
  useEffect(() => {
    const done = msgs.some((m) => m.pending);
    if (!done && msgs.length > 0) {
      try {
        localStorage.setItem(key, JSON.stringify(msgs.slice(-20)));
      } catch {
        /* ignore */
      }
    }
  }, [msgs, key]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [msgs, editing]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative flex h-full w-full flex-col bg-white shadow-2xl sm:max-w-md">
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-lg font-black text-[#0d122b]">
            IA
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-900">Ask a Teacher</p>
            <p className="text-xs text-slate-500">
              {subject} · {firstName(profile) ? `Hi, ${firstName(profile)} · ` : ""}replies need internet
            </p>
          </div>
          <span className="text-2xl leading-none text-red-500">●</span>
          <button onClick={onClose} className="ml-1 rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-100" aria-label="Close chat">
            ✕
          </button>
        </div>

        <div ref={bodyRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4">
          {msgs.map((m, i) => (
            <div key={i} className={"flex " + (m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={
                  "max-w-[85%] rounded-2xl px-3 py-2 text-sm " +
                  (m.role === "user"
                    ? "bg-[#0d122b] text-white"
                    : "border border-slate-200 bg-white text-slate-800")
                }
              >
                <div className={m.pending ? "animate-pulse" : ""}>
                  {m.content ? <MathText text={m.content} /> : m.pending && <span>…</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {editing && (
          <div className="border-t border-amber-200 bg-amber-50 px-3 py-2">
            <p className="text-xs text-amber-700">Did you say:</p>
            <div className="mt-1 flex gap-2">
              <input
                value={editing.text}
                onChange={(e) => setEditing({ text: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && editing.text.trim()) {
                    void ask(editing.text);
                  }
                }}
                className="flex-1 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-sm"
                autoFocus
              />
              <button
                onClick={() => editing.text.trim() && void ask(editing.text)}
                className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-bold text-white"
              >
                Send
              </button>
              <button onClick={() => setEditing(null)} className="rounded-lg px-2 text-sm text-amber-700">
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="border-t border-slate-100 px-3 py-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mb-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            aria-label="Language"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                🗣 Speak/answer in: {l.label}
              </option>
            ))}
          </select>
          <div className="flex items-end gap-2">
            <VoiceButton
              language={LANGUAGES.find((l) => l.code === language)?.hint ?? "en"}
              disabled={busy}
              onText={(t) => setEditing({ text: t })}
            />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) void ask(input);
              }}
              placeholder="Ask a question…"
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0d122b]"
            />
            <button
              onClick={() => void ask(input)}
              disabled={!input.trim() || busy}
              className="rounded-xl bg-[#0d122b] px-4 py-2.5 font-bold text-white disabled:opacity-40"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function VoiceButton({ language, disabled, onText }: { language: string; disabled: boolean; onText: (t: string) => void }) {
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setBusy(true);
        try {
          const text = await transcribeAudio(blob, language);
          onText(text);
        } catch {
          onText("");
        }
        setBusy(false);
      };
      recRef.current = rec;
      rec.start();
      setRecording(true);
    } catch {
      alert("Microphone access was denied or is unavailable.");
    }
  };

  const stop = () => {
    recRef.current?.stop();
    setRecording(false);
  };

  if (busy) {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-lg" title="Transcribing…">
        ⏳
      </div>
    );
  }
  return (
    <button
      onClick={recording ? stop : () => void start()}
      disabled={disabled}
      className={
        "flex h-11 w-11 items-center justify-center rounded-xl text-lg " +
        (recording
          ? "bg-red-500 text-white"
          : "bg-amber-400 text-[#0d122b] disabled:opacity-40")
      }
      title={recording ? "Stop recording" : "Speak your question"}
    >
      {recording ? "◼" : "🎤"}
    </button>
  );
}