#!/usr/bin/env python3
import csv
import re
import subprocess
import time
import sys

EMAIL_REGEX = r'[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}'

def get_snapshot_text():
    """Get page content via agent-browser snapshot"""
    try:
        result = subprocess.run(
            ['DISPLAY=:99', 'agent-browser', 'snapshot', '-i', '--json'],
            capture_output=True, text=True, timeout=30,
            env={'DISPLAY': ':99', 'PATH': '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'}
        )
        if result.returncode == 0:
            return result.stdout
        return ''
    except Exception as e:
        return ''

def extract_emails(text):
    """Extract unique emails from text"""
    emails = re.findall(EMAIL_REGEX, text)
    # Filter out common non-contact emails
    filtered = []
    for email in emails:
        email_lower = email.lower()
        if any(skip in email_lower for skip in ['noreply', 'no-reply', 'example', 'domain.com', 'test@']):
            continue
        if email not in filtered:
            filtered.append(email)
    return filtered

def process_website(url, browser_session):
    """Process a single website - homepage + contact page"""
    # Clean URL
    if not url.startswith('http'):
        url = 'https://' + url
    url = url.rstrip('/')
    
    emails = []
    pages_to_try = [url, url + '/contact', url + '/contact-us', url + '/about', url + '/about-us']
    
    for page_url in pages_to_try:
        if len(emails) >= 1:  # Stop if we found an email
            break
        
        try:
            # Open page
            proc = subprocess.run(
                ['bash', '-c', f'DISPLAY=:99 agent-browser open "{page_url}"'],
                capture_output=True, text=True, timeout=20,
                env={'DISPLAY': ':99', 'PATH': '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'}
            )
            time.sleep(2)  # Wait for page load
            
            # Get snapshot
            snapshot = subprocess.run(
                ['bash', '-c', 'DISPLAY=:99 agent-browser snapshot -i --json'],
                capture_output=True, text=True, timeout=30,
                env={'DISPLAY': ':99', 'PATH': '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'}
            )
            
            if snapshot.stdout:
                page_emails = extract_emails(snapshot.stdout)
                for email in page_emails:
                    if email not in emails:
                        emails.append(email)
                        
        except Exception as e:
            continue
    
    return emails

def main():
    input_file = '/root/.openclaw/workspace/peachyseo-coming-soon/Prospect_List_500.csv'
    output_file = '/root/.openclaw/workspace/peachyseo-coming-soon/Prospect_List_500_with_emails.csv'
    
    # Read CSV
    rows = []
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames + ['Email_Found']
        for row in reader:
            rows.append(row)
    
    print(f"Processing {len(rows)} businesses...")
    
    # Process each business with a website
    results = []
    processed = 0
    emails_found = 0
    
    for row in rows:
        website = row.get('Website', '').strip()
        
        if not website:
            row['Email_Found'] = 'NONE'
            results.append(row)
            continue
        
        # Check if already has email in CSV
        existing_email = row.get('Email', '').strip()
        if existing_email:
            row['Email_Found'] = existing_email
            emails_found += 1
            results.append(row)
            processed += 1
            print(f"[{processed}/{len(rows)}] {row['Business Name']}: Already has email: {existing_email}")
            continue
        
        # Try to scrape email
        print(f"[{processed+1}/{len(rows)}] Scraping {website}...")
        try:
            emails = process_website(website, None)
            if emails:
                row['Email_Found'] = emails[0]  # Take first found email
                emails_found += 1
                print(f"  -> Found: {emails[0]}")
            else:
                row['Email_Found'] = 'NONE'
                print(f"  -> No email found")
        except Exception as e:
            row['Email_Found'] = 'FAILED'
            print(f"  -> Failed: {e}")
        
        results.append(row)
        processed += 1
        
        # Rate limit - don't overwhelm
        time.sleep(1)
    
    # Write output CSV
    with open(output_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(results)
    
    print(f"\nDone! Found {emails_found} emails out of {len(rows)} businesses")
    print(f"Output saved to: {output_file}")

if __name__ == '__main__':
    main()
