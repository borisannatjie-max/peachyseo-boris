#!/bin/bash
# Version Rollback — Boris Command Center
# Lists and restores previous versions of documents

set -e

VAULT_DIR="/root/.openclaw/workspace/vault"
BACKUP_DIR="/root/.openclaw/workspace/.vault_backups"

mkdir -p "$BACKUP_DIR"

rollback_file() {
  local FILE="$1"
  local FILENAME=$(basename "$FILE")

  echo "=== Version History: $FILENAME ==="

  # Check for backups
  if [ -d "${BACKUP_DIR}/${FILENAME}" ]; then
    ls -lt "${BACKUP_DIR}/${FILENAME}/" | head -10
    echo ""
    echo "Select version to restore (full path):"
    read -r SELECTED
    if [ -f "$SELECTED" ]; then
      cp "$SELECTED" "$FILE"
      echo "Restored: $SELECTED -> $FILE"
    fi
  else
    echo "No backup history found for $FILENAME"
  fi
}

# Create or update backup
backup_file() {
  local FILE="$1"
  local FILENAME=$(basename "$FILE")
  local TIMESTAMP=$(date +%Y%m%d_%H%M%S)

  mkdir -p "${BACKUP_DIR}/${FILENAME}"
  cp "$FILE" "${BACKUP_DIR}/${FILENAME}/${TIMESTAMP}_${FILENAME}"
  echo "Backed up: $FILENAME"
}

# Auto-backup before any sub-agent write
auto_backup() {
  local FILE="$1"
  if [ -f "$FILE" ]; then
    backup_file "$FILE"
  fi
}

case "$1" in
  "list")
    ls -lt "$VAULT_DIR/"*.md 2>/dev/null || echo "No documents found"
    ;;
  "rollback")
    rollback_file "$2"
    ;;
  "backup")
    backup_file "$2"
    ;;
  "auto")
    auto_backup "$2"
    ;;
  *)
    echo "Usage: version-rollback.sh {list|rollback <file>|backup <file>|auto <file>}"
    ;;
esac
