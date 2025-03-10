
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    enum: ['Remote', 'Hybrid', 'On-site']
  },
  jobType: {
    type: String,
    required: true,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship']
  },
  salaryMin: {
    type: Number
  },
  salaryMax: {
    type: Number
  },
  skills: {
    type: [String],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  applicationLink: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String,
    required: true
  },
  logo: {
    type: String
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);

module.exports = Job;
