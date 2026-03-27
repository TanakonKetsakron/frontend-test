import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { DepartmentService } from '../../../services/department.service';

@Component({
  selector: 'app-department-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './department-detail.html',
})
export class DepartmentDetailComponent implements OnInit {
  department: any = null;
  loading = false;

  constructor(
    private departmentService: DepartmentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.loading = true;
    this.departmentService.getById(Number(id)).subscribe({
      next: (res: any) => {
        this.department = res.data;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}