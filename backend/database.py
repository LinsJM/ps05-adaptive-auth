from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

import os

env_db_url = os.getenv("DATABASE_URL")
if not env_db_url:
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