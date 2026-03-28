---
name: boris-command-center
description: Deploy the Boris Command Center dashboard - a Next.js mission control interface for OpenClaw agents. Use when asked to install, deploy, or set up the "Boris Command Center", "Mission Control", or "Boris Dashboard". Creates a web-based dashboard with modules for Command Center, Agent Pulse, Think-Log, Chat Bridge, Omni-Search, Missions, Vault, Calendar, Kill Switch, and Deploy. Runs on port 3000 with PM2.
---

# Boris Command Center - Deployment Skill

Deploys the Boris Command Center - a Next.js web dashboard for OpenClaw agent management.

## Prerequisites

- SSH access to target server (root or sudo user)
- Node.js 18+ installed
- PM2 installed (`npm install -g pm2`)
- UFW or firewall allowing port 3000

## Deployment

### Quick Deploy

Run the deployment script on target server:

```bash
# Copy dashboard files to server
scp -r /path/to/skill/assets/dashboard root@TARGET_SERVER:/root/.openclaw/workspace/

# SSH to server and run deployment
ssh root@TARGET_SERVER
cd /root/.openclaw/workspace/dashboard
npm install
pm2 start ecosystem.config.js --env production
ufw allow 3000/tcp  # Open firewall
```

### Full Deployment via SSH Tunnel

If running from a restricted server (like this one), deploy through Contabo:

```bash
# From this server, copy files to Contabo
sshpass -p 'SERVER_PASSWORD' scp -r /root/.openclaw/skills/boris-command-center/assets/dashboard \
  root@95.111.231.17:/root/.openclaw/workspace/

# SSH to Contabo and deploy
sshpass -p 'SERVER_PASSWORD' ssh root@95.111.231.17
cd /root/.openclaw/workspace/dashboard
npm install
pm2 start ecosystem.config.js --env production
ufw allow 3000/tcp
```

## Configuration

### Environment Variables

Edit `/root/.openclaw/workspace/dashboard/.env.local`:

```env
OPENCLAW_API_KEY=your_openclaw_api_key
OPENCLAW_GATEWAY_URL=http://localhost:18789
NEXT_PUBLIC_GATEWAY_URL=http://localhost:18789
```

### PM2 Management

```bash
pm2 list                    # Check status
pm2 logs boris-dashboard    # View logs
pm2 restart boris-dashboard # Restart
pm2 stop boris-dashboard    # Stop
```

## Accessing the Dashboard

After deployment:
- Local: `http://localhost:3000`
- Remote: `http://YOUR_SERVER_IP:3000`

## Troubleshooting

**Port 3000 blocked:** Run `ufw allow 3000/tcp`

**PM2 not starting:** Check logs with `pm2 logs boris-dashboard`

**Node version issue:** Use Node.js 18+ (`nvm use 18`)

## Files

- `scripts/deploy.sh` - Automated deployment script
- `assets/dashboard/` - Dashboard source code
