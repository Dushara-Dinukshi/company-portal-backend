const Internship = require('../models/Internship');
const Company = require('../models/Company');
const Student = require('../models/Student');

// ==================== INTERNSHIP CRUD OPERATIONS ====================

// Create Internship
const createInternship = async (req, res) => {
  try {
    const { title, description, company, location, duration, stipend, requirements } = req.body;

    // Check if all required fields are provided
    if (!title || !description || !company || !location || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, company, location, and duration'
      });
    }

    // Verify company exists
    const companyExists = await Company.findById(company);
    if (!companyExists) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Create new internship
    const internship = new Internship({
      title,
      description,
      company,
      location,
      duration,
      stipend: stipend || '',
      requirements: requirements || []
    });

    await internship.save();

    // Populate company details
    await internship.populate('company', 'name email address');

    res.status(201).json({
      success: true,
      message: 'Internship created successfully',
      data: { internship }
    });

  } catch (error) {
    console.error('Create internship error:', error);
    
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

// Get All Internships
const getAllInternships = async (req, res) => {
  try {
    const { page = 1, limit = 10, location, company, search } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    if (location) query.location = { $regex: location, $options: 'i' };
    if (company) query.company = company;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const internships = await Internship.find(query)
      .populate('company', 'name email address telephone linkedinURL')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalInternships = await Internship.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Internships retrieved successfully',
      data: {
        internships,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalInternships / limit),
          totalInternships
        }
      }
    });

  } catch (error) {
    console.error('Get internships error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get Internship by ID
const getInternshipById = async (req, res) => {
  try {
    const { id } = req.params;

    const internship = await Internship.findById(id)
      .populate('company', 'name email address telephone linkedinURL biography');

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Internship retrieved successfully',
      data: { internship }
    });

  } catch (error) {
    console.error('Get internship error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid internship ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update Internship
const updateInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const internship = await Internship.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    }).populate('company', 'name email address');

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Internship updated successfully',
      data: { internship }
    });

  } catch (error) {
    console.error('Update internship error:', error);
    
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

// Delete Internship
const deleteInternship = async (req, res) => {
  try {
    const { id } = req.params;

    const internship = await Internship.findByIdAndDelete(id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Internship deleted successfully'
    });

  } catch (error) {
    console.error('Delete internship error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get Internships by Company
const getInternshipsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Verify company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    const internships = await Internship.find({ company: companyId })
      .populate('company', 'name email address')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalInternships = await Internship.countDocuments({ company: companyId });

    res.status(200).json({
      success: true,
      message: 'Company internships retrieved successfully',
      data: {
        internships,
        company: {
          id: company._id,
          name: company.name,
          email: company.email
        },
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalInternships / limit),
          totalInternships
        }
      }
    });

  } catch (error) {
    console.error('Get company internships error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  createInternship,
  getAllInternships,
  getInternshipById,
  updateInternship,
  deleteInternship,
  getInternshipsByCompany
};
