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
    path: 'libraries',
    loadComponent: () =>
      import('./features/libraries/components/library-list.component').then(
        m => m.LibraryListComponent
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
    path: '**',
    redirectTo: 'dashboard'
  }
];
