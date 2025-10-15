#!/bin/bash
# Environment variables for Library Management System

# Application Configuration
export APP_NAME="LIBRARY_MANAGEMENT_SYSTEM"

# Database Configuration (Docker PostgreSQL)
# Format: postgresql://username:password@host:port/database_name
export PG_CONNECTION_STRING="postgresql://user:password@localhost:5432/library"

# Development Settings
export DEBUG=true

# Run the application
echo "Starting Library Management System..."
echo "Database: $PG_CONNECTION_STRING"
echo "API Docs will be available at: http://localhost:8000/docs"
echo ""

uvicorn main:app --reload --host 0.0.0.0 --port 8000