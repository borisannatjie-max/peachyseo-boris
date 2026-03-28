#!/usr/bin/env python3
"""
Direct PNG → Tesseract OCR on pre-rendered page images.
Uses all CPU cores. Renders are already done, so we go straight to OCR.
"""
import subprocess, time, os, sys
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor, as_completed
from multiprocessing import cpu_count

IMG_DIR  = Path("/tmp/ocr_imgs")
OUT_DIR  = Path("/tmp/ocr_clean")
OUT_MARK = Path("/root/.openclaw/workspace/chemistry_elements_clean.md")

OUT_DIR.mkdir(exist_ok=True)
WORKERS  = cpu_count()

def ocr_page(i):
    img_file = IMG_DIR / f"p{i:05d}.png"
    txt_file = OUT_DIR / f"page_{i:05d}.txt"
    if txt_file.exists():
        return i, txt_file.read_text(), None  # already done (resume)
    try:
        result = subprocess.run(
            ["tesseract", str(img_file), "stdout", "--psm", "1", "-l", "eng"],
            capture_output=True, text=True, timeout=60
        )
        text = result.stdout
        txt_file.write_text(text)
        return i, text, None
    except Exception as e:
        return i, "", str(e)

def assemble():
    pages = sorted(OUT_DIR.glob("page_*.txt"), key=lambda f: int(f.stem.split("_")[1]))
    parts = []
    for f in pages:
        i = int(f.stem.split("_")[1])
        text = f.read_text().strip()
        parts.append(f"# Page {i+1}\n\n{text}\n\n---\n")
    OUT_MARK.write_text("".join(parts))
    sz = OUT_MARK.stat().st_size
    print(f"[MD] → {OUT_MARK}  ({sz/1024:.0f} KB)")

# Main
done = sorted(OUT_DIR.glob("page_*.txt"))
start_idx = len(done)
total = 1359

print(f"[OCR] {total} pages · {WORKERS} workers · resuming from {start_idx+1}", flush=True)

errors = []
t0 = time.time()

with ProcessPoolExecutor(max_workers=WORKERS) as ex:
    futures = {ex.submit(ocr_page, i): i for i in range(start_idx, total)}
    done_count = start_idx
    for fut in as_completed(futures):
        i, text, err = fut.result()
        if err:
            errors.append((i+1, err))
        done_count += 1
        if done_count % 100 == 0 or done_count == total:
            elapsed = time.time() - t0
            rate = done_count / elapsed if elapsed else 0
            eta  = (total - done_count) / rate / 60 if rate else 0
            print(f"[{done_count}/{total}] {100*done_count/total:.1f}% · "
                  f"{elapsed/60:.1f}min · ~{eta:.1f}min left", flush=True)

print(f"[DONE] {len(errors)} errors", flush=True)
assemble()

if errors:
    (OUT_DIR/"errors.txt").write_text("\n".join(f"p{p}: {e}" for p,e in errors))
