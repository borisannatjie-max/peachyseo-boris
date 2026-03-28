module.exports = {
  apps: [
    {
      name: "boris-dashboard",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: "/root/.openclaw/workspace/dashboard",
      instances: 1,
      autorestart: true,
      watch: false,
      memory: 512,
      env: { NODE_ENV: "production", PORT: "3000" },
    },
    {
      name: "boris-heartbeat",
      script: "/root/.openclaw/workspace/scripts/heartbeat_pulse.sh",
      interpreter: "bash",
      instances: 1,
      autorestart: false,   // Don't restart — script loops internally
      watch: false,
      env: { NODE_ENV: "production" },
    },
  ],
};
