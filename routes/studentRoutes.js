const express = require('express');
const { 
  registerStudent, 
  loginStudent, 
  getStudentProfile, 
  updateStudentProfile,
  applyForInternship,
  getStudentApplications,
  getAllStudents,
  deleteStudent
} = require('../controllers/studentController');
const authMiddleware = require('../middle/auth');
const adminAuthMiddleware = require('../middle/adminAuth');

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Student API running successfully'
  });
});

// ==================== PUBLIC ROUTES ====================

// POST /api/students/register
router.post('/register', registerStudent);

// POST /api/students/login
router.post('/login', loginStudent);

// GET /api/students/profile/:id
router.get('/profile/:id', getStudentProfile);

// ==================== STUDENT PROTECTED ROUTES ====================

// PUT /api/students/profile - Update own profile
router.put('/profile', authMiddleware, updateStudentProfile);

// POST /api/students/apply/:internshipId - Apply for internship
router.post('/apply/:internshipId', authMiddleware, applyForInternship);

// GET /api/students/applications - Get own applications
router.get('/applications', authMiddleware, getStudentApplications);

// ==================== ADMIN ROUTES ====================

// GET /api/students - Get all students (Admin only)
router.get('/', adminAuthMiddleware, getAllStudents);

// DELETE /api/students/:id - Delete student (Admin only)
router.delete('/:id', adminAuthMiddleware, deleteStudent);

module.exports = router;
