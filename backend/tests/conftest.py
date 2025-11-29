# tests/conftest.py

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from src.database import Base, get_db
from src.main import create_app

# ใช้ SQLite แยกสำหรับ test โดยเฉพาะ
TEST_DATABASE_URL = "sqlite:///./test_vending.db"

engine = create_engine(
    TEST_DATABASE_URL,
    future=True,
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function")
def client():
    """
    สร้างตารางใหม่ทุก test (clean slate)
    แล้วให้ TestClient ใช้ DB ตัวนี้แทน Postgres จริง
    """
    # reset schema
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    app = create_app()
    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as c:
        yield c

    app.dependency_overrides.clear()
