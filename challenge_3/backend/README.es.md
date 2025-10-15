# 📚 Sistema de Gestión de Biblioteca - Backend API

**🇪🇸 Versión en Español** (actual) | **[🇺🇸 English Version](README.md)**

API RESTful completa para gestión de bibliotecas construida con **FastAPI**, **SQLModel** y **PostgreSQL**.

## 🚀 Inicio Rápido

### Prerequisitos
- Python 3.12+
- PostgreSQL (o Docker)
- uv package manager

### Instalación

```bash
# 1. Instalar dependencias
uv sync

# 2. Iniciar PostgreSQL con Docker
docker-compose up -d

# 3. Configurar variables de entorno
cp .env.example .env
# O usar el script shell:
sh ./env.example.sh
```

### Ejecutar la Aplicación

```bash
# Opción A: Con archivo .env
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Opción B: Con script shell (inicia servidor automáticamente)
sh ./env.example.sh
```

**Servidor**: http://localhost:8000  
**Documentación API**: http://localhost:8000/docs

## 🧪 Testing

```bash
# Ejecutar todos los tests
./run_tests.sh

# Con cobertura
./run_tests.sh --cov=app --cov-report=html
```

**Resultados**: ✅ 6/6 tests pasando

## 📋 Características

### Gestión de Libros
- Crear, leer, actualizar, eliminar libros
- Rastrear copias totales y disponibles
- Buscar y filtrar por categoría
- Validación de ISBN

### Gestión de Miembros
- Registrar y gestionar perfiles de miembros
- Auto-generar números de miembro (`MEM{AÑO}{SEQ}`)
- Seguimiento de estado de membresía (activo, suspendido, expirado)
- Límites de préstamos y gestión de expiración

### Gestión de Préstamos
- Prestar y devolver libros
- Renovar préstamos (máximo 2 veces)
- Rastrear libros vencidos
- Calcular multas
- Historial de préstamos

## 🔌 Endpoints de la API

### Libros (7 endpoints)
```
POST   /api/v1/books              - Crear libro
GET    /api/v1/books              - Listar libros (paginado)
GET    /api/v1/books/{id}         - Obtener libro por ID
GET    /api/v1/books/isbn/{isbn}  - Obtener libro por ISBN
PUT    /api/v1/books/{id}         - Actualizar libro
DELETE /api/v1/books/{id}         - Eliminar libro
GET    /api/v1/books/available/list - Libros disponibles
```

### Miembros (9 endpoints)
```
POST   /api/v1/members              - Registrar miembro
GET    /api/v1/members              - Listar miembros
GET    /api/v1/members/{id}         - Obtener miembro
PUT    /api/v1/members/{id}         - Actualizar miembro
DELETE /api/v1/members/{id}         - Eliminar miembro
GET    /api/v1/members/{id}/loans   - Historial de préstamos
POST   /api/v1/members/{id}/renew   - Renovar membresía
POST   /api/v1/members/{id}/suspend - Suspender miembro
POST   /api/v1/members/{id}/activate - Activar miembro
```

### Préstamos (7 endpoints)
```
POST   /api/v1/loans               - Prestar libro
GET    /api/v1/loans               - Listar préstamos
GET    /api/v1/loans/{id}          - Obtener préstamo
POST   /api/v1/loans/{id}/return   - Devolver libro
POST   /api/v1/loans/{id}/renew    - Renovar préstamo
GET    /api/v1/loans/overdue       - Préstamos vencidos
GET    /api/v1/loans/statistics    - Estadísticas de préstamos
```

## 🎯 Reglas de Negocio

### Libros
- ISBN debe ser único (10 o 13 dígitos)
- Copias disponibles ≤ Copias totales
- No se pueden eliminar libros con préstamos activos

### Miembros
- Email y número de miembro deben ser únicos
- Solo miembros ACTIVOS pueden pedir prestado
- Miembros con libros vencidos no pueden hacer nuevos préstamos
- Máximo 3 préstamos simultáneos (configurable)

### Préstamos
- Período de préstamo por defecto: 14 días
- Renovaciones máximas: 2 veces
- Período de renovación: 7 días cada una
- Préstamos vencidos no pueden ser renovados

## 🏗️ Arquitectura

```
┌─────────────────────────────────────┐
│      Capa API (FastAPI)             │
│   books.py | members.py | loans.py  │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│   Capa Validación (Pydantic)        │
│   *Create | *Update | *Response     │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│   Capa Servicio (Lógica Negocio)   │
│      library_service.py             │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│   Capa Modelo (ORM SQLModel)        │
│   Book | Member | Loan              │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│   Capa Base de Datos (PostgreSQL)   │
└─────────────────────────────────────┘
```

## 📂 Estructura del Proyecto

```
backend/
├── app/
│   ├── __init__.py           # App FastAPI
│   ├── database.py           # Config DB
│   ├── core/
│   │   └── config.py         # Configuración
│   ├── models/               # Modelos DB
│   │   ├── book.py
│   │   ├── member.py
│   │   └── loan.py
│   ├── schemas/              # Esquemas Pydantic
│   │   ├── book.py
│   │   ├── member.py
│   │   └── loan.py
│   ├── services/             # Lógica de negocio
│   │   └── library_service.py
│   └── api/                  # Rutas API
│       ├── books.py
│       ├── members.py
│       └── loans.py
├── tests/                    # Suite de tests
├── main.py                   # Punto de entrada
├── env.example.sh           # Setup de entorno
└── run_tests.sh             # Ejecutor de tests
```

## 🔧 Configuración

### Variables de Entorno

```bash
# Requerida
PG_CONNECTION_STRING=postgresql://user:password@localhost:5432/library

# Opcionales (con valores por defecto)
APP_NAME=LIBRARY_MANAGEMENT_SYSTEM
DEBUG=true
API_V1_PREFIX=/api/v1
```

### PostgreSQL con Docker

```bash
# Iniciar base de datos
docker-compose up -d

# String de conexión
postgresql://user:password@localhost:5432/library
```

## 💡 Ejemplos de API

### Crear un Libro
```bash
curl -X POST "http://localhost:8000/api/v1/books" \
  -H "Content-Type: application/json" \
  -d '{
    "isbn": "9780132350884",
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "category": "Ingeniería de Software",
    "total_copies": 5
  }'
```

### Registrar un Miembro
```bash
curl -X POST "http://localhost:8000/api/v1/members" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com"
  }'
```

### Prestar un Libro
```bash
curl -X POST "http://localhost:8000/api/v1/loans" \
  -H "Content-Type: application/json" \
  -d '{
    "book_id": 1,
    "member_id": 1
  }'
```

## 🛠️ Desarrollo

### Calidad de Código
```bash
# Formatear código
uv run ruff format app/

# Lint de código
uv run ruff check app/

# Verificación de tipos
uv run mypy app/
```

### Testing
```bash
# Ejecutar tests
./run_tests.sh

# Test específico
./run_tests.sh tests/test_books.py::test_create_book -v

# Con cobertura
./run_tests.sh --cov=app --cov-report=html
```

## 📊 Stack Tecnológico

| Componente | Tecnología |
|-----------|------------|
| **Framework** | FastAPI 0.119.0 |
| **ORM** | SQLModel 0.0.27 |
| **Base de Datos** | PostgreSQL 18 |
| **Servidor** | Uvicorn 0.37.0 |
| **Validación** | Pydantic 2.12.2+ |
| **Testing** | pytest 8.4.2 |
| **Python** | 3.12+ |

## 🐛 Solución de Problemas

### Error de Conexión a Base de Datos
```bash
# Verificar que PostgreSQL esté ejecutándose
docker ps

# Verificar string de conexión
echo $PG_CONNECTION_STRING
```

### Errores de Importación
```bash
# Reinstalar dependencias
uv sync
```

### Puerto Ya en Uso
```bash
# Usar puerto diferente
uvicorn main:app --port 8001

# O matar proceso
lsof -ti:8000 | xargs kill -9
```

## 📈 Mejoras Futuras

- [ ] Autenticación JWT
- [ ] Sistema de pago de multas
- [ ] Notificaciones por email para libros vencidos
- [ ] Sistema de reservas
- [ ] Reseñas y calificaciones
- [ ] Búsqueda full-text con Elasticsearch
- [ ] Funcionalidad de exportación (PDF, CSV)
- [ ] Dashboard de analytics

## 📄 Licencia

Este proyecto es parte de un desafío de entrevista para Jikkosoft.

---

**Hecho con ❤️ usando FastAPI y SQLModel**
