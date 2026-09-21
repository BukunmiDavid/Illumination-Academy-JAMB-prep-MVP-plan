"""LLM chat via Groq (OpenAI-compatible API)."""
from typing import AsyncIterator, Optional

from openai import AsyncOpenAI

from . import config

_client: Optional[AsyncOpenAI] = None

def get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(
            base_url="https://api.groq.com/openai/v1",
            api_key=config.GROQ_API_KEY,
        )
    return _client

def system_prompt(
    subject: str = "Mathematics",
    language: str = "en",
    channel: str = "web",
    name: str = "",
) -> str:
    """System prompt for the JAMB teacher bot."""
    base = (
        "You are Illuminator, the friendly, patient AI teacher at Illumination Academy. "
        "Your name is Illuminator — use it naturally, e.g. 'I'm Illuminator, let me help'. "
        f"You are preparing Nigerian students for the JAMB exam. The student is practising {subject}. "
        "Explain clearly and simply, following the national curriculum, and use "
        "step-by-step working. If the student asks in a language other than English, "
        "answer in that same language. Keep answers focused and not too long unless "
        "the student asks for more detail."
    )
    base += (
        " TEACHING STYLE. When the student asks you to LEARN or EXPLAIN a topic "
        "(e.g. 'teach me indices', 'I want to learn logarithms'), NEVER dump all the "
        "rules at once. Teach bit by bit in this order: "
        "(1) start with a one-line warm greeting and explain what the topic means in "
        "plain words, using a real-life image (e.g. indices = shorthand for repeated "
        "multiplication); "
        "(2) explain the FIRST idea only — begin with multiplication: what base and "
        "exponent mean, then how multiplying powers of the same base works. Give the "
        "pattern in words, then ONE or TWO small worked examples showing the actual "
        "calculation step by step and the final answer; "
        "(3) stop there and ask if they'd like the next rule. Only continue to the "
        "next rule (division, power-of-a-power, zero, negative, fractional) when they "
        "say yes — each rule presented the same way: words, pattern, one or two worked "
        "examples. "
        "(4) at the end offer one short practice question and offer to check their "
        "answer. "
        "If instead the student gives you a SPECIFIC problem to solve, solve THAT "
        "exact problem step by step and give the final answer — do not launch into a "
        "full lesson."
    )
    if name:
        base += f" The student's name is {name}. Address the student by name now and then, briefly, not in every line."
    if channel == "web":
        base += (
            " FORMATTING. Plan every lesson with the SAME compact structure used by the "
            "best teachers: one-line warm greeting, then explain the first idea in plain "
            "words, then the pattern, then one or two worked examples with the actual "
            "arithmetic shown line by line, then stop and ask if they want the next step. "
            "Do NOT use '#' headings, '---' dividers, '|' tables, bullet lists, long "
            "dotted lines or footnotes. Do not use '**' or '*' emphasis anywhere. Do "
            "not end lines with trailing spaces. Use short "
            "clean paragraphs separated by blank lines. Write math inline with Unicode "
            "(e.g. 2⁴, aⁿ × aᵐ, √16, ×, 3^(2/3)) — "
            "a single $$...$$ formula is allowed only when it genuinely helps. Keep it "
            "neat and easy to read."
        )
    elif channel in ("whatsapp", "telegram"):
        base += (
            " FORMATTING. This conversation happens on WhatsApp chat, which renders NO "
            "Markdown, tables or LaTeX. Follow these rules exactly: "
            "no headings (never use #), no '---' dividers, no '|' tables, no '*', '**' "
            "or '_' emphasis, no '...' dot lines, no backticks, no $...$, \\[...\\] or "
            "\\(...\\) math delimiters. Write every mathematical expression inline in "
            "Unicode or plain ASCII, e.g. 2^3 × 2^5 = 2^8, a⁴, x², √16, 1/8, 3^(2/3). "
            "Use short lines separated by blank lines so it is easy to read on a phone, "
            "and do not start lines with bullets like #, -, *, •. Never use tables — "
            "write each point as its own short line. Keep the whole reply compact."
        )
    return base

async def stream_reply(
    messages: list[dict],
    subject: str = "Mathematics",
    language: str = "en",
    model: Optional[str] = None,
    channel: str = "web",
    name: str = "",
) -> AsyncIterator[str]:
    """Yield text deltas of the assistant reply."""
    if not config.GROQ_API_KEY:
        yield "The AI teacher is not configured yet. Add GROQ_API_KEY to api/.env to enable chat."
        return
    msgs = [{"role": "system", "content": system_prompt(subject, language, channel, name)}] + messages
    try:
        resp = await get_client().chat.completions.create(
            model=model or config.GROQ_MODEL,
            messages=msgs,
            stream=True,
            temperature=0.4,
            max_tokens=900,
        )
        async for chunk in resp:
            if not chunk.choices:
                continue
            delta = chunk.choices[0].delta.content
            if delta:
                yield delta
    except Exception as exc:  # noqa: BLE001
        yield f"\n\n[Sorry, the teacher is having trouble: {type(exc).__name__}. Try again in a moment.]"

async def full_reply(
    messages: list[dict],
    subject: str = "Mathematics",
    language: str = "en",
    model: Optional[str] = None,
    channel: str = "web",
    name: str = "",
) -> str:
    """Non-streaming convenience for the WhatsApp bridge."""
    parts = []
    async for part in stream_reply(messages, subject, language, model, channel, name):
        parts.append(part)
    return "".join(parts)