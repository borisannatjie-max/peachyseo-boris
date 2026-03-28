import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";
import { appendFileSync } from "fs";

interface ChatMessage {
  id: string;
  role: "user" | "boris" | "agent";
  agent?: string;
  content: string;
  ts: string;
}

function extractAgentTags(text: string): string[] {
  const matches = text.match(/@(\w+)/g) || [];
  return [...new Set(matches.map((m: string) => m.slice(1)))];
}

function parseCommand(text: string): { directive: string; agents: string[] } {
  const agents = extractAgentTags(text);
  const directive = text.replace(/@\w+/g, "").trim();
  return { directive, agents };
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message?.trim()) return NextResponse.json({ error: "Empty message" }, { status: 400 });

    const { directive, agents } = parseCommand(message);
    const response: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "boris",
      content: "",
      ts: new Date().toISOString(),
    };

    if (agents.length > 0) {
      // Write task to mission queue file (Boris reads this on next heartbeat)
      const taskFile = `/tmp/agent_task_${Date.now()}.json`;
      const taskPayload = JSON.stringify({
        agents,
        directive,
        created: new Date().toISOString(),
      });
      appendFileSync(taskFile, taskPayload);

      response.content =
        `Delegated to ${agents.join(", ")}.\n` +
        `Task queued at ${taskFile}.\n` +
        `Directive: "${directive}"\n\n` +
        `Note: Sub-agents can be triggered via the OpenClaw sessions API. ` +
        `For immediate spawning, use the ACP harness directly.`;
    } else {
      response.content = `Roger. Processing: "${directive}"`;
    }

    return NextResponse.json({ response, taggedAgents: agents, directive });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
