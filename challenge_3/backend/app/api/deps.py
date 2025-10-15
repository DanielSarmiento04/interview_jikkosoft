"""
API dependencies.

This module provides common dependencies for API routes,
such as database session injection.
"""

from typing import Generator
from sqlmodel import Session
from fastapi import Depends

from app.database import get_session
from app.services.library_service import LibraryService


def get_library_service(
    session: Session = Depends(get_session)
) -> LibraryService:
    """
    Dependency for getting LibraryService instance.
    
    Args:
        session: Database session
    
    Returns:
        LibraryService: Service instance
    """
    return LibraryService(session)
