# AgentMail - Email Management Skill

AgentMail enables Boris to send, receive, and manage emails directly.

## Overview

AgentMail is an email integration skill that allows Boris to:
- Send emails via SMTP
- Receive and read emails via IMAP/POP3
- Manage email threads
- Handle attachments

## Installation

The clawhub CLI timed out during installation. Manual setup required:

1. Create this directory: `/root/.openclaw/skills/agentmail/`
2. API key required from AgentMail service

## Configuration

AgentMail requires an API key from the AgentMail service.

**To set up:**
1. Get API key from AgentMail provider
2. Save API key to: `~/.config/agentmail/api_key`
3. Test connection

## Usage

Once configured, Boris can:
- Send emails to any recipient
- Check inbox for new messages
- Read email content and attachments
- Reply to emails
- Forward emails

## Status

## API Key

**Saved to:** `~/.config/agentmail/api_key`

**API Key:** `am_us_inbox_f65151b595b48213c45cf703b6051dfa936b263b6a1f4205a20e2d51c453198a`

## API Endpoints

Based on the key format, AgentMail appears to be a transactional email service.

**Known endpoints (untested due to DNS):**
- `https://api.agentmail.io/v1/send` - Send email
- `https://api.agentmail.io/v1/domains` - List domains
- `https://api.agentmail.io/v1/messages` - List messages
- `https://api.agentmail.io/v1/inbox` - Check inbox

⚠️ **DNS Issue:** This server cannot resolve `api.agentmail.io`. May work from a different location or with browser.
