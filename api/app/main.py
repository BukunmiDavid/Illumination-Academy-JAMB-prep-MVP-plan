import json
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from . import chat, config, db, transcribe

settings = config


@asynccontextmanager
async def lifespan(_app: FastAPI):
    db.init_db()
    yield


app = FastAPI(title="Illumination Academy API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS or ["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatMessage(BaseModel):
    role: str = Field(pattern="^(system|user|assistant)$")
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    subject: str = "Mathematics"
    language: str = "en"


class ResultRequest(BaseModel):
    phone: str = ""
    name: str = ""
    subject: str = "mathematics"
    score: int
    total: int
    answers: dict | None = None


class WhatsAppInbound(BaseModel):
    phone: str
    text: str


@app.get("/")
def root():
    return {"app": "Illumination Academy", "status": "ok"}


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/subjects")
def subjects():
    # Only mathematics ships in v1. This endpoint grows as subjects are added.
    return {"subjects": ["mathematics"]}


@app.post("/api/chat")
async def chat_stream(req: ChatRequest):
    async def event_stream():
        async for delta in chat.stream_reply(req.messages, req.subject, req.language):
            yield f"data: {json.dumps({'delta': delta}, ensure_ascii=False)}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@app.post("/api/chat/sync")
async def chat_sync(req: ChatRequest):
    text = await chat.full_reply(req.messages, req.subject, req.language)
    return {"text": text}


@app.post("/api/transcribe")
async def transcribe(
    audio: UploadFile = File(...),
    language: str = Form(default=""),
):
    if not audio.filename:
        raise HTTPException(400, "No audio file provided")
    content = await audio.read()
    if not content:
        raise HTTPException(400, "Empty audio file")
    text = await transcribe.transcribe_audio(content, audio.content_type or "audio/webm", language)
    return {"text": text}


@app.post("/api/results")
async def save_result(req: ResultRequest):
    with db.get_conn() as conn:
        conn.execute(
            "INSERT INTO results (phone, name, subject, score, total, answers_json) VALUES (?, ?, ?, ?, ?, ?)",
            (req.phone, req.name, req.subject, req.score, req.total, json.dumps(req.answers or {})),
        )
    return {"ok": True}


@app.post("/api/wa/webhook")
async def whatsapp_webhook(req: WhatsAppInbound):
    """Free-form Q&A fallback for the WhatsApp bridge.

    The bridge owns the /start flow state machine; this endpoint only produces a
    teacher reply for a free-form question.
    """
    text = req.text
    if not text.strip():
        return {"reply": settings.WELCOME_MESSAGE}
    reply = await chat.full_reply([{"role": "user", "content": text}], "Mathematics", "en")
    return {"reply": reply}