const Company = require('../models/Company');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key', {
    expiresIn: '30d'
  });
};

// Register Company
const registerCompany = async (req, res) => {
  try {
    const { name, email, password, address, telephone, linkedinURL, biography, termsAccepted } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password || !address || !telephone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password, address, and telephone'
      });
    }

    // Check if terms are accepted
    if (!termsAccepted) {
      return res.status(400).json({
        success: false,
        message: 'You must accept the terms and conditions'
      });
    }

    // Check if company already exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: 'Company with this email already exists'
      });
    }

    // Create new company
    const company = new Company({
      name,
      email,
      password,
      address,
      telephone,
      linkedinURL: linkedinURL || '',
      biography: biography || '',
      termsAccepted
    });

    await company.save();

    // Generate token
    const token = generateToken(company._id);

    res.status(201).json({
      success: true,
      message: 'Company registered successfully',
      data: {
        company: {
          id: company._id,
          name: company.name,
          email: company.email,
          address: company.address,
          telephone: company.telephone,
          linkedinURL: company.linkedinURL,
          biography: company.biography,
          termsAccepted: company.termsAccepted,
          createdAt: company.createdAt
        },
        token
      }
    });

  } catch (error) {
    console.error('Company registration error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Company with this email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Login Company
const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find company by email
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await company.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(company._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        company: {
          id: company._id,
          name: company.name,
          email: company.email,
          address: company.address,
          telephone: company.telephone,
          linkedinURL: company.linkedinURL,
          biography: company.biography,
          termsAccepted: company.termsAccepted,
          createdAt: company.createdAt
        },
        token
      }
    });

  } catch (error) {
    console.error('Company login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Verify Account
const verifyAccount = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    const company = await Company.findById(decoded.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Account verified successfully',
      data: {
        company: {
          id: company._id,
          name: company.name,
          email: company.email,
          verified: true
        }
      }
    });

  } catch (error) {
    console.error('Account verification error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid verification token'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email and new password are required'
      });
    }

    // Find company by email
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Update password
    company.password = newPassword;
    await company.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const companyId = req.company._id;
    const { name, address, telephone, linkedinURL, biography } = req.body;

    // Find and update company
    const company = await Company.findByIdAndUpdate(
      companyId,
      {
        name: name || req.company.name,
        address: address || req.company.address,
        telephone: telephone || req.company.telephone,
        linkedinURL: linkedinURL || req.company.linkedinURL,
        biography: biography || req.company.biography
      },
      { new: true, runValidators: true }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        company: {
          id: company._id,
          name: company.name,
          email: company.email,
          address: company.address,
          telephone: company.telephone,
          linkedinURL: company.linkedinURL,
          biography: company.biography,
          termsAccepted: company.termsAccepted,
          createdAt: company.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Post Vacancy
const postVacancy = async (req, res) => {
  try {
    const companyId = req.company._id;
    const { title, description, requirements, location, salary, type } = req.body;

    // Check if all required fields are provided
    if (!title || !description || !requirements || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, requirements, and location'
      });
    }

    // Create new vacancy
    const vacancy = {
      title,
      description,
      requirements,
      location,
      salary: salary || '',
      type: type || 'full-time',
      status: 'active',
      postedAt: new Date(),
      applications: []
    };

    // Add vacancy to company
    const company = await Company.findByIdAndUpdate(
      companyId,
      { $push: { vacancies: vacancy } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: 'Vacancy posted successfully',
      data: {
        vacancy: company.vacancies[company.vacancies.length - 1]
      }
    });

  } catch (error) {
    console.error('Post vacancy error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// View Vacancies
const viewVacancies = async (req, res) => {
  try {
    const companyId = req.company._id;

    const company = await Company.findById(companyId).select('vacancies');
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vacancies retrieved successfully',
      data: {
        vacancies: company.vacancies,
        totalVacancies: company.vacancies.length
      }
    });

  } catch (error) {
    console.error('View vacancies error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Edit Vacancy
const editVacancy = async (req, res) => {
  try {
    const companyId = req.company._id;
    const { vacancyId } = req.params;
    const { title, description, requirements, location, salary, type, status } = req.body;

    // Find company and update specific vacancy
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Find the vacancy
    const vacancy = company.vacancies.id(vacancyId);
    if (!vacancy) {
      return res.status(404).json({
        success: false,
        message: 'Vacancy not found'
      });
    }

    // Update vacancy fields
    if (title) vacancy.title = title;
    if (description) vacancy.description = description;
    if (requirements) vacancy.requirements = requirements;
    if (location) vacancy.location = location;
    if (salary !== undefined) vacancy.salary = salary;
    if (type) vacancy.type = type;
    if (status) vacancy.status = status;

    await company.save();

    res.status(200).json({
      success: true,
      message: 'Vacancy updated successfully',
      data: {
        vacancy
      }
    });

  } catch (error) {
    console.error('Edit vacancy error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid vacancy ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete Vacancy
const deleteVacancy = async (req, res) => {
  try {
    const company = await Company.findById(req.user.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Find the vacancy index
    const vacancyIndex = company.vacancies.findIndex(
      (v) => v._id.toString() === req.params.vacancyId
    );

    if (vacancyIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Vacancy not found'
      });
    }

    // Remove the vacancy safely
    company.vacancies.splice(vacancyIndex, 1);
    await company.save();

    res.status(200).json({
      success: true,
      message: 'Vacancy deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  registerCompany,
  loginCompany,
  verifyAccount,
  resetPassword,
  updateProfile,
  postVacancy,
  viewVacancies,
  editVacancy,
  deleteVacancy
};
