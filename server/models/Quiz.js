const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  questionType: {
    type: String,
    enum: ['mcq', 'true-false', 'short-answer', 'dropdown'],
    required: [true, 'Question type is required']
  },
  isMultiSelect: {
    type: Boolean,
    default: false
  },
  options: [{
    text: { type: String, trim: true },
    isCorrect: { type: Boolean, default: false }
  }],
  correctAnswer: {
    type: String,
    trim: true
  },
  marks: {
    type: Number,
    default: 1,
    min: 1
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  course: {
    type: String,
    trim: true,
    maxlength: 100
  },
  lecturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  duration: {
    type: Number,
    required: [true, 'Quiz duration is required'],
    min: 1,
    max: 300
  },
  totalMarks: {
    type: Number,
    default: 0
  },
  passingPercentage: {
    type: Number,
    default: 50,
    min: 0,
    max: 100
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  // Pricing
  pricingType: {
    type: String,
    enum: ['free', 'paid'],
    default: 'free'
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  // Re-attempt control
  maxAttempts: {
    type: Number,
    default: 1,
    min: 1,
    max: 100
  },
  // Shuffle questions for each student/attempt
  shuffleQuestions: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    enum: ['mid_exam', 'final_exam', 'lesson_based', 'general'],
    default: 'general'
  },
  lessonReference: {
    type: String,
    trim: true,
    maxlength: 200
  },
  questions: [questionSchema]
}, {
  timestamps: true
});

// Calculate total marks before saving
quizSchema.pre('save', function(next) {
  if (this.questions && this.questions.length > 0) {
    this.totalMarks = this.questions.reduce((sum, q) => sum + q.marks, 0);
  }
  // Ensure free quizzes have price 0
  if (this.pricingType === 'free') {
    this.price = 0;
  }
  next();
});

module.exports = mongoose.model('Quiz', quizSchema);
