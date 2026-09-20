const API = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

export interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

export async function sendChat(
  messages: ChatMsg[],
  subject: string,
  language: string,
  onDelta: (d: string) => void,
  onDone: () => void,
): Promise<void> {
  const res = await fetch(`${API}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, subject, language }),
  });
  if (!res.ok || !res.body) throw new Error(`chat failed: ${res.status}`);
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") {
        onDone();
        return;
      }
      try {
        const p = JSON.parse(data);
        if (p.delta) onDelta(p.delta as string);
      } catch {
        /* ignore malformed chunk */
      }
    }
  }
  onDone();
}

export async function transcribeAudio(file: Blob, language: string): Promise<string> {
  const fd = new FormData();
  fd.append("audio", file, "voice.webm");
  fd.append("language", language);
  const res = await fetch(`${API}/api/transcribe`, { method: "POST", body: fd });
  if (!res.ok) throw new Error(`transcribe failed: ${res.status}`);
  const j = (await res.json()) as { text?: string };
  return j.text ?? "";
}

export async function saveResult(phone: string, name: string, subject: string, score: number, total: number): Promise<void> {
  try {
    await fetch(`${API}/api/results`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, name, subject, score, total }),
    });
  } catch {
    /* offline is fine - result is still stored locally */
  }
}