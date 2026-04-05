import { useState } from 'react';
import { Modal, Input, Button, message, Divider } from 'antd';
import {
  CreditCardOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import api from '../../api/axios';

const PaymentModal = ({ open, onClose, quiz, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [success, setSuccess] = useState(false);

  const formatCardNumber = (value) => {
    const v = value.replace(/\D/g, '').slice(0, 16);
    return v.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) return v.slice(0, 2) + '/' + v.slice(2);
    return v;
  };

  const isFormValid = () => {
    return cardNumber.replace(/\s/g, '').length === 16 &&
      expiry.length === 5 &&
      cvv.length >= 3 &&
      cardName.trim().length > 0;
  };

  const handlePayment = async () => {
    if (!isFormValid()) {
      message.warning('Please fill all card details.');
      return;
    }

    setLoading(true);
    try {
      const cardLast4 = cardNumber.replace(/\s/g, '').slice(-4);
      const { data } = await api.post('/payments', {
        quizId: quiz._id,
        cardLast4
      });
      setSuccess(true);
      message.success('Payment successful!');
      setTimeout(() => {
        onPaymentSuccess(data.payment);
        handleClose();
      }, 1500);
    } catch (error) {
      message.error(error.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setCardName('');
    setSuccess(false);
    onClose();
  };

  if (!quiz) return null;

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={460}
      centered
      destroyOnClose
      className="payment-modal"
    >
      {success ? (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a', marginBottom: 16 }} />
          <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Payment Successful!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>You can now attempt the quiz.</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>💳</div>
            <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 4 }}>Complete Payment</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
              Unlock access to this quiz
            </p>
          </div>

          {/* Quiz Summary */}
          <div style={{
            background: 'var(--bg-primary)',
            borderRadius: 10,
            padding: 16,
            marginBottom: 20,
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{quiz.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{quiz.course}</div>
              </div>
              <div style={{
                fontSize: 22,
                fontWeight: 800,
                color: 'var(--primary)',
              }}>
                LKR {quiz.price?.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Card Form */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>
              Cardholder Name
            </label>
            <Input
              placeholder="JOHN DOE"
              value={cardName}
              onChange={e => setCardName(e.target.value.toUpperCase())}
              size="large"
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>
              Card Number
            </label>
            <Input
              prefix={<CreditCardOutlined style={{ color: 'var(--text-muted)' }} />}
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={e => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
              size="large"
              style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: 1 }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>
                Expiry
              </label>
              <Input
                placeholder="MM/YY"
                value={expiry}
                onChange={e => setExpiry(formatExpiry(e.target.value))}
                maxLength={5}
                size="large"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>
                CVV
              </label>
              <Input
                prefix={<LockOutlined style={{ color: 'var(--text-muted)' }} />}
                placeholder="•••"
                value={cvv}
                onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
                size="large"
                type="password"
              />
            </div>
          </div>

          <Button
            type="primary"
            block
            size="large"
            onClick={handlePayment}
            loading={loading}
            disabled={!isFormValid()}
            style={{ height: 48, fontSize: 15, fontWeight: 600 }}
          >
            Pay LKR {quiz.price?.toLocaleString()}
          </Button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            marginTop: 16,
            color: 'var(--text-muted)',
            fontSize: 12
          }}>
            <SafetyCertificateOutlined />
            <span>Secure payment · Your card details are safe</span>
          </div>
        </>
      )}
    </Modal>
  );
};

export default PaymentModal;
