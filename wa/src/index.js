import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, resolve } from "node:path";
import { spawn } from "node:child_process";
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  downloadMediaMessage,
} from "@whiskeysockets/baileys";
import QRCode from "qrcode";
import pino from "pino";

const API_URL = (process.env.API_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");
const AUTH_DIR = process.env.AUTH_DIR ?? "./auth";
const SESSIONS_FILE = resolve(dirname(resolve(AUTH_DIR)), "sessions.json");
const ALLOWED = new Set(
  (process.env.ALLOWED_NUMBERS ?? "").split(",").map((s) => s.trim()).filter(Boolean),
);

const logger = pino({ level: process.env.LOG_LEVEL ?? "warn" });

/* -------------------------------------------------------------------------- */
/* session state: registration + onboarding + quiz + history                  */
/* -------------------------------------------------------------------------- */

const LANG_HINTS = { en: "en", pcm: "en", yo: "yo", ig: "ig", ha: "ha" };

function loadSessions() {
  try {
    if (existsSync(SESSIONS_FILE)) return JSON.parse(readFileSync(SESSIONS_FILE, "utf8"));
  } catch {
    /* start fresh */
  }
  return {};
}

const sessions = loadSessions();
const quizzes = new Map(); // jid -> { id, options, correct }
let saveTimer = null;

function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      mkdirSync(dirname(SESSIONS_FILE), { recursive: true });
      writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
    } catch {
      /* best effort */
    }
  }, 500);
}

function phone(jid) {
  return jid.split("@")[0];
}

/* ---------- small HTTP page that shows the pairing QR -------------------- */

const QR_PAGE_PORT = Number(process.env.QR_PAGE_PORT ?? 8081);
const QR_PNG = () => resolve(AUTH_DIR, "..", "qr.png");
let qrPage = null; // latest html with cache-buster
let qrServerStarted = false;

function startQrPage() {
  if (qrServerStarted) return;
  qrServerStarted = true;

  qrPage =
    "<!doctype html><meta charset=utf-8><title>Link Illumination Academy on WhatsApp</title>" +
    "<style>body{font-family:system-ui;text-align:center;padding:24px}img{width:320px;height:320px;border:1px solid #ddd;border-radius:12px}" +
    "p{color:#555}button{font-size:16px;padding:10px 24px;border-radius:10px;border:0;background:#25D366;color:#fff;font-weight:600;cursor:pointer}</style>" +
    "<h2>1) Open WhatsApp on your phone</h2>" +
    "<p>Settings &gt; Linked devices &gt; Link a device, then scan the QR.</p>" +
    `<img src="/qr.png?t=${Date.now()}" alt="pairing QR">` +
    "<p>QR refreshes about every 20s. If it looks stale, reload this page.</p>" +
    `<button onclick="location.reload()">Get fresh QR</button>` +
    "<p id=s>Waiting for scan…</p>" +
    '<script>setInterval(()=>fetch("/status").then(r=>r.text()).then(t=>{if(t==="linked")document.getElementById("s").textContent="✅ Linked! You can close this page."}),3000)</script>';

  createServer((req, res) => {
    if (req.url.startsWith("/qr.png")) {
      try {
        const p = QR_PNG();
        if (!existsSync(p)) {
          res.writeHead(404);
          res.end("no QR yet");
          return;
        }
        res.writeHead(200, { "Content-Type": "image/png" });
        res.end(readFileSync(p));
      } catch {
        res.writeHead(500);
        res.end("error");
      }
      return;
    }
    if (req.url.startsWith("/status")) {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(existsSync(credsPath()) ? "linked" : "waiting");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(qrPage);
  })
    .on("error", (err) => {
      console.error(`[wa] QR page could not listen on ${QR_PAGE_PORT}:`, err.message);
    })
    .listen(QR_PAGE_PORT, () => {
      console.log(`\n[wa] QR page: http://localhost:${QR_PAGE_PORT}  (open this in your browser)\n`);
      if (process.platform === "win32") {
        spawn("cmd", ["/c", "start", "", `http://localhost:${QR_PAGE_PORT}`], { stdio: "ignore", detached: true }).unref();
      }
    });
}

function credsPath() {
  return resolve(AUTH_DIR, "creds.json");
}

function isAllowed(jid) {
  if (ALLOWED.size === 0) return true;
  return ALLOWED.has(phone(jid));
}

function getSession(jid) {
  return sessions[jid] ?? null;
}

function ensureSession(jid) {
  if (!sessions[jid]) {
    sessions[jid] = {
      name: "",
      subject: "Mathematics",
      school: "",
      cls: "",
      lang: "en",
      step: null, // null = registered/free mode, else onboarding step key
      history: [],
    };
    persist();
  }
  return sessions[jid];
}

function clearSession(jid) {
  delete sessions[jid];
  quizzes.delete(jid);
  persist();
}

function pushHistory(s, role, content) {
  s.history.push({ role, content });
  if (s.history.length > 8) s.history = s.history.slice(-8);
}

function registered(s) {
  return !!s && s.step === null && !!s.name;
}

/* -------------------------------------------------------------------------- */
/* helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getText(msg) {
  const m = msg.message;
  if (!m) return "";
  return (
    m.conversation ||
    m.extendedTextMessage?.text ||
    m.imageMessage?.caption ||
    m.videoMessage?.caption ||
    m.documentMessage?.title ||
    ""
  );
}

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

async function teacherReply(s, text) {
  const body = {
    messages: [...s.history, { role: "user", content: text }],
    subject: s.subject,
    language: s.lang,
  };
  const res = await fetch(`${API_URL}/api/chat/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) return `[Sorry, the teacher service replied ${res.status}. Try again in a moment.]`;
  const data = await res.json();
  const reply = String(data.text ?? "").trim() || "[The teacher had nothing to say. Try again?]";
  pushHistory(s, "user", text);
  pushHistory(s, "assistant", reply.slice(0, 2000));
  return reply;
}

function helpText() {
  return (
    `Commands:\n` +
    `• *start* — register or see your menu\n` +
    `• *quiz* — get a JAMB question to practise\n` +
    `• *next* / *skip* — next quiz question\n` +
    `• *lang yo / ig / ha / pcm / en* — set reply language\n` +
    `• *stop* — end your session\n` +
    `• *help* — show this message\n\n` +
    `Ask any question and I'll teach you, step by step, in your language.`
  );
}

/* ---------- quiz (reads the shipped question bank) ------------------------ */

let questionBank = [];
let bankLoaded = false;

function loadBank() {
  if (bankLoaded) return;
  bankLoaded = true;
  try {
    const here = dirname(new URL(import.meta.url).pathname);
    const p = resolve(here, "../../web/src/data/questions.json");
    const raw = JSON.parse(readFileSync(p, "utf8"));
    questionBank = Array.isArray(raw) ? raw : raw.questions ?? [];
  } catch {
    questionBank = [];
  }
}

function pickQuestion() {
  const pool = questionBank.filter((q) => q.options?.length >= 2);
  return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
}

function renderQuestion(q) {
  const opts = q.options.map((o, i) => `${LETTERS[i]}. ${o}`).join("\n");
  return `Q${q.id}: ${q.question}\n\n${opts}`;
}

function answerLetter(raw) {
  const t = (raw ?? "").trim().toUpperCase();
  if (/^[A-J]$/.test(t)) return t;
  const n = parseInt(t, 10);
  if (n >= 1 && n <= 10) return LETTERS[n - 1];
  return null;
}

/* -------------------------------------------------------------------------- */
/* WhatsApp socket                                                            */
/* -------------------------------------------------------------------------- */

async function startWA() {
  loadBank();
  startQrPage();
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

  const sock = makeWASocket({
    auth: state,
    logger,
    browser: ["Illumination Academy", "Chrome", "1.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      const qrPath = QR_PNG();
      const qrTextPath = resolve(AUTH_DIR, "..", "qr.txt");
      try {
        writeFileSync(qrTextPath, qr);
        QRCode.toFile(qrPath, qr, { width: 480, margin: 2 }).then(() => {
          console.log(`\n[wa] QR refreshed — open http://localhost:${QR_PAGE_PORT} and scan it.\n`);
        });
      } catch (err) {
        console.log("\n[wa] could not write QR file:", err.message);
      }
    }
    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      console.log(
        `[wa] disconnected (${statusCode ?? "?"}) —${shouldReconnect ? " reconnecting in 5s" : " logged out, delete the auth folder to scan a new QR"}`,
      );
      if (shouldReconnect) setTimeout(() => void startWA().catch(console.error), 5000);
    } else if (connection === "open") {
      console.log("[wa] connected and listening for messages.");
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    for (const msg of messages) {
      try {
        if (msg.key?.fromMe || msg.key?.remoteJid?.includes("@g.us")) continue;
        const jid = msg.key.remoteJid;
        if (!jid) continue;
        if (!isAllowed(jid)) {
          await sock.sendMessage(jid, {
            text: "Sorry, this number is not enrolled in the pilot.",
          });
          continue;
        }
        await sock.sendPresenceUpdate("composing", jid);
        const reply = await handleMessage(jid, msg);
        await sock.sendMessage(jid, { text: reply });
      } catch (err) {
        console.error("[wa] handler error:", err);
      }
    }
  });

  return sock;
}

/* ---------- message routing ---------------------------------------------- */

async function handleMessage(jid, msg) {
  const text = getText(msg).trim();
  const voice = Boolean(msg.message?.audioMessage);
  const lower = text.toLowerCase();

  if (voice) {
    let s = getSession(jid);
    if (!registered(s)) {
      return "I'd love to hear you, but please send *start* first to register.";
    }
    const hint = LANG_HINTS[s.lang] ?? "en";
    try {
      const buffer = await downloadMediaMessage(msg, "buffer", {}, { logger });
      const fd = new FormData();
      fd.append("audio", new Blob([buffer], { type: "audio/ogg" }), "voice.ogg");
      fd.append("language", hint);
      const res = await fetch(`${API_URL}/api/transcribe`, { method: "POST", body: fd });
      if (!res.ok) return `[Voice processing failed (${res.status}). Try again.]`;
      const data = await res.json();
      const heard = String(data.text ?? "").trim();
      if (!heard) return "I couldn't hear a clear question. Could you speak a bit more slowly?";
      return await teacherReply(s, heard);
    } catch {
      return "Sorry, I couldn't process that voice note just now. Try again shortly.";
    }
  }

  let s = getSession(jid);

  if (!text) return registered(s) ? "Send *help* to see what I can do." : helpText();

  if (lower === "help" || lower === "menu") return helpText();

  if (lower === "stop" || lower === "end" || lower === "exit") {
    if (!s) return "You hadn't started a session.";
    clearSession(jid);
    return "Session ended. Send *start* anytime to come back. Good luck with your studying! 📚";
  }

  if (lower.startsWith("lang ")) {
    const code = lower.slice(5).trim();
    if (!Object.prototype.hasOwnProperty.call(LANG_HINTS, code)) {
      return `Supported languages: *en*, *yo*, *ig*, *ha*, *pcm*.`;
    }
    ensureSession(jid).lang = code;
    persist();
    return `Okay, I'll answer in *${code.toUpperCase()}*. 🗣`;
  }

  if (lower === "start") {
    if (registered(s)) {
      return `Hi ${s.name}! 👋 I'm your Illumination Academy teacher for *${s.subject}*.\n\n` +
        `• Ask me any question — e.g. *explain variation to me*\n` +
        `• Send a voice note in English, Pidgin, Yorùbá, Igbo or Hausa\n` +
        `• Type *quiz* to practise past questions\n` +
        `• Type *help* for commands\n\n` +
        `Ready? Ask away!`;
    }
    const sess = ensureSession(jid);
    sess.step = "name";
    persist();
    return (
      "Welcome to Illumination Academy! 🎓 I'm your personal JAMB teacher.\n\n" +
      "To set up your profile, please tell me your *name*."
    );
  }

  if (lower === "quiz" || lower === "practice" || lower === "next" || lower === "skip") {
    if (!registered(s)) return "Send *start* first, then I'll give you questions to practise.";
    const sess = ensureSession(jid);
    const q = pickQuestion();
    if (!q) return "No questions available right now. Try again later.";
    quizzes.set(jid, { id: q.id, options: q.options, correct: q.correct });
    return `Here's a JAMB practice question. Reply with the letter (*A*) or the answer itself.\n\n${renderQuestion(q)}`;
  }

  /* onboarding in progress */
  if (s && s.step) {
    const sess = s;
    if (sess.step === "name") {
      sess.name = text.replace(/^my name is\s+/i, "").slice(0, 60);
      sess.step = "subject";
    } else if (sess.step === "subject") {
      sess.subject = text.slice(0, 40);
      sess.step = "school";
    } else if (sess.step === "school") {
      sess.school = text === "-" ? "" : text.slice(0, 60);
      sess.step = "class";
    } else if (sess.step === "class") {
      sess.cls = text === "-" ? "" : text.slice(0, 60);
      sess.step = null;
      persist();
      return (
        `You're all set, ${sess.name}! 🎉 Your profile:\n` +
        `• Subject: *${sess.subject}*\n` +
        `• School: ${sess.school || "-"}\n` +
        `• Class: ${sess.cls || "-"}\n\n` +
        `Now ask me anything — or send *quiz* for a practice question.`
      );
    }
    persist();
    if (sess.step === "subject") return `Great, ${sess.name}. Which subject are you preparing for? *(default: Mathematics)*`;
    if (sess.step === "school") return `Which school do you attend? *(send - to skip)*`;
    if (sess.step === "class") return `Which class are you in? e.g. SS1, SS2, SS3 *(send - to skip)*`;
  }

  /* quiz answer grading */
  const quiz = quizzes.get(jid);
  if (quiz) {
    const L = answerLetter(text);
    const exact = quiz.options.findIndex((o) => o.toLowerCase() === text.toLowerCase());
    let picked = null;
    if (L) picked = L;
    else if (exact >= 0) picked = LETTERS[exact];
    if (picked) {
      quizzes.delete(jid);
      const ok = picked === quiz.correct;
      const q = questionBank.find((x) => x.id === quiz.id);
      const correctText = q?.options[LETTERS.indexOf(quiz.correct)] ?? quiz.correct;
      const head = ok
        ? `✅ Correct! Well done, ${s?.name ?? "student"}.`
        : `❌ Not quite — the answer is *${quiz.correct}*. ${correctText}`;
      const explain = q?.explanation ? `\n\n${q.explanation}` : "";
      return `${head}${explain}\n\nType *next* for another question, or ask me anything.`;
    }
  }

  /* free-form Q&A for everyone (even unregistered, one-off) */
  const sess = ensureSession(jid);
  return await teacherReply(sess, text);
}

process.on("unhandledRejection", (err) => {
  console.error("[wa] unhandled rejection:", err?.message ?? err);
});
process.on("uncaughtException", (err) => {
  console.error("[wa] uncaught exception:", err?.message ?? err);
});

startWA().catch((err) => {
  console.error("[wa] fatal:", err);
  process.exit(1);
});