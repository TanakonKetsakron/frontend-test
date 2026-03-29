// ==========================================
// Department Model - ตาม API Response Structure
// ==========================================

import { User } from './user.model';

export interface Department {
  id: number;
  name: string;
  user_count?: number;
}

export interface DepartmentWithUsers extends Department {
  users: User[];
}

// ==========================================
// API Response Types
// ==========================================

export interface DepartmentListResponse {
  success: boolean;
  data: Department[];
}

export interface DepartmentDetailResponse {
  success: boolean;
  data: DepartmentWithUsers;
}
