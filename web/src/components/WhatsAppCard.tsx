import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { waStartUrl, telegramUrl, WHATSAPP_NUMBER, TELEGRAM_LINK } from "../lib/wa";

export default function WhatsAppCard() {
  const [qr, setQr] = useState<string | null>(null);
  const waUrl = waStartUrl();

  useEffect(() => {
    if (!waUrl) return;
    let alive = true;
    QRCode.toDataURL(waUrl, { width: 320, margin: 1 })
      .then((data) => {
        if (alive) setQr(data);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [waUrl]);

  const hasAny = WHATSAPP_NUMBER !== "" || TELEGRAM_LINK !== "";
  if (!hasAny) return null;

  return (
    <div className="mt-4 rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Continue learning on chat</h2>
          <p className="text-sm text-slate-500">
            Ask questions, get AI lessons and practise — right inside the chat app you already use.
          </p>
        </div>
        <span className="text-2xl">💬</span>
      </div>

      <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row">
        {qr && (
          <img
            src={qr}
            alt="WhatsApp QR code"
            className="h-40 w-40 rounded-lg border border-slate-200"
          />
        )}
        <div className="flex flex-1 flex-wrap items-center justify-center gap-2 text-center sm:justify-start sm:text-left">
          {WHATSAPP_NUMBER !== "" && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-xl bg-[#25D366] px-4 py-3 font-semibold text-white active:scale-[.98]"
            >
              💬 WhatsApp
            </a>
          )}
          {TELEGRAM_LINK !== "" && (
            <a
              href={telegramUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-xl bg-[#229ED9] px-4 py-3 font-semibold text-white active:scale-[.98]"
            >
              ✈️ Telegram
            </a>
          )}
        </div>
      </div>
      {qr && (
        <p className="mt-3 text-center text-xs text-slate-400 sm:text-left">
          On your phone? Just tap the button above — no scanning needed.
        </p>
      )}
    </div>
  );
}