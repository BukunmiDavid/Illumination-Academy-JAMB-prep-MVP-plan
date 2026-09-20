"""Speech-to-text via Groq Whisper."""
from openai import AsyncOpenAI

from . import config

_client: AsyncOpenAI | None = None

def get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(
            base_url="https://api.groq.com/openai/v1",
            api_key=config.GROQ_API_KEY,
        )
    return _client

# Whisper language shortcodes we allow a user to hint at. Pidgin is not a
# Whisper token, so we let auto-detection handle it unless hinted as English.
SUPPORTED_LANGUAGES = {"en": "en", "yo": "yo", "ig": "ig", "ha": "ha", "pcm": ""}

async def transcribe_audio(
    audio_bytes: bytes,
    mime: str = "audio/webm",
    language_hint: str = "",
) -> str:
    """Transcribe audio bytes and return the text."""
    if not config.GROQ_API_KEY:
        return "The speech service is not configured yet. Add GROQ_API_KEY to api/.env to enable voice."
    filename = f"audio.{_ext_from_mime(mime)}"
    params: dict = {
        "model": "whisper-large-v3-turbo",
        "file": (filename, audio_bytes, mime),
        "response_format": "json",
        "temperature": 0.0,
    }
    hint = SUPPORTED_LANGUAGES.get(language_hint.strip().lower(), "")
    if hint:
        params["language"] = hint
    result = await get_client().audio.transcriptions.create(**params)
    return result.text.strip()

def _ext_from_mime(mime: str) -> str:
    return {
        "audio/webm": "webm",
        "audio/mp4": "m4a",
        "audio/mpeg": "mp3",
        "audio/ogg": "ogg",
        "audio/wav": "wav",
        "audio/x-wav": "wav",
    }.get(mime.split(";")[0].strip(), "webm")