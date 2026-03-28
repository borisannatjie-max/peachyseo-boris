"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Activity, Bot, Database, Calendar, FolderOpen, FileText, Search,
  Zap, DollarSign, RefreshCw, Plus, ChevronRight, Shield,
  MessageSquare, Send, Terminal, Rocket,
  Wifi, WifiOff, AlertTriangle, Globe, Lock, Dock,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

// ─── Think-Log Terminal ──────────────────────────────────────
function ThinkTerminal({ visible }: { visible: boolean }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return;
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.hostname}:3001`);

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.ts) setLogs((prev) => [...prev.slice(-499), data]);
      } catch { /* ignore */ }
    };

    const poll = setInterval(async () => {
      try {
        const res = await fetch("/api/think-log");
        const data = await res.json();
        if (data.logs) setLogs((prev) => [...new Set([...prev, ...data.logs])].slice(-500));
      } catch { /* ignore */ }
    }, 5000);

    return () => { ws.close(); clearInterval(poll); };
  }, [visible]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);

  const levelColor = (level: string) => {
    if (level === "error") return "text-red-400";
    if (level === "warn") return "text-amber-400";
    if (level === "reasoning") return "text-blue-400";
    return "text-slate-300";
  };

  if (!visible) return null;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Terminal className="w-4 h-4 text-green-400" />
        <span className="text-sm font-semibold">Agent Internal Monologue</span>
        <span className={`flex items-center gap-1 ml-auto text-xs ${connected ? "text-green-400" : "text-slate-500"}`}>
          {connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          {connected ? "Live" : "Reconnecting..."}
        </span>
      </div>
      <div className="flex-1 dark:bg-slate-950 border dark:border-slate-800 rounded-xl p-4 overflow-y-auto font-mono text-xs space-y-1 bg-slate-50 border-slate-200">
        {logs.length === 0 ? (
          <span className="text-slate-500 dark:text-slate-600">Waiting for agent thoughts...</span>
        ) : (
          logs.map((log, i) => (
            <div key={i} className={levelColor(log.level)}>
              <span className="text-slate-500 dark:text-slate-600 mr-2">[{log.agent}]</span>
              <span>{log.message}</span>
              <span className="text-slate-600 dark:text-slate-700 ml-2">{new Date(log.ts).toLocaleTimeString()}</span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

// ─── Multi-Agent Chat Bridge ─────────────────────────────────
function ChatBridge({ visible }: { visible: boolean }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { id: `u-${Date.now()}`, role: "user", content: input, ts: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    const text = input;
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      if (data.response) setMessages((prev) => [...prev, data.response]);
    } catch {
      setMessages((prev) => [...prev, { id: `e-${Date.now()}`, role: "boris", content: "Error reaching Boris.", ts: new Date().toISOString() }]);
    }
    setLoading(false);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  if (!visible) return null;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-semibold">Multi-Agent Chat Bridge</span>
        <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">Tag agents: @Researcher @Coder</span>
      </div>
      <div className="flex-1 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-4 overflow-y-auto space-y-3 bg-white border-slate-200">
        {messages.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-8">
            Start a conversation. Use <span className="font-mono text-blue-500 dark:text-blue-400">@AgentName</span> to delegate tasks.
          </p>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-xl px-4 py-2 text-sm ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-700 border dark:border-slate-600 text-slate-700 dark:text-slate-200"}`}>
              {msg.role !== "user" && <div className="text-xs font-semibold text-slate-400 dark:text-slate-300 mb-1">BORIS</div>}
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <div className={`text-xs mt-1 ${msg.role === "user" ? "text-blue-200" : "text-slate-500 dark:text-slate-400"}`}>{new Date(msg.ts).toLocaleTimeString()}</div>
            </div>
          </div>
        ))}
        {loading && <div className="text-sm text-slate-400 dark:text-slate-500 italic">Boris is thinking...</div>}
        <div ref={bottomRef} />
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder='Ask Boris or tag: @Researcher find trends...'
          className="flex-1 px-4 py-2 border rounded-xl text-sm bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200" disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl disabled:opacity-50">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── One-Click Deploy ────────────────────────────────────────
function OneClickDeploy({ visible }: { visible: boolean }) {
  const [step, setStep] = useState<"config" | "deploying" | "done">("config");
  const [form, setForm] = useState({ name: "", image: "", port: "3000", subdomain: "" });
  const [result, setResult] = useState<any>(null);
  const [containers, setContainers] = useState<string[]>([]);

  const refreshContainers = useCallback(async () => {
    try {
      const res = await fetch("/api/deploy");
      const data = await res.json();
      setContainers(data.containers || []);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { if (visible) refreshContainers(); }, [visible, refreshContainers]);

  const deploy = async () => {
    setStep("deploying");
    try {
      const res = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, port: parseInt(form.port), action: "deploy:full" }),
      });
      setResult(await res.json());
    } catch (err: any) {
      setResult({ error: err.message });
    }
    setStep("done");
    refreshContainers();
  };

  if (!visible) return null;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Rocket className="w-4 h-4 text-purple-400" />
        <span className="text-sm font-semibold">One-Click Deploy</span>
      </div>

      {step === "config" && (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">App Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="my-app" className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Docker Image</label>
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="nginx:alpine" className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 rounded-lg text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Container Port</label>
              <input value={form.port} onChange={(e) => setForm({ ...form, port: e.target.value })} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Subdomain</label>
              <input value={form.subdomain} onChange={(e) => setForm({ ...form, subdomain: e.target.value })} placeholder="my-app" className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 rounded-lg text-sm" />
            </div>
          </div>
          <button onClick={deploy} disabled={!form.name || !form.image || !form.subdomain}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50 mt-2">
            <Rocket className="w-4 h-4 inline mr-2" />Deploy Full Stack
          </button>
        </div>
      )}

      {step === "deploying" && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Spinning up container, configuring Nginx & SSL...</p>
          </div>
        </div>
      )}

      {step === "done" && result && (
        <div className="space-y-3">
          {result.docker?.success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm">
              <Dock className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
              <div><div className="font-medium text-green-800 dark:text-green-300">Container Running</div><div className="text-green-600 dark:text-green-400 text-xs">{result.docker.container} on :{form.port}</div></div>
            </div>
          )}
          {result.nginx?.success && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm">
              <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <div><div className="font-medium text-blue-800 dark:text-blue-300">Proxy Active</div><div className="text-blue-600 dark:text-blue-400 text-xs">{result.nginx.conf}</div></div>
            </div>
          )}
          {result.ssl?.success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm">
              <Lock className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
              <div><div className="font-medium text-green-800 dark:text-green-300">SSL Secured</div><div className="text-green-600 dark:text-green-400 text-xs">https://{form.subdomain}.peachyseo.com</div></div>
            </div>
          )}
          {(result.ssl?.error || result.docker?.error) && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              <div><div className="font-medium text-red-800 dark:text-red-300">Error</div><div className="text-red-600 dark:text-red-400 text-xs">{result.ssl?.error || result.docker?.error}</div></div>
            </div>
          )}
          <button onClick={() => { setStep("config"); setResult(null); }} className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 underline mt-2">← New deployment</button>
        </div>
      )}

      {containers.length > 0 && (
        <div className="mt-4 pt-4 border-t dark:border-slate-700">
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-2">Running Containers</div>
          {containers.map((c, i) => <div key={i} className="text-xs font-mono text-slate-600 dark:text-slate-400 py-0.5">{c}</div>)}
        </div>
      )}
    </div>
  );
}

// ─── Agent Pulse ─────────────────────────────────────────────
function AgentPulse() {
  const [agents, setAgents] = useState<any[]>([]);
  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch("/api/agents");
      const data = await res.json();
      setAgents(data.agents || []);
    } catch { setAgents([]); }
  }, []);
  useEffect(() => { fetchAgents(); }, []);
  const reboot = async (id: string) => { await fetch(`/api/agents/${id}/reboot`, { method: "POST" }); fetchAgents(); };
  if (!agents.length) return <p className="text-sm text-slate-400 dark:text-slate-500 p-4">No agents active.</p>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {agents.map((a) => (
        <div key={a.agent_id} className="border dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-800 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${a.status === "Healthy" ? "bg-green-500" : a.status === "Crashed" ? "bg-red-500 animate-pulse" : "bg-slate-300 dark:bg-slate-600"}`} />
              <span className="font-semibold text-sm dark:text-slate-200">{a.agent_name}</span>
            </div>
            <button onClick={() => reboot(a.agent_id)} className="text-xs text-slate-400 hover:text-red-500 dark:text-slate-500"><RefreshCw className="w-3 h-3" /></button>
          </div>
          <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex justify-between"><span>Task:</span><span className="truncate max-w-[140px]">{a.current_task || "Idle"}</span></div>
            <div className="flex justify-between"><span>Memory:</span><span>{a.memory_mb || "—"} MB</span></div>
            <div className="flex justify-between"><span>Heartbeat:</span><span>{a.last_heartbeat ? new Date(a.last_heartbeat).toLocaleTimeString() : "—"}</span></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Kill Switch ─────────────────────────────────────────────


// ─── Nav Items ──────────────────────────────────────────────
const NAV_ITEMS = [
  { icon: Activity, label: "Command Center", panel: null },
  { icon: Bot, label: "Agent Pulse", panel: "agents" },
  { icon: Terminal, label: "Think-Log", panel: "thinklog" },
  { icon: MessageSquare, label: "Chat Bridge", panel: "chat" },
  { icon: Search, label: "Omni-Search", panel: "search" },
  { icon: Database, label: "Missions", panel: "missions" },
  { icon: FolderOpen, label: "Vault", panel: "vault" },
  { icon: Calendar, label: "Calendar", panel: "calendar" },
  { icon: Rocket, label: "Deploy", panel: "deploy" },
];

// ─── Main Page ──────────────────────────────────────────────
export default function Home() {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-900">
      {/* Sidebar */}
      <aside className={`border-r dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-4 flex flex-col transition-all duration-300 ${sidebarOpen ? "w-72" : "w-16"}`}>
        <div className="flex items-center gap-2 mb-6">
          <Activity className="text-red-600 dark:text-red-500 w-6 h-6 shrink-0" />
          {sidebarOpen && <span className="font-bold text-lg dark:text-slate-100">BORIS</span>}
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mb-4 text-xs text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 text-left">
          {sidebarOpen ? "← Collapse" : "→"}
        </button>
        <nav className="space-y-1 flex-1 overflow-y-auto">
          {NAV_ITEMS.map(({ icon: Icon, label, panel }) => (
            <button
              key={label}
              onClick={() => setActivePanel(activePanel === panel ? null : panel)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${activePanel === panel ? "bg-slate-200 dark:bg-slate-700 font-medium" : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"} ${!sidebarOpen ? "justify-center px-0" : ""}`}
              title={!sidebarOpen ? label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span className="truncate">{label}</span>}
            </button>
          ))}
        </nav>
        <div className="mt-4 pt-4 border-t dark:border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
            {sidebarOpen && <span>Status</span>}
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-500 inline-block" />Online</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="border-b dark:border-slate-800 px-6 py-4 flex items-center justify-between bg-white dark:bg-slate-900">
          <h1 className="text-xl font-bold truncate dark:text-slate-100">
            {NAV_ITEMS.find((n) => n.panel === activePanel)?.label || "Command Center"}
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500 dark:text-slate-400 shrink-0">
              {new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
            <ThemeToggle />
          </div>
        </header>

        <div className="flex-1 p-6 overflow-auto bg-slate-100 dark:bg-slate-900">
          {!activePanel && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 dark:text-slate-500 text-sm">Boris Command Center — select a module from the sidebar</p>
              </div>
            </div>
          )}
          {activePanel === "agents" && <AgentPulse />}

          {activePanel === "thinklog" && <ThinkTerminal visible={activePanel === "thinklog"} />}
          {activePanel === "chat" && <ChatBridge visible={activePanel === "chat"} />}
          {activePanel === "deploy" && <OneClickDeploy visible={activePanel === "deploy"} />}
          {["missions", "vault", "calendar", "search"].includes(activePanel || "") && (
            <div className="flex items-center justify-center h-64 text-slate-400 dark:text-slate-500 text-sm">
              {activePanel} module — connect to Boris API.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
