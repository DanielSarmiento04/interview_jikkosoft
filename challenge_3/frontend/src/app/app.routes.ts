import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/components/dashboard.component').then(
        m => m.DashboardComponent
      )
  },
  {
    path: 'books',
    loadComponent: () =>
      import('./features/books/components/book-list.component').then(
        m => m.BookListComponent
      )
  },
  {
    path: 'books/new',
    loadComponent: () =>
      import('./features/books/components/book-form.component').then(
        m => m.BookFormComponent
      )
  },
  {
    path: 'books/:id',
    loadComponent: () =>
      import('./features/books/components/book-edit.component').then(
        m => m.BookEditComponent
      )
  },
  {
    path: 'members',
    loadComponent: () =>
      import('./features/members/components/member-list.component').then(
        m => m.MemberListComponent
      )
  },
  {
    path: 'members/new',
    loadComponent: () =>
      import('./features/members/components/member-form.component').then(
        m => m.MemberFormComponent
      )
  },
  {
    path: 'members/:id',
    loadComponent: () =>
      import('./features/members/components/member-edit.component').then(
        m => m.MemberEditComponent
      )
  },
  {
    path: 'loans',
    loadComponent: () =>
      import('./features/loans/components/loan-list.component').then(
        m => m.LoanListComponent
      )
  },
  {
    path: 'loans/new',
    loadComponent: () =>
      import('./features/loans/components/loan-form.component').then(
        m => m.LoanFormComponent
      )
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
