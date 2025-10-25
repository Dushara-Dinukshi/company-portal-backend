const Admin = require('../models/adminModel');
const Student = require('../models/Student');
const Company = require('../models/Company');
const Category = require('../models/Category');
const Subscription = require('../models/Subscription');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key', {
    expiresIn: '30d'
  });
};

// ==================== AUTHENTICATION ====================

// Register Admin
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role, permissions } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

    // Create new admin
    const admin = new Admin({
      name,
      email,
      password,
      role: role || 'admin',
      permissions: permissions || {}
    });

    await admin.save();

    // Generate token
    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions,
          isActive: admin.isActive,
          createdAt: admin.createdAt
        },
        token
      }
    });

  } catch (error) {
    console.error('Admin registration error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Login Admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const admin = await Admin.findOne({ email, isActive: true });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions,
          lastLogin: admin.lastLogin
        },
        token
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// ==================== USER MANAGEMENT ====================

// Get All Users (Students and Companies)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, search } = req.query;
    const skip = (page - 1) * limit;

    let students = [];
    let companies = [];
    let totalStudents = 0;
    let totalCompanies = 0;

    // Build search query
    const searchQuery = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    if (!type || type === 'students') {
      students = await Student.find(searchQuery)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
      totalStudents = await Student.countDocuments(searchQuery);
    }

    if (!type || type === 'companies') {
      companies = await Company.find(searchQuery)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
      totalCompanies = await Company.countDocuments(searchQuery);
    }

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        students,
        companies,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil((totalStudents + totalCompanies) / limit),
          totalStudents,
          totalCompanies,
          totalUsers: totalStudents + totalCompanies
        }
      }
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    const { userId, userType } = req.params;
    const updateData = req.body;

    let user;
    if (userType === 'student') {
      user = await Student.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
    } else if (userType === 'company') {
      user = await Company.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type'
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const { userId, userType } = req.params;

    let user;
    if (userType === 'student') {
      user = await Student.findByIdAndDelete(userId);
    } else if (userType === 'company') {
      user = await Company.findByIdAndDelete(userId);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type'
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// ==================== CATEGORY MANAGEMENT ====================

// Create Category
const createCategory = async (req, res) => {
  try {
    const { name, description, icon, color } = req.body;
    const createdBy = req.admin._id;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    const category = new Category({
      name,
      description,
      icon,
      color,
      createdBy
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category }
    });

  } catch (error) {
    console.error('Create category error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get All Categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: { categories }
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update Category
const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const updateData = req.body;

    const category = await Category.findByIdAndUpdate(categoryId, updateData, { new: true });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: { category }
    });

  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete Category
const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// ==================== JOB MANAGEMENT ====================

// Get All Job Posts
const getAllJobPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, companyId } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query['vacancies.status'] = status;
    if (companyId) query._id = companyId;

    const companies = await Company.find(query)
      .select('name email vacancies')
      .populate('vacancies.applications.studentId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Flatten vacancies for easier management
    const allVacancies = [];
    companies.forEach(company => {
      company.vacancies.forEach(vacancy => {
        allVacancies.push({
          _id: vacancy._id,
          title: vacancy.title,
          description: vacancy.description,
          location: vacancy.location,
          salary: vacancy.salary,
          type: vacancy.type,
          status: vacancy.status,
          postedAt: vacancy.postedAt,
          company: {
            _id: company._id,
            name: company.name,
            email: company.email
          },
          applications: vacancy.applications
        });
      });
    });

    res.status(200).json({
      success: true,
      message: 'Job posts retrieved successfully',
      data: {
        vacancies: allVacancies,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(allVacancies.length / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get job posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Approve/Reject Job Post
const updateJobStatus = async (req, res) => {
  try {
    const { companyId, vacancyId } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be active, inactive, or closed'
      });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    const vacancy = company.vacancies.id(vacancyId);
    if (!vacancy) {
      return res.status(404).json({
        success: false,
        message: 'Job post not found'
      });
    }

    vacancy.status = status;
    await company.save();

    res.status(200).json({
      success: true,
      message: `Job post ${status} successfully`,
      data: { vacancy }
    });

  } catch (error) {
    console.error('Update job status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// ==================== SUBSCRIPTION MANAGEMENT ====================

// Get All Subscriptions
const getAllSubscriptions = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, planType } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;
    if (planType) query.planType = planType;

    const subscriptions = await Subscription.find(query)
      .populate('company', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalSubscriptions = await Subscription.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Subscriptions retrieved successfully',
      data: {
        subscriptions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalSubscriptions / limit),
          totalSubscriptions
        }
      }
    });

  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update Subscription
const updateSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const updateData = req.body;

    const subscription = await Subscription.findByIdAndUpdate(subscriptionId, updateData, { new: true })
      .populate('company', 'name email');

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subscription updated successfully',
      data: { subscription }
    });

  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// ==================== ANALYTICS ====================

// Get Analytics Reports
const getAnalytics = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Get basic counts
    const totalStudents = await Student.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const totalSubscriptions = await Subscription.countDocuments();
    const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });

    // Get top 5 companies hiring
    const topCompanies = await Company.aggregate([
      { $unwind: '$vacancies' },
      { $match: { 'vacancies.status': 'active' } },
      { $group: { _id: '$_id', name: { $first: '$name' }, jobCount: { $sum: 1 } } },
      { $sort: { jobCount: -1 } },
      { $limit: 5 }
    ]);

    // Payment breakdown
    const paymentBreakdown = await Subscription.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$planType', totalRevenue: { $sum: '$price' }, count: { $sum: 1 } } }
    ]);

    // Monthly revenue trend
    const revenueTrend = await Subscription.aggregate([
      { $match: { createdAt: { $gte: startDate }, paymentStatus: 'paid' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$price' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      success: true,
      message: 'Analytics retrieved successfully',
      data: {
        overview: {
          totalStudents,
          totalCompanies,
          totalSubscriptions,
          activeSubscriptions
        },
        topCompaniesHiring: topCompanies,
        paymentBreakdown,
        revenueTrend,
        period
      }
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// ==================== NOTIFICATION MANAGEMENT ====================

// Create Notification
const createNotification = async (req, res) => {
  try {
    const notificationData = {
      ...req.body,
      createdBy: req.admin._id
    };

    const notification = new Notification(notificationData);
    await notification.save();

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: { notification }
    });

  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get All Notifications
const getAllNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, priority } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (type) query.type = type;
    if (priority) query.priority = priority;

    const notifications = await Notification.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalNotifications = await Notification.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: {
        notifications,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalNotifications / limit),
          totalNotifications
        }
      }
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update Notification
const updateNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const updateData = req.body;

    const notification = await Notification.findByIdAndUpdate(notificationId, updateData, { new: true });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification updated successfully',
      data: { notification }
    });

  } catch (error) {
    console.error('Update notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete Notification
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });

  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// ==================== ADMIN PROFILE ====================

// Get Admin Profile
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');

    res.status(200).json({
      success: true,
      message: 'Admin profile retrieved successfully',
      data: { admin }
    });

  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update Admin Profile
const updateAdminProfile = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const adminId = req.admin._id;

    const updateData = {};
    if (name) updateData.name = name;
    if (permissions) updateData.permissions = permissions;

    const admin = await Admin.findByIdAndUpdate(adminId, updateData, { new: true }).select('-password');

    res.status(200).json({
      success: true,
      message: 'Admin profile updated successfully',
      data: { admin }
    });

  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
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
};
