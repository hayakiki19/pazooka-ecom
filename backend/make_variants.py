from pathlib import Path

from PIL import Image, ImageOps

SRC = Path("/app/frontend/public/products")


def make_variants(pid):
    src = SRC / f"{pid}.png"
    if not src.exists():
        return False
    img = Image.open(src).convert("RGB")
    w, h = img.size

    def save(im, n):
        im.save(SRC / f"{pid}-v{n}.jpg", quality=82, optimize=True)

    def zoom(factor):
        cw, ch = int(w * factor), int(h * factor)
        x, y = (w - cw) // 2, (h - ch) // 2
        return img.crop((x, y, x + cw, y + ch)).resize((w, h), Image.LANCZOS)

    save(ImageOps.mirror(img), 2)
    save(zoom(0.62), 3)
    save(img.crop((0, 0, w, int(h * 0.55))).resize((w, h), Image.LANCZOS), 4)
    save(img.crop((0, int(h * 0.45), w, h)).resize((w, h), Image.LANCZOS), 5)
    save(img.crop((0, 0, int(w * 0.6), h)).resize((w, h), Image.LANCZOS), 6)
    save(img.crop((int(w * 0.4), 0, w, h)).resize((w, h), Image.LANCZOS), 7)
    save(zoom(0.45), 8)
    return True


done = [p.stem for p in sorted(SRC.glob("paz-??.png")) if make_variants(p.stem)]
print(f"variants made for {len(done)} products:", done)
