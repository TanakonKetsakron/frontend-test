import { Injectable, signal, computed } from '@angular/core';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = signal<Toast[]>([]);
  private idCounter = 0;
  
  // Computed signal สำหรับ template
  activeToasts = computed(() => this.toasts());
  
  /**
   * แสดง toast สำเร็จ (สีเขียว)
   */
  success(message: string, duration = 3000): void {
    this.show('success', message, duration);
  }
  
  /**
   * แสดง toast ผิดพลาด (สีแดง)
   */
  error(message: string, duration = 5000): void {
    this.show('error', message, duration);
  }
  
  /**
   * แสดง toast เตือน (สีเหลือง)
   */
  warning(message: string, duration = 4000): void {
    this.show('warning', message, duration);
  }
  
  /**
   * แสดง toast ข้อมูล (สีฟ้า)
   */
  info(message: string, duration = 3000): void {
    this.show('info', message, duration);
  }
  
  /**
   * แสดง toast
   */
  private show(type: Toast['type'], message: string, duration: number): void {
    const id = ++this.idCounter;
    const toast: Toast = { id, type, message, duration };
    
    this.toasts.update(toasts => [...toasts, toast]);
    
    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }
  
  /**
   * ปิด toast ด้วย id
   */
  dismiss(id: number): void {
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }
  
  /**
   * ปิด toast ทั้งหมด
   */
  dismissAll(): void {
    this.toasts.set([]);
  }
}
