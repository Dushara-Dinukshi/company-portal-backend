# 🚀 Company Portal Backend API Documentation

## 📋 Overview
Complete RESTful API for Company Portal Backend with Student, Company, Admin, and Internship modules.

**Base URL**: `http://localhost:5000`

## 🔧 Environment Variables
- `base_url`: `http://localhost:5000`
- `student_token`: JWT token for student authentication
- `company_token`: JWT token for company authentication  
- `admin_token`: JWT token for admin authentication

---

## 🏠 Health Check

### Health Check
- **Method**: `GET`
- **URL**: `{{base_url}}/`
- **Description**: Check if the API is running
- **Headers**: None
- **Body**: None

---

## 👨‍🎓 Student Module

### Test Student API
- **Method**: `GET`
- **URL**: `{{base_url}}/api/students/test`
- **Description**: Test if student API is running
- **Headers**: None
- **Body**: None

### Register Student
- **Method**: `POST`
- **URL**: `{{base_url}}/api/students/register`
- **Description**: Register a new student
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "cv": "Experienced software developer with 3 years of experience"
}
```

### Login Student
- **Method**: `POST`
- **URL**: `{{base_url}}/api/students/login`
- **Description**: Login student and get JWT token
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Get Student Profile
- **Method**: `GET`
- **URL**: `{{base_url}}/api/students/profile/:id`
- **Description**: Get student profile by ID
- **Headers**: None
- **Body**: None
- **Parameters**: `id` (Student ID)

### Update Student Profile
- **Method**: `PUT`
- **URL**: `{{base_url}}/api/students/profile`
- **Description**: Update own profile (Protected)
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{student_token}}`
- **Body**:
```json
{
  "name": "John Smith",
  "cv": "Updated CV with more experience"
}
```

### Get Student Applications
- **Method**: `GET`
- **URL**: `{{base_url}}/api/students/applications`
- **Description**: Get own internship applications (Protected)
- **Headers**: `Authorization: Bearer {{student_token}}`
- **Body**: None

### Apply for Internship
- **Method**: `POST`
- **URL**: `{{base_url}}/api/students/apply/:internshipId`
- **Description**: Apply for an internship (Protected)
- **Headers**: `Authorization: Bearer {{student_token}}`
- **Body**: None
- **Parameters**: `internshipId` (Internship ID)

### Get All Students (Admin)
- **Method**: `GET`
- **URL**: `{{base_url}}/api/students`
- **Description**: Get all students with pagination (Admin only)
- **Headers**: `Authorization: Bearer {{admin_token}}`
- **Body**: None
- **Query Parameters**: 
  - `page` (default: 1)
  - `limit` (default: 10)
  - `search` (optional)

### Delete Student (Admin)
- **Method**: `DELETE`
- **URL**: `{{base_url}}/api/students/:id`
- **Description**: Delete a student (Admin only)
- **Headers**: `Authorization: Bearer {{admin_token}}`
- **Body**: None
- **Parameters**: `id` (Student ID)

---

## 🏢 Company Module

### Test Company API
- **Method**: `GET`
- **URL**: `{{base_url}}/api/companies/test`
- **Description**: Test if company API is running
- **Headers**: None
- **Body**: None

### Register Company
- **Method**: `POST`
- **URL**: `{{base_url}}/api/companies/register`
- **Description**: Register a new company
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "name": "Tech Corp",
  "email": "contact@techcorp.com",
  "password": "password123",
  "address": "123 Tech Street, Silicon Valley",
  "telephone": "+94712345678",
  "linkedinURL": "https://linkedin.com/company/techcorp",
  "biography": "A leading technology company",
  "termsAccepted": true
}
```

### Login Company
- **Method**: `POST`
- **URL**: `{{base_url}}/api/companies/login`
- **Description**: Login company and get JWT token
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "email": "contact@techcorp.com",
  "password": "password123"
}
```

### Verify Account
- **Method**: `POST`
- **URL**: `{{base_url}}/api/companies/verify`
- **Description**: Verify company account
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "token": "{{company_token}}"
}
```

### Reset Password
- **Method**: `POST`
- **URL**: `{{base_url}}/api/companies/reset-password`
- **Description**: Reset company password
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "email": "contact@techcorp.com",
  "newPassword": "newpassword123"
}
```

### Update Company Profile
- **Method**: `PUT`
- **URL**: `{{base_url}}/api/companies/profile`
- **Description**: Update company profile (Protected)
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{company_token}}`
- **Body**:
```json
{
  "name": "Tech Corp Updated",
  "address": "456 Updated Street, Silicon Valley",
  "telephone": "+94712345679",
  "linkedinURL": "https://linkedin.com/company/techcorp-updated",
  "biography": "Updated company biography"
}
```

### Post Vacancy
- **Method**: `POST`
- **URL**: `{{base_url}}/api/companies/vacancies`
- **Description**: Post a new job vacancy (Protected)
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{company_token}}`
- **Body**:
```json
{
  "title": "Software Developer Intern",
  "description": "We are looking for a skilled software developer intern",
  "requirements": "3+ years experience in JavaScript, Node.js",
  "location": "Remote",
  "salary": "$80,000 - $100,000",
  "type": "internship"
}
```

### View Company Vacancies
- **Method**: `GET`
- **URL**: `{{base_url}}/api/companies/vacancies`
- **Description**: View company's posted vacancies (Protected)
- **Headers**: `Authorization: Bearer {{company_token}}`
- **Body**: None

### Edit Vacancy
- **Method**: `PUT`
- **URL**: `{{base_url}}/api/companies/vacancies/:vacancyId`
- **Description**: Edit a vacancy (Protected)
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{company_token}}`
- **Body**:
```json
{
  "title": "Senior Software Developer Intern",
  "description": "Updated description",
  "salary": "$90,000 - $110,000",
  "status": "active"
}
```
- **Parameters**: `vacancyId` (Vacancy ID)

### Delete Vacancy
- **Method**: `DELETE`
- **URL**: `{{base_url}}/api/companies/vacancies/:vacancyId`
- **Description**: Delete a vacancy (Protected)
- **Headers**: `Authorization: Bearer {{company_token}}`
- **Body**: None
- **Parameters**: `vacancyId` (Vacancy ID)

---

## 🎓 Internship Module

### Test Internship API
- **Method**: `GET`
- **URL**: `{{base_url}}/api/internships/test`
- **Description**: Test if internship API is running
- **Headers**: None
- **Body**: None

### Get All Internships
- **Method**: `GET`
- **URL**: `{{base_url}}/api/internships`
- **Description**: Get all internships with filtering (Public)
- **Headers**: None
- **Body**: None
- **Query Parameters**: 
  - `page` (default: 1)
  - `limit` (default: 10)
  - `location` (optional)
  - `company` (optional)
  - `search` (optional)

### Get Internship by ID
- **Method**: `GET`
- **URL**: `{{base_url}}/api/internships/:id`
- **Description**: Get internship details by ID (Public)
- **Headers**: None
- **Body**: None
- **Parameters**: `id` (Internship ID)

### Get Internships by Company
- **Method**: `GET`
- **URL**: `{{base_url}}/api/internships/company/:companyId`
- **Description**: Get internships posted by a specific company (Public)
- **Headers**: None
- **Body**: None
- **Parameters**: `companyId` (Company ID)
- **Query Parameters**: 
  - `page` (default: 1)
  - `limit` (default: 10)

### Create Internship
- **Method**: `POST`
- **URL**: `{{base_url}}/api/internships`
- **Description**: Create a new internship (Company only)
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{company_token}}`
- **Body**:
```json
{
  "title": "Full Stack Developer Internship",
  "description": "Join our team as a full stack developer intern",
  "company": "COMPANY_ID_HERE",
  "location": "Colombo, Sri Lanka",
  "duration": "6 months",
  "stipend": "Rs. 50,000 per month",
  "requirements": ["JavaScript", "React", "Node.js", "MongoDB"]
}
```

### Update Internship
- **Method**: `PUT`
- **URL**: `{{base_url}}/api/internships/:id`
- **Description**: Update an internship (Company only)
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{company_token}}`
- **Body**:
```json
{
  "title": "Senior Full Stack Developer Internship",
  "description": "Updated description for senior position",
  "duration": "12 months",
  "stipend": "Rs. 75,000 per month"
}
```
- **Parameters**: `id` (Internship ID)

### Delete Internship
- **Method**: `DELETE`
- **URL**: `{{base_url}}/api/internships/:id`
- **Description**: Delete an internship (Company only)
- **Headers**: `Authorization: Bearer {{company_token}}`
- **Body**: None
- **Parameters**: `id` (Internship ID)

---

## 👨‍💼 Admin Module

### Test Admin API
- **Method**: `GET`
- **URL**: `{{base_url}}/api/admin/test`
- **Description**: Test if admin API is running
- **Headers**: None
- **Body**: None

### Register Admin
- **Method**: `POST`
- **URL**: `{{base_url}}/api/admin/register`
- **Description**: Register a new admin
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "name": "Admin User",
  "email": "admin@companyportal.com",
  "password": "adminpassword123",
  "role": "super_admin",
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
- **Method**: `POST`
- **URL**: `{{base_url}}/api/admin/login`
- **Description**: Login admin and get JWT token
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "email": "admin@companyportal.com",
  "password": "adminpassword123"
}
```

### Get Admin Profile
- **Method**: `GET`
- **URL**: `{{base_url}}/api/admin/profile`
- **Description**: Get admin profile (Protected)
- **Headers**: `Authorization: Bearer {{admin_token}}`
- **Body**: None

### Update Admin Profile
- **Method**: `PUT`
- **URL**: `{{base_url}}/api/admin/profile`
- **Description**: Update admin profile (Protected)
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{admin_token}}`
- **Body**:
```json
{
  "name": "Updated Admin User",
  "permissions": {
    "manageUsers": true,
    "manageCategories": false,
    "manageJobs": true,
    "manageSubscriptions": true,
    "viewAnalytics": true,
    "manageNotifications": false
  }
}
```

### Get All Users
- **Method**: `GET`
- **URL**: `{{base_url}}/api/admin/users`
- **Description**: Get all users (students and companies) (Admin only)
- **Headers**: `Authorization: Bearer {{admin_token}}`
- **Body**: None
- **Query Parameters**: 
  - `page` (default: 1)
  - `limit` (default: 10)
  - `type` (students/companies)
  - `search` (optional)

### Update User
- **Method**: `PUT`
- **URL**: `{{base_url}}/api/admin/users/:userType/:userId`
- **Description**: Update any user (Admin only)
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{admin_token}}`
- **Body**:
```json
{
  "name": "Updated Student Name",
  "cv": "Updated CV by admin"
}
```
- **Parameters**: 
  - `userType` (student/company)
  - `userId` (User ID)

### Delete User
- **Method**: `DELETE`
- **URL**: `{{base_url}}/api/admin/users/:userType/:userId`
- **Description**: Delete any user (Admin only)
- **Headers**: `Authorization: Bearer {{admin_token}}`
- **Body**: None
- **Parameters**: 
  - `userType` (student/company)
  - `userId` (User ID)

### Create Category
- **Method**: `POST`
- **URL**: `{{base_url}}/api/admin/categories`
- **Description**: Create a new job category (Admin only)
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{admin_token}}`
- **Body**:
```json
{
  "name": "Technology",
  "description": "Tech-related jobs and internships",
  "icon": "tech-icon",
  "color": "#007bff"
}
```

### Get All Categories
- **Method**: `GET`
- **URL**: `{{base_url}}/api/admin/categories`
- **Description**: Get all categories (Admin only)
- **Headers**: `Authorization: Bearer {{admin_token}}`
- **Body**: None

### Update Category
- **Method**: `PUT`
- **URL**: `{{base_url}}/api/admin/categories/:categoryId`
- **Description**: Update a category (Admin only)
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{admin_token}}`
- **Body**:
```json
{
  "name": "Technology & Innovation",
  "description": "Updated description for tech jobs",
  "color": "#28a745"
}
```
- **Parameters**: `categoryId` (Category ID)

### Delete Category
- **Method**: `DELETE`
- **URL**: `{{base_url}}/api/admin/categories/:categoryId`
- **Description**: Delete a category (Admin only)
- **Headers**: `Authorization: Bearer {{admin_token}}`
- **Body**: None
- **Parameters**: `categoryId` (Category ID)

### Get All Job Posts
- **Method**: `GET`
- **URL**: `{{base_url}}/api/admin/jobs`
- **Description**: Get all job posts with filtering (Admin only)
- **Headers**: `Authorization: Bearer {{admin_token}}`
- **Body**: None
- **Query Parameters**: 
  - `page` (default: 1)
  - `limit` (default: 10)
  - `status` (active/inactive/closed)
  - `companyId` (optional)

### Update Job Status
- **Method**: `PUT`
- **URL**: `{{base_url}}/api/admin/jobs/:companyId/:vacancyId/status`
- **Description**: Approve/reject job posts (Admin only)
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{admin_token}}`
- **Body**:
```json
{
  "status": "active"
}
```
- **Parameters**: 
  - `companyId` (Company ID)
  - `vacancyId` (Vacancy ID)

### Get All Subscriptions
- **Method**: `GET`
- **URL**: `{{base_url}}/api/admin/subscriptions`
- **Description**: Get all subscriptions (Admin only)
- **Headers**: `Authorization: Bearer {{admin_token}}`
- **Body**: None
- **Query Parameters**: 
  - `page` (default: 1)
  - `limit` (default: 10)
  - `status` (active/expired/cancelled/pending)
  - `planType` (basic/premium/enterprise)

### Update Subscription
- **Method**: `PUT`
- **URL**: `{{base_url}}/api/admin/subscriptions/:subscriptionId`
- **Description**: Update subscription status (Admin only)
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{admin_token}}`
- **Body**:
```json
{
  "status": "active",
  "paymentStatus": "paid",
  "notes": "Payment received successfully"
}
```
- **Parameters**: `subscriptionId` (Subscription ID)

### Get Analytics
- **Method**: `GET`
- **URL**: `{{base_url}}/api/admin/analytics`
- **Description**: Get analytics reports (Admin only)
- **Headers**: `Authorization: Bearer {{admin_token}}`
- **Body**: None
- **Query Parameters**: 
  - `period` (7d/30d/90d/1y, default: 30d)

### Create Notification
- **Method**: `POST`
- **URL**: `{{base_url}}/api/admin/notifications`
- **Description**: Create a notification (Admin only)
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{admin_token}}`
- **Body**:
```json
{
  "title": "System Maintenance",
  "message": "Scheduled maintenance on Sunday from 2 AM to 4 AM",
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
- **Method**: `GET`
- **URL**: `{{base_url}}/api/admin/notifications`
- **Description**: Get all notifications (Admin only)
- **Headers**: `Authorization: Bearer {{admin_token}}`
- **Body**: None
- **Query Parameters**: 
  - `page` (default: 1)
  - `limit` (default: 10)
  - `type` (info/success/warning/error/promotion)
  - `priority` (low/medium/high/urgent)

### Update Notification
- **Method**: `PUT`
- **URL**: `{{base_url}}/api/admin/notifications/:notificationId`
- **Description**: Update a notification (Admin only)
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{admin_token}}`
- **Body**:
```json
{
  "title": "Updated System Maintenance",
  "message": "Updated maintenance schedule",
  "priority": "high"
}
```
- **Parameters**: `notificationId` (Notification ID)

### Delete Notification
- **Method**: `DELETE`
- **URL**: `{{base_url}}/api/admin/notifications/:notificationId`
- **Description**: Delete a notification (Admin only)
- **Headers**: `Authorization: Bearer {{admin_token}}`
- **Body**: None
- **Parameters**: `notificationId` (Notification ID)

---

## 🔐 Authentication

### JWT Token Usage
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Token Generation
Tokens are automatically generated upon successful login/registration and stored in environment variables:
- `student_token`: For student-protected routes
- `company_token`: For company-protected routes
- `admin_token`: For admin-protected routes

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

---

## 🚀 Getting Started

1. **Import Collections**: Import the Postman or Thunder Client collection
2. **Set Environment**: Configure the `base_url` variable
3. **Register Users**: Start by registering students, companies, and admins
4. **Login**: Use login endpoints to get JWT tokens
5. **Test Protected Routes**: Use tokens for authenticated requests

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- Pagination is available for list endpoints
- Search functionality supports partial matching
- File uploads are not implemented in this version
- All passwords are hashed using bcrypt
- JWT tokens expire after 30 days
