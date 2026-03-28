import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function GET() {
  try {
    // Fetch from PostgreSQL
    const { Client } = require("pg");
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    const result = await client.query("SELECT * FROM agent_pulse ORDER BY last_heartbeat DESC");
    await client.end();
    return NextResponse.json({ agents: result.rows });
  } catch {
    // Fallback: PM2 list
    try {
      const out = execSync("pm2 jlist 2>/dev/null || echo '[]'").toString();
      const pm2Procs = JSON.parse(out);
      const agents = pm2Procs.map((p: any) => ({
        agent_id: p.name,
        agent_name: p.name,
        status: p.pm2_env?.status === "online" ? "online" : "stopped",
        current_task: "—",
        memory_mb: p.monit?.memory ? p.monit.memory / 1024 / 1024 : 0,
        last_heartbeat: new Date(p.pm2_env?.pm_uptime || Date.now()).toISOString(),
        pm2_id: p.pm_id,
      }));
      return NextResponse.json({ agents });
    } catch {
      return NextResponse.json({ agents: [] });
    }
  }
}
