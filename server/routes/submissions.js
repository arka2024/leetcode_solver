const express = require('express');
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { executeCode } = require('../services/codeExecution');

const router = express.Router();

// Submit code
router.post('/', auth, async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

    if (!problemId || !code || !language) {
      return res.status(400).json({
        success: false,
        message: 'Problem ID, code, and language are required'
      });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Check if language is supported
    if (!problem.constraints.languages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: 'Language not supported for this problem'
      });
    }

    // Create submission
    const submission = new Submission({
      user: req.userId,
      problem: problemId,
      code,
      language,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    await submission.save();

    // Execute code asynchronously
    executeCode(submission._id, problem, code, language)
      .then(async (results) => {
        // Update submission with results
        submission.status = results.status;
        submission.testResults = results.testResults;
        submission.performance = results.performance;
        submission.verdict = results.verdict;
        
        await submission.save();

        // Update problem and user statistics
        await Problem.findByIdAndUpdate(problemId, {
          $inc: { 
            'stats.totalSubmissions': 1,
            'stats.acceptedSubmissions': results.status === 'Accepted' ? 1 : 0
          }
        });

        const user = await User.findById(req.userId);
        user.stats.totalSubmissions += 1;
        if (results.status === 'Accepted') {
          user.stats.acceptedSubmissions += 1;
        }
        await user.save();
      })
      .catch(async (error) => {
        console.error('Code execution error:', error);
        submission.status = 'Runtime Error';
        submission.verdict = {
          message: 'Execution failed',
          details: error.message
        };
        await submission.save();
      });

    res.status(201).json({
      success: true,
      message: 'Code submitted successfully',
      submissionId: submission._id
    });
  } catch (error) {
    console.error('Submit code error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit code',
      error: error.message
    });
  }
});

// Get submission status
router.get('/:id/status', auth, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('problem', 'title slug')
      .populate('user', 'username');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Only allow users to view their own submissions (or admins)
    const user = await User.findById(req.userId);
    if (submission.user._id.toString() !== req.userId && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      submission
    });
  } catch (error) {
    console.error('Get submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submission',
      error: error.message
    });
  }
});

// Get user submissions
router.get('/my', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, problemId, status } = req.query;
    
    const filter = { user: req.userId };
    if (problemId) filter.problem = problemId;
    if (status) filter.status = status;

    const submissions = await Submission.find(filter)
      .populate('problem', 'title slug difficulty')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Submission.countDocuments(filter);

    res.json({
      success: true,
      submissions,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get user submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submissions',
      error: error.message
    });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const users = await User.find({ role: 'user' })
      .select('username profile stats')
      .sort({ 'stats.acceptedSubmissions': -1, 'stats.rating': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments({ role: 'user' });

    res.json({
      success: true,
      leaderboard: users.map((user, index) => ({
        rank: (page - 1) * limit + index + 1,
        username: user.username,
        profile: user.profile,
        stats: user.stats
      })),
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard',
      error: error.message
    });
  }
});

module.exports = router;