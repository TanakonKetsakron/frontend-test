import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { DepartmentService } from '../../../services/department.service';
import { ToastService } from '../../../services/toast.service';
import { DepartmentWithUsers } from '../../../models/department.model';

@Component({
  selector: 'app-department-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './department-detail.html',
  styleUrls: ['./department-detail.css']
})
export class DepartmentDetailComponent implements OnInit {
  private departmentService = inject(DepartmentService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);

  department: DepartmentWithUsers | null = null;
  loading = false;
  error = '';

  ngOnInit(): void {
    this.loadDepartment();
  }

  loadDepartment(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.loading = true;
    this.error = '';
    
    this.departmentService.getById(Number(id)).subscribe({
      next: (res) => {
        this.department = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'ไม่สามารถโหลดข้อมูลแผนกได้';
        this.toastService.error(this.error);
      }
    });
  }

  getGenderLabel(gender: string): string {
    switch (gender) {
      case 'male': return '👨 ชาย';
      case 'female': return '👩 หญิง';
      default: return '⚪ ไม่ระบุ';
    }
  }

  retry(): void {
    this.loadDepartment();
  }
}