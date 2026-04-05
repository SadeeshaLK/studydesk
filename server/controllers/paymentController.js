const Quiz = require('../models/Quiz');
const Payment = require('../models/Payment');
const User = require('../models/User');

// @desc    Top up wallet balance
// @route   POST /api/payments/topup
// @access  Student only
exports.topUp = async (req, res) => {
  try {
    const { amount, cardLast4 } = req.body;

    if (!amount || amount < 500) {
      return res.status(400).json({ message: 'Minimum top-up amount is LKR 500.' });
    }

    // Update wallet balance
    const user = await User.findById(req.user._id);
    user.walletBalance += amount;
    await user.save();

    // Create top-up transaction
    const payment = await Payment.create({
      student: req.user._id,
      type: 'topup',
      amount,
      currency: 'LKR',
      paymentMethod: 'card',
      status: 'completed',
      cardLast4: cardLast4 || '0000',
      balanceAfter: user.walletBalance,
      paidAt: new Date()
    });

    res.status(201).json({
      message: `Successfully topped up LKR ${amount.toLocaleString()}!`,
      transaction: {
        id: payment._id,
        transactionId: payment.transactionId,
        amount: payment.amount,
        type: payment.type,
        balanceAfter: user.walletBalance
      },
      walletBalance: user.walletBalance
    });
  } catch (error) {
    console.error('Top up error:', error);
    res.status(500).json({ message: 'Top-up failed. Please try again.' });
  }
};

// @desc    Manual Top up wallet balance with slip upload
// @route   POST /api/payments/manual-topup
// @access  Student only
exports.manualTopUp = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount < 500) {
      return res.status(400).json({ message: 'Minimum top-up amount is LKR 500.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a payment slip.' });
    }

    const slipUrl = `/uploads/${req.file.filename}`;

    // Create pending top-up transaction
    const payment = await Payment.create({
      student: req.user._id,
      type: 'topup',
      amount,
      currency: 'LKR',
      paymentMethod: 'manual',
      status: 'pending',
      slipUrl
    });

    res.status(201).json({
      message: 'Payment slip uploaded successfully. Awaiting admin approval.',
      transaction: {
        id: payment._id,
        transactionId: payment.transactionId,
        amount: payment.amount,
        type: payment.type,
        status: payment.status
      }
    });
  } catch (error) {
    console.error('Manual Top up error:', error);
    res.status(500).json({ message: 'Failed to upload manual payment. Please try again.' });
  }
};

// @desc    Purchase a quiz using wallet balance
// @route   POST /api/payments/purchase
// @access  Student only
exports.purchaseQuiz = async (req, res) => {
  try {
    const { quizId } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    if (quiz.pricingType !== 'paid') {
      return res.status(400).json({ message: 'This quiz is free. No purchase required.' });
    }

    // Check if already purchased
    const existingPurchase = await Payment.findOne({
      student: req.user._id,
      quiz: quizId,
      type: 'purchase',
      status: 'completed'
    });
    if (existingPurchase) {
      return res.status(400).json({ message: 'You have already purchased this quiz.' });
    }

    // Check wallet balance
    const user = await User.findById(req.user._id);
    if (user.walletBalance < quiz.price) {
      return res.status(400).json({
        message: 'Insufficient balance.',
        required: quiz.price,
        currentBalance: user.walletBalance,
        shortfall: quiz.price - user.walletBalance
      });
    }

    // Deduct from wallet
    user.walletBalance -= quiz.price;
    await user.save();

    // Create purchase transaction
    const payment = await Payment.create({
      student: req.user._id,
      type: 'purchase',
      quiz: quizId,
      amount: quiz.price,
      currency: 'LKR',
      paymentMethod: 'card',
      status: 'completed',
      balanceAfter: user.walletBalance,
      paidAt: new Date()
    });

    res.status(201).json({
      message: 'Quiz purchased successfully!',
      transaction: {
        id: payment._id,
        transactionId: payment.transactionId,
        amount: payment.amount,
        type: payment.type,
        quizTitle: quiz.title,
        balanceAfter: user.walletBalance
      },
      walletBalance: user.walletBalance
    });
  } catch (error) {
    console.error('Purchase quiz error:', error);
    res.status(500).json({ message: 'Purchase failed. Please try again.' });
  }
};

// @desc    Get wallet balance
// @route   GET /api/payments/balance
// @access  Student only
exports.getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ walletBalance: user.walletBalance });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ message: 'Failed to fetch balance.' });
  }
};

// @desc    Get student's transaction history
// @route   GET /api/payments/my-payments
// @access  Student only
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ student: req.user._id })
      .populate('quiz', 'title course price')
      .sort({ createdAt: -1 });

    const user = await User.findById(req.user._id);

    res.json({
      payments,
      walletBalance: user.walletBalance
    });
  } catch (error) {
    console.error('Get my payments error:', error);
    res.status(500).json({ message: 'Failed to fetch transactions.' });
  }
};
