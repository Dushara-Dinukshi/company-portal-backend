# 📋 Complete API Endpoints Summary

## 🏠 Health Check
| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| GET | `/` | Health check | No |

## 👨‍🎓 Student Module
| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| GET | `/api/students/test` | Test student API | No |
| POST | `/api/students/register` | Register student | No |
| POST | `/api/students/login` | Login student | No |
| GET | `/api/students/profile/:id` | Get student profile | No |
| PUT | `/api/students/profile` | Update own profile | Student |
| GET | `/api/students/applications` | Get own applications | Student |
| POST | `/api/students/apply/:internshipId` | Apply for internship | Student |
| GET | `/api/students` | Get all students | Admin |
| DELETE | `/api/students/:id` | Delete student | Admin |

## 🏢 Company Module
| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| GET | `/api/companies/test` | Test company API | No |
| POST | `/api/companies/register` | Register company | No |
| POST | `/api/companies/login` | Login company | No |
| POST | `/api/companies/verify` | Verify account | No |
| POST | `/api/companies/reset-password` | Reset password | No |
| PUT | `/api/companies/profile` | Update profile | Company |
| POST | `/api/companies/vacancies` | Post vacancy | Company |
| GET | `/api/companies/vacancies` | View vacancies | Company |
| PUT | `/api/companies/vacancies/:vacancyId` | Edit vacancy | Company |
| DELETE | `/api/companies/vacancies/:vacancyId` | Delete vacancy | Company |

## 🎓 Internship Module
| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| GET | `/api/internships/test` | Test internship API | No |
| GET | `/api/internships` | Get all internships | No |
| GET | `/api/internships/:id` | Get internship by ID | No |
| GET | `/api/internships/company/:companyId` | Get internships by company | No |
| POST | `/api/internships` | Create internship | Company |
| PUT | `/api/internships/:id` | Update internship | Company |
| DELETE | `/api/internships/:id` | Delete internship | Company |

## 👨‍💼 Admin Module
| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| GET | `/api/admin/test` | Test admin API | No |
| POST | `/api/admin/register` | Register admin | No |
| POST | `/api/admin/login` | Login admin | No |
| GET | `/api/admin/profile` | Get admin profile | Admin |
| PUT | `/api/admin/profile` | Update admin profile | Admin |
| GET | `/api/admin/users` | Get all users | Admin |
| PUT | `/api/admin/users/:userType/:userId` | Update user | Admin |
| DELETE | `/api/admin/users/:userType/:userId` | Delete user | Admin |
| POST | `/api/admin/categories` | Create category | Admin |
| GET | `/api/admin/categories` | Get all categories | Admin |
| PUT | `/api/admin/categories/:categoryId` | Update category | Admin |
| DELETE | `/api/admin/categories/:categoryId` | Delete category | Admin |
| GET | `/api/admin/jobs` | Get all job posts | Admin |
| PUT | `/api/admin/jobs/:companyId/:vacancyId/status` | Update job status | Admin |
| GET | `/api/admin/subscriptions` | Get all subscriptions | Admin |
| PUT | `/api/admin/subscriptions/:subscriptionId` | Update subscription | Admin |
| GET | `/api/admin/analytics` | Get analytics | Admin |
| POST | `/api/admin/notifications` | Create notification | Admin |
| GET | `/api/admin/notifications` | Get all notifications | Admin |
| PUT | `/api/admin/notifications/:notificationId` | Update notification | Admin |
| DELETE | `/api/admin/notifications/:notificationId` | Delete notification | Admin |

## 📊 Statistics
- **Total Endpoints**: 45
- **Public Endpoints**: 12
- **Student Protected**: 3
- **Company Protected**: 5
- **Admin Protected**: 25

## 🔐 Authentication Levels
- **No Auth**: Public endpoints (registration, login, public data)
- **Student**: Student-specific operations
- **Company**: Company-specific operations  
- **Admin**: Administrative operations

## 📁 File Structure
```
api_tests/
├── Company_Portal_Backend_API.postman_collection.json
├── Company_Portal_Backend_API.thunder_collection.json
├── API_Documentation.md
└── Endpoints_Summary.md
```
