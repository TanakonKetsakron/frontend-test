import { UserService } from '../../../services/user.service';
import { User, UserFilters, Department } from '../../../models/user.model';
import { DepartmentService } from '../../../services/department.service';
import { ToastService } from '../../../services/toast.service';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

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
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  users: User[] = [];
  departments: Department[] = [];

  // States
  loading = false;
  error = '';
  deleting: number | null = null;

  // Filters
  search = '';
  gender: '' | 'male' | 'female' | 'unspecified' = '';
  department_id: number | '' = '';
  sort = '';
  order: 'asc' | 'desc' = 'asc';
  page = 1;
  limit = 10;
  totalPages = 1;
  total = 0;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Sync filters from URL query params
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.search = params['search'] || '';
      this.gender = params['gender'] || '';
      this.department_id = params['department_id'] ? Number(params['department_id']) : '';
      this.sort = params['sort'] || '';
      this.order = params['order'] || 'asc';
      this.page = params['page'] ? Number(params['page']) : 1;
      this.loadUsers();
    });

    this.loadDepartments();

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.page = 1;
      this.updateUrlAndLoad();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';

    const filters: UserFilters = {
      page: this.page,
      limit: this.limit
    };
    if (this.search) filters.search = this.search;
    if (this.gender) filters.gender = this.gender;
    if (this.department_id) filters.department_id = this.department_id;
    if (this.sort) filters.sort = this.sort;
    if (this.order) filters.order = this.order;

    this.userService.getAll(filters).subscribe({
      next: (res) => {
        this.users = res.data.users;
        this.totalPages = res.data.pagination.totalPages;
        this.total = res.data.pagination.totalItems; // แก้ตรงนี้
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง';
        this.toastService.error(this.error);
      }
    });
  }

  loadDepartments(): void {
    this.departmentService.getAll().subscribe({
      next: (res) => {
        this.departments = res.data;
      },
      error: () => {
        this.toastService.warning('ไม่สามารถโหลดรายการแผนกได้');
      }
    });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.search);
  }

  onFilterChange(): void {
    this.page = 1;
    this.updateUrlAndLoad();
  }

  changePage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.updateUrlAndLoad();
  }

  private updateUrlAndLoad(): void {
    const queryParams: any = {};
    if (this.search) queryParams.search = this.search;
    if (this.gender) queryParams.gender = this.gender;
    if (this.department_id) queryParams.department_id = this.department_id;
    if (this.sort) queryParams.sort = this.sort;
    if (this.order !== 'asc') queryParams.order = this.order;
    if (this.page > 1) queryParams.page = this.page;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      
    });
  }

  deleteUser(id: number, name: string): void {
    if (confirm(`ต้องการลบ "${name}" ใช่หรือไม่?\n\nการลบจะไม่สามารถกู้คืนได้`)) {
      this.deleting = id;
      this.userService.remove(id).subscribe({
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

  retry(): void {
    this.loadUsers();
  }

  // Helper methods for template
  getGenderBadgeClass(gender: string): string {
    switch (gender) {
      case 'male': return 'badge-male';
      case 'female': return 'badge-female';
      default: return 'badge-unspecified';
    }
  }

  getGenderLabel(gender: string): string {
    switch (gender) {
      case 'male': return '👨 ชาย';
      case 'female': return '👩 หญิง';
      default: return '⚪ ไม่ระบุ';
    }
  }
}