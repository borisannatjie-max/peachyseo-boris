#!/usr/bin/env python3
"""
Batch email scraper using agent-browser.
Opens each website, gets snapshot, extracts emails.
"""
import csv
import re
import subprocess
import time
import json
import sys
import os

EMAIL_REGEX = r'[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}'

def run_agent_cmd(cmd_args, timeout=25):
    """Run an agent-browser command and return stdout"""
    env = os.environ.copy()
    env['DISPLAY'] = ':99'
    try:
        result = subprocess.run(
            ['agent-browser'] + cmd_args,
            capture_output=True, text=True, timeout=timeout,
            env=env
        )
        return result.stdout
    except subprocess.TimeoutExpired:
        return ''
    except Exception as e:
        return ''

def extract_emails(text):
    """Extract unique valid emails from text"""
    emails = re.findall(EMAIL_REGEX, text)
    filtered = []
    skip_patterns = ['noreply', 'no-reply', 'example', 'domain.com', 'test@', 
                     'localhost', 'placeholder', 'notset', 'your@']
    for email in emails:
        email_lower = email.lower()
        if any(skip in email_lower for skip in skip_patterns):
            continue
        # Must have at least one dot in domain
        domain = email.split('@')[1] if '@' in email else ''
        if '.' not in domain:
            continue
        if email not in filtered:
            filtered.append(email)
    return filtered

def scrape_website(url, max_pages=3):
    """Scrape emails from a website homepage + contact pages"""
    if not url or not url.strip():
        return []
    
    url = url.strip()
    if not url.startswith('http'):
        url = 'https://' + url
    url = url.rstrip('/')
    
    all_emails = []
    pages_to_try = [url]
    
    # Add contact page variants
    contact_variants = ['/contact', '/contact-us', '/about', '/about-us', '/get-in-touch', '/contact-us/']
    for variant in contact_variants:
        if len(all_emails) >= 1:
            break
        pages_to_try.append(url + variant)
    
    pages_to_try = pages_to_try[:max_pages]
    
    for page_url in pages_to_try:
        if len(all_emails) >= 1:
            break
        
        # Open the page
        output = run_agent_cmd(['open', page_url], timeout=20)
        time.sleep(2)  # Wait for page to load
        
        # Get snapshot as JSON
        output = run_agent_cmd(['snapshot', '-i', '--json'], timeout=30)
        
        if output:
            try:
                data = json.loads(output)
                if data.get('success') and data.get('data'):
                    # Get text from snapshot
                    snapshot_text = data['data'].get('snapshot', '')
                    page_emails = extract_emails(snapshot_text)
                    for email in page_emails:
                        if email not in all_emails:
                            all_emails.append(email)
            except json.JSONDecodeError:
                # Not JSON, might be plain text - try to extract emails anyway
                page_emails = extract_emails(output)
                for email in page_emails:
                    if email not in all_emails:
                        all_emails.append(email)
    
    return all_emails

def main():
    input_file = '/root/.openclaw/workspace/peachyseo-coming-soon/Prospect_List_500.csv'
    output_file = '/root/.openclaw/workspace/peachyseo-coming-soon/Prospect_List_500_with_emails.csv'
    
    # Read CSV
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames + ['Email_Found']
        rows = list(reader)
    
    total = len(rows)
    print(f"Processing {total} businesses...")
    
    # Initialize browser
    print("Initializing browser...")
    run_agent_cmd(['open', 'about:blank'], timeout=10)
    time.sleep(1)
    
    results = []
    emails_found = 0
    processed = 0
    
    for i, row in enumerate(rows):
        website = row.get('Website', '').strip()
        existing_email = row.get('Email', '').strip()
        
        # Skip if no website
        if not website:
            row['Email_Found'] = 'NONE'
            results.append(row)
            continue
        
        # Use existing email if available
        if existing_email:
            row['Email_Found'] = existing_email
            emails_found += 1
            results.append(row)
            processed += 1
            if processed % 20 == 0:
                print(f"Progress: {processed}/{total} (emails found: {emails_found})")
            continue
        
        # Scrape the website
        processed += 1
        business_name = row.get('Business Name', 'Unknown')
        
        if processed % 5 == 0:
            print(f"[{processed}/{total}] {business_name}: {website}")
        
        emails = scrape_website(website)
        
        if emails:
            row['Email_Found'] = emails[0]
            emails_found += 1
            print(f"  FOUND: {emails[0]}")
        else:
            row['Email_Found'] = 'NONE'
        
        results.append(row)
        
        # Rate limit
        time.sleep(0.5)
        
        if processed % 20 == 0:
            print(f"Progress: {processed}/{total} (emails found: {emails_found})")
    
    # Write output CSV
    with open(output_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(results)
    
    print(f"\n=== DONE ===")
    print(f"Total processed: {processed}")
    print(f"Emails found: {emails_found}")
    print(f"Output: {output_file}")

if __name__ == '__main__':
    main()
