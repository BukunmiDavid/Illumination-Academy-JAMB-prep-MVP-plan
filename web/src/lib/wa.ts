export const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER ?? "").trim();
export const TELEGRAM_LINK = (import.meta.env.VITE_TELEGRAM_LINK ?? "").trim();

export function waStartUrl(): string {
  return WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("start")}`
    : "";
}

export function telegramUrl(): string {
  return TELEGRAM_LINK;
}