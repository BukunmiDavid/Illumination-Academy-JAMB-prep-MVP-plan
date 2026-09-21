import os
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent

def _load_env():
    env_path = BASE / ".env"
    if env_path.exists():
        for line in env_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, _, v = line.partition("=")
            os.environ.setdefault(k.strip(), v.strip())

_load_env()

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
GROQ_MODEL = os.environ.get("GROQ_MODEL", "openai/gpt-oss-120b")
CORS_ORIGINS = [o.strip() for o in os.environ.get("CORS_ORIGINS", "").split(",") if o.strip()]
WELCOME_MESSAGE = os.environ.get(
    "WELCOME_MESSAGE",
    "Welcome to Illumination Academy! We will prepare you for your exams.",
)
DB_PATH = BASE / "storage.db"
CHAT_FALLBACK_MODEL = "openai/gpt-oss-20b"
STATS_KEY = os.environ.get("STATS_KEY", "")