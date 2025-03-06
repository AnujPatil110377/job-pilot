
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const multer = require('multer');
const path = require('path');

// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/resumes/');
  },
  filename: function (req, file, cb) {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

// Middleware to ensure user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

// Get current user profile
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('savedJobs')
      .populate('appliedJobs.job');
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/', isAuthenticated, async (req, res) => {
  try {
    const {
      displayName,
      bio,
      location,
      linkedinUrl,
      githubUrl
    } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user fields
    if (displayName) user.displayName = displayName;
    if (bio) user.bio = bio;
    if (location) user.location = location;
    if (linkedinUrl) user.linkedinUrl = linkedinUrl;
    if (githubUrl) user.githubUrl = githubUrl;
    
    await user.save();
    
    res.json({
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        linkedinUrl: user.linkedinUrl,
        githubUrl: user.githubUrl,
        resume: user.resume
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload resume
router.post('/resume', isAuthenticated, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.resume = `/uploads/resumes/${req.file.filename}`;
    await user.save();
    
    res.json({ message: 'Resume uploaded successfully', resumeUrl: user.resume });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save a job
router.post('/saved-jobs/:jobId', isAuthenticated, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    const user = await User.findById(req.user._id);
    
    // Check if job is already saved
    if (user.savedJobs.includes(req.params.jobId)) {
      return res.status(400).json({ message: 'Job already saved' });
    }
    
    user.savedJobs.push(req.params.jobId);
    await user.save();
    
    res.json({ message: 'Job saved successfully' });
  } catch (error) {
    console.error('Error saving job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove a saved job
router.delete('/saved-jobs/:jobId', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Remove job from savedJobs
    user.savedJobs = user.savedJobs.filter(
      jobId => jobId.toString() !== req.params.jobId
    );
    
    await user.save();
    
    res.json({ message: 'Job removed from saved jobs' });
  } catch (error) {
    console.error('Error removing saved job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Track applied job
router.post('/applied-jobs/:jobId', isAuthenticated, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    const user = await User.findById(req.user._id);
    
    // Check if job is already in applied jobs
    if (user.appliedJobs.some(appliedJob => appliedJob.job.toString() === req.params.jobId)) {
      return res.status(400).json({ message: 'Job already in applied jobs' });
    }
    
    user.appliedJobs.push({
      job: req.params.jobId,
      appliedAt: new Date()
    });
    
    await user.save();
    
    res.json({ message: 'Job added to applied jobs' });
  } catch (error) {
    console.error('Error adding applied job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
