import { useState } from 'react';
import { Modal, Button, message } from 'antd';
import {
  CheckCircleOutlined,
  ShoppingCartOutlined,
  WalletOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import api from '../../api/axios';

const PurchaseModal = ({ open, onClose, quiz, walletBalance = 0, onPurchaseSuccess, onTopUpClick }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newBalance, setNewBalance] = useState(0);

  if (!quiz) return null;

  const hasEnough = walletBalance >= quiz.price;
  const shortfall = quiz.price - walletBalance;

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/payments/purchase', { quizId: quiz._id });
      setNewBalance(data.walletBalance);
      setSuccess(true);
      message.success('Quiz purchased successfully!');
      setTimeout(() => {
        onPurchaseSuccess(data.walletBalance);
        handleClose();
      }, 1500);
    } catch (error) {
      message.error(error.response?.data?.message || 'Purchase failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={440}
      centered
      destroyOnClose
    >
      {success ? (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a', marginBottom: 16 }} />
          <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Purchase Successful!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>You can now attempt the quiz.</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Remaining balance: <strong style={{ color: 'var(--primary)' }}>LKR {newBalance.toLocaleString()}</strong>
          </p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16,
              background: 'linear-gradient(135deg, #faad14, #fa8c16)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px', fontSize: 28, color: '#fff'
            }}>
              <ShoppingCartOutlined />
            </div>
            <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 4 }}>Purchase Quiz</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
              Unlock this quiz using your wallet balance
            </p>
          </div>

          {/* Quiz Summary */}
          <div style={{
            background: 'var(--bg-primary)',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{quiz.title}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{quiz.course}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>
              LKR {quiz.price?.toLocaleString()}
            </div>
          </div>

          {/* Balance Info */}
          <div style={{
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
            border: `2px solid ${hasEnough ? '#52c41a' : '#ff4d4f'}`,
            background: hasEnough ? 'rgba(82, 196, 26, 0.06)' : 'rgba(255, 77, 79, 0.06)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                <WalletOutlined /> Your Balance
              </span>
              <span style={{ fontWeight: 700, fontSize: 16 }}>
                LKR {walletBalance.toLocaleString()}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Quiz Price</span>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#ff4d4f' }}>
                - LKR {quiz.price?.toLocaleString()}
              </span>
            </div>
            <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>
                {hasEnough ? 'Remaining' : 'Shortfall'}
              </span>
              <span style={{
                fontWeight: 700, fontSize: 16,
                color: hasEnough ? '#52c41a' : '#ff4d4f'
              }}>
                {hasEnough
                  ? `LKR ${(walletBalance - quiz.price).toLocaleString()}`
                  : `LKR ${shortfall.toLocaleString()}`
                }
              </span>
            </div>
          </div>

          {hasEnough ? (
            <Button
              type="primary"
              block
              size="large"
              onClick={handlePurchase}
              loading={loading}
              style={{ height: 48, fontSize: 15, fontWeight: 600 }}
              icon={<ShoppingCartOutlined />}
            >
              Confirm Purchase
            </Button>
          ) : (
            <div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                marginBottom: 12, padding: '10px 14px',
                background: 'rgba(255, 77, 79, 0.08)',
                borderRadius: 8, fontSize: 13, color: '#ff4d4f', fontWeight: 500
              }}>
                <WarningOutlined />
                Insufficient balance. Please top up at least LKR {shortfall.toLocaleString()} more.
              </div>
              <Button
                type="primary"
                block
                size="large"
                onClick={() => { handleClose(); onTopUpClick(); }}
                style={{
                  height: 48, fontSize: 15, fontWeight: 600,
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  border: 'none'
                }}
                icon={<WalletOutlined />}
              >
                Top Up Wallet
              </Button>
            </div>
          )}
        </>
      )}
    </Modal>
  );
};

export default PurchaseModal;
