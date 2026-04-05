import { useState, useEffect } from 'react';
import { Button, Tag, Spin, Empty, Input, Select, Space } from 'antd';
import {
  FileTextOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  BarChartOutlined,
  RightOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  WalletOutlined,
  ShoppingCartOutlined,
  CrownOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import PurchaseModal from '../../components/Common/PurchaseModal';
import TopUpModal from '../../components/Common/TopUpModal';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const [purchaseQuiz, setPurchaseQuiz] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, quizzesRes, balanceRes] = await Promise.all([
        api.get('/submissions/student-stats'),
        api.get('/quizzes/student/available'),
        api.get('/payments/balance')
      ]);
      setStats(statsRes.data.stats);
      setQuizzes(quizzesRes.data.quizzes);
      setWalletBalance(balanceRes.data.walletBalance);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizAction = (quiz) => {
    if (quiz.needsPayment) {
      setPurchaseQuiz(quiz);
      setShowPurchaseModal(true);
      return;
    }
    if (quiz.canAttempt) {
      navigate(`/student/quiz/${quiz._id}`);
    }
  };

  const handlePurchaseSuccess = (newBalance) => {
    setWalletBalance(newBalance);
    fetchData();
  };

  const handleTopUpSuccess = (newBalance) => {
    setWalletBalance(newBalance);
  };

  const getQuizButton = (quiz) => {
    if (quiz.needsPayment) {
      return (
        <Button type="primary" icon={<ShoppingCartOutlined />} onClick={() => handleQuizAction(quiz)}
          style={{ background: '#722ed1', borderColor: '#722ed1' }}>
          Buy · LKR {quiz.price?.toLocaleString()}
        </Button>
      );
    }

    if (!quiz.canAttempt) {
      return (
        <Tag color="default" style={{ padding: '4px 12px', fontSize: 13 }}>
          <CheckCircleOutlined /> Max Attempts ({quiz.maxAttempts}) Reached
        </Tag>
      );
    }

    if (quiz.attemptCount > 0) {
      return (
        <Button type="primary" icon={<ReloadOutlined />} onClick={() => handleQuizAction(quiz)}
          style={{ background: '#faad14', borderColor: '#faad14' }}>
          Reattempt ({quiz.attemptCount}/{quiz.maxAttempts})
        </Button>
      );
    }

    return (
      <Button type="primary" icon={<RightOutlined />} onClick={() => handleQuizAction(quiz)}>
        {t('start_quiz')}
      </Button>
    );
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Spin size="large" /></div>;
  }

  // Derived filtered & sorted data
  const filteredQuizzes = quizzes.filter(quiz => {
    // 1. Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = quiz.title?.toLowerCase().includes(q);
      const matchDesc = quiz.description?.toLowerCase().includes(q);
      const matchCourse = quiz.course?.toLowerCase().includes(q);
      const matchLesson = quiz.lessonReference?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCourse && !matchLesson) return false;
    }
    // 2. Category
    if (categoryFilter !== 'all') {
      if (quiz.category !== categoryFilter) return false;
    }
    return true;
  });

  const sortedQuizzes = [...filteredQuizzes].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'price_high':
        return (b.price || 0) - (a.price || 0);
      case 'price_low':
        return (a.price || 0) - (b.price || 0);
      case 'title_az':
        return (a.title || '').localeCompare(b.title || '');
      case 'title_za':
        return (b.title || '').localeCompare(a.title || '');
      case 'newest':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const getCategoryLabel = (cat) => {
    if (cat === 'mid_exam') return 'Mid Exam';
    if (cat === 'final_exam') return 'Final Exam';
    if (cat === 'lesson_based') return 'Lesson Based';
    return 'General';
  };

  const getCategoryColor = (cat) => {
    if (cat === 'mid_exam') return 'blue';
    if (cat === 'final_exam') return 'volcano';
    if (cat === 'lesson_based') return 'cyan';
    return 'default';
  };

  return (
    <div>
      <div className="welcome-banner">
        <h2>👋 {t('welcome_back')}, {user?.name?.split(' ')[0]}!</h2>
        <p>{t('studydesk.space')}</p>
      </div>

      <div className="stats-row">
        {/* Wallet Balance Card */}
        <div className="stat-card" style={{ cursor: 'pointer', position: 'relative' }}
          onClick={() => navigate('/student/wallet')}>
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, rgba(102,126,234,0.15), rgba(118,75,162,0.15))', color: '#764ba2' }}>
            <WalletOutlined />
          </div>
          <div className="stat-card-value" style={{ color: '#764ba2' }}>
            LKR {walletBalance.toLocaleString()}
          </div>
          <div className="stat-card-label">Wallet Balance</div>
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={(e) => { e.stopPropagation(); setShowTopUpModal(true); }}
            style={{
              position: 'absolute', top: 12, right: 12,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 600
            }}
          >
            Top Up
          </Button>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#e6f4ff', color: '#1677ff' }}>
            <FileTextOutlined />
          </div>
          <div className="stat-card-value">{stats?.quizzesTaken || 0}</div>
          <div className="stat-card-label">{t('quizzes_taken')}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#f6ffed', color: '#52c41a' }}>
            <BarChartOutlined />
          </div>
          <div className="stat-card-value">{stats?.avgScore || 0}%</div>
          <div className="stat-card-label">{t('avg_score')}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#fff7e6', color: '#faad14' }}>
            <TrophyOutlined />
          </div>
          <div className="stat-card-value">{stats?.passRate || 0}%</div>
          <div className="stat-card-label">{t('pass_rate')}</div>
        </div>
      </div>

      <div className="section-header" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <h2 className="section-title" style={{ margin: 0 }}>{t('available_quizzes')}</h2>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search quizzes, courses, or lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ maxWidth: 300, flex: 1 }}
            size="large"
            allowClear
          />
          <Select
            value={sortBy}
            onChange={setSortBy}
            size="large"
            style={{ minWidth: 160 }}
            suffixIcon={<SortAscendingOutlined />}
            options={[
              { value: 'newest', label: 'Newest First' },
              { value: 'oldest', label: 'Oldest First' },
              { value: 'price_low', label: 'Price: Low to High' },
              { value: 'price_high', label: 'Price: High to Low' },
              { value: 'title_az', label: 'Title: A to Z' },
              { value: 'title_za', label: 'Title: Z to A' },
            ]}
          />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignSelf: 'center', background: 'var(--bg-secondary)', padding: '4px', borderRadius: 10, border: '1px solid var(--border-color)' }}>
            {[
              { key: 'all', label: 'All Categories' },
              { key: 'general', label: 'General' },
              { key: 'mid_exam', label: 'Mid Exams' },
              { key: 'final_exam', label: 'Final Exams' },
              { key: 'lesson_based', label: 'Lessons' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setCategoryFilter(tab.key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  border: 'none',
                  background: categoryFilter === tab.key ? '#fff' : 'transparent',
                  color: categoryFilter === tab.key ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: categoryFilter === tab.key ? 600 : 500,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: categoryFilter === tab.key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {sortedQuizzes.length === 0 ? (
        <Empty description={t('no_quizzes')} />
      ) : (
        <div className="quiz-grid">
          {sortedQuizzes.map(quiz => (
            <div key={quiz._id} className="quiz-card">
              <div className="quiz-card-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                  <Space size={[8, 8]} wrap align="center">
                    <div className="quiz-card-course" style={{ margin: 0 }}>{quiz.course || 'General'}</div>
                    <Tag color={getCategoryColor(quiz.category)} style={{ margin: 0, borderRadius: 4, fontWeight: 500 }}>
                      {getCategoryLabel(quiz.category)}
                    </Tag>
                  </Space>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {quiz.pricingType === 'paid' ? (
                      <Tag color="purple" style={{ margin: 0, fontWeight: 600 }}>
                        <CrownOutlined /> LKR {quiz.price?.toLocaleString()}
                      </Tag>
                    ) : (
                      <Tag color="green" style={{ margin: 0, fontWeight: 600 }}>Free</Tag>
                    )}
                  </div>
                </div>
                <div className="quiz-card-title">{quiz.title}</div>
                {quiz.category === 'lesson_based' && quiz.lessonReference && (
                  <div style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, marginBottom: 4 }}>
                    📚 {quiz.lessonReference}
                  </div>
                )}
                <div className="quiz-card-desc">{quiz.description}</div>
              </div>

              <div className="quiz-card-meta">
                <div className="quiz-card-meta-item">
                  <FileTextOutlined /> {quiz.questions?.length || '?'} {t('questions')}
                </div>
                <div className="quiz-card-meta-item">
                  <ClockCircleOutlined /> {quiz.duration} {t('minutes')}
                </div>
                <div className="quiz-card-meta-item">
                  <TrophyOutlined /> {quiz.totalMarks} {t('marks')}
                </div>
                {quiz.maxAttempts > 1 && (
                  <div className="quiz-card-meta-item">
                    <ReloadOutlined /> Max {quiz.maxAttempts} attempts
                  </div>
                )}
              </div>

              <div className="quiz-card-footer">
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  By {quiz.lecturer?.name || 'Lecturer'}
                </span>
                {getQuizButton(quiz)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Purchase Modal */}
      <PurchaseModal
        open={showPurchaseModal}
        onClose={() => { setShowPurchaseModal(false); setPurchaseQuiz(null); }}
        quiz={purchaseQuiz}
        walletBalance={walletBalance}
        onPurchaseSuccess={handlePurchaseSuccess}
        onTopUpClick={() => setShowTopUpModal(true)}
      />

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

export default StudentDashboard;
