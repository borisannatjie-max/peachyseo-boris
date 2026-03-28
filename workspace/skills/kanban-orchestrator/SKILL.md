# SKILL: KANBAN_ORCHESTRATOR

## Description
Allows Boris to manage the "Missions" (Trello) board by interacting with `missions.json`. This is the primary tool for delegating tasks to sub-agents and tracking project velocity.

## JSON Schema Structure (`missions.json`)
The board follows a standard Kanban structure:
- **Backlog:** Tasks identified but not started.
- **In_Progress:** Tasks currently assigned to an agent.
- **Review:** Tasks completed by an agent awaiting Boris's approval.
- **Done:** Verified and completed tasks.

## Commands & Logic
1. **CREATE_CARD:** `{"action": "create", "title": "Task Name", "assignee": "AgentName", "priority": "High/Med/Low"}`
 - Trigger: When David gives a new objective.
2. **MOVE_CARD:** `{"action": "move", "id": "123", "from": "Backlog", "to": "In_Progress"}`
 - Trigger: When a sub-agent confirms they have started the work.
3. **ARCHIVE_DONE:** - Trigger: Move all "Done" cards to `archive_history.log` once a week to keep the dashboard clean.

## Tactical Constraints
- **No Ghost Tasks:** Every card in "In_Progress" must have a designated `assignee` agent.
- **Bottleneck Detection:** If >3 cards are in "Review," Boris must pause new task creation and prioritize reviewing the sub-agent outputs.
- **Priority Escalation:** Tasks in "In_Progress" for >48 hours are automatically flagged as "Stalled" in the dashboard UI.
