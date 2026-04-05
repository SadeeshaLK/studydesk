const Submission = require('../models/Submission');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const { sendEmail, quizResultEmail } = require('../utils/emailService');

// @desc    Submit quiz answers
// @route   POST /api/submissions
// @access  Student only
exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers, startedAt, tabSwitchCount } = req.body;

    // Get quiz with answers for scoring
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    // Check attempt limit
    const attemptCount = await Submission.countDocuments({ student: req.user._id, quiz: quizId });
    if (attemptCount >= quiz.maxAttempts) {
      return res.status(400).json({ message: `Maximum attempts (${quiz.maxAttempts}) reached for this quiz.` });
    }

    // Score the submission
    let score = 0;
    const scoredAnswers = answers.map(answer => {
      const question = quiz.questions.id(answer.questionId);
      if (!question) return { ...answer, isCorrect: false, marks: 0 };

      let isCorrect = false;
      let marks = 0;

      switch (question.questionType) {
        case 'mcq':
        case 'true-false': {
          if (question.isMultiSelect) {
            const correctOptionIds = question.options.filter(opt => opt.isCorrect).map(opt => opt._id.toString());
            const selectedOptionIds = answer.selectedOptions || [];
            
            let correctChosenCount = 0;
            let incorrectChosenCount = 0;
            
            selectedOptionIds.forEach(id => {
              if (correctOptionIds.includes(id)) {
                correctChosenCount++;
              } else {
                incorrectChosenCount++;
              }
            });
            
            isCorrect = (correctOptionIds.length > 0 && correctOptionIds.every(id => selectedOptionIds.includes(id)) && selectedOptionIds.length === correctOptionIds.length);
            marks = Math.max(0, correctChosenCount - incorrectChosenCount);
          } else {
            const correctOption = question.options.find(opt => opt.isCorrect);
            isCorrect = !!(correctOption && answer.selectedOption === correctOption._id.toString());
            marks = isCorrect ? question.marks : 0;
          }
          break;
        }
        case 'short-answer': {
          const studentAnswer = (answer.textAnswer || '').trim().toLowerCase();
          const correctAns = (question.correctAnswer || '').trim().toLowerCase();
          isCorrect = !!(studentAnswer === correctAns && studentAnswer !== '');
          marks = isCorrect ? question.marks : 0;
          break;
        }
      }

      score += marks;

      return {
        questionId: answer.questionId,
        selectedOption: answer.selectedOption || '',
        selectedOptions: answer.selectedOptions || [],
        textAnswer: answer.textAnswer || '',
        isCorrect,
        marks
      };
    });

    const totalMarks = quiz.totalMarks;
    const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
    const passed = percentage >= quiz.passingPercentage;

    const submission = await Submission.create({
      student: req.user._id,
      quiz: quizId,
      answers: scoredAnswers,
      attemptNumber: attemptCount + 1,
      score,
      totalMarks,
      percentage,
      passed,
      startedAt: startedAt || new Date(),
      submittedAt: new Date(),
      tabSwitchCount: tabSwitchCount || 0
    });

    res.status(201).json({
      message: 'Quiz submitted successfully!',
      result: {
        id: submission._id,
        score,
        totalMarks,
        percentage,
        passed,
        attemptNumber: submission.attemptNumber,
        quizTitle: quiz.title
      }
    });

    // Send quiz result email (async, non-blocking)
    const student = await User.findById(req.user._id);
    if (student) {
      sendEmail(student.email, quizResultEmail(student.name, quiz.title, score, totalMarks, percentage, passed)).catch(() => {});
    }
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Failed to submit quiz.' });
  }
};

// @desc    Get student's results
// @route   GET /api/submissions/my-results
// @access  Student only
exports.getMyResults = async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user._id })
      .populate('quiz', 'title course duration totalMarks passingPercentage maxAttempts')
      .sort({ submittedAt: -1 });

    res.json({ submissions });
  } catch (error) {
    console.error('Get my results error:', error);
    res.status(500).json({ message: 'Failed to fetch results.' });
  }
};

// @desc    Get single submission detail
// @route   GET /api/submissions/:id
// @access  Student (own) or Lecturer
exports.getSubmissionDetail = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('quiz', 'title course questions passingPercentage maxAttempts')
      .populate('student', 'name email');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found.' });
    }

    // Students can only view their own submissions
    if (req.user.role === 'student' && submission.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    res.json({ submission });
  } catch (error) {
    console.error('Get submission detail error:', error);
    res.status(500).json({ message: 'Failed to fetch submission.' });
  }
};

// @desc    Get all submissions for a quiz
// @route   GET /api/submissions/quiz/:quizId
// @access  Lecturer only
exports.getQuizSubmissions = async (req, res) => {
  try {
    // Verify the quiz belongs to this lecturer
    const quiz = await Quiz.findOne({ _id: req.params.quizId, lecturer: req.user._id });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    const submissions = await Submission.find({ quiz: req.params.quizId })
      .populate('student', 'name email')
      .sort({ submittedAt: -1 });

    res.json({ submissions, quizTitle: quiz.title });
  } catch (error) {
    console.error('Get quiz submissions error:', error);
    res.status(500).json({ message: 'Failed to fetch submissions.' });
  }
};

// @desc    Get quiz analytics
// @route   GET /api/submissions/analytics/:quizId
// @access  Lecturer only
exports.getQuizAnalytics = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.quizId, lecturer: req.user._id });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    const submissions = await Submission.find({ quiz: req.params.quizId });

    if (submissions.length === 0) {
      return res.json({
        analytics: {
          quizTitle: quiz.title,
          attemptCount: 0,
          averageScore: 0,
          averagePercentage: 0,
          highestScore: 0,
          lowestScore: 0,
          passCount: 0,
          failCount: 0,
          passRate: 0
        }
      });
    }

    const scores = submissions.map(s => s.score);
    const percentages = submissions.map(s => s.percentage);
    const passCount = submissions.filter(s => s.passed).length;

    res.json({
      analytics: {
        quizTitle: quiz.title,
        attemptCount: submissions.length,
        averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10,
        averagePercentage: Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length),
        highestScore: Math.max(...scores),
        lowestScore: Math.min(...scores),
        passCount,
        failCount: submissions.length - passCount,
        passRate: Math.round((passCount / submissions.length) * 100)
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics.' });
  }
};

// @desc    Get lecturer dashboard stats
// @route   GET /api/submissions/dashboard-stats
// @access  Lecturer only
exports.getDashboardStats = async (req, res) => {
  try {
    const User = require('../models/User');
    
    const totalQuizzes = await Quiz.countDocuments({ lecturer: req.user._id });
    const publishedQuizzes = await Quiz.countDocuments({ lecturer: req.user._id, isPublished: true });
    const totalStudents = await User.countDocuments({ role: 'student' });

    // Get all quizzes by this lecturer
    const lecturerQuizzes = await Quiz.find({ lecturer: req.user._id }).select('_id');
    const quizIds = lecturerQuizzes.map(q => q._id);

    const allSubmissions = await Submission.find({ quiz: { $in: quizIds } });
    const totalSubmissions = allSubmissions.length;
    const avgScore = totalSubmissions > 0
      ? Math.round(allSubmissions.reduce((sum, s) => sum + s.percentage, 0) / totalSubmissions)
      : 0;

    // Recent submissions
    const recentSubmissions = await Submission.find({ quiz: { $in: quizIds } })
      .populate('student', 'name')
      .populate('quiz', 'title')
      .sort({ submittedAt: -1 })
      .limit(10);

    res.json({
      stats: {
        totalQuizzes,
        publishedQuizzes,
        totalStudents,
        totalSubmissions,
        avgScore
      },
      recentSubmissions
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats.' });
  }
};

// @desc    Get student dashboard stats
// @route   GET /api/submissions/student-stats
// @access  Student only
exports.getStudentStats = async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user._id })
      .populate('quiz', 'title course');
    
    const quizzesTaken = submissions.length;
    const avgScore = quizzesTaken > 0
      ? Math.round(submissions.reduce((sum, s) => sum + s.percentage, 0) / quizzesTaken)
      : 0;
    const passRate = quizzesTaken > 0
      ? Math.round((submissions.filter(s => s.passed).length / quizzesTaken) * 100)
      : 0;

    res.json({
      stats: {
        quizzesTaken,
        avgScore,
        passRate
      },
      recentResults: submissions.slice(0, 5)
    });
  } catch (error) {
    console.error('Get student stats error:', error);
    res.status(500).json({ message: 'Failed to fetch stats.' });
  }
};
