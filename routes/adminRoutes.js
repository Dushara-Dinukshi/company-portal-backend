const express = require('express');
const {
  // Authentication
  registerAdmin,
  loginAdmin,
  
  // User Management
  getAllUsers,
  updateUser,
  deleteUser,
  
  // Category Management
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  
  // Job Management
  getAllJobPosts,
  updateJobStatus,
  
  // Subscription Management
  getAllSubscriptions,
  updateSubscription,
  
  // Analytics
  getAnalytics,
  
  // Notification Management
  createNotification,
  getAllNotifications,
  updateNotification,
  deleteNotification,
  
  // Admin Profile
  getAdminProfile,
  updateAdminProfile
} = require('../controllers/adminController');
const adminAuthMiddleware = require('../middle/adminAuth');

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Admin API running successfully'
  });
});

// ==================== AUTHENTICATION ROUTES ====================

// POST /api/admin/register
router.post('/register', registerAdmin);

// POST /api/admin/login
router.post('/login', loginAdmin);

// ==================== ADMIN PROFILE ROUTES ====================

// GET /api/admin/profile (Protected)
router.get('/profile', adminAuthMiddleware, getAdminProfile);

// PUT /api/admin/profile (Protected)
router.put('/profile', adminAuthMiddleware, updateAdminProfile);

// ==================== USER MANAGEMENT ROUTES ====================

// GET /api/admin/users (Protected)
router.get('/users', adminAuthMiddleware, getAllUsers);

// PUT /api/admin/users/:userType/:userId (Protected)
router.put('/users/:userType/:userId', adminAuthMiddleware, updateUser);

// DELETE /api/admin/users/:userType/:userId (Protected)
router.delete('/users/:userType/:userId', adminAuthMiddleware, deleteUser);

// ==================== CATEGORY MANAGEMENT ROUTES ====================

// POST /api/admin/categories (Protected)
router.post('/categories', adminAuthMiddleware, createCategory);

// GET /api/admin/categories (Protected)
router.get('/categories', adminAuthMiddleware, getAllCategories);

// PUT /api/admin/categories/:categoryId (Protected)
router.put('/categories/:categoryId', adminAuthMiddleware, updateCategory);

// DELETE /api/admin/categories/:categoryId (Protected)
router.delete('/categories/:categoryId', adminAuthMiddleware, deleteCategory);

// ==================== JOB MANAGEMENT ROUTES ====================

// GET /api/admin/jobs (Protected)
router.get('/jobs', adminAuthMiddleware, getAllJobPosts);

// PUT /api/admin/jobs/:companyId/:vacancyId/status (Protected)
router.put('/jobs/:companyId/:vacancyId/status', adminAuthMiddleware, updateJobStatus);

// ==================== SUBSCRIPTION MANAGEMENT ROUTES ====================

// GET /api/admin/subscriptions (Protected)
router.get('/subscriptions', adminAuthMiddleware, getAllSubscriptions);

// PUT /api/admin/subscriptions/:subscriptionId (Protected)
router.put('/subscriptions/:subscriptionId', adminAuthMiddleware, updateSubscription);

// ==================== ANALYTICS ROUTES ====================

// GET /api/admin/analytics (Protected)
router.get('/analytics', adminAuthMiddleware, getAnalytics);

// ==================== NOTIFICATION MANAGEMENT ROUTES ====================

// POST /api/admin/notifications (Protected)
router.post('/notifications', adminAuthMiddleware, createNotification);

// GET /api/admin/notifications (Protected)
router.get('/notifications', adminAuthMiddleware, getAllNotifications);

// PUT /api/admin/notifications/:notificationId (Protected)
router.put('/notifications/:notificationId', adminAuthMiddleware, updateNotification);

// DELETE /api/admin/notifications/:notificationId (Protected)
router.delete('/notifications/:notificationId', adminAuthMiddleware, deleteNotification);

module.exports = router;
