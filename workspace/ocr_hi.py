#!/usr/bin/env python3
"""
High-quality parallel OCR: render at 2x scale then OCR with PSM=1 (best quality).
"""
import subprocess, time
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor, as_completed
from multiprocessing import cpu_count
import fitz

PDF_PATH = "/root/.openclaw/workspace/chemistry_elements.pdf"
IMG_DIR  = Path("/tmp/ocr_hi_imgs")
OUT_DIR  = Path("/tmp/ocr_hi")
OUT_MARK = Path("/root/.openclaw/workspace/chemistry_elements_clean.md")

IMG_DIR.mkdir(exist_ok=True)
OUT_DIR.mkdir(exist_ok=True)

SCALE   = 2.0
PSM     = 1
WORKERS = cpu_count()

def render_and_ocr(i):
    img_file = IMG_DIR / f"p{i:05d}.png"
    txt_file = OUT_DIR / f"page_{i:05d}.txt"

    if txt_file.exists():
        return i, "skip", None

    try:
        doc = fitz.open(PDF_PATH)
        page = doc[i]
        pix  = page.get_pixmap(matrix=fitz.Matrix(SCALE, SCALE))
        pix.save(str(img_file))
        doc.close()
    except Exception as e:
        return i, "render_fail", str(e)

    try:
        result = subprocess.run(
            ["tesseract", str(img_file), "stdout", "--psm", str(PSM), "-l", "eng"],
            capture_output=True, text=True, timeout=90
        )
        txt_file.write_text(result.stdout)
        return i, "ok", None
    except Exception as e:
        return i, "ocr_fail", str(e)

done = sorted(OUT_DIR.glob("page_*.txt"))
start_idx = len(done)
total = 1359

print(f"[HI-OCR] {total} pages · {WORKERS} workers · scale={SCALE}x · psm={PSM} · from {start_idx+1}", flush=True)

errors = []
t0 = time.time()

with ProcessPoolExecutor(max_workers=WORKERS) as ex:
    futures = {ex.submit(render_and_ocr, i): i for i in range(start_idx, total)}
    done_count = start_idx
    for fut in as_completed(futures):
        idx, status, err = fut.result()
        if err and err != "skip":
            errors.append((idx+1, status, err))
        done_count += 1
        if done_count % 50 == 0 or done_count == total:
            elapsed = time.time() - t0
            rate = done_count / elapsed if elapsed else 0
            eta  = (total - done_count) / rate / 60 if rate else 0
            print(f"[{done_count}/{total}] {100*done_count/total:.1f}% · "
                  f"{elapsed/60:.1f}min · ~{eta:.1f}min left", flush=True)

print(f"[DONE] {len(errors)} errors", flush=True)

parts = []
for i in range(total):
    txt_file = OUT_DIR / f"page_{i:05d}.txt"
    text = txt_file.read_text().strip() if txt_file.exists() else "_[missing]_"
    parts.append(f"# Page {i+1}\n\n{text}\n\n---\n")

OUT_MARK.write_text("".join(parts))
sz = OUT_MARK.stat().st_size
print(f"[MD] → {OUT_MARK}  ({sz/1024:.0f} KB)")
