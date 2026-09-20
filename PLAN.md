# Illumination Academy — Build Plan & Decisions

E-teacher platform preparing Nigerian students for JAMB. MVP = Mathematics (1983 paper) proof-of-concept.

## Locked decisions
- **Offline-first PWA**: exam, timer, grading, results, review + explanations work with NO internet. Only the AI chat and voice need data.
- **PoC subject**: Mathematics. **48 questions** (from the user's `MATHEMATICS-JAMB-Past-Questions.pdf`, extracted by user).
- **No diagrams in v1**: all 48 questions are self-contained text; Q36 & Q46 dropped (under-specified without figure); Q44/Q49 get QA flags.
- **WhatsApp**: Baileys (Node) for pilot, pluggable behind one interface so the official Meta API can replace it later.
- **Budget**: ~$0–10/month pilot (Groq free tier for LLM + Whisper, free hosting, Baileys).
- **Stack**: Python FastAPI backend, Vite + React + TS + Tailwind + KaTeX PWA, SQLite, Groq (`llama-3.3-70b-versatile`) + `whisper-large-v3-turbo`, Node Baileys bridge.

## Data pipeline
- Source of truth: `build/questions_math.py` (48 questions) -> `data/mathematics.csv` -> `web/src/data/questions.json` (bundled for offline).
- CSV columns: `id, year, subject, topic, question, option_a, option_b, option_c, option_d, option_e, correct, explanation, source_note`.

## Resolved answer keys (7 disputed/typo questions)
| Q | Resolved | Note |
|---|---|---|
| 12 | B — 10 pupils | printed key D(12) wrong |
| 13 | D — 0.000019 | print typo 0.303 -> 0.03 |
| 21 | A — 6 | RHS correct 100100_2 (=36); note 6_10 = 12_4 |
| 22 | C — 0 | coefficients corrected (1/2 + 1/3 - 5/6) |
| 32 | B — m=4, n=-2 | B and D duplicate in 1983 paper |
| 39 | B — 6.10 cm2 | printed key C(6.09) wrong rounding |
| 48 | D — 25.46 | option D printed 25.50 (typo); key E wrong |

## Product flows (v1)
1. **Web / offline exam**: subject picker -> setup (questions + timer) -> MCQ exam with countdown -> auto-submit -> results (score/%) -> review (correct/wrong filter; reveal answer + explanation).
2. **Ask a Teacher (web, online)**: streaming chat tied to subject/topic; mic voice input -> Whisper transcription with "Did you say...?" confirm + language selector (en, yo, ig, ha, pcm).
3. **WhatsApp (Baileys)**: `/start` welcome -> collect exam/subject/name/school/class -> free Q&A (text + voice notes) -> `/stop`; session persisted in SQLite.

## Backend endpoints (FastAPI)
- `POST /api/chat` (SSE stream), `POST /api/transcribe`, `GET /api/subjects`, `POST /api/results`, `POST /api/wa/webhook`.
- DB: SQLite `api/storage.db` (students, chats, results).
- Keys via `api/.env` (Groq `GROQ_API_KEY`).

## Milestones
- M0 scaffold + plan + data pipeline
- M1 CSV/JSON generation + validation
- M2 backend (exams, chat, transcribe)
- M3 web PWA exam engine (offline)
- M4 web chat + voice
- M5 WhatsApp bridge
- M6 deploy + pilot (Render + Vercel), QA checklist   <-- current

## Deployment
- **API -> Render** (`render.yaml` blueprint, rootDir `api`): installs
  `requirements-prod.txt` (adds `gunicorn` for POSIX; local Windows venv keeps plain
  `requirements.txt`), runs uvicorn behind gunicorn on `$PORT`. Set `GROQ_API_KEY`
  in Render env vars. SQLite `api/storage.db` is ephemeral on Render free tier.
- **Web -> Vercel** (`web/vercel.json`): `npm run build` -> `dist`; SPA rewrite
  excludes `api/` and extension paths so `sw.js` + hashed assets load normally.
  Set `VITE_API_URL=https://<api>.onrender.com` in Vercel project env vars before build.
- **WhatsApp bridge** (`wa/`, Baileys): needs a long-running always-on process
  (free Render web tiers spin down). Run it on a cheap VPS / Oracle free instance /
  spare Android (Termux) / or a server. `wa/Dockerfile` included. Scan QR once;
  session persists in `wa/auth`.
- Pilot hosts: Render gives `<name>.onrender.com`, Vercel gives `<name>.vercel.app`.
  Vercel default hostname is free (Hobby).

## QA checklist (pilot)
- [ ] Q44 table values spot-check (cumulative freqs 3,15,30,58)
- [ ] Q49 tangent diagram reasoning
- [ ] Explanations render correctly in KaTeX (see formatting pass)
- [ ] 48/48 questions: options render, grading matches `correct`
- [ ] Offline test: load once online, enable airplane mode, take full exam