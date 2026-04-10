const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// @route   POST /api/auth/register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['student', 'lecturer']).withMessage('Invalid role')
], authController.register);

// @route   POST /api/auth/login
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], authController.login);

// @route   GET /api/auth/me
router.get('/me', authenticate, authController.getMe);

// @route   POST /api/auth/forgot-password
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Please enter a valid email')
], authController.forgotPassword);

// @route   POST /api/auth/reset-password
router.post('/reset-password', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('code').trim().notEmpty().withMessage('Reset code is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], authController.resetPassword);

module.exports = router;
