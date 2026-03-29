import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./pages/users/user-list/user-list').then(m => m.UserListComponent)
  },
  { 
    path: 'create', 
    loadComponent: () => import('./pages/users/user-form/user-form').then(m => m.UserFormComponent)
  },
  { 
    path: 'edit/:id', 
    loadComponent: () => import('./pages/users/user-form/user-form').then(m => m.UserFormComponent)
  },
  { 
    path: 'users/:id', 
    loadComponent: () => import('./pages/users/user-detail/user-detail').then(m => m.UserDetailComponent)
  },
  { 
    path: 'departments', 
    loadComponent: () => import('./pages/departments/department-list/department-list').then(m => m.DepartmentListComponent)
  },
  { 
    path: 'departments/:id', 
    loadComponent: () => import('./pages/departments/department-detail/department-detail').then(m => m.DepartmentDetailComponent)
  },
  { path: '**', redirectTo: '/' }
];