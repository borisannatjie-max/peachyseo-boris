# Tech Stack — Boris Command Center

## Installed Components

| Component | Version | Status |
|-----------|---------|--------|
| Next.js (App Router) | 15.5.14 | ✅ Running via PM2 |
| React | 19.2.4 | ✅ |
| Tailwind CSS | 4.2.2 | ✅ |
| Socket.io | 4.x | ✅ |
| Supabase CLI | 2.8.1 | ✅ (manual install) |
| PM2 | 6.0.14 | ✅ Running |

## Real-time Server
- Port: 3001
- Provides live agent log streaming to dashboard clients
- Socket.io channel: `agent:log`

## Supabase
- CLI installed at `/usr/local/bin/supabase`
- Local dev: `supabase init` (requires Docker for local instance)
- Production: Use `@supabase/supabase-js` client with remote project URL + key

## Running
```bash
pm2 start ecosystem.config.js   # Dashboard on :3000
node realtime-server.js         # Real-time on :3001
```

## Todo
- [ ] Connect Supabase project (needs project URL + anon key)
- [ ] Configure Pusher (or use built-in Socket.io)
- [ ] Deploy to production host
