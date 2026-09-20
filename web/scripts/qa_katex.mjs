#!/usr/bin/env node
/**
 * QA: every math block in the shipped bundle parses with the exact KaTeX
 * version the PWA ships (web/node_modules/katex), with throwOnError: true.
 */
import { readFileSync } from "node:fs";
import katex from "katex";

const bank = JSON.parse(
  readFileSync(new URL("../src/data/questions.json", import.meta.url), "utf8"),
);

const MATH_RE = /\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g;

function blocks(text) {
  const out = [];
  for (const m of text.matchAll(MATH_RE)) {
    out.push({ math: (m[1] ?? m[2] ?? "").trim(), display: !!m[1] });
  }
  return out;
}

let total = 0;
const errors = [];

for (const q of bank.questions) {
  const fields = [
    ["question", q.question],
    ...q.options.map((o, i) => [`option ${String.fromCharCode(65 + i)}`, o]),
    ["explanation", q.explanation],
  ];
  for (const [label, text] of fields) {
    for (const b of blocks(text)) {
      total += 1;
      try {
        katex.renderToString(b.math, {
          throwOnError: true,
          displayMode: b.display,
          strict: "error",
        });
      } catch (e) {
        errors.push(`Q${q.id} ${label}: '${b.math}' -> ${e.message}`);
      }
    }
  }
}

if (errors.length) {
  console.log(`FAILED: ${errors.length}/${total} math blocks`);
  for (const e of errors.slice(0, 30)) console.log(" -", e);
  process.exit(1);
}
console.log(`PASS: ${total} math blocks render in KaTeX (${bank.questions.length} questions)`);