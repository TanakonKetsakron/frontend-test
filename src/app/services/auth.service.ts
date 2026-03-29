import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // ข้อมูล credentials ที่ถูกต้อง (ในระบบจริงควรเก็บใน backend)
  private readonly VALID_USERNAME = 'appuser';
  private readonly VALID_PASSWORD = 'apppassword';
  
  private readonly STORAGE_KEY = 'auth_user';
  
  // Signal สำหรับ reactive state
  private currentUser = signal<User | null>(this.loadUserFromStorage());
  
  // Computed signals
  isLoggedIn = computed(() => this.currentUser() !== null);
  user = computed(() => this.currentUser());
  username = computed(() => this.currentUser()?.username ?? '');
  
  constructor(private router: Router) {}
  
  private loadUserFromStorage(): User | null {
    try {
      const data = sessionStorage.getItem(this.STORAGE_KEY);
      if (data) {
        return JSON.parse(atob(data)); // Base64 decode
      }
    } catch {
      sessionStorage.removeItem(this.STORAGE_KEY);
    }
    return null;
  }
  
  private saveUserToStorage(user: User): void {
    const encoded = btoa(JSON.stringify(user)); // Base64 encode
    sessionStorage.setItem(this.STORAGE_KEY, encoded);
  }
  
  /**
   * ล็อกอินด้วย username และ password
   * @returns true ถ้าสำเร็จ, error message ถ้าไม่สำเร็จ
   */
  login(username: string, password: string): { success: boolean; message: string } {
    // ตรวจสอบ input
    if (!username || !password) {
      return { success: false, message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' };
    }
    
    // ตรวจสอบ credentials
    if (username === this.VALID_USERNAME && password === this.VALID_PASSWORD) {
      const user: User = {
        username: username,
        role: 'admin'
      };
      
      this.currentUser.set(user);
      this.saveUserToStorage(user);
      
      return { success: true, message: 'เข้าสู่ระบบสำเร็จ' };
    }
    
    return { success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
  }
  
  /**
   * ออกจากระบบ
   */
  logout(): void {
    this.currentUser.set(null);
    sessionStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/login']);
  }
  
  /**
   * ตรวจสอบว่า token ยังใช้ได้อยู่หรือไม่
   */
  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }
}
