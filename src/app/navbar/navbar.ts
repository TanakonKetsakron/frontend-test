import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <span class="brand-icon">🏢</span>
        <span class="brand-text">HR System</span>
      </div>
      
      <div class="nav-links">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="nav-link">
          <span>👤</span> ผู้ใช้
        </a>
        <a routerLink="/departments" routerLinkActive="active" class="nav-link">
          <span>🏛️</span> แผนก
        </a>
      </div>
      
      <div class="nav-user">
        <span class="user-info">
          <span class="user-icon">👋</span>
          สวัสดี, <strong>{{ authService.username() }}</strong>
        </span>
        <button class="logout-btn" (click)="logout()">
          <span>🚪</span> ออกจากระบบ
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #16a34a, #15803d);
      padding: 0 24px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .brand-icon {
      font-size: 28px;
    }
    
    .brand-text {
      color: white;
      font-weight: 700;
      font-size: 20px;
    }
    
    .nav-links {
      display: flex;
      gap: 8px;
    }
    
    .nav-link {
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      font-size: 15px;
      padding: 10px 16px;
      border-radius: 8px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .nav-link:hover {
      background: rgba(255, 255, 255, 0.15);
      color: white;
    }
    
    .nav-link.active {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      font-weight: 600;
    }
    
    .nav-user {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .user-info {
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .user-info strong {
      color: white;
    }
    
    .user-icon {
      font-size: 18px;
    }
    
    .logout-btn {
      background: rgba(255, 255, 255, 0.15);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    
    .logout-btn:hover {
      background: rgba(255, 255, 255, 0.25);
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  private toastService = inject(ToastService);
  
  logout(): void {
    this.toastService.info('👋 ออกจากระบบแล้ว');
    this.authService.logout();
  }
}