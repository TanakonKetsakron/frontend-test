// ==========================================
// User Model - ตาม API Response Structure
// ==========================================

export interface Address {
  id?: number;
  user_id?: number;
  house_no: string;
  street: string | null;
  district: string;
  province: string;
  postal_code: string;
}

export interface Department {
  id: number;
  name: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  gender: 'male' | 'female' | 'unspecified';
  email: string;
  phone: string | null;
  department_id: number | null;
  department: Department | null;
  address: Address | null;
  created_at: string;
  updated_at: string;
}

// ==========================================
// API Request/Response Types
// ==========================================

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  gender?: 'male' | 'female' | 'unspecified' | '';
  department_id?: number | '';
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface Pagination {
  currentPage: number;   // แก้จาก page
  itemsPerPage: number;  // แก้จาก limit
  totalItems: number;    // แก้จาก total
  totalPages: number;    // เหมือนเดิม
}

export interface UserListResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: Pagination;
  };
}

export interface UserResponse {
  success: boolean;
  data: User;
}

export interface CreateUserPayload {
  first_name: string;
  last_name: string;
  age: number;
  gender: 'male' | 'female' | 'unspecified';
  email: string;
  phone?: string | null;
  department_id?: number | null;
  address?: {
    house_no: string;
    street?: string | null;
    district: string;
    province: string;
    postal_code: string;
  } | null;
}

export interface UpdateUserPayload extends CreateUserPayload {
  id?: number;
}
