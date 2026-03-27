export interface Department {
  id: number;
  name: string;
}

export interface Address {
  house_no: string;
  street?: string;
  district: string;
  province: string;
  postal_code: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  gender: string;
  email: string;
  phone?: string;

  department: Department | null;
  address: Address | null;

  created_at: string;
  updated_at: string;
}