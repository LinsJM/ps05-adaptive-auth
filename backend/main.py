from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
import models  # noqa: F401  (registers the tables)
from routers import auth, events, devices
from datetime import datetime, timedelta, timezone
from database import SessionLocal


Base.metadata.create_all(bind=engine)

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


purge_old_events()

app = FastAPI(title="PS05 Adaptive Auth")
app.include_router(auth.router)
app.include_router(events.router)
app.include_router(devices.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok"}