const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['cpp', 'java', 'python', 'javascript', 'c']
  },
  status: {
    type: String,
    enum: ['Pending', 'Running', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Memory Limit Exceeded', 'Compilation Error', 'Runtime Error'],
    default: 'Pending'
  },
  verdict: {
    message: String,
    details: String
  },
  testResults: [{
    testCase: Number,
    status: String,
    executionTime: Number,
    memoryUsed: Number,
    input: String,
    expectedOutput: String,
    actualOutput: String,
    error: String
  }],
  performance: {
    executionTime: { type: Number, default: 0 }, // milliseconds
    memoryUsed: { type: Number, default: 0 }, // MB
    score: { type: Number, default: 0 }
  },
  metadata: {
    ipAddress: String,
    userAgent: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
submissionSchema.index({ user: 1, createdAt: -1 });
submissionSchema.index({ problem: 1, createdAt: -1 });
submissionSchema.index({ status: 1 });

module.exports = mongoose.model('Submission', submissionSchema);