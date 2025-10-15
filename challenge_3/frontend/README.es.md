# 📚 Sistema de Gestión de Biblioteca - Frontend

[🇬🇧 English Version](./README.md)

## 🎯 Objetivo

Aplicación moderna en Angular 19 para gestionar un sistema de biblioteca con inventario de libros, administración de miembros y seguimiento de préstamos usando signals reactivos y componentes standalone.

## 🏗️ Arquitectura

**Framework**: Angular 19.0.0 (Componentes Standalone)  
**Gestión de Estado**: Signals (reactivo, integrado)  
**Estilos**: SCSS con estilos por componente  
**Enrutamiento**: Módulos de características con carga diferida

## 📁 Estructura del Proyecto

```
src/app/
├── features/
│   ├── dashboard/         # Estadísticas generales y acciones rápidas
│   ├── books/             # Operaciones CRUD de catálogo de libros
│   ├── members/           # Gestión de miembros y estados
│   └── loans/             # Préstamos, devoluciones y renovaciones
├── shared/
│   └── models/            # Interfaces TypeScript compartidas
└── app.routes.ts          # Definiciones de rutas
```

## 🔑 Características Principales

### 📖 Módulo de Libros
- **Listar**: Búsqueda, filtro por disponibilidad (disponible/prestado)
- **Crear**: Agregar nuevos libros con ISBN, autor, género, año
- **Editar**: Actualizar detalles, gestionar cantidad de inventario
- **Eliminar**: Remover libros (si no están prestados actualmente)

### 👥 Módulo de Miembros
- **Listar**: Filtrar por estado (activo/suspendido/expirado)
- **Crear**: Registrar nuevos miembros con ID autogenerado
- **Editar**: Actualizar información, cambiar estado, configurar límite de préstamos
- **Estadísticas**: Rastrear préstamos activos, total de préstamos, estado de atrasos

### 📋 Módulo de Préstamos
- **Prestar**: Asignar libros a miembros activos con fechas de vencimiento
- **Devolver**: Marcar libros como devueltos, actualizar disponibilidad
- **Renovar**: Extender fechas de vencimiento (máx. 3 renovaciones por préstamo)
- **Seguimiento de Atrasos**: Cálculo automático de días de atraso
- **Estadísticas**: Préstamos activos, contador de atrasos, tasas de devolución

### 📊 Dashboard
- Estadísticas en tiempo real de todos los módulos
- Ratio de libros disponibles vs total
- Conteo de miembros activos
- Préstamos actuales y alertas de atrasos
- Botones de acción rápida para tareas comunes

## 🧩 Componentes Principales

| Componente | Propósito | Lógica Principal |
|-----------|---------|-----------|
| `dashboard.component` | Vista general de estadísticas | Signals computados para estadísticas en tiempo real |
| `book-list.component` | Catálogo de libros | Búsqueda y filtrado por disponibilidad |
| `book-form.component` | Crear libros | Formularios reactivos con validación |
| `book-edit.component` | Editar/eliminar libros | Formularios prellenados, confirmación de eliminación |
| `member-list.component` | Directorio de miembros | Filtrado por estado, contador de préstamos |
| `member-form.component` | Registrar miembros | Validación de email, número de miembro automático |
| `member-edit.component` | Actualizar miembros | Gestión de estado, configuración de préstamos máximos |
| `loan-list.component` | Préstamos activos | Detección de atrasos, acciones de devolución/renovación |
| `loan-form.component` | Prestar libros | Solo libros disponibles y miembros activos |

## 🔄 Capa de Servicios

**Gestión de estado reactivo basado en signals:**

```typescript
// Ejemplo: LoanService
private loansSignal = signal<Loan[]>([]);
loans = this.loansSignal.asReadonly();

// Propiedades computadas
activeLoans = computed(() => 
  this.loansSignal().filter(loan => !loan.return_date).length
);

overdueLoans = computed(() =>
  this.loansSignal().filter(loan =>
    !loan.return_date && new Date(loan.due_date) < new Date()
  ).length
);
```

**Servicios:**
- `BookService`: Operaciones HTTP, seguimiento de disponibilidad
- `MemberService`: Operaciones CRUD, filtrado de miembros activos
- `LoanService`: Lógica de préstamo/devolución/renovación, cálculos de atrasos

## 🚀 Comenzar

### Requisitos Previos
- Node.js 18+ o runtime Bun
- Angular CLI 19+

### Instalación

```bash
# Instalar dependencias
npm install
# o
bun install
```

### Servidor de Desarrollo

```bash
npm start
# o
bun run start
```

Navegar a `http://localhost:4200/`

### Compilar

```bash
npm run build
# Compilación de producción → carpeta dist/
```

### Ejecutar Pruebas

```bash
npm test
```

## � Despliegue con Docker

### Construir Imagen Docker

```bash
docker build -t library-frontend:latest .
```

### Ejecutar Contenedor

```bash
docker run -d -p 8080:80 --name library-frontend library-frontend:latest
```

Acceder a la aplicación en `http://localhost:8080`

### Usando Docker Compose

```bash
# Iniciar la aplicación
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener la aplicación
docker-compose down
```

### Despliegue en Producción

El Dockerfile usa construcción multi-etapa:
- **Etapa 1**: Node.js 20 Alpine construye la aplicación Angular
- **Etapa 2**: Nginx 1.27 Alpine sirve archivos estáticos

Características:
- ✅ Compilación optimizada para producción
- ✅ Compresión gzip habilitada
- ✅ Encabezados de seguridad configurados
- ✅ Caché de assets estáticos (1 año)
- ✅ Soporte de enrutamiento Angular (SPA)
- ✅ Endpoint de health check `/health`
- ✅ Imagen pequeña (~50MB)

## �🛣️ Rutas

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | → `/dashboard` | Redirección al dashboard |
| `/dashboard` | DashboardComponent | Vista general de estadísticas |
| `/books` | BookListComponent | Catálogo de libros |
| `/books/new` | BookFormComponent | Crear nuevo libro |
| `/books/:id` | BookEditComponent | Editar libro existente |
| `/members` | MemberListComponent | Directorio de miembros |
| `/members/new` | MemberFormComponent | Registrar miembro |
| `/members/:id` | MemberEditComponent | Editar detalles de miembro |
| `/loans` | LoanListComponent | Préstamos activos y devueltos |
| `/loans/new` | LoanFormComponent | Prestar libro |

## 🎨 Enfoque de Estilos

- **SCSS**: Soporte para anidamiento, variables, mixins
- **Por componente**: Cada componente tiene archivo `.scss`
- **Responsive**: Diseño mobile-first con media queries
- **Animaciones**: Transiciones suaves en hover/focus
- **Inspirado en BEM**: Convenciones estructuradas de nombres de clases

## 📦 Dependencias Principales

```json
{
  "@angular/core": "^19.0.0",
  "@angular/forms": "^19.0.0",
  "@angular/router": "^19.0.0",
  "rxjs": "~7.8.0"
}
```

## 🧪 Reglas de Negocio

- **Miembros**: Máximo 5 préstamos por defecto (configurable por miembro)
- **Préstamos**: Período de préstamo predeterminado de 14 días
- **Renovaciones**: Máximo 3 renovaciones por préstamo
- **Atrasos**: Calculado automáticamente basado en due_date vs fecha actual
- **Disponibilidad**: Libros con `quantity > 0` están disponibles
- **Préstamo**: Solo miembros activos pueden pedir libros prestados

## 🔧 Aspectos Técnicos Destacados

- ✅ **Signals**: Estado reactivo moderno (sin RxJS para estado)
- ✅ **Standalone**: Sin NgModules, bundles ligeros
- ✅ **Lazy Loading**: División de código basada en rutas
- ✅ **TypeScript**: Modo estricto, seguridad de tipos completa
- ✅ **OnPush**: Optimización de detección de cambios
- ✅ **Reactive Forms**: Validación con FormBuilder
- ✅ **Separación de Responsabilidades**: Archivos HTML/SCSS/TS por componente

## 📝 Notas

- URL de API configurada en `environment.ts`
- Todas las fechas en formato ISO (YYYY-MM-DD)
- Manejo de errores con mensajes amigables
- Estados de carga para operaciones asíncronas
- Diálogos de confirmación para acciones destructivas

---

**Desarrollado con Angular 19 | Componentes Standalone | Gestión de Estado basada en Signals**
