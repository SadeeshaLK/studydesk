const mongoose = require('mongoose');
const crypto = require('crypto');

const paymentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['topup', 'purchase'],
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    default: null
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'LKR',
    uppercase: true
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'demo', 'manual'],
    default: 'card'
  },
  slipUrl: {
    type: String,
    default: ''
  },
  adminFeedback: {
    type: String,
    default: ''
  },
  transactionId: {
    type: String,
    unique: true,
    default: () => 'TXN_' + crypto.randomBytes(12).toString('hex').toUpperCase()
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  cardLast4: {
    type: String,
    default: ''
  },
  balanceAfter: {
    type: Number,
    default: 0
  },
  paidAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for student transactions
paymentSchema.index({ student: 1, type: 1 });
// Index for checking if student purchased a quiz
paymentSchema.index({ student: 1, quiz: 1, type: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
