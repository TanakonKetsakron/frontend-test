import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DepartmentService } from '../../../services/department.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './department-list.html',
  styleUrls: ['./department-list.css']
})
export class DepartmentListComponent implements OnInit {
  private departmentService = inject(DepartmentService);
  private toastService = inject(ToastService);

  departments: any[] = [];
  loading = false;
  error = '';

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loading = true;
    this.error = '';
    
    this.departmentService.getAll().subscribe({
      next: (res: any) => {
        this.departments = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'ไม่สามารถโหลดข้อมูลแผนกได้';
        this.toastService.error(this.error);
      }
    });
  }

  retry(): void {
    this.loadDepartments();
  }
}