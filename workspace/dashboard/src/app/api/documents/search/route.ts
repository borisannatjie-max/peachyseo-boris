import { NextRequest, NextResponse } from "next/server";
import { readdir, readFile } from "fs/promises";
import { join } from "path";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q") || "";
  if (!query) return NextResponse.json({ results: [] });

  const vaultDir = "/root/.openclaw/workspace/vault";
  let results: any[] = [];

  try {
    const files = await readdir(vaultDir, { recursive: true });
    for (const file of files) {
      if (typeof file !== "string" || (!file.endsWith(".md") && !file.endsWith(".txt"))) continue;
      const filePath = join(vaultDir, file);
      try {
        const content = await readFile(filePath, "utf-8");
        // Simple keyword match — for semantic search, ChromaDB would be used
        const q = query.toLowerCase();
        if (content.toLowerCase().includes(q)) {
          results.push({ filename: file, path: filePath, project: "Boris", score: 1 });
        }
      } catch { /* skip unreadable */ }
    }
  } catch { /* vault empty */ }

  return NextResponse.json({ results: results.slice(0, 10) });
}
