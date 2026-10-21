# DIGNITAS PS05: Complete Deployment Guide

This guide covers all deployment options for **DIGNITAS (PS05 Adaptive Authentication & Threat Intelligence Gateway)**.

---

## Architecture Overview
DIGNITAS is architected as a self-contained, unified full-stack system:
- **FastAPI Engine**: Serves the REST API (`/api/...`), OpenAPI Documentation (`/docs`), and SQLite ACID database.
- **Embedded Web Frontends**: Serves both the **Overview & Problem Statement Showcase** (`/landing/`) and the **Interactive Threat Gateway & SOC Feed** (`/dashboard/`).
- **Zero Separate Frontend Build Required**: All static assets, CSS, and JS run natively without requiring `npm run build` in production.

---

## Option 1: Instant Local / LAN Demo (Best for Hackathon Judges)

Run the server bound to `0.0.0.0` so judges and team members on the same Wi-Fi network can access the live gateway from their own smartphones, tablets, or laptops.

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies (if not already installed)
pip install -r requirements.txt

# 3. Start the gateway on port 8000
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### Access URLs:
- **From Host Laptop**:
  - Overview Site: `http://localhost:8000/landing/`
  - Solution Gateway: `http://localhost:8000/dashboard/`
  - SOC Threat Ledger: `http://localhost:8000/dashboard/soc.html`
- **From Judge's Phone / Other Laptops (Same Wi-Fi)**:
  - Find your Wi-Fi IP (Run `ipconfig` on Windows or `ifconfig` on Mac/Linux). E.g., `192.168.1.45`.
  - Open: `http://192.168.1.45:8000/dashboard/`

---

## Option 2: Docker Containerization (1-Command Run)

### Using Docker Compose:
```bash
# Build and run container in background
docker compose up -d

# Verify container health
docker ps
```

### Using Raw Docker CLI:
```bash
# Build image
docker build -t dignitas-ps05 .

# Run container on port 8000
docker run -d -p 8000:8000 --name dignitas dignitas-ps05
```

Test health: `curl http://localhost:8000/api/health`

---

## Option 3: Free Serverless Deployment (Vercel)

You can deploy DIGNITAS directly to Vercel in 60 seconds with zero server management:

### Method A: Deploying from the Repository Root (Recommended)
1. In Vercel, click **Add New... > Project** and import `ps05-adaptive-auth` (or your fork).
2. Keep **Root Directory** as `./` (default).
3. Framework Preset: **Other**.
4. Click **Deploy**. Vercel will automatically read `vercel.json`, route API traffic to `api/index.py`, and serve the static landing page and interactive gateway.

### Method B: Deploying with Root Directory set to `backend`
If you imported only the `backend` folder on Vercel:
1. In Vercel Project Settings, **Root Directory** is set to `backend`.
2. Vercel reads `backend/vercel.json` and runs `backend/api/index.py`.
3. The embedded frontend inside `backend/static/` automatically serves `/landing/` and `/dashboard/`.
4. The root `/` cleanly opens the landing showcase without any 404 error.

---

## Option 4: Free Cloud Deployment (Render.com)

1. Fork or push your repo to GitHub: `https://github.com/LinsJM/ps05-adaptive-auth`
2. Go to [Render.com](https://render.com) and click **New + > Web Service**.
3. Connect your GitHub repository.
4. Set the following settings (or Render will auto-detect from `render.yaml`):
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt || pip install -r backend/requirements.txt`
   - **Start Command**: `python -c "import os; os.chdir('backend') if os.path.isdir('backend') else None; import uvicorn; uvicorn.run('main:app', host='0.0.0.0', port=int(os.getenv('PORT', 8000)))"`
   - **Health Check Path**: `/api/health`
5. Click **Create Web Service**. Your app will be live in ~2 minutes!

---

## Option 5: Cloud Deployment (Railway.app / Fly.io)

### Railway:
1. Go to [Railway.app](https://railway.app), click **New Project > Deploy from GitHub repo**.
2. Select `LinsJM/ps05-adaptive-auth`.
3. Railway automatically detects the `Dockerfile` and builds the production container.
4. Add a public domain under service settings.

### Fly.io:
```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Launch app using Dockerfile
fly launch --name dignitas-ps05
fly deploy
```

---

## Option 5: Production Linux VPS (Ubuntu / Debian / AWS EC2)

```bash
# 1. Update system & clone
sudo apt update && sudo apt install -y python3-pip python3-venv git nginx

git clone https://github.com/LinsJM/ps05-adaptive-auth.git /var/www/dignitas
cd /var/www/dignitas

# 2. Setup Virtual Environment
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt

# 3. Setup Systemd Service
sudo bash -c 'cat > /etc/systemd/system/dignitas.service << EOF
[Unit]
Description=Dignitas PS05 Adaptive Auth Gateway
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/var/www/dignitas/backend
ExecStart=/var/www/dignitas/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000 --workers 4
Restart=always

[Install]
WantedBy=multi-user.target
EOF'

sudo systemctl daemon-reload
sudo systemctl enable --now dignitas

# 4. Nginx Reverse Proxy
sudo bash -c 'cat > /etc/nginx/sites-available/dignitas << EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF'

sudo ln -s /etc/nginx/sites-available/dignitas /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx
```
