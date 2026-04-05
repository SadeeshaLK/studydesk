const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Lecturer routes
router.post('/', authorize('lecturer'), quizController.createQuiz);
router.get('/my-quizzes', authorize('lecturer'), quizController.getMyQuizzes);
router.get('/students', authorize('lecturer'), quizController.getStudents);
router.get('/:id', authorize('lecturer'), quizController.getQuizById);
router.put('/:id', authorize('lecturer'), quizController.updateQuiz);
router.delete('/:id', authorize('lecturer'), quizController.deleteQuiz);
router.patch('/:id/publish', authorize('lecturer'), quizController.togglePublish);

// Student routes
router.get('/student/available', authorize('student'), quizController.getAvailableQuizzes);
router.get('/student/:id/attempt', authorize('student'), quizController.getQuizForAttempt);

module.exports = router;
