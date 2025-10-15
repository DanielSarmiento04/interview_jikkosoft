# 🎯 Entrevista Técnica Jikkosoft - Desafíos de Desarrollo Full Stack

> Una demostración completa de habilidades de desarrollo full-stack a través de tres desafíos técnicos progresivos

**[Español]** | **[English](README.md)**

[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.119.0-green.svg)](https://fastapi.tiangolo.com/)
[![Angular](https://img.shields.io/badge/Angular-19.0.0-red.svg)](https://angular.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://docs.docker.com/compose/)

---

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Desafíos](#desafíos)
  - [Desafío 1: Diseño de Esquema de Base de Datos](#desafío-1-diseño-de-esquema-de-base-de-datos)
  - [Desafío 2: Implementación de Algoritmo](#desafío-2-implementación-de-algoritmo)
  - [Desafío 3: Diseño de Sistema Full-Stack](#desafío-3-diseño-de-sistema-full-stack)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Inicio Rápido](#inicio-rápido)
- [Habilidades Clave Demostradas](#habilidades-clave-demostradas)
- [Autor](#autor)

---

## 🎯 Descripción General

Este repositorio contiene soluciones a tres desafíos técnicos progresivos diseñados para evaluar capacidades de desarrollo full-stack:

1. **Diseño de Base de Datos** - Crear un esquema de base de datos normalizado y escalable para una plataforma de blogs
2. **Algoritmos y Estructuras de Datos** - Implementar una solución eficiente del problema Two Sum con pruebas exhaustivas
3. **Aplicación Full-Stack** - Construir un sistema completo de gestión de biblioteca con backend FastAPI y frontend Angular

Cada desafío demuestra prácticas profesionales de ingeniería de software incluyendo código limpio, pruebas exhaustivas, documentación y estrategias de despliegue listas para producción.

---

## 📁 Estructura del Proyecto

```
interview_jikkosoft/
│
├── README.md                          # Versión en inglés
├── README_ES.md                       # Este archivo (Español)
│
├── challenge_1/                       # 🧱 Diseño de Esquema de Base de Datos
│   ├── README.md                      # Documentación del desafío
│   ├── README_ES.md                   # Documentación en español
│   ├── schema.sql                     # Esquema PostgreSQL
│   └── schema.png                     # Visualización del diagrama ER
│
├── challenge_2/                       # 🧮 Algoritmo Two Sum
│   ├── README.md                      # Documentación del desafío
│   ├── README_ES.md                   # Documentación en español
│   ├── pyproject.toml                 # Configuración del proyecto Python
│   ├── src/
│   │   └── two_sum.py                # Implementación principal
│   └── tests/
│       ├── test_two_sum.py           # Pruebas unitarias
│       └── test_performance.py       # Benchmarks de rendimiento
│
└── challenge_3/                       # 📚 Sistema de Gestión de Biblioteca
    ├── README.md                      # Documentación principal
    ├── README.es.md                   # Documentación en español
    ├── compose.yml                    # Configuración Docker Compose
    │
    ├── backend/                       # Backend FastAPI
    │   ├── README.md
    │   ├── Dockerfile
    │   ├── pyproject.toml
    │   ├── main.py
    │   ├── app/                       # Módulos de la aplicación
    │   │   ├── models/               # Modelos de base de datos SQLModel
    │   │   ├── schemas/              # Esquemas de validación Pydantic
    │   │   ├── api/                  # Endpoints REST API
    │   │   └── services/             # Lógica de negocio
    │   └── tests/                     # Suite de pruebas
    │
    └── frontend/                      # Frontend Angular
        ├── README.md
        ├── Dockerfile
        ├── angular.json
        └── src/
            └── app/
                ├── core/             # Servicios core
                └── features/         # Módulos de funcionalidades
                    ├── books/
                    ├── members/
                    └── loans/
```

---

## 🎓 Desafíos

### Desafío 1: Diseño de Esquema de Base de Datos 🧱

**Objetivo:** Diseñar un esquema de base de datos para una plataforma de blogs simple que admita usuarios, publicaciones, comentarios y etiquetas.

#### Aspectos Destacados de la Solución

✅ **Esquema PostgreSQL Normalizado** (3FN)  
✅ **Diagrama ER Completo** con visualización Mermaid  
✅ **Características Listas para Producción:**
- Claves primarias y foráneas con restricciones apropiadas
- Reglas de cascada para integridad referencial
- Campos indexados para optimización de consultas (slugs, nombres de usuario)
- Timestamps con zona horaria
- Manejo de relaciones muchos-a-muchos (publicaciones ↔ etiquetas)

#### Características Principales

- **Tabla Users**: Autenticación y gestión de perfiles
- **Tabla Posts**: Contenido del blog con flujo de publicación
- **Tabla Comments**: Soporte para discusiones anidadas
- **Tabla Tags**: Categorización de contenido
- **Tabla Post_Tags**: Sistema flexible de etiquetado muchos-a-muchos

#### Tecnologías

- PostgreSQL 14+
- SQL DDL
- Principios de normalización de bases de datos
- Modelado ER con Mermaid

📖 **[Documentación Completa](challenge_1/README_ES.md)**

---

### Desafío 2: Implementación de Algoritmo 🧮

**Objetivo:** Implementar una función que encuentre dos números en una lista que sumen un valor objetivo.

#### Aspectos Destacados de la Solución

✅ **Solución Optimizada O(n)** usando mapa hash  
✅ **Cobertura de Pruebas 95%+** con suite de pruebas exhaustiva  
✅ **Múltiples Implementaciones:**
- Enfoque con mapa hash (O(n) tiempo, O(n) espacio) - **RECOMENDADO**
- Enfoque de fuerza bruta (O(n²) tiempo, O(1) espacio) - para comparación
- Enfoque basado en generadores (eficiente en memoria)

#### Aseguramiento de Calidad

- **Pruebas**: pytest con reportes de cobertura
- **Rendimiento**: Benchmarks para 1K a 1M elementos
- **Seguridad de Tipos**: Verificación completa con mypy
- **Calidad de Código**: Linting y formateo con Ruff
- **Documentación**: Docstrings estilo Google

#### Cobertura de Pruebas

✅ Casos básicos (números positivos, negativos, mixtos)  
✅ Casos límite (ceros, duplicados, arrays grandes)  
✅ Manejo de errores (listas vacías, sin solución)  
✅ Benchmarks de rendimiento (10K, 100K, 1M elementos)

#### Tecnologías

- Python 3.12+
- pytest, pytest-cov, pytest-benchmark
- mypy (verificación de tipos)
- Ruff (linting y formateo)
- uv (gestión de paquetes)

📖 **[Documentación Completa](challenge_2/README_ES.md)**

---

### Desafío 3: Diseño de Sistema Full-Stack 📚

**Objetivo:** Diseñar e implementar un sistema de gestión de biblioteca con clases para libros, bibliotecas y miembros.

#### Aspectos Destacados de la Solución

✅ **Aplicación Full-Stack Completa**  
✅ **API RESTful** con FastAPI y SQLModel  
✅ **Frontend Moderno** con Angular 19  
✅ **Despliegue Dockerizado** con Docker Compose  
✅ **Características Listas para Producción:**
- Lógica de negocio exhaustiva
- Validación de entrada y manejo de errores
- Pruebas automatizadas
- Documentación de API (Swagger/ReDoc)
- Componentes UI responsivos

#### Características Principales

**📖 Gestión de Libros**
- Operaciones CRUD para inventario de biblioteca
- Identificación única basada en ISBN
- Seguimiento de disponibilidad
- Organización por categorías

**👥 Gestión de Miembros**
- Registro y perfiles de miembros
- Gestión de estado de membresía (Activo, Suspendido, Expirado)
- Límites de préstamo configurables
- Sistema de renovación de membresía

**🔄 Sistema de Préstamos**
- Préstamo de libros con fechas de vencimiento automáticas
- Devolución de libros con restauración de disponibilidad
- Renovaciones de préstamos (hasta 2 veces)
- Seguimiento de atrasos y cálculo de multas
- Validación de reglas de negocio

#### Arquitectura

```
┌─────────────────┐
│  Angular 19     │  Frontend (Puerto 4200)
│  (TypeScript)   │
└────────┬────────┘
         │ HTTP
         ↓
┌─────────────────┐
│  FastAPI        │  API Backend (Puerto 8000)
│  (Python 3.12)  │
└────────┬────────┘
         │ SQLModel
         ↓
┌─────────────────┐
│  PostgreSQL 18  │  Base de Datos (Puerto 5432)
└─────────────────┘
```

#### Tecnologías

**Backend:**
- FastAPI 0.119.0
- SQLModel (SQLAlchemy + Pydantic)
- PostgreSQL 18
- pytest para pruebas
- uv para gestión de paquetes

**Frontend:**
- Angular 19.0.0
- TypeScript 5.6.2
- RxJS 7.8.0
- SCSS para estilos

**DevOps:**
- Docker & Docker Compose
- Nginx (servidor web frontend)
- Builds multi-etapa para optimización

📖 **[Documentación Completa](challenge_3/README.es.md)**

---

## 🛠 Tecnologías Utilizadas

### Lenguajes y Frameworks

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| Python | 3.12+ | Desarrollo backend, algoritmos |
| TypeScript | 5.6.2 | Desarrollo frontend |
| SQL | PostgreSQL | Diseño y consultas de base de datos |
| FastAPI | 0.119.0 | Framework REST API |
| Angular | 19.0.0 | Framework frontend |

### Bases de Datos

- **PostgreSQL 18** - Base de datos de producción
- **SQLModel** - ORM y validación

### Herramientas de Desarrollo

- **uv** - Gestor de paquetes Python rápido
- **pytest** - Framework de pruebas
- **mypy** - Verificador de tipos estático
- **Ruff** - Linter y formateador Python
- **Docker** - Contenedorización
- **Docker Compose** - Orquestación multi-contenedor

### Pruebas y Calidad

- **pytest-cov** - Cobertura de código
- **pytest-benchmark** - Pruebas de rendimiento
- **mypy** - Seguridad de tipos
- **Ruff** - Calidad de código
- **Karma/Jasmine** - Pruebas Angular

---

## 🚀 Inicio Rápido

### Requisitos Previos

- **Docker** (versión 20.10+)
- **Docker Compose** (versión 2.0+)
- **Python** 3.12+ (para desarrollo local)
- **Node.js** 18+ (para desarrollo local)
- **PostgreSQL** 14+ (para desafío 1)

### Desafío 1: Esquema de Base de Datos

```bash
# Navegar al desafío 1
cd challenge_1

# Crear base de datos
createdb blog_platform

# Aplicar esquema
psql -d blog_platform -f schema.sql

# Verificar tablas
psql -d blog_platform -c "\dt"
```

### Desafío 2: Algoritmo Two Sum

```bash
# Navegar al desafío 2
cd challenge_2

# Instalar dependencias
uv sync --dev

# Ejecutar pruebas
uv run pytest

# Ejecutar con cobertura
uv run pytest --cov=src --cov-report=html

# Ver reporte de cobertura
open htmlcov/index.html

# Ejecutar benchmarks de rendimiento
uv run pytest tests/test_performance.py --benchmark-only
```

### Desafío 3: Sistema de Gestión de Biblioteca

```bash
# Navegar al desafío 3
cd challenge_3

# Iniciar todos los servicios con Docker Compose
docker compose up -d --build

# Ver logs
docker compose logs -f

# Acceder a la aplicación
# Frontend: http://localhost:4200
# API Backend: http://localhost:8000
# Docs API: http://localhost:8000/docs
```

**Instrucciones detalladas de configuración disponibles en el README de cada desafío.**

---

## 🎓 Habilidades Clave Demostradas

### Principios de Ingeniería de Software

✅ **Principios SOLID** - Arquitectura de código mantenible y extensible  
✅ **DRY (Don't Repeat Yourself)** - Reutilización de código  
✅ **Código Limpio** - Código legible y autodocumentado  
✅ **Patrones de Diseño** - Patrones Repository, Service, MVC  

### Diseño de Bases de Datos

✅ **Normalización** - Diseño de base de datos en 3FN  
✅ **Integridad Referencial** - Claves foráneas y restricciones  
✅ **Optimización de Consultas** - Indexación estratégica  
✅ **Evolución de Esquema** - Diseño extensible  

### Algoritmos y Estructuras de Datos

✅ **Análisis de Complejidad Temporal** - O(n) vs O(n²)  
✅ **Complejidad Espacial** - Optimización de memoria  
✅ **Mapas Hash** - Búsquedas eficientes  
✅ **Benchmarking de Rendimiento** - Pruebas de rendimiento en el mundo real  

### Desarrollo Backend

✅ **Diseño de API RESTful** - Métodos HTTP y códigos de estado estándar  
✅ **Validación de Entrada** - Esquemas Pydantic  
✅ **Manejo de Errores** - Manejo exhaustivo de excepciones  
✅ **Uso de ORM** - SQLModel/SQLAlchemy  
✅ **Lógica de Negocio** - Patrón de capa de servicio  

### Desarrollo Frontend

✅ **Framework Moderno** - Angular 19 con componentes standalone  
✅ **TypeScript** - Desarrollo frontend con seguridad de tipos  
✅ **Programación Reactiva** - Observables RxJS  
✅ **Arquitectura de Componentes** - Componentes modulares y reutilizables  
✅ **Servicios HTTP** - Integración con API  

### Pruebas y Aseguramiento de Calidad

✅ **Pruebas Unitarias** - pytest, Jasmine  
✅ **Cobertura de Pruebas** - Cobertura 95%+  
✅ **Pruebas de Rendimiento** - Benchmarking  
✅ **Verificación de Tipos** - mypy, TypeScript  
✅ **Linting** - Ruff, ESLint  

### DevOps y Despliegue

✅ **Contenedorización** - Builds multi-etapa Docker  
✅ **Orquestación** - Docker Compose  
✅ **Gestión de Entornos** - Gestión de configuración  
✅ **Gestión de Dependencias** - uv, npm  

### Documentación

✅ **Archivos README** - Documentación exhaustiva del proyecto  
✅ **Documentación de API** - OpenAPI/Swagger  
✅ **Comentarios de Código** - Docstrings y comentarios en línea  
✅ **Diagramas ER** - Diseño visual de base de datos  
✅ **Documentación Bilingüe** - Inglés y Español  

---

## 📊 Estadísticas del Proyecto

| Métrica | Valor |
|---------|-------|
| Total de Líneas de Código | ~5,000+ |
| Cobertura de Pruebas | 95%+ |
| Número de Endpoints | 20+ APIs REST |
| Tablas de Base de Datos | 8 (en todos los desafíos) |
| Servicios Docker | 3 contenedores |
| Archivos de Documentación | 14 archivos README |
| Idiomas Soportados | Inglés, Español |

---

## 🔗 Navegación

### Documentación de Desafíos

- **[Desafío 1: Esquema de Base de Datos](challenge_1/README_ES.md)** - Diseño de base de datos de plataforma de blogs
- **[Desafío 2: Algoritmo Two Sum](challenge_2/README_ES.md)** - Implementación de algoritmo optimizado
- **[Desafío 3: Sistema de Biblioteca](challenge_3/README.es.md)** - Aplicación full-stack

### Documentación en Inglés

- **[README in English](README.md)** - Main documentation
- **[Challenge 1: Database Schema](challenge_1/README.md)**
- **[Challenge 2: Two Sum Algorithm](challenge_2/README.md)**
- **[Challenge 3: Library System](challenge_3/README.md)**

---

## 🧑‍💻 Autor

**Daniel Sarmiento**  
*Desarrollador Full Stack Senior*

**Habilidades Demostradas:**
- Desarrollo Full-Stack (Python, TypeScript, SQL)
- Desarrollo Backend (FastAPI, SQLModel, PostgreSQL)
- Desarrollo Frontend (Angular, RxJS, TypeScript)
- Diseño y Optimización de Bases de Datos
- Diseño y Análisis de Algoritmos
- DevOps y Contenedorización (Docker, Docker Compose)
- Pruebas y Aseguramiento de Calidad
- Documentación Técnica

**Contacto:**
- GitHub: [@DanielSarmiento04](https://github.com/DanielSarmiento04)

---

## 📄 Licencia

Este proyecto es parte de una entrevista técnica para Jikkosoft.  
© 2025 Daniel Sarmiento. Todos los derechos reservados.


**¡Gracias por revisar esta presentación!** 🚀
