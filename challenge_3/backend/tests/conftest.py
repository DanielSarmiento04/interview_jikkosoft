"""
Test configuration and fixtures.
"""

import os
import pytest
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from fastapi.testclient import TestClient

# Set test environment variable before importing app
# Using same PostgreSQL connection as env.example.sh
os.environ["PG_CONNECTION_STRING"] = "postgresql://user:password@localhost:5432/library"

from app import app
from app.database import get_session


@pytest.fixture(name="session")
def session_fixture():
    """
    Create an in-memory SQLite database for testing.
    """
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    """
    Create a test client with overridden database session.
    """
    def get_session_override():
        return session
    
    app.dependency_overrides[get_session] = get_session_override
    
    client = TestClient(app)
    yield client
    
    app.dependency_overrides.clear()
