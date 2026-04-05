import { useState, useEffect } from 'react';
import { Button, Spin, Table, Tag } from 'antd';
import {
  FileTextOutlined,
  TeamOutlined,
  BarChartOutlined,
  TrophyOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import api from '../../api/axios';

const LecturerDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await api.get('/submissions/dashboard-stats');
      setStats(data.stats);
      setRecentSubmissions(data.recentSubmissions || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const recentColumns = [
    {
      title: t('student'),
      dataIndex: ['student', 'name'],
      key: 'student',
      render: (name) => <span style={{ fontWeight: 500 }}>{name}</span>,
    },
    {
      title: t('quiz'),
      dataIndex: ['quiz', 'title'],
      key: 'quiz',
    },
    {
      title: t('score'),
      key: 'score',
      render: (_, r) => `${r.score}/${r.totalMarks}`,
      width: 100,
    },
    {
      title: t('status'),
      key: 'status',
      render: (_, r) => <Tag color={r.passed ? 'green' : 'red'}>{r.passed ? t('passed') : t('failed')}</Tag>,
      width: 100,
    },
    {
      title: t('date'),
      dataIndex: 'submittedAt',
      key: 'date',
      render: (d) => dayjs(d).format('MMM DD, hh:mm A'),
      width: 160,
    },
  ];

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Spin size="large" /></div>;
  }

  return (
    <div>
      <div className="welcome-banner">
        <h2>👋 {t('welcome_back')}, {user?.name?.split(' ')[0]}!</h2>
        <p>Manage your quizzes and track student performance.</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#e6f4ff', color: '#1677ff' }}>
            <FileTextOutlined />
          </div>
          <div className="stat-card-value">{stats?.totalQuizzes || 0}</div>
          <div className="stat-card-label">{t('total_quizzes')}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#f6ffed', color: '#52c41a' }}>
            <TeamOutlined />
          </div>
          <div className="stat-card-value">{stats?.totalStudents || 0}</div>
          <div className="stat-card-label">{t('total_students')}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#fff7e6', color: '#faad14' }}>
            <BarChartOutlined />
          </div>
          <div className="stat-card-value">{stats?.totalSubmissions || 0}</div>
          <div className="stat-card-label">{t('total_submissions')}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#f9f0ff', color: '#722ed1' }}>
            <TrophyOutlined />
          </div>
          <div className="stat-card-value">{stats?.avgScore || 0}%</div>
          <div className="stat-card-label">{t('avg_score')}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Button type="primary" icon={<PlusOutlined />} size="large" 
          onClick={() => navigate('/lecturer/quizzes/create')}>
          {t('create_quiz')}
        </Button>
      </div>

      <div className="section-header">
        <h2 className="section-title">{t('recent_results')}</h2>
      </div>

      <div className="data-table">
        <Table
          columns={recentColumns}
          dataSource={recentSubmissions}
          rowKey="_id"
          pagination={false}
          scroll={{ x: 600 }}
        />
      </div>
    </div>
  );
};

export default LecturerDashboard;
