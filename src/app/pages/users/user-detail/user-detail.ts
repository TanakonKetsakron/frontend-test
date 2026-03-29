import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-detail.html',
  styleUrls: ['./user-detail.css']
})
export class UserDetailComponent implements OnInit {
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  user: any = null;
  loading = false;
  error = '';
  deleting = false;

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.loading = true;
    this.error = '';
    
    this.userService.getById(Number(id)).subscribe({
      next: (res: any) => {
        this.user = res.data ?? res;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้';
        this.toastService.error(this.error);
      }
    });
  }

  deleteUser(): void {
    if (!this.user) return;
    
    const name = `${this.user.first_name} ${this.user.last_name}`;
    if (confirm(`ต้องการลบ "${name}" ใช่หรือไม่?\n\nการลบจะไม่สามารถกู้คืนได้`)) {
      this.deleting = true;
      this.userService.delete(this.user.id).subscribe({
        next: () => {
          this.toastService.success(`✅ ลบ "${name}" เรียบร้อยแล้ว`);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.deleting = false;
          this.toastService.error(err.error?.message || 'ไม่สามารถลบข้อมูลได้');
        }
      });
    }
  }

  retry(): void {
    this.loadUser();
  }
}