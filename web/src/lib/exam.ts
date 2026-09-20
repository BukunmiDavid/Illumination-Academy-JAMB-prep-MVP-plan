import type { Question, ExamAnswer, ExamConfig, SavedResult } from "../types";

export const LETTERS = "ABCDEFGHIJK";

export function letter(i: number): string {
  return LETTERS[i] ?? `${i + 1}`;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildPaper(questions: Question[], cfg: ExamConfig): Question[] {
  const pool = cfg.shuffle ? shuffle(questions) : questions;
  return pool.slice(0, cfg.count);
}

export function grade(answers: ExamAnswer[], questions: Question[]) {
  const byId = new Map(questions.map((q) => [q.id, q]));
  let score = 0;
  const detail: { q: Question; chosen: string | null; ok: boolean }[] = [];
  for (const a of answers) {
    const q = byId.get(a.qid);
    if (!q) continue;
    const ok = a.chosen != null && a.chosen === q.correct;
    if (ok) score += 1;
    detail.push({ q, chosen: a.chosen, ok });
  }
  const percent = questions.length ? Math.round((score / questions.length) * 100) : 0;
  return { score, total: questions.length, percent, detail };
}

const RESULT_KEY = "illumination.lastResult";

export function saveResult(r: SavedResult) {
  try {
    localStorage.setItem(RESULT_KEY, JSON.stringify(r));
  } catch {
    /* ignore */
  }
}

export function lastResult(): SavedResult | null {
  try {
    const raw = localStorage.getItem(RESULT_KEY);
    return raw ? (JSON.parse(raw) as SavedResult) : null;
  } catch {
    return null;
  }
}

const OFFLINE_SENT = "illumination.offlineAttempts";

export function recordOfflineAttempt(r: SavedResult) {
  try {
    const arr = JSON.parse(localStorage.getItem(OFFLINE_SENT) ?? "[]") as SavedResult[];
    arr.push(r);
    localStorage.setItem(OFFLINE_SENT, JSON.stringify(arr.slice(-20)));
  } catch {
    /* ignore */
  }
}