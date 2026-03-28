#!/bin/bash
# PDF Generator — Boris Command Center
# Usage: ./pdf-generator.sh <folder_path> <output_name>

set -e

FOLDER="$1"
OUTPUT_NAME="$2"
OUTPUT_DIR="/root/.openclaw/workspace/vault/pdfs"
TIMESTAMP=$(date +%Y-%m-%d_%H%M)

mkdir -p "$OUTPUT_DIR"

if [ -z "$FOLDER" ]; then
  echo "Usage: pdf-generator.sh <folder_path> [output_name]"
  exit 1
fi

# Compile markdown files into a single HTML document
HTML_OUT="/tmp/report_${TIMESTAMP}.html"
PDF_OUT="${OUTPUT_DIR}/${OUTPUT_NAME:-report_${TIMESTAMP}}.pdf"

# Header
cat > "$HTML_OUT" << 'HEADER'
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #1a1a1a; }
    h1 { color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px; }
    h2 { color: #2563eb; margin-top: 30px; }
    h3 { color: #4b5563; }
    pre { background: #f3f4f6; padding: 15px; border-radius: 8px; overflow-x: auto; }
    code { font-family: monospace; font-size: 13px; }
    .meta { color: #6b7280; font-size: 13px; margin-bottom: 30px; }
    table { border-collapse: collapse; width: 100%; margin: 20px 0; }
    th, td { border: 1px solid #e5e7eb; padding: 10px; text-align: left; }
    th { background: #f9fafb; }
  </style>
</head>
<body>
HEADER

# Generate table of contents and content
echo "<h1>Project Report</h1>" >> "$HTML_OUT"
echo "<div class='meta'>Generated: $(date) | Source: $FOLDER</div>" >> "$HTML_OUT"

INDEX=0
for file in $(find "$FOLDER" -type f \( -name "*.md" -o -name "*.txt" -o -name "*.json" \) 2>/dev/null | sort); do
  FILENAME=$(basename "$file")
  echo "<h2>${FILENAME}</h2>" >> "$HTML_OUT"
  echo "<pre><code>$(cat "$file" | sed 's/</\&lt;/g' | sed 's/>/\&gt;/g')</code></pre>" >> "$HTML_OUT"
  INDEX=$((INDEX + 1))
done

echo "</body></html>" >> "$HTML_OUT"

# Convert to PDF
wkhtmltopdf --enable-local-file-access --page-size A4 "$HTML_OUT" "$PDF_OUT" 2>/dev/null

rm -f "$HTML_OUT"

echo "PDF generated: $PDF_OUT"
