# HR Management System — Angular Frontend

ระบบจัดการทรัพยากรบุคคล (HR) พัฒนาด้วย Angular 21 (Standalone Components)

## 🚀 Features

### User Management
- ✅ แสดงรายการ Users พร้อม Department และ Address
- ✅ ค้นหา (Search) พร้อม Debounce 300ms
- ✅ กรองตามเพศ (male/female/unspecified)
- ✅ กรองตามแผนก (Department)
- ✅ เรียงลำดับ (Sort) ตาม field ต่างๆ
- ✅ Pagination
- ✅ เพิ่ม / แก้ไข / ลบ User พร้อม Address
- ✅ Form Validation ครบถ้วน

### Department Management
- ✅ แสดงรายการ Departments พร้อม user_count
- ✅ ดูรายละเอียด Department พร้อมรายชื่อสมาชิก

### Authentication
- ✅ Login/Logout ผ่าน Backend API
- ✅ Route Protection (Auth Guard)
- ✅ Token-based Authentication

### UX/UI
- ✅ Theme เขียว-ขาว (#16a34a)
- ✅ Loading States
- ✅ Error States พร้อม Retry
- ✅ Empty States
- ✅ Toast Notifications
- ✅ Responsive Design

## 📋 Requirements

- Node.js 20+
- Backend API รันอยู่ที่ `http://localhost:4000`

## 🛠️ Tech Stack

- **Framework:** Angular 21 (Standalone Components)
- **Styling:** TailwindCSS 4
- **State:** Signals
- **Forms:** ReactiveFormsModule
- **HTTP:** HttpClient with typed responses

## 📦 Installation

```bash
# Clone repository
git clone <repository-url>
cd frontend-test

# Install dependencies
npm install

# Start development server
ng serve
```

## 🔧 Configuration

สร้างไฟล์ `.env` จาก `.env.example`:

```bash
cp .env.example .env
```

ตั้งค่า API URL ใน `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4000'
};
```

## 🚀 Development

```bash
# Start dev server
ng serve

# Build for production
ng build

# Run tests
ng test
```

เปิด browser ไปที่ `http://localhost:4200/`

## 📁 Project Structure

```
src/
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
├── app/
│   ├── app.config.ts
│   ├── app.routes.ts
│   ├── app.component.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   └── department.model.ts
│   ├── services/
│   │   ├── user.service.ts
│   │   ├── department.service.ts
│   │   ├── auth.service.ts
│   │   ├── auth.guard.ts
│   │   └── toast.service.ts
│   ├── navbar/
│   └── pages/
│       ├── auth/
│       │   └── login.component.ts
│       ├── users/
│       │   ├── user-list/
│       │   ├── user-detail/
│       │   └── user-form/
│       └── departments/
│           ├── department-list/
│           └── department-detail/
└── styles.css
```

## 🔐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/login | Login |
| GET | /users | List users with filters |
| GET | /users/:id | Get user detail |
| POST | /users | Create user |
| PUT | /users/:id | Update user |
| DELETE | /users/:id | Delete user |
| GET | /departments | List departments |
| GET | /departments/:id | Get department detail |

## 📝 Query Parameters (GET /users)

| Param | Type | Description |
|-------|------|-------------|
| page | number | Page number |
| limit | number | Items per page |
| search | string | Search by name/email |
| gender | string | Filter by gender |
| department_id | number | Filter by department |
| sort | string | Sort field |
| order | asc/desc | Sort order |

## ✅ Validation Rules

### User Form
- **first_name:** Required, Thai/English letters only
- **last_name:** Required, Thai/English letters only
- **age:** Required, 1-120
- **gender:** Required (male/female/unspecified)
- **email:** Required, valid email format
- **phone:** Optional, 9-10 digits
- **department_id:** Optional

### Address Form (Optional)
- **house_no:** Required when address enabled
- **street:** Optional
- **district:** Required when address enabled
- **province:** Required when address enabled
- **postal_code:** Required, 5 digits

## 📄 License

MIT
