# Heartbeat Status Skill

Updates `Docs/agent_status.json` every 30 minutes with team health metrics.

## What it does
- Reads current mission state from `Missions/tasks.json`
- Updates `Docs/agent_status.json` with uptime, active missions, and team status
- Timestamps the update

## Cron
Every 30 minutes via OpenClaw cron.
