#!/bin/bash
# Boris Command Center - Automated Deployment Script
# Version: 1.0.0

set -e

DASHBOARD_DIR="/root/.openclaw/workspace/dashboard"
APP_NAME="boris-dashboard"
PORT=3000

echo "🚀 Boris Command Center Deployment v1.0.0"
echo "=========================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "⚠️  Please run as root (use sudo)"
  exit 1
fi

# Navigate to dashboard directory
cd "$DASHBOARD_DIR" || {
  echo "❌ Dashboard directory not found: $DASHBOARD_DIR"
  echo "   Please copy dashboard files first:"
  echo "   scp -r dashboard root@YOUR_SERVER:$DASHBOARD_DIR"
  exit 1
}

echo "📁 Working in: $(pwd)"

# Check Node.js version
NODE_VERSION=$(node -v 2>/dev/null | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js 18+ required. Current: $(node -v)"
  exit 1
fi
echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build Next.js (optional, can use dev mode)
# npm run build

# Configure PM2
echo "⚙️  Configuring PM2..."

# Stop existing instance if running
pm2 stop "$APP_NAME" 2>/dev/null || true
pm2 delete "$APP_NAME" 2>/dev/null || true

# Start the dashboard
echo "🚀 Starting dashboard..."
pm2 start ecosystem.config.js --env production

# Wait a moment for startup
sleep 2

# Check status
pm2_status=$(pm2 list | grep "$APP_NAME" | awk '{print $10}')
if [ "$pm2_status" == "online" ]; then
  echo "✅ Dashboard is ONLINE"
else
  echo "⚠️  Dashboard status: $pm2_status"
  echo "   Check logs: pm2 logs $APP_NAME"
fi

# Open firewall
echo "🔥 Configuring firewall..."
ufw allow $PORT/tcp 2>/dev/null || echo "   (ufw not available or already configured)"

echo ""
echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "📍 Dashboard URL: http://$(hostname -I | awk '{print $1}'):$PORT"
echo ""
echo "PM2 Commands:"
echo "  pm2 logs $APP_NAME     - View logs"
echo "  pm2 restart $APP_NAME  - Restart"
echo "  pm2 stop $APP_NAME     - Stop"
echo ""
