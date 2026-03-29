import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

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
  `]
})
export class NavbarComponent {}