import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private api = 'http://localhost:4000';

  constructor(private http: HttpClient) {}

  // 🔥 GET ALL (มี filter/search)
  getAll(params: any) {
  return this.http.get<any>(`${this.api}/users`, { params });
}

  // 🔥 GET BY ID
  getById(id: number) {
    return this.http.get<User>(`${this.api}/users/${id}`);
  }

  // 🔥 CREATE USER
  create(data: any) {
    return this.http.post(`${this.api}/users`, data);
  }

  // 🔥 UPDATE USER
  update(id: number, data: any) {
    return this.http.put(`${this.api}/users/${id}`, data);
  }

  // 🔥 DELETE USER
  delete(id: number) {
    return this.http.delete(`${this.api}/users/${id}`);
  }
}