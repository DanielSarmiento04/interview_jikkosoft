# 🎯 Jikkosoft Technical Interview - Full Stack Development Challenges

> A comprehensive showcase of full-stack development skills through three progressive technical challenges

**[English]** | **[Español](README_ES.md)**

[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.119.0-green.svg)](https://fastapi.tiangolo.com/)
[![Angular](https://img.shields.io/badge/Angular-19.0.0-red.svg)](https://angular.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://docs.docker.com/compose/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Challenges](#challenges)
  - [Challenge 1: Database Schema Design](#challenge-1-database-schema-design)
  - [Challenge 2: Algorithm Implementation](#challenge-2-algorithm-implementation)
  - [Challenge 3: Full-Stack System Design](#challenge-3-full-stack-system-design)
- [Technologies Used](#technologies-used)
- [Quick Start](#quick-start)
- [Key Skills Demonstrated](#key-skills-demonstrated)
- [Author](#author)

---

## 🎯 Overview

This repository contains solutions to three progressive technical challenges designed to evaluate full-stack development capabilities:

1. **Database Design** - Creating a normalized, scalable database schema for a blog platform
2. **Algorithm & Data Structures** - Implementing an efficient Two Sum solution with comprehensive testing
3. **Full-Stack Application** - Building a complete library management system with FastAPI backend and Angular frontend

Each challenge demonstrates professional software engineering practices including clean code, comprehensive testing, documentation, and production-ready deployment strategies.

---

## 📁 Project Structure

```
interview_jikkosoft/
│
├── README.md                          # This file (English)
├── README_ES.md                       # Spanish version
│
├── challenge_1/                       # 🧱 Database Schema Design
│   ├── README.md                      # Challenge documentation
│   ├── README_ES.md                   # Spanish documentation
│   ├── schema.sql                     # PostgreSQL schema
│   └── schema.png                     # ER diagram visualization
│
├── challenge_2/                       # 🧮 Two Sum Algorithm
│   ├── README.md                      # Challenge documentation
│   ├── README_ES.md                   # Spanish documentation
│   ├── pyproject.toml                 # Python project configuration
│   ├── src/
│   │   └── two_sum.py                # Main implementation
│   └── tests/
│       ├── test_two_sum.py           # Unit tests
│       └── test_performance.py       # Performance benchmarks
│
└── challenge_3/                       # 📚 Library Management System
    ├── README.md                      # Main documentation
    ├── README.es.md                   # Spanish documentation
    ├── compose.yml                    # Docker Compose configuration
    │
    ├── backend/                       # FastAPI Backend
    │   ├── README.md
    │   ├── Dockerfile
    │   ├── pyproject.toml
    │   ├── main.py
    │   ├── app/                       # Application modules
    │   │   ├── models/               # SQLModel database models
    │   │   ├── schemas/              # Pydantic validation schemas
    │   │   ├── api/                  # REST API endpoints
    │   │   └── services/             # Business logic
    │   └── tests/                     # Test suite
    │
    └── frontend/                      # Angular Frontend
        ├── README.md
        ├── Dockerfile
        ├── angular.json
        └── src/
            └── app/
                ├── core/             # Core services
                └── features/         # Feature modules
                    ├── books/
                    ├── members/
                    └── loans/
```

---

## 🎓 Challenges

### Challenge 1: Database Schema Design 🧱

**Objective:** Design a database schema for a simple blog platform supporting users, posts, comments, and tags.

#### Solution Highlights

✅ **Normalized PostgreSQL Schema** (3NF)  
✅ **Complete ER Diagram** with Mermaid visualization  
✅ **Production-Ready Features:**
- Primary and foreign keys with proper constraints
- Cascading rules for referential integrity
- Indexed fields for query optimization (slugs, usernames)
- Timezone-aware timestamps
- Many-to-many relationship handling (posts ↔ tags)

#### Key Features

- **Users Table**: Authentication and profile management
- **Posts Table**: Blog content with publishing workflow
- **Comments Table**: Threaded discussion support
- **Tags Table**: Content categorization
- **Post_Tags**: Flexible many-to-many tagging system

#### Technologies

- PostgreSQL 14+
- SQL DDL
- Database normalization principles
- ER modeling with Mermaid

📖 **[Full Documentation](challenge_1/README.md)**

---

### Challenge 2: Algorithm Implementation 🧮

**Objective:** Implement a function that finds two numbers in a list that sum to a target value.

#### Solution Highlights

✅ **Optimized O(n) Solution** using hash map  
✅ **95%+ Test Coverage** with comprehensive test suite  
✅ **Multiple Implementations:**
- Hash map approach (O(n) time, O(n) space) - **RECOMMENDED**
- Brute force approach (O(n²) time, O(1) space) - for comparison
- Generator-based approach (memory efficient)

#### Quality Assurance

- **Testing**: pytest with coverage reporting
- **Performance**: Benchmarks for 1K to 1M elements
- **Type Safety**: Full mypy type checking
- **Code Quality**: Ruff linting and formatting
- **Documentation**: Google-style docstrings

#### Test Coverage

✅ Basic cases (positive, negative, mixed numbers)  
✅ Edge cases (zeros, duplicates, large arrays)  
✅ Error handling (empty lists, no solution)  
✅ Performance benchmarks (10K, 100K, 1M elements)

#### Technologies

- Python 3.12+
- pytest, pytest-cov, pytest-benchmark
- mypy (type checking)
- Ruff (linting & formatting)
- uv (package management)

📖 **[Full Documentation](challenge_2/README.md)**

---

### Challenge 3: Full-Stack System Design 📚

**Objective:** Design and implement a library management system with classes for books, libraries, and members.

#### Solution Highlights

✅ **Complete Full-Stack Application**  
✅ **RESTful API** with FastAPI and SQLModel  
✅ **Modern Frontend** with Angular 19  
✅ **Dockerized Deployment** with Docker Compose  
✅ **Production-Ready Features:**
- Comprehensive business logic
- Input validation and error handling
- Automated testing
- API documentation (Swagger/ReDoc)
- Responsive UI components

#### Core Features

**📖 Book Management**
- CRUD operations for library inventory
- ISBN-based unique identification
- Availability tracking
- Category-based organization

**👥 Member Management**
- Member registration and profiles
- Membership status management (Active, Suspended, Expired)
- Configurable loan limits
- Membership renewal system

**🔄 Loan System**
- Book checkout with automatic due dates
- Book returns with availability restoration
- Loan renewals (up to 2 times)
- Overdue tracking and fine calculation
- Business rule validation

#### Architecture

```
┌─────────────────┐
│  Angular 19     │  Frontend (Port 4200)
│  (TypeScript)   │
└────────┬────────┘
         │ HTTP
         ↓
┌─────────────────┐
│  FastAPI        │  Backend API (Port 8000)
│  (Python 3.12)  │
└────────┬────────┘
         │ SQLModel
         ↓
┌─────────────────┐
│  PostgreSQL 18  │  Database (Port 5432)
└─────────────────┘
```

#### Technologies

**Backend:**
- FastAPI 0.119.0
- SQLModel (SQLAlchemy + Pydantic)
- PostgreSQL 18
- pytest for testing
- uv for package management

**Frontend:**
- Angular 19.0.0
- TypeScript 5.6.2
- RxJS 7.8.0
- SCSS for styling

**DevOps:**
- Docker & Docker Compose
- Nginx (frontend web server)
- Multi-stage builds for optimization

📖 **[Full Documentation](challenge_3/README.md)**

---

## 🛠 Technologies Used

### Languages & Frameworks

| Technology | Version | Purpose |
|-----------|---------|---------|
| Python | 3.12+ | Backend development, algorithms |
| TypeScript | 5.6.2 | Frontend development |
| SQL | PostgreSQL | Database design and queries |
| FastAPI | 0.119.0 | REST API framework |
| Angular | 19.0.0 | Frontend framework |

### Databases

- **PostgreSQL 18** - Production database
- **SQLModel** - ORM and validation

### Development Tools

- **uv** - Fast Python package manager
- **pytest** - Testing framework
- **mypy** - Static type checker
- **Ruff** - Python linter and formatter
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

### Testing & Quality

- **pytest-cov** - Code coverage
- **pytest-benchmark** - Performance testing
- **mypy** - Type safety
- **Ruff** - Code quality
- **Karma/Jasmine** - Angular testing

---

## 🚀 Quick Start

### Prerequisites

- **Docker** (version 20.10+)
- **Docker Compose** (version 2.0+)
- **Python** 3.12+ (for local development)
- **Node.js** 18+ (for local development)
- **PostgreSQL** 14+ (for challenge 1)

### Challenge 1: Database Schema

```bash
# Navigate to challenge 1
cd challenge_1

# Create database
createdb blog_platform

# Apply schema
psql -d blog_platform -f schema.sql

# Verify tables
psql -d blog_platform -c "\dt"
```

### Challenge 2: Two Sum Algorithm

```bash
# Navigate to challenge 2
cd challenge_2

# Install dependencies
uv sync --dev

# Run tests
uv run pytest

# Run with coverage
uv run pytest --cov=src --cov-report=html

# View coverage report
open htmlcov/index.html

# Run performance benchmarks
uv run pytest tests/test_performance.py --benchmark-only
```

### Challenge 3: Library Management System

```bash
# Navigate to challenge 3
cd challenge_3

# Start all services with Docker Compose
docker compose up -d --build

# View logs
docker compose logs -f

# Access the application
# Frontend: http://localhost:4200
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

**Detailed setup instructions available in each challenge's README.**

---

## 🎓 Key Skills Demonstrated

### Software Engineering Principles

✅ **SOLID Principles** - Maintainable, extensible code architecture  
✅ **DRY (Don't Repeat Yourself)** - Code reusability  
✅ **Clean Code** - Readable, self-documenting code  
✅ **Design Patterns** - Repository, Service, MVC patterns  

### Database Design

✅ **Normalization** - 3NF database design  
✅ **Referential Integrity** - Foreign keys and constraints  
✅ **Query Optimization** - Strategic indexing  
✅ **Schema Evolution** - Extensible design  

### Algorithms & Data Structures

✅ **Time Complexity Analysis** - O(n) vs O(n²)  
✅ **Space Complexity** - Memory optimization  
✅ **Hash Maps** - Efficient lookups  
✅ **Performance Benchmarking** - Real-world performance testing  

### Backend Development

✅ **RESTful API Design** - Standard HTTP methods and status codes  
✅ **Input Validation** - Pydantic schemas  
✅ **Error Handling** - Comprehensive exception handling  
✅ **ORM Usage** - SQLModel/SQLAlchemy  
✅ **Business Logic** - Service layer pattern  

### Frontend Development

✅ **Modern Framework** - Angular 19 with standalone components  
✅ **TypeScript** - Type-safe frontend development  
✅ **Reactive Programming** - RxJS observables  
✅ **Component Architecture** - Modular, reusable components  
✅ **HTTP Services** - API integration  

### Testing & Quality Assurance

✅ **Unit Testing** - pytest, Jasmine  
✅ **Test Coverage** - 95%+ coverage  
✅ **Performance Testing** - Benchmarking  
✅ **Type Checking** - mypy, TypeScript  
✅ **Linting** - Ruff, ESLint  

### DevOps & Deployment

✅ **Containerization** - Docker multi-stage builds  
✅ **Orchestration** - Docker Compose  
✅ **Environment Management** - Configuration management  
✅ **Dependency Management** - uv, npm  

### Documentation

✅ **README Files** - Comprehensive project documentation  
✅ **API Documentation** - OpenAPI/Swagger  
✅ **Code Comments** - Docstrings and inline comments  
✅ **ER Diagrams** - Visual database design  
✅ **Bilingual Documentation** - English and Spanish  

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| Total Lines of Code | ~5,000+ |
| Test Coverage | 95%+ |
| Number of Endpoints | 20+ REST APIs |
| Database Tables | 8 (across all challenges) |
| Docker Services | 3 containers |
| Documentation Files | 14 README files |
| Languages Supported | English, Spanish |

---

## 🔗 Navigation

### Challenge Documentation

- **[Challenge 1: Database Schema](challenge_1/README.md)** - Blog platform database design
- **[Challenge 2: Two Sum Algorithm](challenge_2/README.md)** - Optimized algorithm implementation
- **[Challenge 3: Library System](challenge_3/README.md)** - Full-stack application

### Spanish Documentation

- **[README en Español](README_ES.md)** - Documentación principal
- **[Desafío 1: Esquema de Base de Datos](challenge_1/README_ES.md)**
- **[Desafío 2: Algoritmo Two Sum](challenge_2/README_ES.md)**
- **[Desafío 3: Sistema de Biblioteca](challenge_3/README.es.md)**

---

## 🧑‍💻 Author

**Daniel Sarmiento**  
*Senior Full Stack Developer*

**Skills Demonstrated:**
- Full-Stack Development (Python, TypeScript, SQL)
- Backend Development (FastAPI, SQLModel, PostgreSQL)
- Frontend Development (Angular, RxJS, TypeScript)
- Database Design & Optimization
- Algorithm Design & Analysis
- DevOps & Containerization (Docker, Docker Compose)
- Testing & Quality Assurance
- Technical Documentation

**Contact:**
- GitHub: [@DanielSarmiento04](https://github.com/DanielSarmiento04)

---

## 📄 License

This project is part of a technical interview for Jikkosoft.  
© 2025 Daniel Sarmiento. All rights reserved.

---

## 🙏 Acknowledgments

This technical interview showcases:
- Modern software engineering best practices
- Production-ready code quality
- Comprehensive testing strategies
- Professional documentation standards
- Full-stack development expertise

**Thank you for reviewing this submission!** 🚀
