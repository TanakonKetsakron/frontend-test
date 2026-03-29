import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { DepartmentService } from '../../../services/department.service';
import { ToastService } from '../../../services/toast.service';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
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
  styleUrls: ['./user-list.css']
})
export class UserListComponent implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private departmentService = inject(DepartmentService);
  private toastService = inject(ToastService);

  users: User[] = [];
  departments: any[] = [];
  
  // States
  loading = false;
  error = '';
  deleting: number | null = null;

  // Filters
  search = '';
  gender = '';
  department_id = '';
  sort = '';
  page = 1;
  totalPages = 1;
  total = 0;

  private searchSubject = new Subject<string>();

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
    this.error = '';
    
    const params: any = { page: this.page, limit: 10 };
    if (this.search) params.search = this.search;
    if (this.gender) params.gender = this.gender;
    if (this.department_id) params.department_id = this.department_id;
    if (this.sort) params.sort = this.sort;

    this.userService.getAll(params).subscribe({
      next: (res) => {
        this.users = res.data.users;
        this.totalPages = res.data.pagination.totalPages;
        this.total = res.data.pagination.total;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง';
        this.toastService.error(this.error);
      }
    });
  }

  loadDepartments() {
    this.departmentService.getAll().subscribe({
      next: (res: any) => {
        this.departments = res.data;
      },
      error: () => {
        this.toastService.warning('ไม่สามารถโหลดรายการแผนกได้');
      }
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
    if (confirm(`ต้องการลบ "${name}" ใช่หรือไม่?\n\nการลบจะไม่สามารถกู้คืนได้`)) {
      this.deleting = id;
      this.userService.delete(id).subscribe({
        next: () => {
          this.deleting = null;
          this.toastService.success(`✅ ลบ "${name}" เรียบร้อยแล้ว`);
          this.loadUsers();
        },
        error: (err) => {
          this.deleting = null;
          this.toastService.error(err.error?.message || 'ไม่สามารถลบข้อมูลได้');
        }
      });
    }
  }

  retry() {
    this.loadUsers();
  }
}