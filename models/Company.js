const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    minlength: [2, 'Company name must be at least 2 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  telephone: {
    type: String,
    required: [true, 'Telephone number is required'],
    trim: true,
    match: [/^(?:\+94|0)?7\d{8}$/, 'Please enter a valid telephone number']
  },
  linkedinURL: {
    type: String,
    trim: true,
    match: [/^https?:\/\/(www\.)?linkedin\.com\/(company|in)\/[a-zA-Z0-9-_/]+\/?$/, 'Please enter a valid LinkedIn URL']
  },
  biography: {
    type: String,
    trim: true,
    maxlength: [1000, 'Biography cannot exceed 1000 characters']
  },
  termsAccepted: {
    type: Boolean,
    required: [true, 'You must accept the terms and conditions'],
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  vacancies: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    requirements: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    salary: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'internship', 'contract'],
      default: 'full-time'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'closed'],
      default: 'active'
    },
    postedAt: {
      type: Date,
      default: Date.now
    },
    applications: [{
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
      },
      appliedAt: {
        type: Date,
        default: Date.now
      },
      status: {
        type: String,
        enum: ['pending', 'reviewed', 'accepted', 'rejected'],
        default: 'pending'
      },
      coverLetter: {
        type: String,
        trim: true
      }
    }]
  }]
}, {
  timestamps: true
});

// Hash password before saving
companySchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
companySchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
companySchema.methods.toJSON = function() {
  const companyObject = this.toObject();
  delete companyObject.password;
  return companyObject;
};

module.exports = mongoose.model('Company', companySchema);
