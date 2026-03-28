#!/usr/bin/env python3
import imaplib
import email
from email.header import decode_header
from datetime import datetime, timezone
import json
import os
import sys

# Load config
CONFIG = {
    "server": "server801.web-hosting.com",
    "port": 993,
    "username": "hello@peachyseo.com",
    "password": "PeachyPassword9000",
    "state_file": "/root/.openclaw/workspace/scripts/.email_state.json"
}

def decode_str(s):
    if s is None:
        return ""
    parts = decode_header(s)
    result = []
    for part, enc in parts:
        if isinstance(part, bytes):
            # Handle unknown/odd encodings
            if enc and enc.lower() not in ("utf-8", "utf-8 Bom", "iso-8859-1", "windows-1252", "us-ascii"):
                try:
                    result.append(part.decode(enc, errors="replace"))
                except (LookupError, TypeError):
                    result.append(part.decode("latin-1", errors="replace"))
            else:
                result.append(part.decode(enc or "utf-8", errors="replace"))
        else:
            result.append(part)
    return "".join(result)

def get_body(msg):
    body = ""
    if msg.is_multipart():
        for part in msg.walk():
            ct = part.get_content_type()
            disp = str(part.get("Content-Disposition") or "")
            if ct == "text/plain" and "attachment" not in disp:
                body = part.get_payload(decode=True).decode("utf-8", errors="replace")
                break
    else:
        body = msg.get_payload(decode=True).decode("utf-8", errors="replace")
    return body[:500].strip()  # First 500 chars

def load_state():
    if os.path.exists(CONFIG["state_file"]):
        with open(CONFIG["state_file"]) as f:
            return json.load(f)
    return {"last_uid": None, "last_check": None}

def save_state(state):
    with open(CONFIG["state_file"], "w") as f:
        json.dump(state, f)

def main():
    state = load_state()
    last_uid = state.get("last_uid")
    last_check = state.get("last_check")

    try:
        mail = imaplib.IMAP4_SSL(CONFIG["server"], CONFIG["port"])
        mail.login(CONFIG["username"], CONFIG["password"])
        mail.select("INBOX")

        # Search for unseen emails
        status, messages = mail.search(None, "UNSEEN")
        if status != "OK":
            print("No messages found")
            return

        ids = messages[0].split()
        if not ids:
            print("No new emails")
            return

        new_emails = []
        for uid in ids:
            status, msg_data = mail.fetch(uid, "(RFC822)")
            if status != "OK":
                continue
            raw = email.message_from_bytes(msg_data[0][1])
            subject = decode_str(raw.get("Subject", "(no subject)"))
            sender = decode_str(raw.get("From", ""))
            date = raw.get("Date", "")
            body = get_body(raw)
            new_emails.append({
                "from": sender,
                "subject": subject,
                "date": date,
                "preview": body
            })

        if new_emails:
            # Update state
            state["last_uid"] = ids[-1].decode()
            state["last_check"] = datetime.now(timezone.utc).isoformat()
            save_state(state)

            # Output for the agent to pick up
            print(f"NEW_EMAILS:{len(new_emails)}")
            for i, e in enumerate(new_emails, 1):
                print(f"---EMAIL{i}---")
                print(f"FROM: {e['from']}")
                print(f"SUBJECT: {e['subject']}")
                print(f"DATE: {e['date']}")
                print(f"PREVIEW: {e['preview']}")
        else:
            print("No new emails")

        mail.logout()

    except Exception as ex:
        print(f"ERROR: {ex}")
        sys.exit(1)

if __name__ == "__main__":
    main()
