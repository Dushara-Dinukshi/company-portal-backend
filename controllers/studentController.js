const Student = require('../models/Student');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key', {
    expiresIn: '30d'
  });
};

// Register Student
const registerStudent = async (req, res) => {
  try {
    const { name, email, password, cv } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this email already exists'
      });
    }

    // Create new student
    const student = new Student({
      name,
      email,
      password,
      cv: cv || ''
    });

    await student.save();

    // Generate token
    const token = generateToken(student._id);

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: {
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          cv: student.cv
        },
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle validation errors
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

// Login Student
const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find student by email
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await student.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(student._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          cv: student.cv
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get Student Profile
const getStudentProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if student exists
    const student = await Student.findById(id)
      .populate('appliedInternships.internshipId', 'title company location')
      .select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student profile retrieved successfully',
      data: {
        student
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Apply for Internship
const applyForInternship = async (req, res) => {
  try {
    const { internshipId } = req.params;
    const studentId = req.student._id;

    // Check if student already applied for this internship
    const existingApplication = await Student.findOne({
      _id: studentId,
      'appliedInternships.internshipId': internshipId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this internship'
      });
    }

    // Add internship application
    const student = await Student.findByIdAndUpdate(
      studentId,
      {
        $push: {
          appliedInternships: {
            internshipId,
            appliedAt: new Date(),
            status: 'pending'
          }
        }
      },
      { new: true }
    ).populate('appliedInternships.internshipId', 'title company location');

    res.status(200).json({
      success: true,
      message: 'Successfully applied for internship',
      data: {
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          appliedInternships: student.appliedInternships
        }
      }
    });

  } catch (error) {
    console.error('Apply internship error:', error);
    
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

module.exports = {
  registerStudent,
  loginStudent,
  getStudentProfile,
  applyForInternship
};
