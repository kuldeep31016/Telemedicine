# 🗺️ API Routes Map

## Base URL: `http://localhost:5001/api`

## 🔐 Authentication Endpoints

| Method | Endpoint | Description | Auth Required | Body |
|--------|----------|-------------|---------------|------|
| POST | `/v1/auth/register` | Register new user | ✅ Firebase | `{ firebaseUid, email, name, role, ... }` |
| POST | `/v1/auth/login` | Login user | ✅ Firebase | `{}` (token in header) |
| GET | `/v1/auth/me` | Get current user | ✅ Firebase | - |
| POST | `/v1/auth/logout` | Logout user | ✅ Firebase | - |
| PUT | `/v1/auth/profile` | Update profile | ✅ Firebase | `{ name, phone, ... }` |

## 👨‍💼 Admin Endpoints

| Method | Endpoint | Description | Auth Required | Params/Body |
|--------|----------|-------------|---------------|-------------|
| GET | `/v1/admin/dashboard/stats` | Dashboard statistics | Admin | - |
| GET | `/v1/admin/users` | Get all users | Admin | `?page=1&limit=10&role=patient` |
| GET | `/v1/admin/users/:id` | Get user by ID | Admin | - |
| PUT | `/v1/admin/users/:id/status` | Update user status | Admin | `{ isActive: true/false }` |
| GET | `/v1/admin/doctors` | Get all doctors | Admin | `?page=1&limit=10` |
| GET | `/v1/admin/doctors/:id` | Get doctor by ID | Admin | - |
| GET | `/v1/admin/appointments` | Get all appointments | Admin | `?status=pending&date=2024-01-01` |
| GET | `/v1/admin/sos-alerts` | Get SOS alerts | Admin | - |

## 👨‍⚕️ Doctor Endpoints

| Method | Endpoint | Description | Auth Required | Params/Body |
|--------|----------|-------------|---------------|-------------|
| GET | `/v1/doctor/dashboard/stats` | Dashboard statistics | Doctor | - |
| GET | `/v1/doctor/appointments` | Get appointments | Doctor | `?status=pending&date=2024-01-01` |
| GET | `/v1/doctor/appointments/:id` | Get appointment details | Doctor | - |
| PUT | `/v1/doctor/appointments/:id` | Update appointment | Doctor | `{ status, notes }` |
| GET | `/v1/doctor/patients` | Get patients | Doctor | `?page=1&limit=10` |
| GET | `/v1/doctor/patients/:id` | Get patient details | Doctor | - |
| GET | `/v1/doctor/consultations` | Get consultations | Doctor | `?status=completed` |
| POST | `/v1/doctor/prescriptions` | Create prescription | Doctor | `{ patientId, medicines, ... }` |

## 🏥 Patient Endpoints

| Method | Endpoint | Description | Auth Required | Params/Body |
|--------|----------|-------------|---------------|-------------|
| GET | `/v1/patient/dashboard/stats` | Dashboard statistics | Patient | - |
| GET | `/v1/patient/appointments` | Get appointments | Patient | `?status=upcoming` |
| GET | `/v1/patient/appointments/:id` | Get appointment details | Patient | - |
| POST | `/v1/patient/appointments` | Book appointment | Patient | `{ doctorId, date, time, ... }` |
| DELETE | `/v1/patient/appointments/:id` | Cancel appointment | Patient | - |
| GET | `/v1/patient/medical-records` | Get medical records | Patient | - |
| GET | `/v1/patient/prescriptions` | Get prescriptions | Patient | - |

## 👩‍⚕️ ASHA Worker Endpoints

| Method | Endpoint | Description | Auth Required | Params/Body |
|--------|----------|-------------|---------------|-------------|
| GET | `/v1/asha/dashboard/stats` | Dashboard statistics | ASHA | - |
| GET | `/v1/asha/patients` | Get assigned patients | ASHA | - |
| POST | `/v1/asha/reports` | Submit health report | ASHA | `{ patientId, report, ... }` |

---

## 📋 Request/Response Examples

### Register Admin
```http
POST /api/v1/auth/register
Authorization: Bearer <firebase-token>
Content-Type: application/json

{
  "firebaseUid": "fDWxcG5RplR8fMcUPxzIxjmPLil1",
  "email": "admin@test.com",
  "name": "Admin User",
  "username": "adminuser",
  "phone": "9876543210",
  "role": "admin"
}

Response: 201 Created
{
  "_id": "507f1f77bcf86cd799439011",
  "firebaseUid": "fDWxcG5RplR8fMcUPxzIxjmPLil1",
  "email": "admin@test.com",
  "name": "Admin User",
  "role": "admin",
  "isActive": true,
  "createdAt": "2024-02-07T10:30:00Z"
}
```

### Get Admin Dashboard Stats
```http
GET /api/v1/admin/dashboard/stats
Authorization: Bearer <firebase-token>

Response: 200 OK
{
  "totalUsers": 1234,
  "totalDoctors": 89,
  "totalPatients": 1045,
  "todayAppointments": 156,
  "activeSOS": 3,
  "monthlyRevenue": 45000
}
```

### Get Doctor Appointments
```http
GET /api/v1/doctor/appointments?status=pending&date=2024-02-07
Authorization: Bearer <firebase-token>

Response: 200 OK
{
  "appointments": [
    {
      "_id": "...",
      "patient": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "date": "2024-02-07",
      "time": "10:00 AM",
      "status": "pending",
      "type": "video_call"
    }
  ],
  "total": 5,
  "page": 1,
  "pages": 1
}
```

### Book Patient Appointment
```http
POST /api/v1/patient/appointments
Authorization: Bearer <firebase-token>
Content-Type: application/json

{
  "doctorId": "507f1f77bcf86cd799439012",
  "date": "2024-02-08",
  "time": "14:00",
  "type": "video_call",
  "symptoms": "Fever and headache"
}

Response: 201 Created
{
  "_id": "...",
  "patientId": "...",
  "doctorId": "...",
  "date": "2024-02-08",
  "time": "14:00",
  "status": "pending",
  "type": "video_call"
}
```

---

## 🔒 Authentication Headers

All protected endpoints require:
```
Authorization: Bearer <firebase-id-token>
```

The token is automatically added by axios interceptor in the frontend.

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details..."
}
```

---

## 🎯 Query Parameters Guide

### Pagination
```
?page=1&limit=10
```

### Filtering
```
?status=pending&role=doctor&isActive=true
```

### Sorting
```
?sortBy=createdAt&order=desc
```

### Search
```
?search=john&searchFields=name,email
```

### Date Range
```
?startDate=2024-02-01&endDate=2024-02-07
```

---

## 📊 Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - No permission |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 500 | Server Error - Internal error |
