import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";
import { appendFileSync, writeFileSync } from "fs";

const DEPLOY_LOG = "/tmp/deploy_log.txt";

// ── Docker spin-up ─────────────────────────────────────────
function dockerCreate(name: string, image: string, port: number, env: Record<string, string> = {}) {
  const envArgs = Object.entries(env).map(([k, v]) => `-e ${k}=${v}`).join(" ");
  const cmd = `docker run -d --name ${name} --restart unless-stopped ${envArgs} -p ${port}:3000 ${image}`;
  try {
    execSync(cmd, { stdio: "pipe" });
    return { success: true, container: name, port };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ── Nginx reverse proxy ─────────────────────────────────────
function nginxProxy(subdomain: string, targetPort: number) {
  const confPath = `/etc/nginx/sites-available/${subdomain}`;
  const conf = `server {
  listen 80;
  server_name ${subdomain}.peachyseo.com;

  location / {
    proxy_pass http://localhost:${targetPort};
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_cache_bypass $http_upgrade;
  }
}`;
  writeFileSync(confPath, conf);
  try {
    execSync(`ln -sf ${confPath} /etc/nginx/sites-enabled/${subdomain} && nginx -t`, { stdio: "pipe" });
    execSync("nginx -s reload", { stdio: "pipe" });
    return { success: true, conf: confPath };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ── acme.sh SSL (replaces certbot) ──────────────────────────
function letsEncryptSSL(subdomain: string) {
  const domain = `${subdomain}.peachyseo.com`;

  try {
    // Issue certificate — standalone mode (needs port 80 free)
    execSync(
      `~/.acme.sh/acme.sh --standalone --domain "${domain}" --force --keylength 2048 --log /tmp/acme.log`,
      { stdio: "pipe", timeout: 120 }
    );
  } catch {
    return {
      success: false,
      error: "acme.sh failed — ensure DNS A record points to this server and port 80 is free",
      note: "Run manually: ~/.acme.sh/acme.sh --standalone --domain yourdomain.com",
    };
  }

  // Install cert to standard nginx paths
  try {
    execSync(
      `~/.acme.sh/acme.sh --install-cert --domain "${domain}" \
        --key-file /etc/ssl/private/${subdomain}.key \
        --fullchain-file /etc/ssl/certs/${subdomain}.crt \
        --reloadcmd "nginx -s reload"`,
      { stdio: "pipe", timeout: 30 }
    );
  } catch {
    // Fallback: create directories and symlinks manually
    try {
      execSync(`mkdir -p /etc/ssl/private /etc/ssl/certs`, { stdio: "pipe" });
      execSync(`ln -sf ~/.acme.sh/${domain}/fullchain.cer /etc/ssl/certs/${subdomain}.crt`, { stdio: "pipe" });
      execSync(`ln -sf ~/.acme.sh/${domain}/${domain}.key /etc/ssl/private/${subdomain}.key`, { stdio: "pipe" });
    } catch { /* non-fatal */ }
  }

  // Write HTTPS nginx conf
  const conf = `server {
  listen 80;
  server_name ${domain};
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl http2;
  server_name ${domain};

  ssl_certificate /etc/ssl/certs/${subdomain}.crt;
  ssl_certificate_key /etc/ssl/private/${subdomain}.key;

  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_cache_bypass $http_upgrade;
  }
}`;
  writeFileSync(`/etc/nginx/sites-available/${subdomain}`, conf);
  try {
    execSync(`ln -sf /etc/nginx/sites-available/${subdomain} /etc/nginx/sites-enabled/${subdomain}`, { stdio: "pipe" });
    execSync("nginx -t && nginx -s reload", { stdio: "pipe" });
    return { success: true, domain };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ── Main dispatch ───────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { action, name, image, port, subdomain, env } = await req.json();
    const result: any = { action, ts: new Date().toISOString() };

    switch (action) {
      case "docker:start":
        Object.assign(result, dockerCreate(name, image, port, env || {}));
        break;

      case "docker:stop":
        try {
          execSync(`docker stop ${name} && docker rm ${name}`, { stdio: "pipe" });
          Object.assign(result, { success: true, container: name, action: "stopped" });
        } catch (err: any) {
          Object.assign(result, { success: false, error: err.message });
        }
        break;

      case "nginx:proxy":
        Object.assign(result, nginxProxy(subdomain, port));
        break;

      case "ssl:cert":
        Object.assign(result, letsEncryptSSL(subdomain));
        break;

      case "deploy:full": {
        const docker = dockerCreate(name, image, port, env || {});
        if (!docker.success) return NextResponse.json({ ...result, docker }, { status: 500 });
        const nginx = nginxProxy(subdomain, port);
        const ssl = letsEncryptSSL(subdomain);
        Object.assign(result, { docker, nginx, ssl });
        break;
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

    appendFileSync(DEPLOY_LOG, `[${result.ts}] ${JSON.stringify(result)}\n`);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const containers = execSync("docker ps --format '{{.Names}} {{.Status}} {{.Ports}}' 2>/dev/null || echo ''", { encoding: "utf-8" });
    return NextResponse.json({ containers: containers.trim().split("\n").filter(Boolean) });
  } catch {
    return NextResponse.json({ containers: [], error: "Docker not available" });
  }
}
