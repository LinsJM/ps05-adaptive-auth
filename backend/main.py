import os
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import Base, engine, SessionLocal
import models
from routers import auth, events, dashboard
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

# Include Routers
app.include_router(auth.router)
app.include_router(events.router)
app.include_router(dashboard.router)


@app.get("/api/health")
def health():
    return {"status": "ok", "project": "ps05-adaptive-auth"}


# Serve static frontend application
frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))
if os.path.exists(os.path.join(frontend_dir, "index.html")):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")