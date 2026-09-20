from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "icons"
OUT.mkdir(parents=True, exist_ok=True)

NAVY = (13, 18, 43)  # #0d122b
AMBER = (251, 191, 36)  # amber-400


def make(size: int) -> None:
    img = Image.new("RGB", (size, size), NAVY)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((0, 0, size - 1, size - 1), radius=int(size * 0.22), fill=NAVY)
    # amber book / page motif
    m = size * 0.09
    w = size * 0.82
    h = size * 0.42
    x0, y0 = m, size * 0.5 - h / 2 + size * 0.03
    d.rounded_rectangle((x0, y0, x0 + w * 0.55, y0 + h), radius=int(size * 0.04), fill=AMBER)
    d.rounded_rectangle((x0 + w * 0.45, y0, x0 + w, y0 + h), radius=int(size * 0.04), fill=AMBER)
    # text "IA"
    try:
        font = ImageFont.truetype("arialbd.ttf", int(size * 0.38))
    except OSError:
        font = ImageFont.load_default()
    label = "IA"
    bbox = d.textbbox((0, 0), label, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    d.text(
        ((size - tw) / 2 - bbox[0], (size - th) / 2 - bbox[1] - size * 0.02),
        label,
        font=font,
        fill=NAVY,
    )
    img.save(OUT / f"icon-{size}.png")


for s in (192, 512):
    make(s)

print(f"icons written to {OUT}")