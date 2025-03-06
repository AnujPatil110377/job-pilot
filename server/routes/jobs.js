
const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const multer = require('multer');
const path = require('path');

// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get all jobs with pagination, search and filters
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build the query
    let query = {};
    
    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { skills: searchRegex }
      ];
    }
    
    // Filters
    if (req.query.location) {
      query.location = req.query.location;
    }
    
    if (req.query.jobType) {
      query.jobType = req.query.jobType;
    }
    
    if (req.query.minSalary) {
      query.salaryMin = { $gte: parseInt(req.query.minSalary) };
    }
    
    if (req.query.maxSalary) {
      query.salaryMax = { $lte: parseInt(req.query.maxSalary) };
    }
    
    // Execute query with pagination
    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.json({
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new job
router.post('/', upload.single('logo'), async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      jobType,
      salaryMin,
      salaryMax,
      skills,
      description,
      applicationLink,
      contactEmail
    } = req.body;
    
    // Create new job
    const newJob = new Job({
      title,
      company,
      location,
      jobType,
      salaryMin: salaryMin ? parseInt(salaryMin) : undefined,
      salaryMax: salaryMax ? parseInt(salaryMax) : undefined,
      skills: skills.split(',').map(skill => skill.trim()),
      description,
      applicationLink,
      contactEmail,
      logo: req.file ? `/uploads/${req.file.filename}` : null,
      postedBy: req.user ? req.user._id : null
    });
    
    await newJob.save();
    
    res.status(201).json(newJob);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a job
router.put('/:id', upload.single('logo'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Update job fields
    const updateData = { ...req.body };
    
    if (req.body.skills) {
      updateData.skills = req.body.skills.split(',').map(skill => skill.trim());
    }
    
    if (req.body.salaryMin) {
      updateData.salaryMin = parseInt(req.body.salaryMin);
    }
    
    if (req.body.salaryMax) {
      updateData.salaryMax = parseInt(req.body.salaryMax);
    }
    
    if (req.file) {
      updateData.logo = `/uploads/${req.file.filename}`;
    }
    
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );
    
    res.json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a job
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    await Job.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
