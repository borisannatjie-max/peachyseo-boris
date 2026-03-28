#!/bin/bash
# heartbeat_pulse.sh — Boris System Heartbeat (runs continuously)
# Loops every 30 minutes, writes to /root/openclaw-dashboard/agents/agent_status.json

STATUS_FILE="/root/openclaw-dashboard/agents/agent_status.json"
ALERT_LOG="/root/openclaw-dashboard/agents/alerts.log"
MEM_LIMIT=$((2 * 1024 * 1024 * 1024))  # 2GB
mkdir -p "$(dirname "$STATUS_FILE")" "$(dirname "$ALERT_LOG")"

while true; do
  TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  SYSTEM_LOAD=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//' || echo "unknown")

  # Fetch PM2 data
  PM2_DATA=$(pm2 jlist 2>/dev/null || echo "[]")
  AGENT_COUNT=$(echo "$PM2_DATA" | jq 'length' 2>/dev/null || echo "0")

  # Build agents JSON array — exclude PM2 internal entries
  AGENTS_JSON=$(echo "$PM2_DATA" | jq -r \
    '.[] | select(.name | test("^(boris|openclaw|agent)")) |
    {
      name: .name,
      status: (if .pm2_env.status == "online" then "Healthy"
               else if .pm2_env.status == "errored" then "Crashed"
               else if .pm2_env.status == "stopped" then "Stopped"
               else "Unknown" end end end),
      last_check_in: "'"$TIMESTAMP"'",
      current_task: (.pm2_env.env.NODE_APP_INSTANCE // .name),
      memory: .monit.memory,
      memory_mb: ((.monit.memory / 1024 / 1024) | floor),
      cpu: .monit.cpu
    }' 2>/dev/null | jq -s '.')

  # Auto-restart agents over memory limit
  echo "$AGENTS_JSON" | jq -r '.[] | select(.memory > '"$MEM_LIMIT"') | .name' 2>/dev/null | while IFS= read -r name; do
    [ -z "$name" ] && continue
    echo "[$TIMESTAMP] Auto-restarting $name (memory limit)" >> "$ALERT_LOG"
    pm2 restart "$name" 2>/dev/null || true
  done

  # Write status
  jq -n \
    --arg ts "$TIMESTAMP" \
    --arg load "$SYSTEM_LOAD" \
    --argjson agents "$AGENTS_JSON" \
    --argjson count "$AGENT_COUNT" \
    '{
      timestamp: $ts,
      system_load: $load,
      agent_count: $count,
      agents: $agents
    }' > "$STATUS_FILE"

  echo "[$TIMESTAMP] Heartbeat: $AGENT_COUNT agents checked" >> /root/.openclaw/workspace/memory/heartbeat.log

  sleep 1800
done
