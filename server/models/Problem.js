const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  isHidden: { type: Boolean, default: false },
  points: { type: Number, default: 1 }
});

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  constraints: {
    timeLimit: { type: Number, default: 2000 }, // milliseconds
    memoryLimit: { type: Number, default: 256 }, // MB
    languages: {
      type: [String],
      default: ['cpp', 'python', 'java', 'javascript']
    }
  },
  testCases: [testCaseSchema],
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  hints: [String],
  solution: {
    approach: String,
    code: String,
    complexity: {
      time: String,
      space: String
    }
  },
  stats: {
    totalSubmissions: { type: Number, default: 0 },
    acceptedSubmissions: { type: Number, default: 0 },
    acceptanceRate: { type: Number, default: 0 }
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Update acceptance rate before saving
problemSchema.pre('save', function(next) {
  if (this.stats.totalSubmissions > 0) {
    this.stats.acceptanceRate = (this.stats.acceptedSubmissions / this.stats.totalSubmissions) * 100;
  }
  next();
});

module.exports = mongoose.model('Problem', problemSchema);