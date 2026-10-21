import os
import sys

# Ensure backend directory is in sys.path regardless of working directory
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import Base, engine, SessionLocal
import models
from routers import auth, events, dashboard, db_inspector
import seed

RETENTION_DAYS = 30


def purge_old_events():
    """Privacy: delete login events older than the retention window."""
    db = SessionLocal()
    try:
        cutoff = (datetime.now(timezone.utc) - timedelta(days=RETENTION_DAYS)).replace(tzinfo=None)
        db.query(models.LoginEvent).filter(models.LoginEvent.created_at < cutoff).delete()
        db.commit()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables
    Base.metadata.create_all(bind=engine)
    purge_old_events()
    # Ensure baseline data is seeded
    db = SessionLocal()
    try:
        seed.seed_database(db, wipe=False)
    finally:
        db.close()
    yield


app = FastAPI(
    title="PS05 Adaptive Authentication & Risk Scoring Gateway",
    description="Adaptive Authentication and Suspicious Login Detection Gateway (Team Dignitas)",
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS for local Vite development and frontend apps
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.responses import RedirectResponse

# Include Routers
app.include_router(auth.router)
app.include_router(events.router)
app.include_router(dashboard.router)
app.include_router(db_inspector.router)


@app.get("/api/health")
def health():
    return {"status": "ok", "project": "ps05-adaptive-auth"}


from fastapi.responses import HTMLResponse, RedirectResponse

# ========================================================
# Frontend Static Files & Multi-Environment Resolution
# ========================================================
def find_static_dir(target_name: str) -> str | None:
    """Locate static assets across multiple deployment structures (root, backend-only, docker, vercel)."""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    candidates = [
        # 1. Inside backend/static (self-contained within backend directory)
        os.path.join(current_dir, "static", target_name),
        # 2. Inside backend/frontend
        os.path.join(current_dir, "frontend", target_name),
        # 3. In parent frontend directory (standard repo root checkout)
        os.path.abspath(os.path.join(current_dir, "..", "frontend", target_name)),
        # 4. In current working directory
        os.path.abspath(os.path.join(os.getcwd(), "backend", "static", target_name)),
        os.path.abspath(os.path.join(os.getcwd(), "static", target_name)),
        os.path.abspath(os.path.join(os.getcwd(), "frontend", target_name)),
        # 5. Container & Cloud standard absolute paths
        f"/app/backend/static/{target_name}",
        f"/app/frontend/{target_name}",
        f"/opt/render/project/src/frontend/{target_name}",
        f"/opt/render/project/src/backend/static/{target_name}",
        f"/var/task/backend/static/{target_name}",
        f"/var/task/static/{target_name}",
    ]
    for c in candidates:
        if os.path.isdir(c) and os.path.exists(os.path.join(c, "index.html")):
            return c
    return None


landing_dir = find_static_dir("landing")
dashboard_dir = find_static_dir("dashboard")

# Mount Dashboard (Interactive Gateway & SOC Feed)
if dashboard_dir:
    app.mount("/dashboard", StaticFiles(directory=dashboard_dir, html=True), name="dashboard")


@app.get("/dashboard")
def redirect_dashboard():
    """Ensure accessing /dashboard without trailing slash cleanly opens the dashboard."""
    return RedirectResponse(url="/dashboard/", status_code=302)


# Mount Landing Page (PS05 Product & Solution Showcase)
if landing_dir:
    app.mount("/landing", StaticFiles(directory=landing_dir, html=True), name="landing")


@app.get("/landing")
def redirect_landing():
    """Ensure accessing /landing without trailing slash cleanly opens the landing page."""
    return RedirectResponse(url="/landing/", status_code=302)


FALLBACK_GATEWAY_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DIGNITAS — PS05 Adaptive Authentication Gateway</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: radial-gradient(ellipse at 50% 20%, #0d1527 0%, #060913 100%);
      color: #e2e8f0;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.35);
      border-radius: 9999px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: #34d399;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 10px #10b981;
      animation: pulse 1.8s infinite;
    }
    @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.85); } }
    .card {
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(148, 163, 184, 0.15);
      backdrop-filter: blur(16px);
      border-radius: 20px;
      padding: 40px;
      max-width: 680px;
      width: 100%;
      text-align: center;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(99, 102, 241, 0.12);
    }
    h1 {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.03em;
      margin-bottom: 12px;
      background: linear-gradient(135deg, #ffffff 30%, #94a3b8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p.desc {
      color: #94a3b8;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 32px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 14px;
      margin-bottom: 28px;
    }
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 14px 20px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      transition: all 0.2s ease;
    }
    .btn-primary {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: #ffffff;
      box-shadow: 0 4px 18px rgba(99, 102, 241, 0.4);
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(99, 102, 241, 0.6);
    }
    .btn-sec {
      background: rgba(30, 41, 59, 0.85);
      border: 1px solid rgba(148, 163, 184, 0.2);
      color: #e2e8f0;
    }
    .btn-sec:hover {
      background: rgba(51, 65, 85, 0.95);
      border-color: rgba(148, 163, 184, 0.4);
      transform: translateY(-2px);
    }
    .footer-stat {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: #64748b;
      margin-top: 8px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">
      <span class="pulse-dot"></span>
      FASTAPI GATEWAY ENGINE ONLINE
    </div>
    <h1>DIGNITAS PS05</h1>
    <p class="desc">
      Adaptive Authentication & Suspicious Login Detection Gateway is active.
      All endpoints, SQLite ACID database, and security heuristics are running.
    </p>
    <div class="grid">
      <a href="/landing/" class="btn btn-primary">
        🚀 Open Solution Showcase
      </a>
      <a href="/dashboard/" class="btn btn-primary" style="background: linear-gradient(135deg, #0ea5e9, #0284c7); box-shadow: 0 4px 18px rgba(14, 165, 233, 0.4);">
        🛡️ Live Gateway & SOC Feed
      </a>
      <a href="/docs" class="btn btn-sec">
        📖 Interactive OpenAPI Docs
      </a>
      <a href="/api/health" class="btn btn-sec">
        ⚡ Gateway Healthcheck
      </a>
    </div>
    <div class="footer-stat">
      Team Dignitas • PS05 Sub-10ms Risk Scoring Gateway
    </div>
  </div>
</body>
</html>
"""


@app.get("/", response_class=HTMLResponse)
def root():
    """Default root endpoint: opens landing showcase if available, else interactive dashboard, or portal."""
    if landing_dir and os.path.exists(os.path.join(landing_dir, "index.html")):
        return RedirectResponse(url="/landing/", status_code=302)
    elif dashboard_dir and os.path.exists(os.path.join(dashboard_dir, "index.html")):
        return RedirectResponse(url="/dashboard/", status_code=302)
    return HTMLResponse(content=FALLBACK_GATEWAY_HTML)


@app.get("/api")
def api_root():
    """Provides a clear directory of all available endpoints for judges and API clients."""
    return {
        "project": "DIGNITAS PS05 Adaptive Authentication Gateway",
        "team": "Dignitas",
        "status": "online",
        "documentation": {
            "swagger_ui": "/docs",
            "redoc": "/redoc",
            "openapi_json": "/openapi.json",
        },
        "web_interfaces": {
            "landing_showcase": "/landing/",
            "solution_gateway": "/dashboard/",
            "soc_threat_ledger": "/dashboard/soc.html",
        },
        "endpoints": {
            "health": "/api/health",
            "auth_login": "/api/auth/login",
            "auth_register": "/api/auth/register",
            "verify_stepup": "/api/verify-stepup",
            "verify_prompt": "/api/verify-prompt",
            "dashboard_events": "/api/dashboard/events",
            "dashboard_stats": "/api/dashboard/stats",
            "db_status": "/api/db/status",
        },
    }