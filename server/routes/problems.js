const express = require('express');
const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all problems with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      difficulty,
      category,
      tags,
      search
    } = req.query;

    const filter = { isActive: true };

    if (difficulty) filter.difficulty = difficulty;
    if (category) filter.category = new RegExp(category, 'i');
    if (tags) filter.tags = { $in: tags.split(',') };
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const problems = await Problem.find(filter)
      .select('-testCases -solution')
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Problem.countDocuments(filter);

    res.json({
      success: true,
      problems,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get problems error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch problems',
      error: error.message
    });
  }
});

// Get single problem by slug
router.get('/:slug', async (req, res) => {
  try {
    const problem = await Problem.findOne({ 
      slug: req.params.slug, 
      isActive: true 
    })
    .select('-solution')
    .populate('author', 'username');

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Hide hidden test cases from response
    const publicTestCases = problem.testCases.filter(tc => !tc.isHidden);
    const responseData = problem.toObject();
    responseData.testCases = publicTestCases;

    res.json({
      success: true,
      problem: responseData
    });
  } catch (error) {
    console.error('Get problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch problem',
      error: error.message
    });
  }
});

// Create new problem (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const problemData = {
      ...req.body,
      author: req.userId,
      slug: req.body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
    };

    const problem = new Problem(problemData);
    await problem.save();

    res.status(201).json({
      success: true,
      message: 'Problem created successfully',
      problem
    });
  } catch (error) {
    console.error('Create problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create problem',
      error: error.message
    });
  }
});

// Update problem (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    res.json({
      success: true,
      message: 'Problem updated successfully',
      problem
    });
  } catch (error) {
    console.error('Update problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update problem',
      error: error.message
    });
  }
});

// Get problem statistics
router.get('/:slug/stats', async (req, res) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug });
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    const submissions = await Submission.aggregate([
      { $match: { problem: problem._id } },
      { $group: {
        _id: '$status',
        count: { $sum: 1 }
      }}
    ]);

    const stats = {
      total: problem.stats.totalSubmissions,
      accepted: problem.stats.acceptedSubmissions,
      acceptanceRate: problem.stats.acceptanceRate,
      byStatus: submissions.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

module.exports = router;