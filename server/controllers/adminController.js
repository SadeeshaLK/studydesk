const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Submission = require('../models/Submission');
const Payment = require('../models/Payment');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Admin only
exports.getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalStudents, totalLecturers, totalQuizzes, totalSubmissions, allPayments] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'lecturer' }),
      Quiz.countDocuments(),
      Submission.countDocuments(),
      Payment.find({ status: 'completed' })
    ]);

    const purchases = allPayments.filter(p => p.type === 'purchase');
    const topups = allPayments.filter(p => p.type === 'topup');
    const totalRevenue = purchases.reduce((sum, p) => sum + p.amount, 0);
    const totalTopups = topups.reduce((sum, p) => sum + p.amount, 0);

    // Recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt');

    // Recent transactions
    const recentPayments = await Payment.find({ status: 'completed' })
      .populate('student', 'name email')
      .populate('quiz', 'title price')
      .sort({ paidAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalStudents,
        totalLecturers,
        totalQuizzes,
        totalSubmissions,
        totalRevenue,
        totalTopups,
        totalPayments: allPayments.length
      },
      recentUsers,
      recentPayments
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data.' });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin only
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select('name email role createdAt');

    // Add stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const u = user.toObject();
        if (user.role === 'student') {
          u.submissionCount = await Submission.countDocuments({ student: user._id });
          u.paymentCount = await Payment.countDocuments({ student: user._id, status: 'completed' });
        } else if (user.role === 'lecturer') {
          u.quizCount = await Quiz.countDocuments({ lecturer: user._id });
        }
        return u;
      })
    );

    res.json({ users: usersWithStats });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
};

// @desc    Promote user to lecturer
// @route   PATCH /api/admin/users/:id/promote
// @access  Admin only
exports.promoteToLecturer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot change admin role.' });
    }

    if (user.role === 'lecturer') {
      return res.status(400).json({ message: 'User is already a lecturer.' });
    }

    user.role = 'lecturer';
    await user.save();

    res.json({ message: `${user.name} promoted to Lecturer!`, user });
  } catch (error) {
    console.error('Promote user error:', error);
    res.status(500).json({ message: 'Failed to promote user.' });
  }
};

// @desc    Demote user to student
// @route   PATCH /api/admin/users/:id/demote
// @access  Admin only
exports.demoteToStudent = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot change admin role.' });
    }

    if (user.role === 'student') {
      return res.status(400).json({ message: 'User is already a student.' });
    }

    user.role = 'student';
    await user.save();

    res.json({ message: `${user.name} demoted to Student.`, user });
  } catch (error) {
    console.error('Demote user error:', error);
    res.status(500).json({ message: 'Failed to demote user.' });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin only
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin account.' });
    }

    // Clean up user data
    await Promise.all([
      Submission.deleteMany({ student: req.params.id }),
      Payment.deleteMany({ student: req.params.id }),
      Quiz.deleteMany({ lecturer: req.params.id })
    ]);

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: `User ${user.name} deleted successfully.` });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user.' });
  }
};

// @desc    Get all payments
// @route   GET /api/admin/payments
// @access  Admin only
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('student', 'name email')
      .populate('quiz', 'title price pricingType')
      .sort({ createdAt: -1 });

    const completedPayments = payments.filter(p => p.status === 'completed');
    const totalRevenue = completedPayments
      .filter(p => p.type === 'purchase')
      .reduce((sum, p) => sum + p.amount, 0);
    const totalTopups = completedPayments
      .filter(p => p.type === 'topup')
      .reduce((sum, p) => sum + p.amount, 0);

    res.json({ payments, totalRevenue, totalTopups });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Failed to fetch payments.' });
  }
};

// @desc    Approve manual payment
// @route   PATCH /api/admin/payments/manual/:id/approve
// @access  Admin only
exports.approveManualPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    
    if (!payment || payment.paymentMethod !== 'manual') {
      return res.status(404).json({ message: 'Manual payment not found.' });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({ message: `Payment is already ${payment.status}.` });
    }

    const user = await User.findById(payment.student);
    if (!user) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    user.walletBalance += payment.amount;
    await user.save();

    payment.status = 'completed';
    payment.balanceAfter = user.walletBalance;
    payment.paidAt = new Date();
    await payment.save();

    res.json({ message: 'Payment approved successfully.', payment, walletBalance: user.walletBalance });
  } catch (error) {
    console.error('Approve manual payment error:', error);
    res.status(500).json({ message: 'Failed to approve payment.' });
  }
};

// @desc    Reject manual payment
// @route   PATCH /api/admin/payments/manual/:id/reject
// @access  Admin only
exports.rejectManualPayment = async (req, res) => {
  try {
    const { feedback } = req.body;
    const payment = await Payment.findById(req.params.id);
    
    if (!payment || payment.paymentMethod !== 'manual') {
      return res.status(404).json({ message: 'Manual payment not found.' });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({ message: `Payment is already ${payment.status}.` });
    }

    payment.status = 'failed';
    payment.adminFeedback = feedback || '';
    await payment.save();

    res.json({ message: 'Payment rejected.', payment });
  } catch (error) {
    console.error('Reject manual payment error:', error);
    res.status(500).json({ message: 'Failed to reject payment.' });
  }
};

// @desc    Get all quizzes (admin view)
// @route   GET /api/admin/quizzes
// @access  Admin only
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate('lecturer', 'name email')
      .select('-questions')
      .sort({ createdAt: -1 });

    const quizzesWithStats = await Promise.all(
      quizzes.map(async (quiz) => {
        const submissionCount = await Submission.countDocuments({ quiz: quiz._id });
        const paymentCount = await Payment.countDocuments({ quiz: quiz._id, status: 'completed' });
        return { ...quiz.toObject(), submissionCount, paymentCount };
      })
    );

    res.json({ quizzes: quizzesWithStats });
  } catch (error) {
    console.error('Get all quizzes error:', error);
    res.status(500).json({ message: 'Failed to fetch quizzes.' });
  }
};
