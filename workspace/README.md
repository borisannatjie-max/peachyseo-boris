# Boris Team HQ

## Structure

```
workspace/
├── Missions/
│   └── tasks.json       # Trello-style kanban board
├── Docs/
│   ├── agent_status.json   # Heartbeat status (auto-updated)
│   └── team_registry.json  # Agent roster
├── Calendar.md          # Shared scheduling
├── dashboard/           # Next.js dashboard app
│   └── src/app/         # App routes
└── skills/
    └── heartbeat-status/   # 30-min heartbeat skill
```

## Stack
- **Runtime**: Node.js 22 + Next.js (latest)
- **Database**: PostgreSQL 15 (`boris_team`)
- **DB User**: boris / BorisHeadAgent2026

## Commands
```bash
cd dashboard && npm run dev   # Start dashboard
```

## Cron Jobs
- **Heartbeat**: Updates agent_status.json every 30 min
