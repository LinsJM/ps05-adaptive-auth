from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

import os

env_db_url = os.getenv("DATABASE_URL")
if not env_db_url:
    # Check if running in Vercel or serverless environment with read-only root
    if os.getenv("VERCEL") or os.getenv("VERCEL_ENV") or os.getenv("AWS_LAMBDA_FUNCTION_NAME"):
        tmp_db = "/tmp/adaptive_auth.db"
        backend_dir = os.path.dirname(os.path.abspath(__file__))
        source_db = os.path.join(backend_dir, "adaptive_auth.db")
        if not os.path.exists(source_db):
            base_dir = os.path.dirname(backend_dir)
            source_db = os.path.join(base_dir, "adaptive_auth.db")
        if os.path.exists(source_db) and not os.path.exists(tmp_db):
            import shutil
            try:
                shutil.copy2(source_db, tmp_db)
            except Exception:
                pass
        DATABASE_URL = f"sqlite:///{tmp_db}"
    else:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        db_path = os.path.join(base_dir, "adaptive_auth.db")
        DATABASE_URL = f"sqlite:///{db_path.replace(os.sep, '/')}"
else:
    DATABASE_URL = env_db_url

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()