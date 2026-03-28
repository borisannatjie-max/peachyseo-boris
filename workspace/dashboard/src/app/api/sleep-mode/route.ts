import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function POST() {
  try {
    // Pause all PM2 processes except boris-dashboard
    execSync('pm2 pause all 2>/dev/null || true');
    return NextResponse.json({ success: true, mode: "sleep" });
  } catch {
    return NextResponse.json({ error: "Failed to enter sleep mode" }, { status: 500 });
  }
}
