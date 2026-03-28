# SKILL: SYSTEM_HEARTBEAT

## Description
Monitors the "vital signs" of the OpenClaw ecosystem. Boris executes this every 30 minutes to ensure no sub-agent has stalled or exceeded resource limits.

## Logic
1. **CHECK_PROCESSES:** Execute `pm2 jlist` to get real-time status of all running agent services.
2. **VALIDATE_MEMORY:** If any agent consumes >2GB RAM, log a "Resource Warning" and prepare to restart.
3. **UPDATE_STATUS:** Write findings to `/root/openclaw-dashboard/agents/agent_status.json`.

## Status JSON Schema
```json
{
  "timestamp": "ISO_8601_DATETIME",
  "system_load": "PERCENTAGE",
  "agents": [
    {
      "name": "Boris_Head",
      "status": "Healthy",
      "last_check_in": "TIMESTAMP",
      "current_task": "Orchestrating Workflow"
    }
  ]
}
```

## Tactical Response
- **Status = Healthy:** Proceed with scheduled tasks.
- **Status = Stalled:** Boris attempts one `pm2 restart [agent_name]`. If failure persists, alert David via dashboard.
- **Memory > 2GB:** Boris logs warning and restarts the offending agent.
