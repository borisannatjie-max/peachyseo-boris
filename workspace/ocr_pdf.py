#!/usr/bin/env python3
"""
Parallel OCR for Chemistry of the Elements PDF.
Uses all CPU cores for both rendering and tesseract OCR.
"""

import fitz, subprocess, time, os, sys
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor, as_completed
from multiprocessing import cpu_count

PDF_PATH = "/root/.openclaw/workspace/chemistry_elements.pdf"
OUT_DIR  = Path("/tmp/ocr_pages")
OUT_MARK = Path("/root/.openclaw/workspace/chemistry_elements.md")
TEMP_DIR = Path("/tmp/ocr_imgs")

OUT_DIR.mkdir(exist_ok=True)
TEMP_DIR.mkdir(exist_ok=True)

SCALE   = 1.5   # render scale
PSM     = 3     # page segmentation mode (3 = fully automatic)
WORKERS = max(1, cpu_count())
CHUNK   = 50    # checkpoint every N pages

# ── helpers ──────────────────────────────────────────────────────────────────

def render_and_ocr(args):
    """Render one page and run tesseract. Returns (page_index, text, error)."""
    i, total = args
    page_num = i + 1
    img_file = TEMP_DIR / f"p{i:05d}.png"
    txt_file = OUT_DIR  / f"page_{i:05d}.txt"

    try:
        doc = fitz.open(PDF_PATH)
        page = doc[i]
        pix  = page.get_pixmap(matrix=fitz.Matrix(SCALE, SCALE))
        pix.save(str(img_file))
        doc.close()

        result = subprocess.run(
            ["tesseract", str(img_file), "stdout",
             "--psm", str(PSM), "-l", "eng"],
            capture_output=True, text=True, timeout=120
        )
        text = result.stdout
        txt_file.write_text(text)
        return i, text, None
    except Exception as e:
        return i, "", str(e)

# ── main ─────────────────────────────────────────────────────────────────────

doc   = fitz.open(PDF_PATH)
total = len(doc)
doc.close()

# Resume: count already-done pages
done = sorted(OUT_DIR.glob("page_*.txt"))
start_idx = len(done)
done_ids  = {int(f.stem.split("_")[1]) for f in done}

print(f"[OCR] {total} pages · {WORKERS} workers · resuming from page {start_idx+1}", flush=True)

all_errors = []
start_time = time.time()
lock_for_print = None  # sequential print via main process

tasks = [(i, total) for i in range(start_idx, total)]

with ProcessPoolExecutor(max_workers=WORKERS) as executor:
    futures = {executor.submit(render_and_ocr, t): t for t in tasks}

    for fut in as_completed(futures):
        idx, text, err = fut.result()
        pn = idx + 1

        if err:
            all_errors.append((pn, err))
            print(f"[ERR] page {pn}: {err}", flush=True)

        # progress
        done_count = len([f for f in OUT_DIR.glob("page_*.txt")]) + len(all_errors)
        if done_count % 100 == 0 or done_count == total:
            elapsed = time.time() - start_time
            rate    = done_count / elapsed if elapsed > 0 else 0
            eta     = (total - done_count) / rate / 60 if rate > 0 else 0
            print(f"[{done_count}/{total}] {100*done_count/total:.1f}% · "
                  f"{elapsed/60:.1f}min · ~{eta:.1f}min left · {rate:.1f} p/min", flush=True)

print(f"[DONE] {len(all_errors)} errors", flush=True)

# ── assemble markdown ─────────────────────────────────────────────────────────

print("[MD] Assembling markdown...", flush=True)
parts = []
for i in range(total):
    txt_file = OUT_DIR / f"page_{i:05d}.txt"
    if txt_file.exists():
        text = txt_file.read_text().strip()
        parts.append(f"# Page {i+1}\n\n{text}\n\n---\n")
    else:
        parts.append(f"# Page {i+1}\n\n_[OCR failed]_\n\n---\n")

OUT_MARK.write_text("".join(parts))
sz = OUT_MARK.stat().st_size
print(f"[MD] Done → {OUT_MARK}  ({sz/1024:.0f} KB)", flush=True)

if all_errors:
    err_file = OUT_DIR / "errors.txt"
    err_file.write_text("\n".join(f"page {p}: {e}" for p, e in all_errors))
    print(f"[ERR] {len(all_errors)} errors → {err_file}", flush=True)
