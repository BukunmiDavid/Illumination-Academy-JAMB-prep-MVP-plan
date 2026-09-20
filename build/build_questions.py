#!/usr/bin/env python3
"""Build data/mathematics.csv and web/src/data/questions.json from questions_math.py."""
import csv, json, os, sys
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from questions_math import QUESTIONS

LETTERS = ["A", "B", "C", "D", "E"]

# ---- validation -----------------------------------------------------------
errors = []
ids = [q["id"] for q in QUESTIONS]
dups = [i for i, c in Counter(ids).items() if c > 1]
if dups:
    errors.append(f"Duplicate ids: {dups}")
if len(ids) != len(set(ids)):
    errors.append("Length mismatch")

for q in QUESTIONS:
    n = len(q["options"])
    if n not in (4, 5):
        errors.append(f"Q{q['id']}: expected 4 or 5 options, got {n}")
    if q["correct"] not in LETTERS[:n]:
        errors.append(f"Q{q['id']}: correct='{q['correct']}' not among options A-{LETTERS[n-1]}")
    for f in ("question", "explanation"):
        if not q.get(f):
            errors.append(f"Q{q['id']}: missing {f}")

if errors:
    print("VALIDATION FAILED:")
    for e in errors:
        print(" -", e)
    sys.exit(1)

# ---- CSV -------------------------------------------------------------------
csv_path = os.path.join(ROOT, "data", "mathematics.csv")
with open(csv_path, "w", newline="", encoding="utf-8") as fh:
    w = csv.writer(fh)
    w.writerow(["id", "year", "subject", "topic", "question",
                "option_a", "option_b", "option_c", "option_d", "option_e",
                "correct", "explanation", "source_note"])
    for q in sorted(QUESTIONS, key=lambda x: x["id"]):
        opts = q["options"] + [""] * (5 - len(q["options"]))
        w.writerow([q["id"], q["year"], q["subject"], q["topic"], q["question"],
                    *opts, q["correct"], q["explanation"], q.get("source_note", "")])

# ---- JSON (bundled into the PWA) -------------------------------------------
json_path = os.path.join(ROOT, "web", "src", "data", "questions.json")
os.makedirs(os.path.dirname(json_path), exist_ok=True)
payload = {
    "subject": "mathematics",
    "title": "Mathematics (1983)",
    "questions": [
        {
            "id": q["id"],
            "year": q["year"],
            "topic": q["topic"],
            "question": q["question"],
            "options": q["options"],
            "correct": q["correct"],
            "explanation": q["explanation"],
            "source_note": q.get("source_note", ""),
        }
        for q in sorted(QUESTIONS, key=lambda x: x["id"])
    ],
}
with open(json_path, "w", encoding="utf-8") as fh:
    json.dump(payload, fh, ensure_ascii=False, indent=1)

print(f"OK: {len(QUESTIONS)} questions")
print(f"  CSV  -> {csv_path}")
print(f"  JSON -> {json_path}")