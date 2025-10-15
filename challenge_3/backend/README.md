# 📚 Library Management System - Backend API# 📚 Library Management System - Backend API# Library Management System - Backend



**[🇪🇸 Versión en Español](README.es.md)** | **🇺🇸 English Version** (current)



---A complete RESTful API for library management built with **FastAPI**, **SQLModel**, and **PostgreSQL**.## Overview



A complete RESTful API for library management built with **FastAPI**, **SQLModel**, and **PostgreSQL**.A comprehensive RESTful API for library management built with FastAPI, SQLModel, and PostgreSQL. The system manages books, members, and loans with complete CRUD operations and business logic validation.



## 🚀 Quick Start## 🚀 Quick Start



### Prerequisites## 🚀 Tech Stack

- Python 3.12+

- PostgreSQL (or Docker)### Prerequisites- **Python**: 3.12

- uv package manager

- Python 3.12+- **Framework**: FastAPI 0.119.0

### Installation

- PostgreSQL (or Docker)- **ORM**: SQLModel 0.0.27

```bash

# 1. Install dependencies- uv package manager- **Database**: PostgreSQL

uv sync

- **Server**: Uvicorn 0.37.0

# 2. Start PostgreSQL with Docker

docker-compose up -d### Installation- **Testing**: pytest, pytest-asyncio, httpx



# 3. Configure environment- **Code Quality**: ruff, mypy

cp .env.example .env

# Or use the shell script:```bash

sh ./env.example.sh

```# 1. Install dependencies## 📋 Features



### Run the Applicationuv sync



```bash### Book Management

# Option A: With .env file

uvicorn main:app --reload --host 0.0.0.0 --port 8000# 2. Start PostgreSQL with Docker- ✅ Add, update, delete, and search books



# Option B: With shell script (auto-starts server)docker-compose up -d- ✅ Track total and available copies

sh ./env.example.sh

```- ✅ ISBN validation and uniqueness



**Server**: http://localhost:8000  # 3. Configure environment- ✅ Category-based filtering

**API Docs**: http://localhost:8000/docs

cp .env.example .env- ✅ Pagination support

## 🧪 Testing

# Or use the shell script:

```bash

# Run all testssh ./env.example.sh### Member Management

./run_tests.sh

```- ✅ Member registration and profile management

# With coverage

./run_tests.sh --cov=app --cov-report=html- ✅ Membership status tracking (active, suspended, expired)

```

### Run the Application- ✅ Auto-generated member numbers

**Results**: ✅ 6/6 tests passing

- ✅ Loan limit configuration

## 📋 Features

```bash- ✅ Membership renewal

### Books Management

- Create, read, update, delete books# Option A: With .env file

- Track total and available copies

- Search and filter by categoryuvicorn main:app --reload --host 0.0.0.0 --port 8000### Loan Management

- ISBN validation

- ✅ Book checkout and return

### Members Management

- Register and manage member profiles# Option B: With shell script (auto-starts server)- ✅ Loan renewal (max 2 times)

- Auto-generate member numbers (`MEM{YEAR}{SEQ}`)

- Track membership status (active, suspended, expired)sh ./env.example.sh- ✅ Overdue tracking

- Loan limits and expiry management

```- ✅ Fine calculation

### Loans Management

- Checkout and return books- ✅ Loan history

- Renew loans (max 2 times)

- Track overdue books**Server**: http://localhost:8000  

- Calculate fines

- Loan history**API Docs**: http://localhost:8000/docs## 🏗️ Project Structure



## 🔌 API Endpoints



### Books (7 endpoints)## 🧪 Testing```

```

POST   /api/v1/books              - Create bookbackend/

GET    /api/v1/books              - List books (paginated)

GET    /api/v1/books/{id}         - Get book by ID```bash├── app/

GET    /api/v1/books/isbn/{isbn}  - Get book by ISBN

PUT    /api/v1/books/{id}         - Update book# Run all tests│   ├── __init__.py           # FastAPI app initialization

DELETE /api/v1/books/{id}         - Delete book

GET    /api/v1/books/available/list - Available books./run_tests.sh│   ├── database.py           # Database configuration

```

│   ├── views.py              # Legacy views (can be removed)

### Members (9 endpoints)

```# With coverage│   │

POST   /api/v1/members              - Register member

GET    /api/v1/members              - List members./run_tests.sh --cov=app --cov-report=html│   ├── core/

GET    /api/v1/members/{id}         - Get member

PUT    /api/v1/members/{id}         - Update member```│   │   └── config.py         # Application settings

DELETE /api/v1/members/{id}         - Delete member

GET    /api/v1/members/{id}/loans   - Loan history│   │

POST   /api/v1/members/{id}/renew   - Renew membership

POST   /api/v1/members/{id}/suspend - Suspend member**Results**: ✅ 6/6 tests passing│   ├── models/               # SQLModel database models

POST   /api/v1/members/{id}/activate - Activate member

```│   │   ├── book.py           # Book model



### Loans (7 endpoints)## 📋 Features│   │   ├── member.py         # Member model

```

POST   /api/v1/loans               - Checkout book│   │   └── loan.py           # Loan model

GET    /api/v1/loans               - List loans

GET    /api/v1/loans/{id}          - Get loan### Books Management│   │

POST   /api/v1/loans/{id}/return   - Return book

POST   /api/v1/loans/{id}/renew    - Renew loan- Create, read, update, delete books│   ├── schemas/              # Pydantic request/response schemas

GET    /api/v1/loans/overdue       - Overdue loans

GET    /api/v1/loans/statistics    - Loan statistics- Track total and available copies│   │   ├── book.py

```

- Search and filter by category│   │   ├── member.py

## 🎯 Business Rules

- ISBN validation│   │   └── loan.py

### Books

- ISBN must be unique (10 or 13 digits)│   │

- Available copies ≤ Total copies

- Cannot delete books with active loans### Members Management│   ├── services/             # Business logic layer



### Members- Register and manage member profiles│   │   └── library_service.py

- Email and member number must be unique

- Only ACTIVE members can borrow- Auto-generate member numbers (`MEM{YEAR}{SEQ}`)│   │

- Members with overdue books cannot make new loans

- Max 3 simultaneous loans (configurable)- Track membership status (active, suspended, expired)│   └── api/                  # API routes



### Loans- Loan limits and expiry management│       ├── deps.py           # Dependencies

- Default loan period: 14 days

- Max renewals: 2 times│       ├── books.py          # Book endpoints

- Renewal period: 7 days each

- Overdue loans cannot be renewed### Loans Management│       ├── members.py        # Member endpoints



## 🏗️ Architecture- Checkout and return books│       └── loans.py          # Loan endpoints



```- Renew loans (max 2 times)│

┌─────────────────────────────────────┐

│      API Layer (FastAPI)            │- Track overdue books├── main.py                   # Entry point

│   books.py | members.py | loans.py  │

└─────────────────────────────────────┘- Calculate fines├── pyproject.toml           # Dependencies

                 ↓

┌─────────────────────────────────────┐- Loan history├── env.example.sh           # Environment variables example

│   Validation Layer (Pydantic)       │

│   *Create | *Update | *Response     │└── README.md                # This file

└─────────────────────────────────────┘

                 ↓## 🔌 API Endpoints```

┌─────────────────────────────────────┐

│   Service Layer (Business Logic)    │

│      library_service.py             │

└─────────────────────────────────────┘### Books (7 endpoints)## 🔧 Setup

                 ↓

┌─────────────────────────────────────┐```

│   Model Layer (SQLModel ORM)        │

│   Book | Member | Loan              │POST   /api/v1/books              - Create book### Prerequisites

└─────────────────────────────────────┘

                 ↓GET    /api/v1/books              - List books (paginated)- Python 3.12+

┌─────────────────────────────────────┐

│   Database Layer (PostgreSQL)       │GET    /api/v1/books/{id}         - Get book by ID- PostgreSQL

└─────────────────────────────────────┘

```GET    /api/v1/books/isbn/{isbn}  - Get book by ISBN- uv (recommended) or pip



## 📂 Project StructurePUT    /api/v1/books/{id}         - Update book



```DELETE /api/v1/books/{id}         - Delete book### Installation

backend/

├── app/GET    /api/v1/books/available/list - Available books

│   ├── __init__.py           # FastAPI app

│   ├── database.py           # DB config```1. **Clone the repository**

│   ├── core/

│   │   └── config.py         # Settings   ```bash

│   ├── models/               # DB models

│   │   ├── book.py### Members (9 endpoints)   cd backend

│   │   ├── member.py

│   │   └── loan.py```   ```

│   ├── schemas/              # Pydantic schemas

│   │   ├── book.pyPOST   /api/v1/members              - Register member

│   │   ├── member.py

│   │   └── loan.pyGET    /api/v1/members              - List members2. **Create virtual environment**

│   ├── services/             # Business logic

│   │   └── library_service.pyGET    /api/v1/members/{id}         - Get member   ```bash

│   └── api/                  # API routes

│       ├── books.pyPUT    /api/v1/members/{id}         - Update member   # Using uv (recommended)

│       ├── members.py

│       └── loans.pyDELETE /api/v1/members/{id}         - Delete member   uv venv

├── tests/                    # Test suite

├── main.py                   # Entry pointGET    /api/v1/members/{id}/loans   - Loan history   source .venv/bin/activate  # On Windows: .venv\Scripts\activate

├── env.example.sh           # Environment setup

└── run_tests.sh             # Test runnerPOST   /api/v1/members/{id}/renew   - Renew membership   

```

POST   /api/v1/members/{id}/suspend - Suspend member   # Or using Python

## 🔧 Configuration

POST   /api/v1/members/{id}/activate - Activate member   python -m venv .venv

### Environment Variables

```   source .venv/bin/activate

```bash

# Required   ```

PG_CONNECTION_STRING=postgresql://user:password@localhost:5432/library

### Loans (7 endpoints)

# Optional (with defaults)

APP_NAME=LIBRARY_MANAGEMENT_SYSTEM```3. **Install dependencies**

DEBUG=true

API_V1_PREFIX=/api/v1POST   /api/v1/loans               - Checkout book   ```bash

```

GET    /api/v1/loans               - List loans   # Using uv

### Docker PostgreSQL

GET    /api/v1/loans/{id}          - Get loan   uv sync

```bash

# Start databasePOST   /api/v1/loans/{id}/return   - Return book   

docker-compose up -d

POST   /api/v1/loans/{id}/renew    - Renew loan   # Or using pip

# Connection string

postgresql://user:password@localhost:5432/libraryGET    /api/v1/loans/overdue       - Overdue loans   pip install -e .

```

GET    /api/v1/loans/statistics    - Loan statistics   pip install -e ".[dev]"

## 💡 API Examples

```   ```

### Create a Book

```bash

curl -X POST "http://localhost:8000/api/v1/books" \

  -H "Content-Type: application/json" \## 🎯 Business Rules4. **Configure environment variables**

  -d '{

    "isbn": "9780132350884",   ```bash

    "title": "Clean Code",

    "author": "Robert C. Martin",### Books   # Copy and edit the example file

    "category": "Software Engineering",

    "total_copies": 5- ISBN must be unique (10 or 13 digits)   cp env.example.sh .env

  }'

```- Available copies ≤ Total copies   



### Register a Member- Cannot delete books with active loans   # Update with your PostgreSQL credentials

```bash

curl -X POST "http://localhost:8000/api/v1/members" \   export PG_CONNECTION_STRING="postgresql://user:password@localhost:5432/library"

  -H "Content-Type: application/json" \

  -d '{### Members   ```

    "name": "John Doe",

    "email": "john@example.com"- Email and member number must be unique

  }'

```- Only ACTIVE members can borrow5. **Run the application**



### Checkout a Book- Members with overdue books cannot make new loans   ```bash

```bash

curl -X POST "http://localhost:8000/api/v1/loans" \- Max 3 simultaneous loans (configurable)   # Using the env script

  -H "Content-Type: application/json" \

  -d '{   source env.example.sh

    "book_id": 1,

    "member_id": 1### Loans   

  }'

```- Default loan period: 14 days   # Or run directly



## 🛠️ Development- Max renewals: 2 times   uvicorn main:app --reload --host 0.0.0.0 --port 8000



### Code Quality- Renewal period: 7 days each   ```

```bash

# Format code- Overdue loans cannot be renewed

uv run ruff format app/

## 📚 API Documentation

# Lint code

uv run ruff check app/## 🏗️ Architecture



# Type checkingOnce the application is running, access the interactive documentation:

uv run mypy app/

``````



### Testing┌─────────────────────────────────────┐- **Swagger UI**: http://localhost:8000/docs

```bash

# Run tests│      API Layer (FastAPI)            │- **ReDoc**: http://localhost:8000/redoc

./run_tests.sh

│   books.py | members.py | loans.py  │- **OpenAPI JSON**: http://localhost:8000/openapi.json

# Specific test

./run_tests.sh tests/test_books.py::test_create_book -v└─────────────────────────────────────┘



# With coverage                 ↓## 🔌 API Endpoints

./run_tests.sh --cov=app --cov-report=html

```┌─────────────────────────────────────┐



## 📊 Tech Stack│   Validation Layer (Pydantic)       │### Books



| Component | Technology |│   *Create | *Update | *Response     │```

|-----------|------------|

| **Framework** | FastAPI 0.119.0 |└─────────────────────────────────────┘POST   /api/v1/books              - Create new book

| **ORM** | SQLModel 0.0.27 |

| **Database** | PostgreSQL 18 |                 ↓GET    /api/v1/books              - List books (paginated, with filters)

| **Server** | Uvicorn 0.37.0 |

| **Validation** | Pydantic 2.12.2+ |┌─────────────────────────────────────┐GET    /api/v1/books/{id}         - Get book by ID

| **Testing** | pytest 8.4.2 |

| **Python** | 3.12+ |│   Service Layer (Business Logic)    │GET    /api/v1/books/isbn/{isbn}  - Get book by ISBN



## 🐛 Troubleshooting│      library_service.py             │PUT    /api/v1/books/{id}         - Update book



### Database Connection Error└─────────────────────────────────────┘DELETE /api/v1/books/{id}         - Delete book

```bash

# Verify PostgreSQL is running                 ↓GET    /api/v1/books/available/list - Get available books

docker ps

┌─────────────────────────────────────┐```

# Check connection string

echo $PG_CONNECTION_STRING│   Model Layer (SQLModel ORM)        │

```

│   Book | Member | Loan              │### Members

### Import Errors

```bash└─────────────────────────────────────┘```

# Reinstall dependencies

uv sync                 ↓POST   /api/v1/members              - Register new member

```

┌─────────────────────────────────────┐GET    /api/v1/members              - List members (paginated)

### Port Already in Use

```bash│   Database Layer (PostgreSQL)       │GET    /api/v1/members/{id}         - Get member by ID

# Use different port

uvicorn main:app --port 8001└─────────────────────────────────────┘PUT    /api/v1/members/{id}         - Update member



# Or kill process```DELETE /api/v1/members/{id}         - Delete member

lsof -ti:8000 | xargs kill -9

```GET    /api/v1/members/{id}/loans   - Get member's loan history



## 📈 Future Enhancements## 📂 Project StructurePOST   /api/v1/members/{id}/renew   - Renew membership



- [ ] JWT AuthenticationPOST   /api/v1/members/{id}/suspend - Suspend member

- [ ] Fine payment system

- [ ] Email notifications for overdue books```POST   /api/v1/members/{id}/activate - Activate member

- [ ] Book reservation system

- [ ] Reviews and ratingsbackend/```

- [ ] Full-text search with Elasticsearch

- [ ] Export functionality (PDF, CSV)├── app/

- [ ] Analytics dashboard

│   ├── __init__.py           # FastAPI app### Loans

## 📄 License

│   ├── database.py           # DB config```

This project is part of an interview challenge for Jikkosoft.

│   ├── core/POST   /api/v1/loans               - Checkout book

---

│   │   └── config.py         # SettingsGET    /api/v1/loans               - List loans (paginated)

**Made with ❤️ using FastAPI and SQLModel**

│   ├── models/               # DB modelsGET    /api/v1/loans/{id}          - Get loan by ID

│   │   ├── book.pyPOST   /api/v1/loans/{id}/return   - Return book

│   │   ├── member.pyPOST   /api/v1/loans/{id}/renew    - Renew loan

│   │   └── loan.pyGET    /api/v1/loans/overdue       - Get overdue loans

│   ├── schemas/              # Pydantic schemasGET    /api/v1/loans/statistics    - Get loan statistics

│   │   ├── book.py```

│   │   ├── member.py

│   │   └── loan.py## 🎯 Business Rules

│   ├── services/             # Business logic

│   │   └── library_service.py### Books

│   └── api/                  # API routes- ISBN must be unique (10 or 13 digits)

│       ├── books.py- Available copies cannot exceed total copies

│       ├── members.py- Books with active loans cannot be deleted

│       └── loans.py

├── tests/                    # Test suite### Members

├── main.py                   # Entry point- Email and member number must be unique

├── env.example.sh           # Environment setup- Member numbers auto-generated as `MEM{YEAR}{SEQ}`

└── run_tests.sh             # Test runner- Only ACTIVE members can borrow books

```- Members with overdue books cannot checkout new books

- Maximum 3 simultaneous loans (configurable)

## 🔧 Configuration

### Loans

### Environment Variables- Default loan period: 14 days

- Maximum renewals: 2 times

```bash- Renewal period: 7 days per renewal

# Required- Overdue loans cannot be renewed

PG_CONNECTION_STRING=postgresql://user:password@localhost:5432/library- Books must be available for checkout



# Optional (with defaults)## 🧪 Testing

APP_NAME=LIBRARY_MANAGEMENT_SYSTEM

DEBUG=true```bash

API_V1_PREFIX=/api/v1# Run all tests

```uv run pytest



### Docker PostgreSQL# Run with coverage

uv run pytest --cov=app --cov-report=html

```bash

# Start database# Run specific test file

docker-compose up -duv run pytest tests/test_books.py -v

```

# Connection string

postgresql://user:password@localhost:5432/library## 🔍 Code Quality

```

```bash

## 💡 API Examples# Format code

uv run ruff format app/

### Create a Book

```bash# Lint code

curl -X POST "http://localhost:8000/api/v1/books" \uv run ruff check app/

  -H "Content-Type: application/json" \

  -d '{# Type checking

    "isbn": "9780132350884",uv run mypy app/

    "title": "Clean Code",```

    "author": "Robert C. Martin",

    "category": "Software Engineering",## 🐳 Docker Support

    "total_copies": 5

  }'Create a `Dockerfile`:

``````dockerfile

FROM python:3.12-slim

### Register a Member

```bashWORKDIR /app

curl -X POST "http://localhost:8000/api/v1/members" \

  -H "Content-Type: application/json" \COPY pyproject.toml .

  -d '{RUN pip install uv && uv pip install --system -e .

    "name": "John Doe",

    "email": "john@example.com"COPY . .

  }'

```CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

```

### Checkout a Book

```bash## 📝 Environment Variables

curl -X POST "http://localhost:8000/api/v1/loans" \

  -H "Content-Type: application/json" \| Variable | Description | Example |

  -d '{|----------|-------------|---------|

    "book_id": 1,| `PG_CONNECTION_STRING` | PostgreSQL connection URL | `postgresql://user:pass@localhost:5432/library` |

    "member_id": 1| `APP_NAME` | Application name | `LIBRARY_MANAGEMENT_SYSTEM` |

  }'

```## 🚀 Development Workflow



## 🛠️ Development1. **Start the server in development mode**

   ```bash

### Code Quality   uvicorn main:app --reload

```bash   ```

# Format code

uv run ruff format app/2. **Make changes to code** - Auto-reload will restart the server



# Lint code3. **Test your changes**

uv run ruff check app/   ```bash

   curl http://localhost:8000/health

# Type checking   ```

uv run mypy app/

```4. **Check the interactive docs** at http://localhost:8000/docs



### Testing## 🔐 Security Considerations

```bash

# Run tests- [ ] Add authentication (JWT recommended)

./run_tests.sh- [ ] Add rate limiting

- [ ] Configure CORS for production

# Specific test- [ ] Use environment-specific settings

./run_tests.sh tests/test_books.py::test_create_book -v- [ ] Add input sanitization

- [ ] Implement audit logging

# With coverage

./run_tests.sh --cov=app --cov-report=html## 📈 Future Enhancements

```

- [ ] Add authentication and authorization

## 📊 Tech Stack- [ ] Implement fine payment system

- [ ] Add email notifications for overdue books

| Component | Technology |- [ ] Create reservation system

|-----------|------------|- [ ] Add book reviews and ratings

| **Framework** | FastAPI 0.119.0 |- [ ] Implement search with Elasticsearch

| **ORM** | SQLModel 0.0.27 |- [ ] Add export functionality (PDF, CSV)

| **Database** | PostgreSQL 18 |- [ ] Create dashboard with statistics

| **Server** | Uvicorn 0.37.0 |

| **Validation** | Pydantic 2.12.2+ |## 🤝 Contributing

| **Testing** | pytest 8.4.2 |

| **Python** | 3.12+ |1. Follow PEP 8 style guidelines

2. Add type hints to all functions

## 🐛 Troubleshooting3. Write docstrings for all public functions

4. Add tests for new features

### Database Connection Error5. Update documentation

```bash

# Verify PostgreSQL is running## 📄 License

docker ps

This project is part of an interview challenge for Jikkosoft.

# Check connection string

echo $PG_CONNECTION_STRING## 👨‍💻 Developer Notes

```

- Database tables are created automatically on startup

### Import Errors- For production, use Alembic for migrations

```bash- All datetime fields use UTC

# Reinstall dependencies- Pagination is 1-indexed (first page = 1)

uv sync- Soft delete pattern can be added for better data retention

```

## 🐛 Troubleshooting

### Port Already in Use

```bash**Database connection error:**

# Use different port- Verify PostgreSQL is running

uvicorn main:app --port 8001- Check connection string in environment variables

- Ensure database exists

# Or kill process

lsof -ti:8000 | xargs kill -9**Import errors:**

```- Activate virtual environment

- Run `uv sync` to install dependencies

## 📈 Future Enhancements

**Port already in use:**

- [ ] JWT Authentication- Change port: `uvicorn main:app --port 8001`

- [ ] Fine payment system- Or kill the process using port 8000

- [ ] Email notifications for overdue books

- [ ] Book reservation system## 📞 Support

- [ ] Reviews and ratings

- [ ] Full-text search with ElasticsearchFor issues or questions, please contact the development team or create an issue in the repository.

- [ ] Export functionality (PDF, CSV)
- [ ] Analytics dashboard

## 📄 License

This project is part of an interview challenge for Jikkosoft.

---

**Made with ❤️ using FastAPI and SQLModel**
