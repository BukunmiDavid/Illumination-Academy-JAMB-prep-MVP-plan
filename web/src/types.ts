export interface Question {
  id: number;
  year: number;
  topic: string;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
  source_note: string;
}

export interface QuestionBank {
  subject: string;
  title: string;
  questions: Question[];
}

export interface ExamAnswer {
  qid: number;
  chosen: string | null;
}

export interface ExamConfig {
  count: number;
  secondsPerQuestion: number;
  shuffle: boolean;
}

export interface SavedResult {
  score: number;
  total: number;
  percent: number;
  subject: string;
  at: number;
}