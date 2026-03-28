#!/bin/bash
# AgentMail via SSH to Contabo

SSH_HOST="95.111.231.17"
SSH_USER="root"
SSH_PASS="Minion10810!!!"
API_KEY="am_us_inbox_f65151b595b48213c45cf703b6051dfa936b263b6a1f4205a20e2d51c453198a"
API_BASE="http://api.agentmail.to/v1"

CMD=$1

case $CMD in
  inbox)
    sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no "$SSH_USER@$SSH_HOST" "curl -s '$API_BASE/inbox' -H 'Authorization: Bearer $API_KEY'"
    ;;
  send)
    TO=$2
    SUBJECT=$3
    BODY=$4
    sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no "$SSH_USER@$SSH_HOST" "curl -s -X POST '$API_BASE/send' -H 'Authorization: Bearer $API_KEY' -H 'Content-Type: application/json' -d '{\"to\":\"$TO\",\"subject\":\"$SUBJECT\",\"body\":\"$BODY\"}'"
    ;;
  *)
    echo "Usage: agentmail.sh {inbox|send}"
    ;;
esac
