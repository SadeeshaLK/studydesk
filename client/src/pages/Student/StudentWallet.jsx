import { useState, useEffect } from 'react';
import { Button, Table, Tag, Spin, Empty } from 'antd';
import {
  WalletOutlined,
  PlusOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import api from '../../api/axios';
import TopUpModal from '../../components/Common/TopUpModal';

const StudentWallet = () => {
  const { t } = useTranslation();
  const [payments, setPayments] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await api.get('/payments/my-payments');
      setPayments(data.payments);
      setWalletBalance(data.walletBalance);
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopUpSuccess = (newBalance) => {
    setWalletBalance(newBalance);
    fetchData();
  };

  const filteredPayments = filter === 'all'
    ? payments
    : payments.filter(p => p.type === filter);

  // Summary stats
  const totalTopups = payments
    .filter(p => p.type === 'topup' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPurchases = payments
    .filter(p => p.type === 'purchase' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const columns = [
    {
      title: 'Type',
      key: 'type',
      width: 120,
      render: (_, r) => (
        <Tag
          color={r.type === 'topup' ? 'green' : 'purple'}
          style={{ fontWeight: 600, fontSize: 12 }}
          icon={r.type === 'topup' ? <ArrowUpOutlined /> : <ShoppingCartOutlined />}
        >
          {r.type === 'topup' ? 'Top Up' : 'Purchase'}
        </Tag>
      ),
    },
    {
      title: 'Description',
      key: 'desc',
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {r.type === 'topup'
              ? 'Wallet Top-Up'
              : r.quiz?.title || 'Quiz Purchase'
            }
          </div>
          {r.type === 'purchase' && r.quiz?.course && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.quiz.course}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Amount',
      key: 'amount',
      width: 150,
      render: (_, r) => (
        <span style={{
          fontWeight: 700,
          fontSize: 15,
          color: r.type === 'topup' ? '#52c41a' : '#ff4d4f'
        }}>
          {r.type === 'topup' ? '+' : '-'} LKR {r.amount?.toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Balance After',
      key: 'balanceAfter',
      width: 140,
      render: (_, r) => (
        <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>
          LKR {r.balanceAfter?.toLocaleString() ?? '—'}
        </span>
      ),
      responsive: ['md'],
    },
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'txn',
      width: 160,
      render: (id) => (
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>
          {id?.slice(0, 16)}...
        </span>
      ),
      responsive: ['lg'],
    },
    {
      title: 'Date',
      dataIndex: 'paidAt',
      key: 'date',
      width: 170,
      render: (d) => d ? dayjs(d).format('MMM DD, YYYY hh:mm A') : '—',
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      render: (_, r) => {
        const colors = { completed: 'green', pending: 'orange', failed: 'red', refunded: 'blue' };
        return <Tag color={colors[r.status]}>{r.status}</Tag>;
      },
    },
  ];

  const filterTabs = [
    { key: 'all', label: 'All', count: payments.length },
    { key: 'topup', label: 'Top-Ups', count: payments.filter(p => p.type === 'topup').length },
    { key: 'purchase', label: 'Purchases', count: payments.filter(p => p.type === 'purchase').length },
  ];

  return (
    <div>
      {/* Wallet Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 16,
        padding: '32px 28px',
        marginBottom: 24,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: -40, right: -20,
          width: 160, height: 160, borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)'
        }} />
        <div style={{
          position: 'absolute', bottom: -50, right: 60,
          width: 120, height: 120, borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <WalletOutlined style={{ fontSize: 28 }} />
              <span style={{ fontSize: 15, opacity: 0.85, fontWeight: 500 }}>My Wallet</span>
            </div>
            <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: -1 }}>
              LKR {walletBalance.toLocaleString()}
            </div>
            <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>Available Balance</div>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setShowTopUpModal(true)}
            style={{
              height: 50, padding: '0 32px', fontSize: 16, fontWeight: 700,
              background: 'rgba(255,255,255,0.2)',
              border: '2px solid rgba(255,255,255,0.4)',
              borderRadius: 12,
              backdropFilter: 'blur(10px)'
            }}
          >
            Top Up
          </Button>
        </div>

        {/* Summary Stats */}
        <div style={{
          display: 'flex', gap: 24, marginTop: 24, flexWrap: 'wrap',
          position: 'relative', zIndex: 1
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.12)',
            borderRadius: 10, padding: '12px 20px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 2 }}>Total Top-Ups</div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>
              <ArrowUpOutlined /> LKR {totalTopups.toLocaleString()}
            </div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.12)',
            borderRadius: 10, padding: '12px 20px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 2 }}>Total Purchases</div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>
              <ShoppingCartOutlined /> LKR {totalPurchases.toLocaleString()}
            </div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.12)',
            borderRadius: 10, padding: '12px 20px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 2 }}>Transactions</div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>
              <FileTextOutlined /> {payments.length}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="section-header">
        <h2 className="section-title">Transaction History</h2>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {filterTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              border: `2px solid ${filter === tab.key ? 'var(--primary)' : 'var(--border-color)'}`,
              background: filter === tab.key ? 'var(--primary-bg, rgba(22,119,255,0.08))' : 'var(--bg-secondary)',
              color: filter === tab.key ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: filter === tab.key ? 600 : 400,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      <div className="data-table">
        {filteredPayments.length === 0 ? (
          <Empty
            description={
              filter === 'all'
                ? 'No transactions yet. Top up your wallet to get started!'
                : `No ${filter === 'topup' ? 'top-up' : 'purchase'} transactions.`
            }
          />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredPayments}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 700 }}
          />
        )}
      </div>

      {/* Top Up Modal */}
      <TopUpModal
        open={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        currentBalance={walletBalance}
        onTopUpSuccess={handleTopUpSuccess}
      />
    </div>
  );
};

export default StudentWallet;
