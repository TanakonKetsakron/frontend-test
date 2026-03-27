import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private api = 'http://localhost:4000';

  constructor(private http: HttpClient) {}

  // 🔥 GET ALL DEPARTMENTS
  getAll() {
    return this.http.get<any>(`${this.api}/departments`);
  }

  // 🔥 GET BY ID
  getById(id: number) {
    return this.http.get(`${this.api}/departments/${id}`);
  }
}