import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";

const DATABASE_URL = process.env.DATABASE_URL || "postgres://boris:BorisHeadAgent2026@localhost:5432/boris_team";

export async function GET() {
  try {
    const client = new Client({ connectionString: DATABASE_URL });
    await client.connect();
    const result = await client.query("SELECT * FROM budget_tracker WHERE date = CURRENT_DATE LIMIT 1");
    await client.end();
    if (result.rows.length === 0) {
      return NextResponse.json({ spend_usd: 0, cap_usd: 10, alerts_sent: 0 });
    }
    return NextResponse.json(result.rows[0]);
  } catch {
    return NextResponse.json({ spend_usd: 0, cap_usd: 10, alerts_sent: 0 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const client = new Client({ connectionString: DATABASE_URL });
    await client.connect();
    await client.query(
      "INSERT INTO budget_tracker (date, cap_usd) VALUES (CURRENT_DATE, $1) ON CONFLICT (date) DO UPDATE SET cap_usd = $1",
      [body.cap_usd]
    );
    await client.end();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
