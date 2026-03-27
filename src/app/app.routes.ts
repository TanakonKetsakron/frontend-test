import { Routes } from '@angular/router';
import { UserListComponent } from './pages/users/user-list/user-list';
import { UserFormComponent } from './pages/users/user-form/user-form';
import { DepartmentListComponent } from './pages/departments/department-list/department-list';
import { DepartmentDetailComponent } from './pages/departments/department-detail/department-detail';

export const routes: Routes = [
  { path: '', component: UserListComponent },
  { path: 'create', component: UserFormComponent },
  { path: 'edit/:id', component: UserFormComponent },
  { path: 'users/:id', component: UserListComponent }, // user detail — ดูด้านล่าง
  { path: 'departments', component: DepartmentListComponent },
  { path: 'departments/:id', component: DepartmentDetailComponent },
];