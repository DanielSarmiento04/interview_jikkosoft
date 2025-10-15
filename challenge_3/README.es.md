# Sistema de Gestión de Bibliotecas 📚

> Un sistema completo de gestión de bibliotecas full-stack construido con FastAPI y Angular

[English Version](./README.md)

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Ejecutar la Aplicación](#ejecutar-la-aplicación)
- [Documentación de la API](#documentación-de-la-api)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Pruebas](#pruebas)
- [Solución de Problemas](#solución-de-problemas)

## 🎯 Descripción General

Este proyecto implementa un **sistema simple de gestión de bibliotecas** con clases para libros, bibliotecas y miembros. El sistema permite:

- **Gestión de Libros**: Agregar, actualizar, eliminar y buscar libros en el inventario de la biblioteca
- **Gestión de Miembros**: Registrar, actualizar y administrar miembros de la biblioteca
- **Sistema de Préstamos**: Prestar, devolver y renovar préstamos de libros con seguimiento automático
- **Reglas de Negocio**: Aplicar disponibilidad, fechas de vencimiento, límites de renovación y validaciones de membresía

## ✨ Características

### Gestión de Libros
- ✅ Operaciones CRUD para libros
- ✅ Identificación única basada en ISBN
- ✅ Seguimiento de copias totales y disponibles
- ✅ Clasificación por categorías
- ✅ Gestión automática de disponibilidad

### Gestión de Miembros
- ✅ Registro y perfiles de miembros
- ✅ Estado de membresía (Activo, Suspendido, Expirado)
- ✅ Límites de préstamos configurables por miembro
- ✅ Sistema de renovación de membresía

### Sistema de Préstamos
- ✅ Préstamo de libros con cálculo automático de fecha de vencimiento
- ✅ Devolución de libros con restauración de disponibilidad
- ✅ Renovaciones de préstamos (hasta 2 veces)
- ✅ Seguimiento de retrasos y cálculo de multas
- ✅ Validación de reglas de negocio (disponibilidad, estado de membresía, límites de préstamos)

## 🛠 Stack Tecnológico

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) 0.119.0
- **Base de Datos**: PostgreSQL 18 con [SQLModel](https://sqlmodel.tiangolo.com/) (SQLAlchemy + Pydantic)
- **Validación**: Pydantic 2.12.2
- **Servidor**: Uvicorn 0.37.0
- **Gestor de Paquetes**: [uv](https://github.com/astral-sh/uv) - Instalador ultra-rápido de paquetes Python

### Frontend
- **Framework**: [Angular](https://angular.dev/) 19.0.0
- **Lenguaje**: TypeScript 5.6.2
- **Estilos**: SCSS
- **Cliente HTTP**: RxJS 7.8.0

### DevOps e Infraestructura
- **Contenedorización**: Docker y Docker Compose
- **Base de Datos**: PostgreSQL 18
- **Servidor Web**: Nginx (para frontend)
- **Versión de Python**: 3.12

### Herramientas de Desarrollo
- **Pruebas**: pytest 8.4.2, pytest-cov, pytest-benchmark
- **Linting**: Ruff 0.14.0
- **Verificación de Tipos**: mypy 1.18.2
- **Pruebas de API**: httpx 0.27.2

## 🏗 Arquitectura

```
Sistema de Gestión de Bibliotecas
│
├── Backend (FastAPI)
│   ├── API RESTful
│   ├── Capa de Lógica de Negocio
│   ├── Capa de Acceso a Datos (SQLModel)
│   └── Base de Datos PostgreSQL
│
├── Frontend (Angular)
│   ├── Componentes
│   ├── Servicios (Clientes HTTP)
│   └── Enrutamiento
│
└── Infraestructura (Docker)
    ├── Contenedor PostgreSQL
    ├── Contenedor Backend
    └── Contenedor Frontend (Nginx)
```

### Modelos de Base de Datos

El sistema implementa tres modelos principales:

1. **Book (Libro)**: Representa libros de la biblioteca con gestión de inventario
2. **Member (Miembro)**: Representa miembros de la biblioteca con gestión de membresía
3. **Loan (Préstamo)**: Representa transacciones de préstamo de libros que vinculan libros y miembros

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- **Docker** (versión 20.10 o superior)
- **Docker Compose** (versión 2.0 o superior)

### Opcional (para desarrollo local sin Docker):
- **Python** 3.12+
- **Node.js** 18+ y npm
- **PostgreSQL** 18+
- **uv** (gestor de paquetes Python): `pip install uv`

## 🚀 Instalación y Configuración

### Método 1: Usando Docker (Recomendado)

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd challenge_3
   ```

2. **Iniciar la base de datos**
   ```bash
   docker compose up -d db
   ```

3. **Verificar la creación de la base de datos**
   ```bash
   docker exec -it db psql -U user -c "\l"
   ```
   
   Deberías ver la base de datos `library` en la lista. Si no, créala manualmente:
   ```bash
   docker exec -it db psql -U user -c "CREATE DATABASE library;"
   ```

4. **Construir e iniciar todos los servicios**
   ```bash
   docker compose up -d --build
   ```

5. **Verificar que todos los contenedores están corriendo**
   ```bash
   docker compose ps
   ```

### Método 2: Configuración de Desarrollo Local

#### Configuración del Backend

1. **Navegar al directorio backend**
   ```bash
   cd backend
   ```

2. **Instalar dependencias usando uv**
   ```bash
   uv sync
   ```

3. **Configurar variables de entorno**
   ```bash
   export PG_CONNECTION_STRING="postgresql://user:password@localhost:5432/library"
   ```

4. **Ejecutar el backend**
   ```bash
   uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   O usar el script proporcionado:
   ```bash
   sh ./env.example.sh
   ```

#### Configuración del Frontend

1. **Navegar al directorio frontend**
   ```bash
   cd frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar el servidor de desarrollo**
   ```bash
   npm start
   ```

## 🎮 Ejecutar la Aplicación

### Puntos de Acceso

Una vez que todos los servicios estén corriendo:

| Servicio | URL | Descripción |
|---------|-----|-------------|
| **Frontend** | http://localhost:4200 | Aplicación Angular |
| **API Backend** | http://localhost:8000 | API REST FastAPI |
| **Docs API (Swagger)** | http://localhost:8000/docs | Documentación interactiva de la API |
| **Docs API (ReDoc)** | http://localhost:8000/redoc | Documentación alternativa de la API |
| **PostgreSQL** | localhost:5432 | Base de datos (usuario: `user`, contraseña: `password`) |

### Comandos de Inicio Rápido

```bash
# Iniciar todos los servicios
docker compose up -d

# Ver logs
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f backend
docker compose logs -f frontend

# Detener todos los servicios
docker compose down

# Detener y eliminar volúmenes (reinicio limpio)
docker compose down -v

# Reconstruir y reiniciar
docker compose up -d --build
```

## 📖 Documentación de la API

### URL Base
```
http://localhost:8000/api/v1
```

### Endpoints Principales

#### Libros
- `GET /books` - Listar todos los libros
- `POST /books` - Crear un nuevo libro
- `GET /books/{id}` - Obtener libro por ID
- `PUT /books/{id}` - Actualizar libro
- `DELETE /books/{id}` - Eliminar libro
- `GET /books/isbn/{isbn}` - Buscar por ISBN
- `GET /books/search?query=...` - Buscar libros

#### Miembros
- `GET /members` - Listar todos los miembros
- `POST /members` - Registrar un nuevo miembro
- `GET /members/{id}` - Obtener miembro por ID
- `PUT /members/{id}` - Actualizar miembro
- `DELETE /members/{id}` - Eliminar miembro
- `GET /members/{id}/loans` - Obtener historial de préstamos del miembro

#### Préstamos
- `GET /loans` - Listar todos los préstamos
- `POST /loans` - Prestar un libro
- `GET /loans/{id}` - Obtener préstamo por ID
- `PUT /loans/{id}/return` - Devolver un libro
- `PUT /loans/{id}/renew` - Renovar un préstamo
- `GET /loans/overdue` - Listar préstamos vencidos

### Ejemplos de Llamadas a la API

**Crear un Libro:**
```bash
curl -X POST "http://localhost:8000/api/v1/books" \
  -H "Content-Type: application/json" \
  -d '{
    "isbn": "9780132350884",
    "title": "Código Limpio",
    "author": "Robert C. Martin",
    "publisher": "Prentice Hall",
    "publication_year": 2008,
    "category": "Ingeniería de Software",
    "description": "Un Manual de Artesanía Ágil de Software",
    "total_copies": 5,
    "available_copies": 5
  }'
```

**Registrar un Miembro:**
```bash
curl -X POST "http://localhost:8000/api/v1/members" \
  -H "Content-Type: application/json" \
  -d '{
    "member_number": "MEM2024001",
    "name": "Juan Pérez",
    "email": "juan.perez@ejemplo.com",
    "phone": "+1234567890",
    "address": "Calle Principal 123, Ciudad, País"
  }'
```

**Prestar un Libro:**
```bash
curl -X POST "http://localhost:8000/api/v1/loans" \
  -H "Content-Type: application/json" \
  -d '{
    "book_id": 1,
    "member_id": 1
  }'
```

## 📁 Estructura del Proyecto

```
challenge_3/
│
├── compose.yml                 # Configuración de Docker Compose
├── init-db.sh                  # Script de inicialización de base de datos
├── README.md                   # Versión en inglés
├── README.es.md               # Este archivo (Español)
│
├── backend/                    # Backend FastAPI
│   ├── Dockerfile             # Definición del contenedor backend
│   ├── pyproject.toml         # Dependencias Python (uv)
│   ├── uv.lock               # Archivo lock de dependencias
│   ├── main.py               # Punto de entrada de la aplicación
│   ├── env.example.sh        # Ejemplo de configuración de entorno
│   │
│   ├── app/
│   │   ├── __init__.py       # Inicialización de la app con lifespan
│   │   ├── database.py       # Configuración de base de datos
│   │   ├── views.py          # Utilidades de vistas
│   │   │
│   │   ├── core/
│   │   │   └── config.py     # Configuración y ajustes
│   │   │
│   │   ├── models/           # Modelos de base de datos SQLModel
│   │   │   ├── book.py       # Modelo Libro
│   │   │   ├── member.py     # Modelo Miembro
│   │   │   └── loan.py       # Modelo Préstamo
│   │   │
│   │   ├── schemas/          # Esquemas Pydantic para validación
│   │   │   ├── book.py
│   │   │   ├── member.py
│   │   │   └── loan.py
│   │   │
│   │   ├── api/              # Endpoints de la API
│   │   │   ├── books.py      # Rutas de libros
│   │   │   ├── members.py    # Rutas de miembros
│   │   │   ├── loans.py      # Rutas de préstamos
│   │   │   └── deps.py       # Dependencias
│   │   │
│   │   └── services/
│   │       └── library_service.py  # Lógica de negocio
│   │
│   └── tests/                # Suite de pruebas
│       ├── conftest.py       # Configuración de pruebas
│       └── test_books.py     # Pruebas de libros
│
└── frontend/                 # Frontend Angular
    ├── Dockerfile           # Definición del contenedor frontend
    ├── nginx.conf          # Configuración de Nginx
    ├── package.json        # Dependencias Node.js
    ├── angular.json        # Configuración Angular
    ├── tsconfig.json       # Configuración TypeScript
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

## 🧪 Pruebas

### Pruebas del Backend

Ejecutar la suite de pruebas:

```bash
# Navegar al directorio backend
cd backend

# Ejecutar todas las pruebas
uv run pytest

# Ejecutar con cobertura
uv run pytest --cov=app --cov-report=html

# Ejecutar archivo de prueba específico
uv run pytest tests/test_books.py

# Ejecutar con salida detallada
uv run pytest -v
```

O usar el script proporcionado:
```bash
sh ./run_tests.sh
```

### Pruebas del Frontend

```bash
cd frontend

# Ejecutar pruebas unitarias
npm test

# Ejecutar pruebas con cobertura
npm run test -- --code-coverage
```

## 🔧 Solución de Problemas

### Problema: La base de datos "library" no existe

**Error:**
```
psycopg2.OperationalError: FATAL: database "library" does not exist
```

**Solución:**
```bash
# Crear la base de datos manualmente
docker exec -it db psql -U user -c "CREATE DATABASE library;"

# O reiniciar con volúmenes limpios
docker compose down -v
docker compose up -d
```

### Problema: El contenedor backend falla con "uvicorn executable not found"

**Error:**
```
OCI runtime create failed: runc create failed: "uvicorn" executable file not found in $PATH
```

**Solución:**
Asegúrate de que tu `backend/Dockerfile` use `uv run`:
```dockerfile
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
```

### Problema: Puerto ya en uso

**Error:**
```
Bind for 0.0.0.0:5432 failed: port is already allocated
```

**Solución:**
```bash
# Verificar qué está usando el puerto
lsof -i :5432

# Detener el servicio conflictivo o cambiar el puerto en compose.yml
# Modificar: "5433:5432" para usar un puerto diferente en el host
```

### Problema: Conexión rechazada al backend

**Solución:**
```bash
# Verificar logs del contenedor backend
docker compose logs backend

# Verificar que el backend esté corriendo
docker compose ps

# Reiniciar backend
docker compose restart backend
```

### Problema: El frontend no puede conectarse al backend

**Solución:**
Verificar la configuración de entorno en `frontend/src/environments/`:
- Asegurarse de que la URL de la API apunte al endpoint correcto del backend
- Para Docker: `http://localhost:8000`
- Para desarrollo: Actualizar según sea necesario

## 📝 Variables de Entorno

### Backend (.env)

```bash
# Conexión a Base de Datos
PG_CONNECTION_STRING=postgresql://user:password@db:5432/library

# Configuración de Aplicación
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

## 📄 Licencia

Este proyecto es parte de un desafío de entrevista para Jikkosoft.


