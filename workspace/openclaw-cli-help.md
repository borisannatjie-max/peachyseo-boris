# OpenClaw CLI Help Documentation

Source: https://docs.openclaw.ai/start/getting-started

---

## Table of Contents

1. [Installation](#1-installation)
2. [Setup & Onboarding](#2-setup--onboarding)
3. [Gateway Management](#3-gateway-management)
4. [Model Configuration](#4-model-configuration)
5. [Channel Setup](#5-channel-setup)
6. [Plugins & Skills](#6-plugins--skills)
7. [Cron & Automation](#7-cron--automation)
8. [Sessions & Memory](#8-sessions--memory)
9. [Diagnostics & Troubleshooting](#9-diagnostics--troubleshooting)
10. [Advanced Configuration](#10-advanced-configuration)

---

## 1. Installation

### Install OpenClaw CLI (Bash)

Source: https://docs.openclaw.ai/start/getting-started

Installs the OpenClaw CLI tool using platform-specific scripts.

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

### Install OpenClaw CLI via npm

Source: https://docs.openclaw.ai/install

```bash
npm install -g openclaw@latest
```

### Install OpenClaw CLI via pnpm

Source: https://docs.openclaw.ai/install

```bash
pnpm add -g openclaw@latest
```

### Install OpenClaw via Shell Script

Source: https://docs.openclaw.ai/install/installer

Various installation methods:

```bash
# Default installation
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash

# Skip onboarding
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash -s -- --no-onboard

# Git install (hackable)
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash -s -- --install-method git

# Dry run
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash -s -- --dry-run
```

---

## 2. Setup & Onboarding

### Standard Onboarding

Source: https://docs.openclaw.ai/start/getting-started

```bash
openclaw onboard --install-daemon
```

### Onboarding Flow Options

Source: https://docs.openclaw.ai/cli/onboard

```bash
openclaw onboard
openclaw onboard --flow quickstart
openclaw onboard --flow manual
```

### Non-Interactive Onboarding

Source: https://docs.openclaw.ai/cli/onboard

```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice apiKey \
  --anthropic-api-key "$ANTHROPIC_API_KEY" \
  --secret-input-mode plaintext \
  --gateway-port 18789 \
  --gateway-bind loopback \
  --install-daemon \
  --daemon-runtime node \
  --skip-skills
```

### Non-Interactive with Gateway Token

Source: https://docs.openclaw.ai/cli/onboard

```bash
export OPENCLAW_GATEWAY_TOKEN="your-token"
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice skip \
  --gateway-auth token \
  --gateway-token-ref-env OPENCLAW_GATEWAY_TOKEN \
  --accept-risk
```

### Initialize Workspace

Source: https://docs.openclaw.ai/cli/setup

```bash
openclaw setup
openclaw setup --workspace ~/.openclaw/workspace
openclaw setup --wizard
```

---

## 3. Gateway Management

### Start Gateway

Source: https://docs.openclaw.ai/start/getting-started

```bash
openclaw gateway
```

### Start Gateway (Custom Port)

Source: https://docs.openclaw.ai/start/getting-started

```bash
openclaw gateway --port 18789
```

### Gateway Service Management

Source: https://docs.openclaw.ai/cli/gateway

```bash
openclaw gateway install
openclaw gateway start
openclaw gateway stop
openclaw gateway restart
openclaw gateway uninstall
```

### Gateway Status

Source: https://docs.openclaw.ai/cli/gateway

```bash
openclaw status
openclaw status --all      # full diagnosis
openclaw status --deep     # adds gateway health probes
```

### Gateway Health Check

Source: https://docs.openclaw.ai/help/faq

```bash
openclaw health --json
openclaw health --verbose
```

### Restart Gateway & Check Status

Source: https://docs.openclaw.ai/gateway/authentication

```bash
openclaw gateway restart
openclaw models status
openclaw doctor
```

### Configure and Manage Gateway

Source: https://docs.openclaw.ai/start/getting-started

```bash
openclaw onboard --install-daemon
openclaw gateway status
openclaw dashboard
```

### Access Dashboard

Source: https://docs.openclaw.ai/platforms/raspberry-pi

```bash
openclaw dashboard --no-open
```

---

## 4. Model Configuration

### List Available Models

Source: https://docs.openclaw.ai/cli/models

```bash
openclaw models list
openclaw models list --json
openclaw models list --all
openclaw models list --provider <name>
```

### Set Default Model

Source: https://docs.openclaw.ai/concepts/models

```bash
openclaw models set <model>
openclaw models set openai/gpt-4o
```

### Model Fallbacks

Source: https://docs.openclaw.ai/gateway/cli-backends

```bash
openclaw models fallbacks list
openclaw models fallbacks add <model>
openclaw models fallbacks remove <model>
openclaw models fallbacks clear
```

### Configure API-based LLM Models

Source: https://docs.openclaw.ai/platforms/raspberry-pi

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-sonnet-4-5",
        "fallbacks": ["openai/gpt-4o-mini"]
      }
    }
  }
}
```

### Configure Primary and Fallback Models

Source: https://docs.openclaw.ai/gateway/configuration-examples

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-opus-4-6",
        "fallbacks": ["anthropic/claude-opus-4-5", "openai/gpt-4o"]
      }
    }
  }
}
```

### Configure MiniMax Provider

Source: https://docs.openclaw.ai/providers/minimax

```json
{
  "env": {
    "MINIMAX_API_KEY": "sk-..."
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "minimax/MiniMax-M2.5"
      }
    }
  }
}
```

### Configure MiniMax M2.5 Direct

Source: https://docs.openclaw.ai/gateway/configuration-reference

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "minimax/MiniMax-M2.5"
      },
      "models": {
        "minimax/MiniMax-M2.5": {
          "alias": "Minimax"
        }
      }
    }
  }
}
```

---

## 5. Channel Setup

### Authenticate Channels

Source: https://docs.openclaw.ai/start/getting-started

```bash
openclaw channels login
openclaw gateway --port 18789
```

### WhatsApp Channel

Source: https://docs.openclaw.ai/channels/whatsapp

```bash
openclaw channels login --channel whatsapp
openclaw channels login --channel whatsapp --account work
openclaw pairing list whatsapp
openclaw pairing approve whatsapp <CODE>
```

### Telegram Channel

Source: https://docs.openclaw.ai/channels/telegram

```bash
openclaw channels add
openclaw channels login --channel telegram
openclaw pairing list telegram
openclaw pairing approve telegram <CODE>
```

### Discord Channel

Source: https://docs.openclaw.ai/channels/discord

```bash
openclaw config set channels.discord.token '"YOUR_BOT_TOKEN"' --json
openclaw config set channels.discord.enabled true --json
openclaw gateway restart
```

### Manage Channel Status

Source: https://docs.openclaw.ai/cli/channels

```bash
openclaw channels list
openclaw channels status
openclaw channels status --probe
openclaw channels capabilities
```

---

## 6. Plugins & Skills

### Install Plugin

Source: https://docs.openclaw.ai/cli/plugins

```bash
openclaw plugins install <path-or-spec>
openclaw plugins install @openclaw/voice-call
openclaw plugins install ./my-bundle
openclaw plugins install @openclaw/voice-call --pin
```

### List Plugins

Source: https://docs.openclaw.ai/tools/plugin

```bash
openclaw plugins list
openclaw plugins info <id>
openclaw plugins enable <id>
openclaw plugins disable <id>
openclaw plugins doctor
```

### Install Skills via ClawHub

Source: https://docs.openclaw.ai/tools/clawhub

```bash
clawhub install <skill-slug>
clawhub update --all
```

---

## 7. Cron & Automation

### Add Cron Job

Source: https://docs.openclaw.ai/automation/cron-jobs

```bash
# Daily morning briefing at 7am
openclaw cron add \
  --name "Morning brief" \
  --cron "0 7 * * *" \
  --session isolated \
  --message "Summarize overnight updates." \
  --announce \
  --channel whatsapp \
  --to "+15551234567"

# One-shot reminder
openclaw cron add \
  --name "Reminder" \
  --at "2h" \
  --session main \
  --system-event "Call back the client" \
  --wake now

# Weekly review
openclaw cron add \
  --name "Weekly review" \
  --cron "0 9 * * 1" \
  --session isolated \
  --message "Review project status" \
  --model opus
```

### List Cron Jobs

Source: https://docs.openclaw.ai/cli/cron

```bash
openclaw cron list
openclaw cron runs --id <job-id> --limit 20
openclaw cron run <job-id>
```

---

## 8. Sessions & Memory

### Session Cleanup

Source: https://docs.openclaw.ai/cli/sessions

```bash
openclaw sessions cleanup --dry-run
openclaw sessions cleanup --enforce
```

### Compact Session History

Source: https://docs.openclaw.ai/concepts/compaction

```bash
/compact
/compact Focus on decisions and open questions
```

### Reset Session

Source: https://docs.openclaw.ai/concepts/session

```bash
/new
/reset
```

---

## 9. Diagnostics & Troubleshooting

### Full Diagnostic Ladder

Source: https://docs.openclaw.ai/help/troubleshooting

```bash
openclaw status
openclaw status --all
openclaw gateway status
openclaw logs --follow
openclaw doctor
openclaw channels status --probe
```

### Check Gateway Status

Source: https://docs.openclaw.ai/gateway/troubleshooting

```bash
openclaw --version
openclaw doctor
openclaw gateway status
```

### Update OpenClaw

Source: https://docs.openclaw.ai/install/updating

```bash
openclaw update
openclaw update --channel beta
openclaw update --channel dev
openclaw doctor
openclaw gateway restart
```

### Reset OpenClaw Installation

Source: https://docs.openclaw.ai/help/faq

```bash
openclaw reset
openclaw reset --scope full --yes --non-interactive
openclaw onboard --install-daemon
```

---

## 10. Advanced Configuration

### Configure via JSON

Source: https://docs.openclaw.ai/gateway/configuration

```bash
openclaw gateway call config.get --params '{}'
openclaw gateway call config.apply --params '{
  "raw": "{ agents: { defaults: { workspace: \"~/.openclaw/workspace\" } }",
  "baseHash": "<hash>",
  "sessionKey": "agent:main:whatsapp:direct:+15555550123"
}'
```

### Environment Variables

Source: https://docs.openclaw.ai/gateway/configuration

```json
{
  "env": {
    "OPENROUTER_API_KEY": "sk-or-..."
  }
}
```

### Advanced Agent Configuration

Source: https://docs.openclaw.ai/start/openclaw

```json
{
  "logging": {
    "level": "info"
  },
  "agent": {
    "model": "anthropic/claude-opus-4-6",
    "workspace": "~/.openclaw/workspace",
    "thinkingDefault": "high",
    "timeoutSeconds": 1800,
    "heartbeat": {
      "every": "0m"
    }
  },
  "channels": {
    "whatsapp": {
      "allowFrom": ["+15555550123"],
      "groups": {
        "*": {
          "requireMention": true
        }
      }
    }
  },
  "routing": {
    "groupChat": {
      "mentionPatterns": ["@openclaw", "openclaw"]
    }
  },
  "session": {
    "scope": "per-sender",
    "resetTriggers": ["/new", "/reset"],
    "reset": {
      "mode": "daily",
      "atHour": 4,
      "idleMinutes": 10080
    }
  }
}
```

---

## Additional Resources

- [OpenClaw Documentation](https://docs.openclaw.ai)
- [OpenClaw Community](https://discord.com/invite/clawd)
- [Find New Skills](https://clawhub.com)
