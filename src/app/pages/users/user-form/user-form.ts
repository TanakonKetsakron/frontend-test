import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { DepartmentService } from '../../../services/department.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './user-form.html',
})
export class UserFormComponent implements OnInit {
  departments: any[] = [];
  id: any = null;
  loading = false;
  errorMsg = '';

  form: any = {
    first_name: '', last_name: '', age: '', gender: '',
    email: '', phone: '', department_id: '', address: null
  };

  showAddress = false;

  constructor(
    private userService: UserService,
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) this.loadUser();
  }

  loadUser() {
    this.userService.getById(this.id).subscribe((res: any) => {
      const u = res.data ?? res;
      this.form = { ...u, department_id: u.department?.id || '', address: u.address };
      if (u.address) this.showAddress = true;
    });
  }

  loadDepartments() {
    this.departmentService.getAll().subscribe((res: any) => {
      this.departments = res.data;
    });
  }

  toggleAddress() {
    this.showAddress = !this.showAddress;
    this.form.address = this.showAddress
      ? { house_no: '', street: '', district: '', province: '', postal_code: '' }
      : null;
  }

  validate(): boolean {
    if (!this.form.first_name || !this.form.last_name || !this.form.age || !this.form.gender || !this.form.email) {
      this.errorMsg = 'กรุณากรอกข้อมูลที่จำเป็นให้ครบ (ชื่อ, นามสกุล, อายุ, เพศ, อีเมล)';
      return false;
    }
    if (this.showAddress && this.form.address?.postal_code && !/^\d{5}$/.test(this.form.address.postal_code)) {
      this.errorMsg = 'รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก';
      return false;
    }
    this.errorMsg = '';
    return true;
  }

  submit() {
  if (!this.validate()) return;
  this.loading = true;

  const payload: any = {
    first_name: this.form.first_name,
    last_name: this.form.last_name,
    age: Number(this.form.age),
    gender: this.form.gender,
    email: this.form.email,
    phone: this.form.phone || null,
    department_id: this.form.department_id || null,
    address: this.showAddress ? this.form.address : null
  };

  const req = this.id
    ? this.userService.update(this.id, payload)
    : this.userService.create(payload);

  req.subscribe({
    next: () => { this.loading = false; this.router.navigate(['/']); },
    error: (err) => {
      this.loading = false;
      this.errorMsg = err.error?.message || 'เกิดข้อผิดพลาด';
    }
  });
}
}