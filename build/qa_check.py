#!/usr/bin/env python3
"""QA: data integrity + grading keys for the shipped question bank."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QJSON = ROOT / "web" / "src" / "data" / "questions.json"
LETTERS = "ABCDEFGHIJ"

# Resolved/typo agreements locked in PLAN.md.
RESOLVED = {12: "B", 13: "D", 21: "A", 22: "C", 32: "B", 39: "B", 48: "D"}
EXPECTED_IDS = sorted(set(range(1, 51)) - {36, 46})  # 48 ids (36, 46 dropped, no diagram)


def main() -> int:
    bank = json.loads(QJSON.read_text(encoding="utf-8"))
    qs = bank["questions"]
    errs: list[str] = []

    if bank.get("subject") != "mathematics":
        errs.append("bank.subject != mathematics")
    if len(qs) != 48:
        errs.append(f"expected 48 questions, got {len(qs)}")

    ids = [q["id"] for q in qs]
    if ids != EXPECTED_IDS:
        errs.append(f"id sequence mismatch: {ids}")

    seen: set[int] = set()
    for q in qs:
        i = q["id"]
        if i in seen:
            errs.append(f"duplicate id {i}")
        seen.add(i)
        if q.get("year") != 1983:
            errs.append(f"Q{i}: year != 1983")
        if not q.get("topic"):
            errs.append(f"Q{i}: empty topic")
        if not q.get("question"):
            errs.append(f"Q{i}: empty question")
        opts = q.get("options") or []
        if len(opts) < 2 or len(opts) > 10:
            errs.append(f"Q{i}: option count {len(opts)}")
        for n, o in enumerate(opts):
            if not o or not isinstance(o, str):
                errs.append(f"Q{i}: empty option at index {n}")
        c = q.get("correct", "")
        if c not in LETTERS:
            errs.append(f"Q{i}: correct '{c}' not a letter")
        elif LETTERS.index(c) >= len(opts):
            errs.append(f"Q{i}: correct '{c}' out of range for {len(opts)} options")
        if not q.get("explanation"):
            errs.append(f"Q{i}: empty explanation")
        if i in RESOLVED and c != RESOLVED[i]:
            errs.append(f"Q{i}: resolved key should be {RESOLVED[i]}, got {c}")

    # every option index is addressable by a letter and by digit shorthand
    for q in qs:
        for n, _o in enumerate(q["options"]):
            if n > 9:
                errs.append(f"Q{q['id']}: option {n} not addressable by single letter")

    if errs:
        print("FAILED")
        for e in errs:
            print(" -", e)
        return 1
    print(f"PASS: 48/48 present, ids correct, grading keys match resolved answers "
          f"({required_str()})")
    return 0


def required_str() -> str:
    return ", ".join(f"Q{k}={v}" for k, v in sorted(RESOLVED.items()))


if __name__ == "__main__":
    sys.exit(main())