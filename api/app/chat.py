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

def system_prompt(subject: str = "Mathematics", language: str = "en", channel: str = "web") -> str:
    """System prompt for the JAMB teacher bot."""
    base = (
        "You are a patient, friendly teacher at Illumination Academy preparing "
        f"Nigerian students for the JAMB exam. The student is practising {subject}. "
        "Explain clearly and simply, following the national curriculum, and use "
        "step-by-step working. If the student asks in a language other than English, "
        "answer in that same language. Keep answers focused and not too long unless "
        "the student asks for more detail."
    )
    if channel in ("whatsapp", "telegram"):
        base += (
            " This conversation happens on WhatsApp chat, which renders NO Markdown, "
            "tables or LaTeX. Reply in plain text only: no headings, no #, no | tables, "
            "no * or ** emphasis, no $...$, \\[...\\] or \\(...\\) math. Write math inline "
            "in Unicode or ASCII, e.g. 2^3 × 2^5 = 2^8, x², √16, 1/8, 2**3. "
            "Keep answers compact and readable on a phone screen."
        )
    return base

async def stream_reply(
    messages: list[dict],
    subject: str = "Mathematics",
    language: str = "en",
    model: Optional[str] = None,
    channel: str = "web",
) -> AsyncIterator[str]:
    """Yield text deltas of the assistant reply."""
    if not config.GROQ_API_KEY:
        yield "The AI teacher is not configured yet. Add GROQ_API_KEY to api/.env to enable chat."
        return
    msgs = [{"role": "system", "content": system_prompt(subject, language, channel)}] + messages
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
) -> str:
    """Non-streaming convenience for the WhatsApp bridge."""
    parts = []
    async for part in stream_reply(messages, subject, language, model, channel):
        parts.append(part)
    return "".join(parts)