# AgentMail Setup for OpenClaw Agents

When your human asks you to set up email using AgentMail, follow these steps.

## Step 1: Get the API Key

Ask your human for their AgentMail API key. It looks like: `am_us_inbox_f...`

If they don't have one:
1. Go to [console.agentmail.to](https://console.agentmail.to)
2. Create account → Generate API key
3. Save it somewhere safe (not in chat!)

## Step 2: Find a Server That Can Reach api.agentmail.to

Test connectivity:
```bash
curl -s --connect-timeout 5 "http://api.agentmail.to/"
```

If it times out or fails, the server's firewall is blocking it. You need a server that CAN reach it.

**In our setup:** Contabo server (95.111.231.17) can reach it. This server (vmi2786404) cannot.

To tunnel through SSH:
```bash
sshpass -p 'SSH_PASSWORD' ssh -o StrictHostKeyChecking=no user@server \
  'curl -s "https://api.agentmail.to/v0/inboxes" -H "Authorization: Bearer API_KEY"'
```

## Step 3: Verify the API Key

```bash
curl -s "https://api.agentmail.to/v0/inboxes" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Expected response:
```json
{"count":1,"inboxes":[{"inbox_id":"name@agentmail.to","email":"name@agentmail.to",...}]}
```

## Step 4: Read Messages

```bash
curl -s "https://api.agentmail.to/v0/messages" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Step 5: Send Emails

Use the Python SDK (raw REST has bugs on some endpoints):

```bash
pip install agentmail python-dotenv
```

```python
from agentmail import AgentMail
import os

client = AgentMail(api_key=os.getenv("AGENTMAIL_API_KEY"))

client.inboxes.messages.send(
    inbox_id="your-inbox@agentmail.to",
    to=["recipient@example.com"],
    subject="Subject here",
    text="Message body here"
)
```

Or via SSH tunnel:
```bash
sshpass -p 'PASSWORD' ssh root@95.111.231.17 \
  'python3 -c "
from agentmail import AgentMail
import os
c = AgentMail(api_key=\"YOUR_KEY\")
c.inboxes.messages.send(inbox_id=\"you@agentmail.to\", to=[\"them@example.com\"], subject=\"Hi\", text=\"Hello!\")
"'
```

## Common Issues

| Error | Fix |
|-------|-----|
| "Route not found" | Use `/v0/` NOT `/v1/` |
| Connection timeout | Firewall blocks api.agentmail.to - need SSH tunnel |
| 404 on POST | Use Python SDK, not raw REST |

## Our Config (for reference)

- API Key: `am_us_inbox_f65151b595b48213c45cf703b6051dfa936b263b6a1f4205a20e2d51c453198a`
- SSH: root@95.111.231.17 / Minion10810!!!
- Inbox: peachyseo@agentmail.to (display name: Boris)

## Store This

Save the API key to a config file:
```json
{
  "api_key": "am_us_inbox_...",
  "api_base": "https://api.agentmail.to/v0/",
  "ssh_host": "95.111.231.17",
  "ssh_user": "root",
  "ssh_pass": "YOUR_PASSWORD"
}
```

Location: `/root/.openclaw/skills/agentmail/config.json` or similar.
