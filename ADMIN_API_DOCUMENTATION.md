# Admin Module API Documentation

## Overview
The Admin module provides comprehensive backend functionality for managing the entire platform, including users, categories, job posts, subscriptions, analytics, and notifications.

## Base URL
```
http://localhost:5000/api/admin
```

## Authentication
Most admin routes require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### Register Admin
```http
POST /api/admin/register
```
**Body:**
```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin",
  "permissions": {
    "manageUsers": true,
    "manageCategories": true,
    "manageJobs": true,
    "manageSubscriptions": true,
    "viewAnalytics": true,
    "manageNotifications": true
  }
}
```

### Login Admin
```http
POST /api/admin/login
```
**Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

---

## 👤 Admin Profile Management

### Get Admin Profile
```http
GET /api/admin/profile
Authorization: Bearer <token>
```

### Update Admin Profile
```http
PUT /api/admin/profile
Authorization: Bearer <token>
```
**Body:**
```json
{
  "name": "Updated Name",
  "permissions": {
    "manageUsers": true,
    "manageCategories": false
  }
}
```

---

## 👥 User Management

### Get All Users
```http
GET /api/admin/users?page=1&limit=10&type=students&search=john
Authorization: Bearer <token>
```
**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `type`: Filter by user type (`students`, `companies`, or omit for both)
- `search`: Search by name or email

### Update User
```http
PUT /api/admin/users/:userType/:userId
Authorization: Bearer <token>
```
**Path Parameters:**
- `userType`: `student` or `company`
- `userId`: User ID

**Body:** User data to update

### Delete User
```http
DELETE /api/admin/users/:userType/:userId
Authorization: Bearer <token>
```

---

## 📂 Category Management

### Create Category
```http
POST /api/admin/categories
Authorization: Bearer <token>
```
**Body:**
```json
{
  "name": "Technology",
  "description": "Tech-related jobs",
  "icon": "tech-icon",
  "color": "#007bff"
}
```

### Get All Categories
```http
GET /api/admin/categories
Authorization: Bearer <token>
```

### Update Category
```http
PUT /api/admin/categories/:categoryId
Authorization: Bearer <token>
```

### Delete Category
```http
DELETE /api/admin/categories/:categoryId
Authorization: Bearer <token>
```

---

## 💼 Job Management

### Get All Job Posts
```http
GET /api/admin/jobs?page=1&limit=10&status=active&companyId=123
Authorization: Bearer <token>
```
**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `status`: Filter by status (`active`, `inactive`, `closed`)
- `companyId`: Filter by company

### Update Job Status
```http
PUT /api/admin/jobs/:companyId/:vacancyId/status
Authorization: Bearer <token>
```
**Body:**
```json
{
  "status": "active"
}
```

---

## 💳 Subscription Management

### Get All Subscriptions
```http
GET /api/admin/subscriptions?page=1&limit=10&status=active&planType=premium
Authorization: Bearer <token>
```

### Update Subscription
```http
PUT /api/admin/subscriptions/:subscriptionId
Authorization: Bearer <token>
```
**Body:**
```json
{
  "status": "active",
  "paymentStatus": "paid",
  "notes": "Payment received"
}
```

---

## 📊 Analytics

### Get Analytics Reports
```http
GET /api/admin/analytics?period=30d
Authorization: Bearer <token>
```
**Query Parameters:**
- `period`: Time period (`7d`, `30d`, `90d`, `1y`)

**Response includes:**
- Total users (students & companies)
- Total subscriptions
- Top 5 companies hiring
- Payment breakdown by plan type
- Revenue trend over time

---

## 🔔 Notification Management

### Create Notification
```http
POST /api/admin/notifications
Authorization: Bearer <token>
```
**Body:**
```json
{
  "title": "System Maintenance",
  "message": "Scheduled maintenance on Sunday",
  "type": "info",
  "priority": "medium",
  "targetAudience": "all",
  "scheduledAt": "2024-01-15T10:00:00Z",
  "expiresAt": "2024-01-20T10:00:00Z",
  "actionUrl": "/maintenance-info",
  "actionText": "Learn More"
}
```

### Get All Notifications
```http
GET /api/admin/notifications?page=1&limit=10&type=info&priority=high
Authorization: Bearer <token>
```

### Update Notification
```http
PUT /api/admin/notifications/:notificationId
Authorization: Bearer <token>
```

### Delete Notification
```http
DELETE /api/admin/notifications/:notificationId
Authorization: Bearer <token>
```

---

## 🧪 Test Endpoint

### Test API
```http
GET /api/admin/test
```
**Response:**
```json
{
  "success": true,
  "message": "Admin API running successfully"
}
```

---

## 📋 Models Created

### Admin Model (`/models/adminModel.js`)
- Authentication fields (name, email, password)
- Role-based permissions
- Account status management

### Category Model (`/models/Category.js`)
- Job categories with metadata
- Icon and color support
- Usage tracking

### Subscription Model (`/models/Subscription.js`)
- Company subscription plans
- Payment tracking
- Feature management
- Billing cycles

### Notification Model (`/models/Notification.js`)
- User notifications
- Targeting options
- Read tracking
- Scheduling support

---

## 🔒 Security Features

- **JWT Authentication**: All protected routes require valid JWT tokens
- **Role-based Access**: Admin roles with granular permissions
- **Password Hashing**: Bcrypt with salt rounds of 12
- **Input Validation**: Comprehensive validation on all inputs
- **Error Handling**: Consistent error responses with appropriate HTTP status codes

---

## 🚀 Getting Started

1. **Start the server**: `npm start`
2. **Register an admin**: POST to `/api/admin/register`
3. **Login**: POST to `/api/admin/login` to get JWT token
4. **Use protected routes**: Include `Authorization: Bearer <token>` header

The Admin module is now fully integrated and ready for use!
