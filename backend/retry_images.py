import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from generate_product_images import ITEMS, OUT, generate_one


async def main():
    missing = [(pid, prompt) for pid, prompt in ITEMS if not (OUT / f"{pid}.png").exists()]
    print(f"Missing: {[p for p, _ in missing]}", flush=True)
    for pid, prompt in missing:
        for attempt in range(4):
            try:
                if await generate_one(pid, prompt):
                    break
            except Exception as e:
                print(f"RETRY {pid} attempt {attempt + 1}: {str(e)[:120]}", flush=True)
                await asyncio.sleep(20)
        await asyncio.sleep(6)
    print(f"DONE: {len(list(OUT.glob('*.png')))}/21", flush=True)


if __name__ == "__main__":
    asyncio.run(main())
