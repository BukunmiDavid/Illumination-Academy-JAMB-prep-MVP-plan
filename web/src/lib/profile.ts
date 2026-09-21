export interface Profile {
  name: string;
  phone: string;
}

const KEY = "ia.v1.profile";

export function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as Profile;
      return { name: String(p.name ?? ""), phone: String(p.phone ?? "") };
    }
  } catch {
    /* fall through */
  }
  return { name: "", phone: "" };
}

export function saveProfile(p: Profile): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage unavailable - ignore */
  }
}

export function firstName(p: Profile): string {
  return p.name.trim().split(/\s+/)[0] ?? "";
}

export function chatKey(p: Profile): string {
  return `ia.v1.chat.${(p.phone || "guest").replace(/[^\w@.-]/g, "_")}`;
}