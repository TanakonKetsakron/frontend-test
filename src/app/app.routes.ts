import { Routes } from '@angular/router';
import { UserListComponent } from './pages/users/user-list/user-list';
import { UserFormComponent } from './pages/users/user-form/user-form';
import { UserDetailComponent } from './pages/users/user-detail/user-detail';
import { DepartmentListComponent } from './pages/departments/department-list/department-list';
import { DepartmentDetailComponent } from './pages/departments/department-detail/department-detail';
import { authGuard, loginGuard } from './services/auth.guard';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ToastService } from './services/toast.service';

// ============ LOGIN COMPONENT ============
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">🏢</div>
          <h1>HR Management System</h1>
          <p>ระบบจัดการทรัพยากรบุคคล</p>
        </div>
        
        <form (ngSubmit)="onLogin()" class="login-form">
          <div class="form-group">
            <label for="username">
              <span class="icon">👤</span> ชื่อผู้ใช้
            </label>
            <input 
              type="text" 
              id="username"
              [(ngModel)]="username" 
              name="username"
              placeholder="กรอกชื่อผู้ใช้"
              [disabled]="loading"
              autocomplete="username">
          </div>
          
          <div class="form-group">
            <label for="password">
              <span class="icon">🔒</span> รหัสผ่าน
            </label>
            <div class="password-input">
              <input 
                [type]="showPassword ? 'text' : 'password'" 
                id="password"
                [(ngModel)]="password" 
                name="password"
                placeholder="กรอกรหัสผ่าน"
                [disabled]="loading"
                autocomplete="current-password">
              <button 
                type="button" 
                class="toggle-password"
                (click)="showPassword = !showPassword">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>
          
          @if (errorMsg) {
            <div class="error-message">
              <span>⚠️</span> {{ errorMsg }}
            </div>
          }
          
          <button type="submit" class="login-btn" [disabled]="loading">
            @if (loading) {
              <span class="spinner"></span>
              <span>กำลังเข้าสู่ระบบ...</span>
            } @else {
              <span>🚀</span>
              <span>เข้าสู่ระบบ</span>
            }
          </button>
        </form>
        
        <div class="login-footer">
          <p>© 2024 HR Management System</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #16a34a 0%, #15803d 50%, #166534 100%);
      padding: 20px;
    }
    .login-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      width: 100%;
      max-width: 420px;
      overflow: hidden;
      animation: slideUp 0.5s ease-out;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .login-header {
      background: linear-gradient(135deg, #16a34a, #15803d);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    .logo { font-size: 60px; margin-bottom: 16px; }
    .login-header h1 { margin: 0; font-size: 24px; font-weight: 700; }
    .login-header p { margin: 8px 0 0; opacity: 0.9; font-size: 14px; }
    .login-form { padding: 30px; }
    .form-group { margin-bottom: 20px; }
    .form-group label {
      display: flex; align-items: center; gap: 8px;
      margin-bottom: 8px; font-weight: 600; color: #374151; font-size: 14px;
    }
    .icon { font-size: 16px; }
    .form-group input {
      width: 100%; padding: 14px 16px; border: 2px solid #e5e7eb;
      border-radius: 12px; font-size: 16px; transition: all 0.3s; box-sizing: border-box;
    }
    .form-group input:focus {
      outline: none; border-color: #16a34a;
      box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.1);
    }
    .form-group input:disabled { background: #f3f4f6; cursor: not-allowed; }
    .password-input { position: relative; }
    .password-input input { padding-right: 50px; }
    .toggle-password {
      position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
      background: none; border: none; font-size: 20px; cursor: pointer;
      padding: 4px; opacity: 0.7; transition: opacity 0.2s;
    }
    .toggle-password:hover { opacity: 1; }
    .error-message {
      background: #fef2f2; border: 1px solid #fecaca; color: #dc2626;
      padding: 12px 16px; border-radius: 10px; margin-bottom: 20px;
      display: flex; align-items: center; gap: 8px; font-size: 14px;
      animation: shake 0.5s ease-in-out;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    .login-btn {
      width: 100%; padding: 16px;
      background: linear-gradient(135deg, #16a34a, #15803d);
      color: white; border: none; border-radius: 12px;
      font-size: 16px; font-weight: 600; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 10px;
      transition: all 0.3s;
    }
    .login-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(22, 163, 74, 0.4);
    }
    .login-btn:disabled { background: #9ca3af; cursor: not-allowed; }
    .spinner {
      width: 20px; height: 20px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top-color: white; border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .login-footer {
      text-align: center; padding: 20px;
      background: #f9fafb; border-top: 1px solid #e5e7eb;
    }
    .login-footer p { margin: 0; color: #6b7280; font-size: 12px; }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  username = '';
  password = '';
  loading = false;
  errorMsg = '';
  showPassword = false;
  
  onLogin(): void {
    this.errorMsg = '';
    if (!this.username || !this.password) {
      this.errorMsg = 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน';
      return;
    }
    this.loading = true;
    
    setTimeout(() => {
      const result = this.authService.login(this.username, this.password);
      if (result.success) {
        this.toastService.success('🎉 เข้าสู่ระบบสำเร็จ ยินดีต้อนรับ!');
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      } else {
        this.errorMsg = result.message;
        this.toastService.error(result.message);
        this.loading = false;
      }
    }, 800);
  }
}

// ============ ROUTES ============
export const routes: Routes = [
  // Public route - Login
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  
  // Protected routes
  { path: '', component: UserListComponent, canActivate: [authGuard] },
  { path: 'create', component: UserFormComponent, canActivate: [authGuard] },
  { path: 'edit/:id', component: UserFormComponent, canActivate: [authGuard] },
  { path: 'users/:id', component: UserDetailComponent, canActivate: [authGuard] },
  { path: 'departments', component: DepartmentListComponent, canActivate: [authGuard] },
  { path: 'departments/:id', component: DepartmentDetailComponent, canActivate: [authGuard] },
  
  // Redirect unknown routes to login
  { path: '**', redirectTo: '/login' }
];