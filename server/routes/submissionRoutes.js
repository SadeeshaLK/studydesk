const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Student routes
router.post('/', authorize('student'), submissionController.submitQuiz);
router.get('/my-results', authorize('student'), submissionController.getMyResults);
router.get('/student-stats', authorize('student'), submissionController.getStudentStats);

// Lecturer routes
router.get('/dashboard-stats', authorize('lecturer'), submissionController.getDashboardStats);
router.get('/quiz/:quizId', authorize('lecturer'), submissionController.getQuizSubmissions);
router.get('/analytics/:quizId', authorize('lecturer'), submissionController.getQuizAnalytics);

// Shared routes (role checked inside controller)
router.get('/:id', authenticate, submissionController.getSubmissionDetail);

module.exports = router;
