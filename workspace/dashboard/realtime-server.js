const { Server } = require("socket.io");
const { createServer } = require("http");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  // ── Think-Log channel ────────────────────────────────────
  // Any agent emits think-logs here; dashboard subscribes live
  io.on("connection", (socket) => {
    console.log("[Boris] Client connected:", socket.id);

    socket.on("agent:think", (data) => {
      // Broadcast internal monologue to all dashboard viewers
      io.emit("think:update", {
        ...data,
        ts: new Date().toISOString(),
      });
    });

    // Legacy log channel
    socket.on("agent:log", (data) => {
      io.emit("agent:log", { ...data, ts: new Date().toISOString() });
    });

    // Request full think-log history
    socket.on("think:history", () => {
      // In production: fetch from Redis or DB; for now stream empty ack
      socket.emit("think:history", { logs: [] });
    });

    socket.on("disconnect", () => {
      console.log("[Boris] Client disconnected:", socket.id);
    });
  });

  const PORT = process.env.REALTIME_PORT || 3001;
  httpServer.listen(PORT, () => {
    console.log(`[Boris] Real-time server running on port ${PORT}`);
    console.log(`[Boris] Think-Log channel: agent:think → think:update`);
    console.log(`[Boris] Chat channel: agent:message → broadcast`);
  });
});
