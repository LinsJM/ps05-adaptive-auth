from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
import models  # noqa: F401  (registers the tables)
from routers import auth, events

Base.metadata.create_all(bind=engine)

app = FastAPI(title="PS05 Adaptive Auth")
app.include_router(auth.router)
app.include_router(events.router)

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