"""
Database configuration and session management.

This module sets up the SQLModel engine and provides session management
for the application. We use dependency injection to provide database
sessions to our API endpoints.
"""

from typing import Generator
from sqlmodel import create_engine, Session, SQLModel
from app.core.config import settings


# Create engine with connection pooling
# echo=True is useful for development to see SQL queries
engine = create_engine(
    str(settings.database_url),
    echo=False,  # Set to True in development to see SQL queries
    pool_pre_ping=True,  # Verify connections before using them
    pool_size=5,  # Number of connections to maintain
    max_overflow=10,  # Maximum overflow connections
)


def create_db_and_tables() -> None:
    """
    Create all database tables.
    
    This should be called at application startup. In production,
    you'd typically use Alembic migrations instead.
    """
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """
    Dependency for getting database sessions.
    
    This generator ensures that the session is properly closed
    after each request, even if an exception occurs.
    
    Usage:
        @app.get("/items")
        def get_items(session: Session = Depends(get_session)):
            # Use session here
            pass
    """
    with Session(engine) as session:
        yield session
