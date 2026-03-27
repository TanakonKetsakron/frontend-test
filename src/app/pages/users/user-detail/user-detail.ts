import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-detail.html',
})
export class UserDetailComponent implements OnInit {
  user: any = null;
  loading = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.loading = true;
    this.userService.getById(Number(id)).subscribe({
      next: (res: any) => {
        this.user = res.data ?? res;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}