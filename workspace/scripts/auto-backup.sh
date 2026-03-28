#!/bin/bash
# Auto-backup hook — run before any sub-agent writes to vault
# Usage: auto-backup.sh <filepath>

VAULT_DIR="/root/.openclaw/workspace/vault"
BACKUP_DIR="/root/.openclaw/workspace/.vault_backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

FILE="$1"
if [ -z "$FILE" ]; then
  echo "Usage: auto-backup.sh <filepath>"
  exit 1
fi

FILENAME=$(basename "$FILE")
mkdir -p "${BACKUP_DIR}/${FILENAME}"
cp "$FILE" "${BACKUP_DIR}/${FILENAME}/${TIMESTAMP}_${FILENAME}" 2>/dev/null

echo "Auto-backed up: $FILENAME"
