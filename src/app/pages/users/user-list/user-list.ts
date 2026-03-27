import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { DepartmentService } from '../../../services/department.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './user-list.html',
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  departments: any[] = [];
  loading = false;

  search = '';
  gender = '';
  department_id = '';
  sort = '';
  page = 1;
  totalPages = 1;

  private searchSubject = new Subject<string>();

  constructor(
    private userService: UserService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadDepartments();

    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.page = 1;
        this.loadUsers();
      });
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  loadUsers() {
    this.loading = true;
    const params: any = { page: this.page, limit: 10 };
    if (this.search) params.search = this.search;
    if (this.gender) params.gender = this.gender;
    if (this.department_id) params.department_id = this.department_id;
    if (this.sort) params.sort = this.sort;

    this.userService.getAll(params).subscribe({
      next: (res) => {
        this.users = res.data.users;
        this.totalPages = res.data.pagination.totalPages;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  loadDepartments() {
    this.departmentService.getAll().subscribe((res: any) => {
      this.departments = res.data;
    });
  }

  onSearchChange() {
    this.searchSubject.next(this.search);
  }

  onFilterChange() {
    this.page = 1;
    this.loadUsers();
  }

  changePage(p: number) {
    this.page = p;
    this.loadUsers();
  }

  deleteUser(id: number, name: string) {
    if (confirm(`ต้องการลบ ${name} ใช่หรือไม่?`)) {
      this.userService.delete(id).subscribe(() => this.loadUsers());
    }
  }
}