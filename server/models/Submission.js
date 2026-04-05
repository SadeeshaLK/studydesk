const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  selectedOption: {
    type: String,
    default: ''
  },
  selectedOptions: [{
    type: String
  }],
  textAnswer: {
    type: String,
    default: '',
    trim: true
  },
  isCorrect: {
    type: Boolean,
    default: false
  },
  marks: {
    type: Number,
    default: 0
  }
});

const submissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  answers: [answerSchema],
  attemptNumber: {
    type: Number,
    default: 1,
    min: 1
  },
  score: {
    type: Number,
    default: 0
  },
  totalMarks: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  },
  passed: {
    type: Boolean,
    default: false
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  tabSwitchCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Non-unique index for querying (allows multiple attempts)
submissionSchema.index({ student: 1, quiz: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
