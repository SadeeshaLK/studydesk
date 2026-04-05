import { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Radio, Checkbox, Input, Modal, Spin, message, Space } from 'antd';
import {
  ClockCircleOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  LeftOutlined,
  RightOutlined,
  SendOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';

const QuizAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await api.get(`/quizzes/student/${id}/attempt`);
        setQuiz(data.quiz);
        setTimeLeft(data.quiz.duration * 60);
      } catch (error) {
        message.error(error.response?.data?.message || 'Failed to load quiz');
        navigate('/student/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id, navigate]);

  // Timer
  useEffect(() => {
    if (!quizStarted || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [quizStarted]);

  // Anti-cheat: Tab visibility
  useEffect(() => {
    if (!quizStarted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => prev + 1);
        setShowTabWarning(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [quizStarted]);

  const handleAutoSubmit = useCallback(async () => {
    message.warning(t('auto_submit_warning'));
    await submitQuiz();
  }, [answers, quiz]);

  const startQuiz = () => {
    startTimeRef.current = new Date();
    setQuizStarted(true);

    // Try fullscreen
    try {
      document.documentElement.requestFullscreen?.();
    } catch (e) {
      // Fullscreen optional
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerClass = () => {
    if (timeLeft < 60) return 'timer-display danger';
    if (timeLeft < 300) return 'timer-display warning';
    return 'timer-display';
  };

  const handleAnswer = (questionId, value, type = 'option', isMulti = false) => {
    setAnswers(prev => {
      if (type === 'text') {
        return { ...prev, [questionId]: { textAnswer: value } };
      }
      if (isMulti) {
        return { ...prev, [questionId]: { selectedOptions: value } };
      }
      return { ...prev, [questionId]: { selectedOption: value } };
    });
  };

  const submitQuiz = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const formattedAnswers = quiz.questions.map(q => ({
        questionId: q._id,
        selectedOption: answers[q._id]?.selectedOption || '',
        selectedOptions: answers[q._id]?.selectedOptions || [],
        textAnswer: answers[q._id]?.textAnswer || ''
      }));

      const { data } = await api.post('/submissions', {
        quizId: quiz._id,
        answers: formattedAnswers,
        startedAt: startTimeRef.current,
        tabSwitchCount
      });

      // Exit fullscreen
      try {
        document.exitFullscreen?.();
      } catch (e) {}

      message.success('Quiz submitted successfully!');
      navigate(`/student/result/${data.result.id}`, { state: { result: data.result } });
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to submit quiz');
      setSubmitting(false);
    }
  };

  const handleSubmitClick = () => {
    const unanswered = quiz.questions.filter(q => !answers[q._id]).length;
    
    Modal.confirm({
      title: t('submit_quiz'),
      icon: <ExclamationCircleOutlined />,
      content: unanswered > 0 
        ? `You have ${unanswered} unanswered question(s). Are you sure you want to submit?`
        : t('confirm_submit'),
      okText: t('submit'),
      cancelText: t('cancel'),
      onOk: submitQuiz,
    });
  };

  const renderQuestionText = (text) => {
    if (!text) return null;
    const parts = text.split(/```/);
    if (parts.length === 1) return text;

    return parts.map((part, index) => {
      if (index % 2 === 1) { // Inside backticks
        const codeContent = part.replace(/^[a-z]*\s*\n/i, '').trim();
        return (
          <pre key={index} style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '16px', borderRadius: '8px', overflowX: 'auto', margin: '12px 0', fontSize: '14px', fontFamily: "Consolas, 'Courier New', monospace" }}>
            <code>{codeContent}</code>
          </pre>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Spin size="large" /></div>;
  }

  if (!quiz) return null;

  // Pre-quiz start screen
  if (!quizStarted) {
    return (
      <div className="quiz-attempt-container">
        <div className="result-card">
          <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{quiz.title}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>{quiz.description}</p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 32, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary)' }}>{quiz.questions.length}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t('questions')}</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary)' }}>{quiz.duration} {t('minutes')}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t('duration')}</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary)' }}>{quiz.totalMarks}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Total {t('marks')}</div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-primary)', borderRadius: 12, padding: 20, marginBottom: 24, textAlign: 'left' }}>
            <h4 style={{ marginBottom: 8, fontWeight: 600 }}>⚠️ Instructions</h4>
            <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 2 }}>
              <li>Timer starts when you click "Start Quiz"</li>
              <li>Quiz auto-submits when time runs out</li>
              <li>Tab switching is monitored and recorded</li>
              <li>You cannot re-attempt the quiz once submitted</li>
              <li>Navigate between questions using the panel</li>
            </ul>
          </div>

          <Button type="primary" size="large" icon={<FullscreenOutlined />} onClick={startQuiz}
            style={{ height: 50, padding: '0 40px', fontSize: 16, fontWeight: 600 }}>
            {t('start_quiz')}
          </Button>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div>
      {/* Tab Switch Warning */}
      {showTabWarning && (
        <div className="anticheat-overlay">
          <div className="anticheat-modal">
            <WarningOutlined style={{ fontSize: 48, color: '#ff4d4f', marginBottom: 16 }} />
            <h3>{t('tab_switch_warning')}</h3>
            <p>{t('tab_switch_message')}</p>
            <p style={{ fontWeight: 600, color: 'var(--error)' }}>
              {t('tab_switches')}: {tabSwitchCount}
            </p>
            <Button type="primary" onClick={() => setShowTabWarning(false)} size="large">
              {t('continue_quiz')}
            </Button>
          </div>
        </div>
      )}

      <div className="quiz-attempt-layout">
        {/* Main Content */}
        <div className="quiz-attempt-main">
          {/* Header */}
          <div className="quiz-attempt-header">
            <div>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>{quiz.title}</h3>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                {t('questions')} {currentQuestion + 1} {t('of')} {quiz.questions.length}
              </span>
            </div>
            <div className={getTimerClass()}>
              <ClockCircleOutlined />
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Question */}
          <div className="question-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span className="question-number">
                {t('questions')} {currentQuestion + 1}
              </span>
              <span className="question-marks">{question.marks} {t('marks')}</span>
            </div>
            <div className="question-text">{renderQuestionText(question.questionText)}</div>

            {/* MCQ / True-False */}
            {(question.questionType === 'mcq' || question.questionType === 'true-false') && (
              question.isMultiSelect ? (
                <Checkbox.Group
                  value={answers[question._id]?.selectedOptions || []}
                  onChange={(checkedValues) => handleAnswer(question._id, checkedValues, 'option', true)}
                  style={{ width: '100%' }}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {question.options.map(opt => {
                      const isSelected = (answers[question._id]?.selectedOptions || []).includes(opt._id);
                      return (
                        <Checkbox 
                          key={opt._id} 
                          value={opt._id}
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            border: '2px solid',
                            borderColor: isSelected ? '#1677ff' : 'var(--border-color)',
                            borderRadius: 10,
                            background: isSelected ? 'var(--primary-bg)' : 'var(--bg-secondary)',
                            transition: 'all 0.2s',
                            fontSize: 15,
                            marginInlineStart: 0
                          }}
                        >
                          {opt.text}
                        </Checkbox>
                      );
                    })}
                  </Space>
                </Checkbox.Group>
              ) : (
                <Radio.Group
                  value={answers[question._id]?.selectedOption}
                  onChange={(e) => handleAnswer(question._id, e.target.value)}
                  style={{ width: '100%' }}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {question.options.map(opt => (
                      <Radio 
                        key={opt._id} 
                        value={opt._id}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          border: '2px solid',
                          borderColor: answers[question._id]?.selectedOption === opt._id ? '#1677ff' : 'var(--border-color)',
                          borderRadius: 10,
                          background: answers[question._id]?.selectedOption === opt._id ? 'var(--primary-bg)' : 'var(--bg-secondary)',
                          transition: 'all 0.2s',
                          fontSize: 15,
                        }}
                      >
                        {opt.text}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              )
            )}

            {/* Short Answer */}
            {question.questionType === 'short-answer' && (
              <Input.TextArea
                rows={3}
                value={answers[question._id]?.textAnswer || ''}
                onChange={(e) => handleAnswer(question._id, e.target.value, 'text')}
                placeholder="Type your answer here..."
                style={{ fontSize: 15 }}
              />
            )}
          </div>

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <Button 
              icon={<LeftOutlined />} 
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              size="large"
            >
              {t('previous')}
            </Button>

            {currentQuestion === quiz.questions.length - 1 ? (
              <Button 
                type="primary" 
                icon={<SendOutlined />}
                onClick={handleSubmitClick}
                loading={submitting}
                size="large"
                style={{ fontWeight: 600 }}
              >
                {t('submit_quiz')}
              </Button>
            ) : (
              <Button 
                type="primary"
                icon={<RightOutlined />}
                onClick={() => setCurrentQuestion(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                size="large"
              >
                {t('next')}
              </Button>
            )}
          </div>
        </div>

        {/* Question Navigation Panel */}
        <div className="quiz-attempt-sidebar">
          <div className="question-nav">
            <div className="question-nav-title">{t('questions')}</div>
            <div className="question-nav-grid">
              {quiz.questions.map((q, idx) => (
                <div
                  key={q._id}
                  className={`question-nav-item ${idx === currentQuestion ? 'current' : ''} ${answers[q._id] ? 'answered' : ''}`}
                  onClick={() => setCurrentQuestion(idx)}
                >
                  {idx + 1}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: '#52c41a' }}></div>
                Answered ({Object.keys(answers).length})
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, border: '2px solid var(--border-color)' }}></div>
                Unanswered ({quiz.questions.length - Object.keys(answers).length})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAttempt;
