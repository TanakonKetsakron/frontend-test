import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DepartmentService } from '../../../services/department.service';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './department-list.html',
})
export class DepartmentListComponent implements OnInit {
  departments: any[] = [];
  loading = false;

  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.loading = true;
    this.departmentService.getAll().subscribe({
      next: (res: any) => {
        this.departments = res.data;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}