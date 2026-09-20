import { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface Part {
  text?: string;
  math?: string;
  block?: boolean;
}

function splitMath(input: string): Part[] {
  const parts: Part[] = [];
  const re = /\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g;
  let last = 0;
  for (const m of input.matchAll(re)) {
    if (m.index !== undefined && m.index > last) {
      parts.push({ text: input.slice(last, m.index) });
    }
    const math = (m[1] ?? m[2] ?? "").trim();
    parts.push({ math, block: !!m[1] });
    last = m.index + m[0].length;
  }
  if (last < input.length) parts.push({ text: input.slice(last) });
  return parts;
}

export default function MathText({ text, className = "" }: { text: string; className?: string }) {
  const parts = useMemo(() => splitMath(text), [text]);
  return (
    <span className={className}>
      {parts.map((p, i) => {
        if (p.math !== undefined) {
          let html = "";
          try {
            html = katex.renderToString(p.math, {
              throwOnError: false,
              displayMode: !!p.block,
              strict: false,
            });
          } catch {
            html = `<span>${p.math}</span>`;
          }
          return (
            <span
              key={i}
              dangerouslySetInnerHTML={{ __html: html }}
              className={p.block ? "block my-1 overflow-x-auto" : ""}
            />
          );
        }
        return <span key={i}>{p.text}</span>;
      })}
    </span>
  );
}