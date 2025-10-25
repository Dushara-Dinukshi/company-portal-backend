const express = require('express');
const { registerStudent, loginStudent, getStudentProfile, applyForInternship } = require('../controllers/studentController');
const authMiddleware = require('../middle/auth');

const router = express.Router();

// POST /api/students/register
router.post('/register', registerStudent);

// POST /api/students/login
router.post('/login', loginStudent);

// GET /api/students/profile/:id
router.get('/profile/:id', getStudentProfile);

// POST /api/students/apply/:internshipId (Protected route)
router.post('/apply/:internshipId', authMiddleware, applyForInternship);

module.exports = router;
