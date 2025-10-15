# Library Management System 📚

> A comprehensive full-stack library management system built with FastAPI and Angular

[Versión en Español](./README.es.md)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This project implements a **simple library management system** with classes for books, libraries, and members. The system allows:

- **Book Management**: Add, update, delete, and search books in the library inventory
- **Member Management**: Register, update, and manage library members
- **Loan System**: Checkout, return, and renew book loans with automatic tracking
- **Business Rules**: Enforce availability, due dates, renewal limits, and membership validations

## ✨ Features

### Book Management
- ✅ CRUD operations for books
- ✅ ISBN-based unique identification
- ✅ Track total and available copies
- ✅ Category-based classification
- ✅ Automatic availability management

### Member Management
- ✅ Member registration and profiles
- ✅ Membership status (Active, Suspended, Expired)
- ✅ Configurable loan limits per member
- ✅ Membership renewal system

### Loan System
- ✅ Book checkout with automatic due date calculation
- ✅ Book returns with availability restoration
- ✅ Loan renewals (up to 2 times)
- ✅ Overdue tracking and fine calculation
- ✅ Business rule validation (availability, membership status, loan limits)

## 🛠 Technology Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) 0.119.0
- **Database**: PostgreSQL 18 with [SQLModel](https://sqlmodel.tiangolo.com/) (SQLAlchemy + Pydantic)
- **Validation**: Pydantic 2.12.2
- **Server**: Uvicorn 0.37.0
- **Package Manager**: [uv](https://github.com/astral-sh/uv) - Ultra-fast Python package installer

### Frontend
- **Framework**: [Angular](https://angular.dev/) 19.0.0
- **Language**: TypeScript 5.6.2
- **Styling**: SCSS
- **HTTP Client**: RxJS 7.8.0

### DevOps & Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL 18
- **Web Server**: Nginx (for frontend)
- **Python Version**: 3.12

### Development Tools
- **Testing**: pytest 8.4.2, pytest-cov, pytest-benchmark
- **Linting**: Ruff 0.14.0
- **Type Checking**: mypy 1.18.2
- **API Testing**: httpx 0.27.2

## 🏗 Architecture

```
Library Management System
│
├── Backend (FastAPI)
│   ├── RESTful API
│   ├── Business Logic Layer
│   ├── Data Access Layer (SQLModel)
│   └── PostgreSQL Database
│
├── Frontend (Angular)
│   ├── Components
│   ├── Services (HTTP Clients)
│   └── Routing
│
└── Infrastructure (Docker)
    ├── PostgreSQL Container
    ├── Backend Container
    └── Frontend Container (Nginx)
```

### Database Models

The system implements three core models:

1. **Book**: Represents library books with inventory management
2. **Member**: Represents library members with membership management
3. **Loan**: Represents book loan transactions linking books and members

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)

### Optional (for local development without Docker):
- **Python** 3.12+
- **Node.js** 18+ and npm
- **PostgreSQL** 18+
- **uv** (Python package manager): `pip install uv`

## 🚀 Installation & Setup

### Method 1: Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd challenge_3
   ```

2. **Start the database**
   ```bash
   docker compose up -d db
   ```

3. **Verify database creation**
   ```bash
   docker exec -it db psql -U user -c "\l"
   ```
   
   You should see the `library` database listed. If not, create it manually:
   ```bash
   docker exec -it db psql -U user -c "CREATE DATABASE library;"
   ```

4. **Build and start all services**
   ```bash
   docker compose up -d --build
   ```

5. **Verify all containers are running**
   ```bash
   docker compose ps
   ```

### Method 2: Local Development Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies using uv**
   ```bash
   uv sync
   ```

3. **Set environment variables**
   ```bash
   export PG_CONNECTION_STRING="postgresql://user:password@localhost:5432/library"
   ```

4. **Run the backend**
   ```bash
   uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   Or use the provided script:
   ```bash
   sh ./env.example.sh
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm start
   ```

## 🎮 Running the Application

### Access Points

Once all services are running:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:4200 | Angular application |
| **Backend API** | http://localhost:8000 | FastAPI REST API |
| **API Docs (Swagger)** | http://localhost:8000/docs | Interactive API documentation |
| **API Docs (ReDoc)** | http://localhost:8000/redoc | Alternative API documentation |
| **PostgreSQL** | localhost:5432 | Database (user: `user`, password: `password`) |

### Quick Start Commands

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f frontend

# Stop all services
docker compose down

# Stop and remove volumes (clean reset)
docker compose down -v

# Rebuild and restart
docker compose up -d --build
```

## 📖 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Main Endpoints

#### Books
- `GET /books` - List all books
- `POST /books` - Create a new book
- `GET /books/{id}` - Get book by ID
- `PUT /books/{id}` - Update book
- `DELETE /books/{id}` - Delete book
- `GET /books/isbn/{isbn}` - Search by ISBN
- `GET /books/search?query=...` - Search books

#### Members
- `GET /members` - List all members
- `POST /members` - Register a new member
- `GET /members/{id}` - Get member by ID
- `PUT /members/{id}` - Update member
- `DELETE /members/{id}` - Delete member
- `GET /members/{id}/loans` - Get member's loan history

#### Loans
- `GET /loans` - List all loans
- `POST /loans` - Checkout a book
- `GET /loans/{id}` - Get loan by ID
- `PUT /loans/{id}/return` - Return a book
- `PUT /loans/{id}/renew` - Renew a loan
- `GET /loans/overdue` - List overdue loans

### Example API Calls

**Create a Book:**
```bash
curl -X POST "http://localhost:8000/api/v1/books" \
  -H "Content-Type: application/json" \
  -d '{
    "isbn": "9780132350884",
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "publisher": "Prentice Hall",
    "publication_year": 2008,
    "category": "Software Engineering",
    "description": "A Handbook of Agile Software Craftsmanship",
    "total_copies": 5,
    "available_copies": 5
  }'
```

**Register a Member:**
```bash
curl -X POST "http://localhost:8000/api/v1/members" \
  -H "Content-Type: application/json" \
  -d '{
    "member_number": "MEM2024001",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "address": "123 Main St, City, Country"
  }'
```

**Checkout a Book:**
```bash
curl -X POST "http://localhost:8000/api/v1/loans" \
  -H "Content-Type: application/json" \
  -d '{
    "book_id": 1,
    "member_id": 1
  }'
```

## 📁 Project Structure

```
challenge_3/
│
├── compose.yml                 # Docker Compose configuration
├── init-db.sh                  # Database initialization script
├── README.md                   # This file (English)
├── README.es.md               # Spanish version
│
├── backend/                    # FastAPI Backend
│   ├── Dockerfile             # Backend container definition
│   ├── pyproject.toml         # Python dependencies (uv)
│   ├── uv.lock               # Lock file for dependencies
│   ├── main.py               # Application entry point
│   ├── env.example.sh        # Example environment setup
│   │
│   ├── app/
│   │   ├── __init__.py       # App initialization with lifespan
│   │   ├── database.py       # Database configuration
│   │   ├── views.py          # View utilities
│   │   │
│   │   ├── core/
│   │   │   └── config.py     # Settings and configuration
│   │   │
│   │   ├── models/           # SQLModel database models
│   │   │   ├── book.py       # Book model
│   │   │   ├── member.py     # Member model
│   │   │   └── loan.py       # Loan model
│   │   │
│   │   ├── schemas/          # Pydantic schemas for validation
│   │   │   ├── book.py
│   │   │   ├── member.py
│   │   │   └── loan.py
│   │   │
│   │   ├── api/              # API endpoints
│   │   │   ├── books.py      # Book routes
│   │   │   ├── members.py    # Member routes
│   │   │   ├── loans.py      # Loan routes
│   │   │   └── deps.py       # Dependencies
│   │   │
│   │   └── services/
│   │       └── library_service.py  # Business logic
│   │
│   └── tests/                # Test suite
│       ├── conftest.py       # Test configuration
│       └── test_books.py     # Book tests
│
└── frontend/                 # Angular Frontend
    ├── Dockerfile           # Frontend container definition
    ├── nginx.conf          # Nginx configuration
    ├── package.json        # Node.js dependencies
    ├── angular.json        # Angular configuration
    ├── tsconfig.json       # TypeScript configuration
    │
    └── src/
        ├── index.html
        ├── main.ts
        ├── styles.scss
        │
        └── app/
            ├── app.component.ts
            ├── app.routes.ts
            ├── app.config.ts
            │
            ├── core/
            │   └── services/
            │
            └── features/
                ├── books/
                │   ├── components/
                │   ├── models/
                │   └── services/
                ├── members/
                │   ├── components/
                │   ├── models/
                │   └── services/
                └── loans/
                    ├── components/
                    ├── models/
                    └── services/
```

## 🧪 Testing

### Backend Tests

Run the test suite:

```bash
# Navigate to backend directory
cd backend

# Run all tests
uv run pytest

# Run with coverage
uv run pytest --cov=app --cov-report=html

# Run specific test file
uv run pytest tests/test_books.py

# Run with verbose output
uv run pytest -v
```

Or use the provided script:
```bash
sh ./run_tests.sh
```

### Frontend Tests

```bash
cd frontend

# Run unit tests
npm test

# Run tests with coverage
npm run test -- --code-coverage
```

## 🔧 Troubleshooting

### Issue: Database "library" does not exist

**Error:**
```
psycopg2.OperationalError: FATAL: database "library" does not exist
```

**Solution:**
```bash
# Create the database manually
docker exec -it db psql -U user -c "CREATE DATABASE library;"

# Or restart with clean volumes
docker compose down -v
docker compose up -d
```

### Issue: Backend container fails with "uvicorn executable not found"

**Error:**
```
OCI runtime create failed: runc create failed: "uvicorn" executable file not found in $PATH
```

**Solution:**
Ensure your `backend/Dockerfile` uses `uv run`:
```dockerfile
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
```

### Issue: Port already in use

**Error:**
```
Bind for 0.0.0.0:5432 failed: port is already allocated
```

**Solution:**
```bash
# Check what's using the port
lsof -i :5432

# Stop conflicting service or change port in compose.yml
# Modify: "5433:5432" to use different host port
```

### Issue: Connection refused to backend

**Solution:**
```bash
# Check backend container logs
docker compose logs backend

# Verify backend is running
docker compose ps

# Restart backend
docker compose restart backend
```

### Issue: Frontend cannot connect to backend

**Solution:**
Check the environment configuration in `frontend/src/environments/`:
- Ensure the API URL points to the correct backend endpoint
- For Docker: `http://localhost:8000`
- For development: Update as needed

## 📝 Environment Variables

### Backend (.env)

```bash
# Database Connection
PG_CONNECTION_STRING=postgresql://user:password@db:5432/library

# Application Settings
DEBUG=true
APP_NAME=LIBRARY_MANAGEMENT_SYSTEM
```

### Frontend (environments/)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api/v1'
};
```


## 📄 License

This project is part of an interview challenge for Jikkosoft.

