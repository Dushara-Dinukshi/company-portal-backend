const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Register all models
require('./models/Student');
require('./models/Company');
require('./models/Category');
require('./models/Notification');
require('./models/Subscription');
require('./models/Internship');

// Import routes
const studentRoutes = require('./routes/studentRoutes');
const companyRoutes = require('./routes/companyRoutes');
const adminRoutes = require('./routes/adminRoutes');
const internshipRoutes = require('./routes/internshipRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student-auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/internships', internshipRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Student Authentication API is running',
    version: '1.0.0'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
