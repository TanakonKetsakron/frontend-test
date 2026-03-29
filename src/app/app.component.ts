import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  template: `
    <app-navbar></app-navbar>
    
    <router-outlet />
    
    <!-- Toast Container -->
    <div class="toast-container">
      @for (toast of toastService.activeToasts(); track toast.id) {
        <div class="toast" [class]="'toast-' + toast.type" (click)="toastService.dismiss(toast.id)">
          <span class="toast-icon">
            @switch (toast.type) {
              @case ('success') { ✅ }
              @case ('error') { ❌ }
              @case ('warning') { ⚠️ }
              @case ('info') { ℹ️ }
            }
          </span>
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close">×</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    }
    
    .toast {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      animation: slideIn 0.3s ease-out;
      transition: all 0.2s;
    }
    
    .toast:hover {
      transform: translateX(-5px);
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    .toast-success {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }
    
    .toast-error {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
    }
    
    .toast-warning {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
    }
    
    .toast-info {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: white;
    }
    
    .toast-icon {
      font-size: 20px;
    }
    
    .toast-message {
      flex: 1;
      font-size: 14px;
      font-weight: 500;
    }
    
    .toast-close {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    
    .toast-close:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  `]
})
export class AppComponent {
  toastService = inject(ToastService);
}