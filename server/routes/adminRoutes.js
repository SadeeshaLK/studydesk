const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// User management
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/promote', adminController.promoteToLecturer);
router.patch('/users/:id/demote', adminController.demoteToStudent);
router.delete('/users/:id', adminController.deleteUser);

// Payments
router.get('/payments', adminController.getPayments);
router.patch('/payments/manual/:id/approve', adminController.approveManualPayment);
router.patch('/payments/manual/:id/reject', adminController.rejectManualPayment);

// Quizzes
router.get('/quizzes', adminController.getAllQuizzes);

module.exports = router;
