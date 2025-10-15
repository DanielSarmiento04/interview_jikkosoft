# 📚 Library Management System - Frontend

[🇪🇸 Versión en Español](./README.es.md)

## 🎯 Goal

Modern Angular 19 application for managing a library system with book inventory, member management, and loan tracking using reactive signals and standalone components.

## 🏗️ Architecture

**Framework**: Angular 19.0.0 (Standalone Components)  
**State Management**: Signals (reactive, built-in)  
**Styling**: SCSS with component-scoped styles  
**Routing**: Lazy-loaded feature modules

## 📁 Project Structure

```
src/app/
├── features/
│   ├── dashboard/         # Overview statistics & quick actions
│   ├── books/             # Book catalog CRUD operations
│   ├── members/           # Member management & status
│   └── loans/             # Loan checkout, return & renewals
├── shared/
│   └── models/            # Shared TypeScript interfaces
└── app.routes.ts          # Route definitions
```

## 🔑 Core Features

### 📖 Books Module
- **List**: Search, filter by availability (available/checked out)
- **Create**: Add new books with ISBN, author, genre, year
- **Edit**: Update details, manage inventory quantity
- **Delete**: Remove books (if not currently loaned)

### 👥 Members Module
- **List**: Filter by status (active/suspended/expired)
- **Create**: Register new members with auto-generated ID
- **Edit**: Update info, change status, set max loan limit
- **Statistics**: Track active loans, total borrows, overdue status

### 📋 Loans Module
- **Checkout**: Assign books to active members with due dates
- **Return**: Mark books as returned, update availability
- **Renew**: Extend due dates (max 3 renewals per loan)
- **Overdue Tracking**: Automatic calculation of overdue days
- **Statistics**: Active loans, overdue count, return rates

### 📊 Dashboard
- Real-time statistics from all modules
- Available vs total books ratio
- Active members count
- Current loans & overdue alerts
- Quick action buttons for common tasks

## 🧩 Main Components

| Component | Purpose | Key Logic |
|-----------|---------|-----------|
| `dashboard.component` | Statistics overview | Computed signals for real-time stats |
| `book-list.component` | Book catalog | Search & availability filtering |
| `book-form.component` | Create books | Reactive forms with validation |
| `book-edit.component` | Edit/delete books | Pre-filled forms, delete confirmation |
| `member-list.component` | Member directory | Status filtering, loan counts |
| `member-form.component` | Register members | Email validation, auto member number |
| `member-edit.component` | Update members | Status management, max loans config |
| `loan-list.component` | Active loans | Overdue detection, return/renew actions |
| `loan-form.component` | Checkout books | Only available books & active members |

## 🔄 Service Layer

**Signal-based reactive state management:**

```typescript
// Example: LoanService
private loansSignal = signal<Loan[]>([]);
loans = this.loansSignal.asReadonly();

// Computed properties
activeLoans = computed(() => 
  this.loansSignal().filter(loan => !loan.return_date).length
);

overdueLoans = computed(() =>
  this.loansSignal().filter(loan =>
    !loan.return_date && new Date(loan.due_date) < new Date()
  ).length
);
```

**Services:**
- `BookService`: HTTP operations, availability tracking
- `MemberService`: CRUD operations, active member filtering
- `LoanService`: Checkout/return/renew logic, overdue calculations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun runtime
- Angular CLI 19+

### Installation

```bash
# Install dependencies
npm install
# or
bun install
```

### Development Server

```bash
npm start
# or
bun run start
```

Navigate to `http://localhost:4200/`

### Build

```bash
npm run build
# Production build → dist/ folder
```

### Run Tests

```bash
npm test
```

## � Docker Deployment

### Build Docker Image

```bash
docker build -t library-frontend:latest .
```

### Run Container

```bash
docker run -d -p 8080:80 --name library-frontend library-frontend:latest
```

Access the application at `http://localhost:8080`

### Using Docker Compose

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

### Production Deployment

The Dockerfile uses a multi-stage build:
- **Stage 1**: Node.js 20 Alpine builds the Angular app
- **Stage 2**: Nginx 1.27 Alpine serves static files

Features:
- ✅ Optimized production build
- ✅ Gzip compression enabled
- ✅ Security headers configured
- ✅ Static asset caching (1 year)
- ✅ Angular routing support (SPA)
- ✅ Health check endpoint `/health`
- ✅ Small image size (~50MB)

## �🛣️ Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | → `/dashboard` | Redirect to dashboard |
| `/dashboard` | DashboardComponent | Statistics overview |
| `/books` | BookListComponent | Book catalog |
| `/books/new` | BookFormComponent | Create new book |
| `/books/:id` | BookEditComponent | Edit existing book |
| `/members` | MemberListComponent | Members directory |
| `/members/new` | MemberFormComponent | Register member |
| `/members/:id` | MemberEditComponent | Edit member details |
| `/loans` | LoanListComponent | Active & returned loans |
| `/loans/new` | LoanFormComponent | Checkout book |

## 🎨 Styling Approach

- **SCSS**: Nesting, variables, mixins support
- **Component-scoped**: Each component has `.scss` file
- **Responsive**: Mobile-first design with media queries
- **Animations**: Smooth transitions on hover/focus
- **BEM-inspired**: Structured class naming conventions

## 📦 Key Dependencies

```json
{
  "@angular/core": "^19.0.0",
  "@angular/forms": "^19.0.0",
  "@angular/router": "^19.0.0",
  "rxjs": "~7.8.0"
}
```

## 🧪 Business Rules

- **Members**: Max 5 loans by default (configurable per member)
- **Loans**: 14-day default loan period
- **Renewals**: Maximum 3 renewals per loan
- **Overdue**: Auto-calculated based on due_date vs current date
- **Availability**: Books with `quantity > 0` are available
- **Checkout**: Only active members can borrow books

## 🔧 Technical Highlights

- ✅ **Signals**: Modern reactive state (no RxJS for state)
- ✅ **Standalone**: No NgModules, lightweight bundles
- ✅ **Lazy Loading**: Route-based code splitting
- ✅ **TypeScript**: Strict mode, full type safety
- ✅ **OnPush**: Change detection optimization
- ✅ **Reactive Forms**: Validation with FormBuilder
- ✅ **Separation of Concerns**: HTML/SCSS/TS files per component

## 📝 Notes

- API URL configured in `environment.ts`
- All dates in ISO format (YYYY-MM-DD)
- Error handling with user-friendly messages
- Loading states for async operations
- Confirmation dialogs for destructive actions

---

**Developed with Angular 19 | Standalone Components | Signal-based State Management**
