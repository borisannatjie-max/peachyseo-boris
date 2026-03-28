#!/bin/bash
WORKSPACE="/root/.openclaw/workspace"
STATUS_FILE="$WORKSPACE/Docs/agent_status.json"
MISSIONS_FILE="$WORKSPACE/Missions/tasks.json"
UPTIME=$(uptime -p 2>/dev/null || echo "unknown")

# Count active tasks (in_progress column)
ACTIVE=$(grep -c '"status": "in_progress"' "$MISSIONS_FILE" 2>/dev/null || echo "0")

# Get team count (if agent registry exists)
TEAM_COUNT=$(grep -c '"role":' "$WORKSPACE/Docs/team_registry.json" 2>/dev/null || echo "0")

cat > "$STATUS_FILE" << EOF
{
  "updated": "$(date -Iseconds)",
  "agent": "Boris",
  "role": "Head Agent",
  "status": "online",
  "heartbeatIntervalMinutes": 30,
  "uptime": "$UPTIME",
  "activeMissions": $ACTIVE,
  "teamSize": $TEAM_COUNT
}
EOF
