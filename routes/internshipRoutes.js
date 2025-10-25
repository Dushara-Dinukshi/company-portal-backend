const express = require('express');
const {
  createInternship,
  getAllInternships,
  getInternshipById,
  updateInternship,
  deleteInternship,
  getInternshipsByCompany
} = require('../controllers/internshipController');
const authMiddleware = require('../middle/auth');
const adminAuthMiddleware = require('../middle/adminAuth');

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Internship API running successfully'
  });
});

// ==================== PUBLIC ROUTES ====================

// GET /api/internships - Get all internships (public)
router.get('/', getAllInternships);

// GET /api/internships/:id - Get internship by ID (public)
router.get('/:id', getInternshipById);

// GET /api/internships/company/:companyId - Get internships by company (public)
router.get('/company/:companyId', getInternshipsByCompany);

// ==================== PROTECTED ROUTES ====================

// POST /api/internships - Create internship (Company only)
router.post('/', authMiddleware, createInternship);

// PUT /api/internships/:id - Update internship (Company only)
router.put('/:id', authMiddleware, updateInternship);

// DELETE /api/internships/:id - Delete internship (Company only)
router.delete('/:id', authMiddleware, deleteInternship);

// ==================== ADMIN ROUTES ====================

// Admin can also manage internships
// These routes use adminAuthMiddleware for admin-only access

module.exports = router;
