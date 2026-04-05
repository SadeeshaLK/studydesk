import { useState, useEffect } from 'react';
import { Spin, Tag } from 'antd';
import {
  TeamOutlined,
  FileTextOutlined,
  BarChartOutlined,
  DollarOutlined,
  UserOutlined,
  BookOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import api from '../../api/axios';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await api.get('/admin/dashboard');
      setStats(data.stats);
      setRecentUsers(data.recentUsers || []);
      setRecentPayments(data.recentPayments || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Spin size="large" /></div>;
  }

  return (
    <div>
      <div className="welcome-banner" style={{ background: 'linear-gradient(135deg, #722ed1 0%, #eb2f96 100%)' }}>
        <h2>🛡️ Admin Dashboard</h2>
        <p>Welcome back, {user?.name}. Here&apos;s your platform overview.</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#e6f4ff', color: '#1677ff' }}>
            <TeamOutlined />
          </div>
          <div className="stat-card-value">{stats?.totalUsers || 0}</div>
          <div className="stat-card-label">Total Users</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#f6ffed', color: '#52c41a' }}>
            <UserOutlined />
          </div>
          <div className="stat-card-value">{stats?.totalStudents || 0}</div>
          <div className="stat-card-label">Students</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#fff7e6', color: '#faad14' }}>
            <BookOutlined />
          </div>
          <div className="stat-card-value">{stats?.totalLecturers || 0}</div>
          <div className="stat-card-label">Lecturers</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#f9f0ff', color: '#722ed1' }}>
            <FileTextOutlined />
          </div>
          <div className="stat-card-value">{stats?.totalQuizzes || 0}</div>
          <div className="stat-card-label">Quizzes</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#fff1f0', color: '#ff4d4f' }}>
            <BarChartOutlined />
          </div>
          <div className="stat-card-value">{stats?.totalSubmissions || 0}</div>
          <div className="stat-card-label">Submissions</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#f6ffed', color: '#52c41a' }}>
            <DollarOutlined />
          </div>
          <div className="stat-card-value">LKR {(stats?.totalRevenue || 0).toLocaleString()}</div>
          <div className="stat-card-label">Total Revenue</div>
        </div>
      </div>

      {/* Recent Users & Payments side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        {/* Recent Users */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', padding: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>👥 Recent Users</h3>
          {recentUsers.map(u => (
            <div key={u._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{u.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.email}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Tag color={u.role === 'admin' ? 'red' : u.role === 'lecturer' ? 'purple' : 'blue'} style={{ margin: 0 }}>
                  {u.role}
                </Tag>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Payments */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', padding: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>💰 Recent Payments</h3>
          {recentPayments.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No payments yet</p>
          ) : (
            recentPayments.map(p => (
              <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{p.student?.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.quiz?.title}</div>
                </div>
                <div style={{ fontWeight: 700, color: '#52c41a' }}>
                  LKR {p.amount?.toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
