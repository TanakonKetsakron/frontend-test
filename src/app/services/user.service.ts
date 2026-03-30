import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  User, 
  UserFilters, 
  UserListResponse, 
  UserResponse, 
  CreateUserPayload, 
  UpdateUserPayload 
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * ดึงรายการ Users พร้อม filters และ pagination
   */
  getAll(filters: UserFilters = {}): Observable<UserListResponse> {
    let params = new HttpParams();
    
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    if (filters.search) params = params.set('search', filters.search);
    if (filters.gender) params = params.set('gender', filters.gender);
    if (filters.department_id) params = params.set('department_id', filters.department_id.toString());
    if (filters.sort) params = params.set('sort', filters.sort);
    if (filters.order) params = params.set('order', filters.order);

    return this.http.get<UserListResponse>(`${this.apiUrl}/users`, { params });
  }

  /**
   * ดึงข้อมูล User ตาม ID
   */
  getById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/users/${id}`);
  }

  /**
   * สร้าง User ใหม่
   */
  create(data: CreateUserPayload): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/users`, data);
  }

  /**
   * อัปเดต User
   */
  update(id: number, data: UpdateUserPayload): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/users/${id}`, data);
  }

  /**
   * ลบ User (CASCADE ลบ address ด้วย)
   */
  remove(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/users/${id}`);
  }

  /**
   * ดึงสถิติผู้ใช้ (จำนวน, เพศ, อายุ)
   */
  getStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/statistics`);
  }
}