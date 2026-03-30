# HR Management System — Angular Frontend

ระบบจัดการทรัพยากรบุคคล (HR) พัฒนาด้วย Angular 17+ (Standalone Components)

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

### UX/UI
- ✅ Theme เขียว-ขาว (#16a34a)
- ✅ Loading States
- ✅ Error States พร้อม Retry
- ✅ Empty States
- ✅ Toast Notifications
- ✅ Responsive Design

## 📋 Requirements

- Node.js 20+
- Docker
- Backend API รันอยู่ที่ `http://localhost:4000`

## 🛠️ Tech Stack

- **Framework:** Angular 17+ (Standalone Components)
- **Forms:** ReactiveFormsModule
- **HTTP:** HttpClient with typed responses

## 📦 Installation

```bash
# 1. รัน Backend ด้วย Docker
docker compose up -d --build

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

เปิด browser ไปที่ `http://localhost:4200/`

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
│   │   └── toast.service.ts
│   ├── navbar/
│   └── pages/
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
- **house_no:** Required when address enabled, numbers and / only
- **street:** Optional
- **district:** Required when address enabled
- **province:** Required when address enabled, dropdown 77 จังหวัด
- **postal_code:** Required, 5 digits

## 📄 License

MIT