"""
Library Management System - FastAPI Application

A comprehensive library management system with book inventory,
member management, and loan tracking capabilities.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.database import create_db_and_tables
from app.api import books, members, loans


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    
    This handles startup and shutdown events for the application.
    """
    # Startup: Create database tables
    create_db_and_tables()
    yield
    # Shutdown: Clean up resources if needed


# Create FastAPI application
app = FastAPI(
    title="Library Management System",
    description="A RESTful API for managing library operations including books, members, and loans",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(books.router, prefix="/api/v1")
app.include_router(members.router, prefix="/api/v1")
app.include_router(loans.router, prefix="/api/v1")


@app.get("/", tags=["root"])
def read_root():
    """
    Root endpoint providing API information.
    
    Returns:
        dict: API information
    """
    return {
        "name": "Library Management System API",
        "version": "1.0.0",
        "status": "active",
        "docs": "/docs",
        "redoc": "/redoc",
    }


@app.get("/health", tags=["health"])
def health_check():
    """
    Health check endpoint.
    
    Returns:
        dict: Health status
    """
    return {
        "status": "healthy",
        "database": str(settings.database_url).split("@")[-1],  # Hide credentials
    }