import { useState, useEffect } from 'react';
import { Table, Tag, Input, Badge, Button, Modal, Image, message, Space } from 'antd';
import {
  SearchOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ShoppingCartOutlined,
  WalletOutlined,
  BankOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import api from '../../api/axios';

const PaymentManager = () => {
  const { t } = useTranslation();
  const [payments, setPayments] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTopups, setTotalTopups] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const [selectedSlip, setSelectedSlip] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data } = await api.get('/admin/payments');
      setPayments(data.payments);
      setTotalRevenue(data.totalRevenue);
      setTotalTopups(data.totalTopups);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const pendingApprovalsCount = payments.filter(
    p => p.paymentMethod === 'manual' && p.status === 'pending'
  ).length;

  const handleApprove = async (id) => {
    try {
      setProcessingId(id);
      await api.patch(`/admin/payments/manual/${id}/approve`);
      message.success('Payment approved successfully');
      fetchPayments();
      setSelectedSlip(null);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to approve payment');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    Modal.confirm({
      title: 'Reject Manual Payment',
      content: 'Are you sure you want to reject this payment? The slip might be invalid.',
      okText: 'Reject',
      okType: 'danger',
      onOk: async () => {
        try {
          setProcessingId(id);
          await api.patch(`/admin/payments/manual/${id}/reject`, { feedback: 'Invalid slip uploaded' });
          message.success('Payment rejected');
          fetchPayments();
          setSelectedSlip(null);
        } catch (error) {
          message.error(error.response?.data?.message || 'Failed to reject payment');
        } finally {
          setProcessingId(null);
        }
      }
    });
  };

  const filteredPayments = payments
    .filter(p => filter === 'all' || 
                 (filter === 'pending_manual' ? (p.paymentMethod === 'manual' && p.status === 'pending') : p.type === filter))
    .filter(p =>
      p.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.quiz?.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.transactionId?.toLowerCase().includes(search.toLowerCase())
    );

  const columns = [
    {
      title: 'Type/Method',
      key: 'type',
      width: 130,
      render: (_, r) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Tag
            color={r.type === 'topup' ? 'green' : 'purple'}
            style={{ fontWeight: 600, width: 'fit-content' }}
            icon={r.type === 'topup' ? <ArrowUpOutlined /> : <ShoppingCartOutlined />}
          >
            {r.type === 'topup' ? 'Top Up' : 'Purchase'}
          </Tag>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {r.paymentMethod === 'manual' ? <><BankOutlined /> Bank Transfer</> : <><WalletOutlined /> Card/Wallet</>}
          </span>
        </div>
      ),
    },
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'txn',
      render: (id) => <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{id?.slice(0, 16)}...</span>,
      width: 150,
    },
    {
      title: 'Student',
      key: 'student',
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 500 }}>{r.student?.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.student?.email}</div>
        </div>
      ),
    },
    {
      title: 'Details',
      key: 'details',
      render: (_, r) => (
        r.type === 'purchase'
          ? <span>{r.quiz?.title || 'Quiz'}</span>
          : <span style={{ color: 'var(--text-muted)' }}>Wallet Top-Up</span>
      ),
    },
    {
      title: 'Amount',
      key: 'amount',
      render: (_, r) => (
        <span style={{ fontWeight: 700, color: r.type === 'topup' && r.status === 'completed' ? '#52c41a' : 'inherit' }}>
          {r.type === 'topup' ? '+' : ''} LKR {r.amount?.toLocaleString()}
        </span>
      ),
      width: 140,
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, r) => {
        const colors = { completed: 'green', pending: 'orange', failed: 'red', refunded: 'blue' };
        return <Tag color={colors[r.status]}>{r.status}</Tag>;
      },
      width: 110,
    },
    {
      title: 'Slip / Card',
      key: 'slip',
      render: (_, r) => {
        if (r.paymentMethod === 'manual' && r.slipUrl) {
          return (
            <Button 
              size="small" 
              icon={<EyeOutlined />} 
              onClick={() => setSelectedSlip(r)}
            >
              View Slip
            </Button>
          );
        }
        return r.cardLast4 ? <span style={{ color: 'var(--text-muted)' }}>•••• {r.cardLast4}</span> : '—';
      },
      width: 120,
    },
    {
      title: 'Date',
      dataIndex: 'paidAt',
      key: 'date',
      render: (d, r) => (d || r.createdAt) ? dayjs(d || r.createdAt).format('MMM DD, YYYY hh:mm A') : '—',
      width: 180,
    },
  ];

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Payment Records</h2>
          <p className="section-subtitle">Track all wallet transactions and manual slips</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{
            background: 'linear-gradient(135deg, #52c41a, #73d13d)',
            color: '#fff', padding: '12px 20px', borderRadius: 'var(--radius-md)',
            fontWeight: 700, fontSize: 14
          }}>
            <ShoppingCartOutlined /> Revenue: LKR {totalRevenue.toLocaleString()}
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: '#fff', padding: '12px 20px', borderRadius: 'var(--radius-md)',
            fontWeight: 700, fontSize: 14
          }}>
            <WalletOutlined /> Top-Ups: LKR {totalTopups.toLocaleString()}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search by student, quiz, or transaction ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 400 }}
          size="large"
          allowClear
        />
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { key: 'all', label: 'All Transactions' },
            { key: 'pending_manual', label: `Pending Approvals ${pendingApprovalsCount > 0 ? `(${pendingApprovalsCount})` : ''}` },
            { key: 'topup', label: 'Top-Ups' },
            { key: 'purchase', label: 'Purchases' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: `2px solid ${filter === tab.key ? 'var(--primary)' : 'var(--border-color)'}`,
                background: filter === tab.key ? 'var(--primary-bg, rgba(22,119,255,0.08))' : 'var(--bg-secondary)',
                color: filter === tab.key ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: filter === tab.key ? 600 : 400,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              {tab.key === 'pending_manual' && pendingApprovalsCount > 0 && <Badge status="error" />}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="data-table">
        <Table
          columns={columns}
          dataSource={filteredPayments}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 900 }}
        />
      </div>

      {/* Slip Viewer Modal */}
      <Modal
        title="Payment Slip Review"
        open={!!selectedSlip}
        onCancel={() => setSelectedSlip(null)}
        footer={
          selectedSlip?.status === 'pending' ? (
            <Space>
              <Button 
                danger 
                icon={<CloseOutlined />} 
                onClick={() => handleReject(selectedSlip._id)}
                loading={processingId === selectedSlip._id}
              >
                Reject
              </Button>
              <Button 
                type="primary" 
                style={{ background: '#52c41a', borderColor: '#52c41a' }}
                icon={<CheckOutlined />} 
                onClick={() => handleApprove(selectedSlip._id)}
                loading={processingId === selectedSlip._id}
              >
                Approve & Add LKR {selectedSlip.amount?.toLocaleString()}
              </Button>
            </Space>
          ) : null
        }
        width={600}
        centered
        destroyOnClose
      >
        {selectedSlip && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 16, textAlign: 'left', background: 'var(--bg-secondary)', padding: 12, borderRadius: 8 }}>
              <p style={{ margin: '0 0 4px 0' }}><strong>Student:</strong> {selectedSlip.student?.name}</p>
              <p style={{ margin: '0 0 4px 0' }}><strong>Amount:</strong> LKR {selectedSlip.amount?.toLocaleString()}</p>
              <p style={{ margin: '0 0 4px 0' }}><strong>Transaction ID:</strong> {selectedSlip.transactionId}</p>
              <p style={{ margin: 0 }}><strong>Status:</strong> <Tag color={selectedSlip.status === 'pending' ? 'orange' : selectedSlip.status === 'completed' ? 'green' : 'red'}>{selectedSlip.status}</Tag></p>
            </div>
            
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 8, padding: 8, overflow: 'hidden' }}>
              {selectedSlip.slipUrl?.toLowerCase().endsWith('.pdf') ? (
                <iframe 
                  src={selectedSlip.slipUrl} 
                  style={{ width: '100%', height: '60vh', border: 'none' }} 
                  title="Payment Slip PDF"
                />
              ) : (
                <Image
                  src={selectedSlip.slipUrl}
                  alt="Payment Slip"
                  style={{ maxHeight: '60vh', objectFit: 'contain' }}
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                />
              )}
            </div>
            {selectedSlip.status === 'pending' && (
              <p style={{ color: 'var(--text-muted)', marginTop: 12, fontSize: 13 }}>
                Please review the slip carefully before approving. Once approved, the funds will be added directly to the student's wallet.
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PaymentManager;
