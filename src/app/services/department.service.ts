import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  Department, 
  DepartmentListResponse, 
  DepartmentDetailResponse 
} from '../models/department.model';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * ดึงรายการ Departments ทั้งหมด พร้อม user_count
   */
  getAll(): Observable<DepartmentListResponse> {
    return this.http.get<DepartmentListResponse>(`${this.apiUrl}/departments`);
  }

  /**
   * ดึงข้อมูล Department ตาม ID พร้อมรายชื่อ users
   */
  getById(id: number): Observable<DepartmentDetailResponse> {
    return this.http.get<DepartmentDetailResponse>(`${this.apiUrl}/departments/${id}`);
  }
}