    const express = require('express');
    const { 
    registerCompany, 
    loginCompany, 
    verifyAccount, 
    resetPassword, 
    updateProfile, 
    postVacancy, 
    viewVacancies, 
    editVacancy, 
    deleteVacancy 
    } = require('../controllers/companyController');
    const authMiddleware = require('../middle/auth');

    const router = express.Router();

    // Test route
    router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Company API running successfully'
    });
    });

    // POST /api/companies/register
    router.post('/register', registerCompany);

    // POST /api/companies/login
    router.post('/login', loginCompany);

    // POST /api/companies/verify
    router.post('/verify', verifyAccount);

    // POST /api/companies/reset-password
    router.post('/reset-password', resetPassword);

    // PUT /api/companies/profile (Protected route)
    router.put('/profile', authMiddleware, updateProfile);

    // POST /api/companies/vacancies (Protected route)
    router.post('/vacancies', authMiddleware, postVacancy);

    // GET /api/companies/vacancies (Protected route)
    router.get('/vacancies', authMiddleware, viewVacancies);

    // PUT /api/companies/vacancies/:vacancyId (Protected route)
    router.put('/vacancies/:vacancyId', authMiddleware, editVacancy);

    // DELETE /api/companies/vacancies/:vacancyId (Protected route)
    router.delete('/vacancies/:vacancyId', authMiddleware, deleteVacancy);

    module.exports = router;
