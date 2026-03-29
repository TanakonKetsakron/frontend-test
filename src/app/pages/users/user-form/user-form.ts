import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { DepartmentService } from '../../../services/department.service';
import { ToastService } from '../../../services/toast.service';
import { Department } from '../../../models/user.model';
import { CreateUserPayload, UpdateUserPayload } from '../../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-form.html',
  styleUrls: ['./user-form.css']
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private departmentService = inject(DepartmentService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  departments: Department[] = [];
  id: string | null = null;
  loading = false;
  loadingData = false;
  showAddress = false;
  errorMsg = '';

  // Custom validator: ชื่อต้องเป็นตัวอักษรไทย/อังกฤษเท่านั้น
  private nameValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const pattern = /^[a-zA-Zก-๙\s]+$/;
    return pattern.test(control.value) ? null : { invalidName: true };
  }

  // Custom validator: เบอร์โทรต้องเป็นตัวเลข 9-10 หลัก (รองรับ dash ตรงกลาง)
  private phoneValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const phone = control.value;
    
    // ไม่อนุญาตให้ขึ้นต้นหรือลงท้ายด้วย dash
    if (/^-/.test(phone) || /-$/.test(phone)) {
      return { invalidPhone: true, message: 'เบอร์โทรไม่สามารถขึ้นต้นหรือลงท้ายด้วยเครื่องหมาย - ได้' };
    }
    
    // ตรวจสอบว่าเป็นตัวเลขและ dash เท่านั้น
    if (!/^[0-9-]+$/.test(phone)) {
      return { invalidPhone: true, message: 'เบอร์โทรต้องเป็นตัวเลขเท่านั้น' };
    }
    
    // นับจำนวนตัวเลข (ไม่รวม dash) ต้อง 9-10 หลัก
    const digitsOnly = phone.replace(/-/g, '');
    if (digitsOnly.length < 9 || digitsOnly.length > 10) {
      return { invalidPhone: true, message: 'เบอร์โทรต้องมี 9-10 หลัก' };
    }
    
    return null;
  }

  userForm: FormGroup = this.fb.group({
    first_name: ['', [Validators.required, Validators.minLength(2), this.nameValidator]],
    last_name: ['', [Validators.required, Validators.minLength(2), this.nameValidator]],
    age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
    gender: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [this.phoneValidator]],
    department_id: [''],
    address: this.fb.group({
      house_no: [''],
      street: [''],
      district: [''],
      province: [''],
      postal_code: ['']
    })
  });

  ngOnInit(): void {
    this.loadDepartments();
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.loadUser();
    }
  }

  loadUser(): void {
    if (!this.id) return;
    this.loading = true;
    this.userService.getById(Number(this.id)).subscribe({
      next: (res: any) => {
        const user = res.data ?? res;
        this.userForm.patchValue({
          first_name: user.first_name,
          last_name: user.last_name,
          age: user.age,
          gender: user.gender,
          email: user.email,
          phone: user.phone || '',
          department_id: user.department?.id || ''
        });

        if (user.address) {
          this.showAddress = true;
          this.userForm.patchValue({ address: user.address });
          this.setAddressValidators(true);
        }
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้';
        this.loading = false;
      }
    });
  }

  loadDepartments(): void {
    this.departmentService.getAll().subscribe({
      next: (res: any) => {
        this.departments = res.data;
      },
      error: () => {
        this.errorMsg = 'ไม่สามารถโหลดข้อมูลแผนกได้';
      }
    });
  }

  toggleAddress(): void {
    this.showAddress = !this.showAddress;
    this.setAddressValidators(this.showAddress);
    
    if (!this.showAddress) {
      this.userForm.patchValue({
        address: { house_no: '', street: '', district: '', province: '', postal_code: '' }
      });
    }
  }

  private setAddressValidators(enabled: boolean): void {
    const addressGroup = this.userForm.get('address') as FormGroup;
    if (enabled) {
      addressGroup.get('house_no')?.setValidators([Validators.required]);
      addressGroup.get('district')?.setValidators([Validators.required]);
      addressGroup.get('province')?.setValidators([Validators.required]);
      addressGroup.get('postal_code')?.setValidators([Validators.required, Validators.pattern(/^[0-9]{5}$/)]);
    } else {
      addressGroup.get('house_no')?.clearValidators();
      addressGroup.get('district')?.clearValidators();
      addressGroup.get('province')?.clearValidators();
      addressGroup.get('postal_code')?.clearValidators();
    }
    addressGroup.get('house_no')?.updateValueAndValidity();
    addressGroup.get('district')?.updateValueAndValidity();
    addressGroup.get('province')?.updateValueAndValidity();
    addressGroup.get('postal_code')?.updateValueAndValidity();
  }

  // กรองให้กรอกได้เฉพาะตัวเลข
  onNumberInput(event: Event, fieldName: string): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.userForm.get(fieldName)?.setValue(input.value);
  }

  // กรองให้กรอกได้เฉพาะตัวเลขและ dash (สำหรับเบอร์โทร)
  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // อนุญาตเฉพาะตัวเลขและ dash
    input.value = input.value.replace(/[^0-9-]/g, '');
    this.userForm.get('phone')?.setValue(input.value);
  }

  // กรองให้กรอกได้เฉพาะตัวอักษร
  onNameInput(event: Event, fieldName: string): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^a-zA-Zก-๙\s]/g, '');
    this.userForm.get(fieldName)?.setValue(input.value);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.userForm.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    const labels: Record<string, string> = {
      first_name: 'ชื่อ', last_name: 'นามสกุล', age: 'อายุ',
      gender: 'เพศ', email: 'อีเมล', phone: 'เบอร์โทรศัพท์'
    };
    const label = labels[fieldName] || fieldName;

    if (control.errors['required']) return `กรุณากรอก${label}`;
    if (control.errors['minlength']) return `${label}ต้องมีอย่างน้อย ${control.errors['minlength'].requiredLength} ตัวอักษร`;
    if (control.errors['invalidName']) return `${label}ต้องเป็นตัวอักษรภาษาไทยหรืออังกฤษเท่านั้น`;
    if (control.errors['email']) return 'รูปแบบอีเมลไม่ถูกต้อง (ตัวอย่าง: example@email.com)';
    if (control.errors['invalidPhone']) {
      const msg = control.errors['invalidPhone'].message;
      return msg || 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 9-10 หลัก (รองรับ - ตรงกลาง เช่น 092-345-6789)';
    }
    if (control.errors['min']) return `${label}ต้องมากกว่าหรือเท่ากับ ${control.errors['min'].min}`;
    if (control.errors['max']) return `${label}ต้องน้อยกว่าหรือเท่ากับ ${control.errors['max'].max}`;
    if (control.errors['pattern']) return 'รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก';
    return '';
  }

  getAllErrors(): string[] {
    const errors: string[] = [];
    const fields = ['first_name', 'last_name', 'age', 'gender', 'email', 'phone'];
    
    for (const field of fields) {
      const err = this.getErrorMessage(field);
      if (err) errors.push(err);
    }

    if (this.showAddress) {
      const addr = this.userForm.get('address') as FormGroup;
      if (addr.get('house_no')?.errors?.['required']) errors.push('กรุณากรอกบ้านเลขที่');
      if (addr.get('district')?.errors?.['required']) errors.push('กรุณากรอกอำเภอ/เขต');
      if (addr.get('province')?.errors?.['required']) errors.push('กรุณากรอกจังหวัด');
      if (addr.get('postal_code')?.errors) errors.push('รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก');
    }

    return errors;
  }

  submit(): void {
    this.userForm.markAllAsTouched();
    this.errorMsg = '';
    
    if (this.userForm.invalid) {
      const errors = this.getAllErrors();
      this.errorMsg = errors.length > 0 
        ? errors.slice(0, 3).join('\n') 
        : 'กรุณากรอกข้อมูลให้ถูกต้องและครบถ้วน';
      return;
    }

    this.loading = true;
    const formValue = this.userForm.value;

    const payload: any = {
      first_name: formValue.first_name.trim(),
      last_name: formValue.last_name.trim(),
      age: Number(formValue.age),
      gender: formValue.gender,
      email: formValue.email.trim().toLowerCase(),
      phone: formValue.phone ? formValue.phone.trim() : null,
      department_id: formValue.department_id ? Number(formValue.department_id) : null,
      address: this.showAddress ? {
        house_no: formValue.address.house_no.trim(),
        street: formValue.address.street?.trim() || null,
        district: formValue.address.district.trim(),
        province: formValue.address.province.trim(),
        postal_code: formValue.address.postal_code.trim()
      } : null
    };

    const request = this.id
      ? this.userService.update(Number(this.id), payload)
      : this.userService.create(payload);

    request.subscribe({
      next: () => {
        this.loading = false;
        const msg = this.id ? '✅ แก้ไขข้อมูลเรียบร้อยแล้ว' : '✅ เพิ่มผู้ใช้ใหม่เรียบร้อยแล้ว';
        this.toastService.success(msg);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        const rawMsg = err.error?.message || '';
        
        // ตรวจจับ error อีเมลซ้ำและแสดงข้อความที่ชัดเจน
        if (rawMsg.toLowerCase().includes('email') && rawMsg.toLowerCase().includes('exist')) {
          const email = this.userForm.get('email')?.value || '';
          this.errorMsg = `อีเมล "${email}" มีอยู่ในระบบแล้ว กรุณาใช้อีเมลอื่น`;
        } else if (rawMsg.toLowerCase().includes('duplicate')) {
          this.errorMsg = 'ข้อมูลนี้มีอยู่ในระบบแล้ว กรุณาตรวจสอบอีกครั้ง';
        } else {
          this.errorMsg = rawMsg || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
        }
        
        this.toastService.error(this.errorMsg);
      }
    });
  }
}