import asyncio
import base64
import os
from pathlib import Path

from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv(Path(__file__).parent / ".env")

OUT = Path("/app/frontend/public/products")
OUT.mkdir(parents=True, exist_ok=True)

TEE_STYLE = (
    "Professional e-commerce product photography. {desc}. The t-shirt floats in ghost-mannequin "
    "(invisible mannequin) style — no person, no model, no hanger, no hands. Centered, perfectly lit, "
    "on a seamless warm light-grey studio backdrop with a soft circular spotlight glow behind the product. "
    "Soft diffused studio lighting, subtle fabric shadow, hyper-detailed cotton texture, photorealistic, "
    "3:4 portrait composition, no watermark, no extra text."
)

CAP_STYLE = (
    "Professional e-commerce product photography. {desc}. The headwear sits centered on top of a rough grey "
    "brick cube pedestal — no person, no model, no mannequin head. Seamless warm light-grey studio backdrop "
    "with a soft circular spotlight glow behind the product. Soft diffused studio lighting, subtle shadow, "
    "hyper-detailed fabric texture, photorealistic, 3:4 portrait composition, no watermark, no extra text."
)

ITEMS = [
    ("paz-01", TEE_STYLE.format(desc="A black oversized boxy-fit t-shirt with dropped shoulders and a neon acid-lime cybernetic circuit-board graphic printed across the chest")),
    ("paz-02", TEE_STYLE.format(desc="A concrete grey oversized boxy-fit t-shirt with dropped shoulders and a glowing neon city skyline graphic printed across the chest")),
    ("paz-03", TEE_STYLE.format(desc="A bone white oversized boxy-fit t-shirt with dropped shoulders and a small black archival typographic print on the left chest")),
    ("paz-04", TEE_STYLE.format(desc="A dark asphalt grey oversized boxy-fit t-shirt with dropped shoulders and an acid-green digital matrix grid graphic on the chest")),
    ("paz-05", TEE_STYLE.format(desc="An off-black oversized boxy-fit t-shirt with dropped shoulders and a raised white monochrome puff-print abstract graphic on the chest")),
    ("paz-06", TEE_STYLE.format(desc="A washed stone grey oversized boxy-fit t-shirt with dropped shoulders and a black brutalist concrete building photographic print on the front")),
    ("paz-07", TEE_STYLE.format(desc="A vintage washed coal-black oversized boxy-fit t-shirt with dropped shoulders, faded distressed finish and a subtle cracked white graphic on the chest")),
    ("paz-08", TEE_STYLE.format(desc="A static white oversized boxy-fit t-shirt with dropped shoulders and a wavy distorted acid-green horizontal line graphic across the chest")),
    ("paz-09", TEE_STYLE.format(desc="A midnight black oversized boxy-fit t-shirt with dropped shoulders and a small white embroidered signal-noise waveform stitched on the chest")),
    ("paz-10", TEE_STYLE.format(desc="A chalk white oversized boxy-fit t-shirt with dropped shoulders and a small black digital '00:00' zero-hour clock print on the chest")),
    ("paz-11", TEE_STYLE.format(desc="A clean white regular-fit crew-neck t-shirt with a tailored classic cut and a tiny black 'PAZOOKA' logo printed on the left chest")),
    ("paz-12", TEE_STYLE.format(desc="A clean black regular-fit crew-neck t-shirt with a tailored classic cut and a tiny white 'PAZOOKA' logo printed on the left chest")),
    ("paz-13", TEE_STYLE.format(desc="An ash grey regular-fit crew-neck t-shirt with a tailored classic cut and a bold black kinetic typography print across the chest")),
    ("paz-14", TEE_STYLE.format(desc="A concrete grey regular-fit crew-neck t-shirt with a tailored classic cut and a minimal black line-art cityscape print on the chest")),
    ("paz-15", TEE_STYLE.format(desc="A black regular-fit crew-neck t-shirt with a tailored classic cut and a small sharp acid-lime graphic accent printed on the chest")),
    ("paz-16", TEE_STYLE.format(desc="An ecru off-white regular-fit crew-neck t-shirt with a tailored classic cut and a small black embroidered signature emblem on the left chest")),
    ("paz-17", CAP_STYLE.format(desc="A black and white trucker cap with 'PAZOOKA' embroidered in bold white letters on the foam front panel and a black mesh back")),
    ("paz-18", CAP_STYLE.format(desc="A black 5-panel snapback cap with a small acid-lime embroidered square logo patch on the front")),
    ("paz-19", CAP_STYLE.format(desc="A triple-black unstructured dad hat with a curved brim and a tiny tonal black embroidered logo on the front")),
    ("paz-20", CAP_STYLE.format(desc="A washed navy retro baseball cap with off-white vintage-style chain-stitch embroidery on the front")),
    ("paz-21", CAP_STYLE.format(desc="A charcoal grey chunky knit beanie with a folded cuff and a small acid-lime woven monogram label tag")),
]


async def generate_one(pid, prompt):
    chat = LlmChat(
        api_key=os.environ["EMERGENT_LLM_KEY"],
        session_id=f"pazooka-img-{pid}",
        system_message="You are a world-class product photography AI for a streetwear brand.",
    )
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(modalities=["image", "text"])
    text, images = await chat.send_message_multimodal_response(UserMessage(text=prompt))
    if images:
        data = base64.b64decode(images[0]["data"])
        (OUT / f"{pid}.png").write_bytes(data)
        print(f"OK {pid} ({len(data)//1024} KB)", flush=True)
        return True
    print(f"FAIL {pid}: no image returned ({str(text)[:80]})", flush=True)
    return False


async def main():
    sem = asyncio.Semaphore(3)

    async def run(pid, prompt):
        async with sem:
            for attempt in range(3):
                try:
                    if await generate_one(pid, prompt):
                        return
                except Exception as e:
                    print(f"RETRY {pid} attempt {attempt + 1}: {str(e)[:120]}", flush=True)
                    await asyncio.sleep(8)
            print(f"GIVEUP {pid}", flush=True)

    await asyncio.gather(*[run(pid, prompt) for pid, prompt in ITEMS])
    done = len(list(OUT.glob("*.png")))
    print(f"DONE: {done}/21 images generated", flush=True)


if __name__ == "__main__":
    asyncio.run(main())
