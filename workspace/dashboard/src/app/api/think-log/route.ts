import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";

const THINK_LOG_FILE = "/tmp/boris_thinklog.json";

export async function GET() {
  try {
    const logs = JSON.parse(readFileSync(THINK_LOG_FILE, "utf-8"));
    return NextResponse.json({ logs });
  } catch {
    return NextResponse.json({ logs: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { agent, message, level } = await req.json();
    const entry = {
      id: Date.now(),
      agent: agent || "Boris",
      message,
      level: level || "info", // info | warn | error | reasoning
      ts: new Date().toISOString(),
    };

    let logs: any[] = [];
    try {
      logs = JSON.parse(readFileSync(THINK_LOG_FILE, "utf-8"));
    } catch { /* new file */ }

    logs.push(entry);
    // Keep last 500 entries
    if (logs.length > 500) logs = logs.slice(-500);

    require("fs").writeFileSync(THINK_LOG_FILE, JSON.stringify(logs, null, 2));
    return NextResponse.json({ success: true, entry });
  } catch {
    return NextResponse.json({ error: "Failed to write think log" }, { status: 500 });
  }
}
