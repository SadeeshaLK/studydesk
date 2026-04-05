import { useState, useEffect } from 'react';
import { Select, Table, Tag, Spin, Empty, Card } from 'antd';
import {
  BarChartOutlined,
  TrophyOutlined,
  CloseCircleOutlined,
  TeamOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import api from '../../api/axios';

const StudentSubmissions = () => {
  const { t } = useTranslation();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSubs, setLoadingSubs] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const { data } = await api.get('/quizzes/my-quizzes');
      setQuizzes(data.quizzes);
      if (data.quizzes.length > 0) {
        setSelectedQuiz(data.quizzes[0]._id);
        fetchSubmissions(data.quizzes[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (quizId) => {
    setLoadingSubs(true);
    try {
      const [subsRes, analyticsRes] = await Promise.all([
        api.get(`/submissions/quiz/${quizId}`),
        api.get(`/submissions/analytics/${quizId}`)
      ]);
      setSubmissions(subsRes.data.submissions);
      setAnalytics(analyticsRes.data.analytics);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoadingSubs(false);
    }
  };

  const handleQuizChange = (quizId) => {
    setSelectedQuiz(quizId);
    fetchSubmissions(quizId);
  };

  const columns = [
    {
      title: t('student_name'),
      dataIndex: ['student', 'name'],
      key: 'name',
      render: (name) => <span style={{ fontWeight: 500 }}>{name}</span>,
    },
    {
      title: t('email'),
      dataIndex: ['student', 'email'],
      key: 'email',
      responsive: ['md'],
    },
    {
      title: t('score'),
      key: 'score',
      render: (_, r) => <span style={{ fontWeight: 600 }}>{r.score} / {r.totalMarks}</span>,
      width: 120,
    },
    {
      title: t('percentage'),
      dataIndex: 'percentage',
      key: 'percentage',
      render: (v) => <span style={{ fontWeight: 600 }}>{v}%</span>,
      width: 100,
      sorter: (a, b) => a.percentage - b.percentage,
    },
    {
      title: t('status'),
      key: 'status',
      render: (_, r) => <Tag color={r.passed ? 'green' : 'red'}>{r.passed ? t('passed') : t('failed')}</Tag>,
      width: 100,
    },
    {
      title: t('tab_switches'),
      dataIndex: 'tabSwitchCount',
      key: 'tabSwitches',
      render: (count) => count > 0 ? <Tag color="orange">{count}</Tag> : <span>0</span>,
      width: 100,
    },
    {
      title: t('date'),
      dataIndex: 'submittedAt',
      key: 'date',
      render: (d) => dayjs(d).format('MMM DD, YYYY hh:mm A'),
      width: 180,
    },
  ];

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Spin size="large" /></div>;
  }

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">{t('results')} & {t('analytics')}</h2>
          <p className="section-subtitle">View submissions and performance analytics</p>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <Select
          value={selectedQuiz}
          onChange={handleQuizChange}
          style={{ width: '100%', maxWidth: 400 }}
          size="large"
          placeholder="Select a quiz"
        >
          {quizzes.map(q => (
            <Select.Option key={q._id} value={q._id}>{q.title}</Select.Option>
          ))}
        </Select>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="stats-row" style={{ marginBottom: 24 }}>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: '#e6f4ff', color: '#1677ff' }}>
              <TeamOutlined />
            </div>
            <div className="stat-card-value">{analytics.attemptCount}</div>
            <div className="stat-card-label">{t('attempt_count')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: '#f6ffed', color: '#52c41a' }}>
              <BarChartOutlined />
            </div>
            <div className="stat-card-value">{analytics.averagePercentage}%</div>
            <div className="stat-card-label">{t('average_score')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: '#fff7e6', color: '#faad14' }}>
              <RiseOutlined />
            </div>
            <div className="stat-card-value">{analytics.highestScore}</div>
            <div className="stat-card-label">{t('highest_score')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: '#fff1f0', color: '#ff4d4f' }}>
              <FallOutlined />
            </div>
            <div className="stat-card-value">{analytics.passRate}%</div>
            <div className="stat-card-label">{t('pass_rate')}</div>
          </div>
        </div>
      )}

      {/* Submissions Table */}
      <div className="data-table">
        <Table
          columns={columns}
          dataSource={submissions}
          rowKey="_id"
          loading={loadingSubs}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: <Empty description="No submissions yet" /> }}
          scroll={{ x: 800 }}
        />
      </div>
    </div>
  );
};

export default StudentSubmissions;
