
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false
  },
  githubId: {
    type: String,
    required: false
  },
  googleId: {
    type: String,
    required: false
  },
  displayName: {
    type: String,
    required: false
  },
  avatar: {
    type: String,
    required: false
  },
  bio: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  linkedinUrl: {
    type: String,
    default: ''
  },
  githubUrl: {
    type: String,
    default: ''
  },
  resume: {
    type: String,
    default: ''
  },
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],
  appliedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    appliedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
