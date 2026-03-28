# peachyseo-boris

**Boris AI Agent** - OpenClaw workspace, skills, memory and configurations

## What's Backed Up

- `workspace/` - Boris's working directory (memory, AGENTS.md, SOUL.md, etc.)
- `skills/` - OpenClaw skills (boris-command-center, agentmail, etc.)
- `openclaw.json` - OpenClaw configuration

## ⚠️ Sensitive Files Excluded

The following are stored locally only (not pushed to GitHub):
- API keys and tokens
- SSH credentials
- `.env` files
- Database passwords

## Structure

```
peachyseo-boris/
├── README.md
├── .gitignore
├── openclaw.json          # OpenClaw config
├── skills/               # OpenClaw skills
│   ├── boris-command-center/   # Dashboard skill
│   └── agentmail/             # Email integration skill
└── workspace/            # Boris's workspace
    ├── AGENTS.md
    ├── SOUL.md
    ├── IDENTITY.md
    ├── USER.md
    ├── memory/           # Daily memory logs
    ├── skills/           # Installed skills
    └── ...
```

## Auto-Backup

This repo is set up for daily automatic commits via OpenClaw cron job.

---

*Backup powered by Boris 🤖*
