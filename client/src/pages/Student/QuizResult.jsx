import { useState, useEffect } from 'react';
import { Button, Progress, Tag, Spin, Divider, Collapse } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  HomeOutlined,
  BarChartOutlined,
  QuestionCircleOutlined,
  BookOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';

const QuizResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmission(id);
  }, [id]);

  const fetchSubmission = async (submissionId) => {
    try {
      const { data } = await api.get(`/submissions/${submissionId}`);
      setSubmission(data.submission);
    } catch (error) {
      console.error('Failed to fetch result:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper: get the text of a selected option
  const getSelectedAnswerText = (question, answer) => {
    if (!answer) return 'Not answered';
    
    if (question.questionType === 'short-answer') {
      return answer.textAnswer || 'Not answered';
    }

    if (answer.selectedOption) {
      const option = question.options?.find(o => o._id === answer.selectedOption);
      return option?.text || 'Not answered';
    }

    return 'Not answered';
  };

  // Helper: get the correct answer text
  const getCorrectAnswerText = (question) => {
    if (question.questionType === 'short-answer') {
      return question.correctAnswer || '—';
    }

    const correctOption = question.options?.find(o => o.isCorrect);
    return correctOption?.text || '—';
  };

  // Helper: generate brief explanation
  const getExplanation = (question, answer) => {
    const isCorrect = answer?.isCorrect;
    const correctAnswer = getCorrectAnswerText(question);

    if (!answer || (!answer.selectedOption && !answer.textAnswer)) {
      return `You did not answer this question. The correct answer is "${correctAnswer}".`;
    }

    if (isCorrect) {
      return `Correct! "${correctAnswer}" is the right answer.`;
    }

    const yourAnswer = getSelectedAnswerText(question, answer);

    if (question.questionType === 'short-answer') {
      return `Your answer "${yourAnswer}" does not match the expected answer "${correctAnswer}" (case-insensitive exact match required).`;
    }

    return `You selected "${yourAnswer}", but the correct answer is "${correctAnswer}".`;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 80, minHeight: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <p className="empty-state-text">Result not found</p>
        <Button type="primary" onClick={() => navigate('/student/results')} style={{ marginTop: 16 }}>
          Go to Results
        </Button>
      </div>
    );
  }

  const { score, totalMarks, percentage, passed, quiz, answers, tabSwitchCount, submittedAt } = submission;
  const correctCount = answers?.filter(a => a.isCorrect).length || 0;
  const incorrectCount = (quiz?.questions?.length || 0) - correctCount;

  return (
    <div className="result-container">
      {/* Score Card */}
      <div className="result-card">
        <div className="result-status">
          {passed ? '🎉' : '😔'}
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
          {quiz?.title}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontSize: 14 }}>
          {passed ? t('congratulations') : t('better_luck')}
        </p>

        <Progress
          type="circle"
          percent={percentage}
          size={150}
          strokeColor={passed ? { '0%': '#52c41a', '100%': '#73d13d' } : { '0%': '#ff4d4f', '100%': '#ff7875' }}
          strokeWidth={10}
          format={pct => (
            <div>
              <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.2 }}>{pct}%</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{t('percentage')}</div>
            </div>
          )}
        />

        {/* Stats Row */}
        <div className="result-stats-row">
          <div className="result-stat-item">
            <TrophyOutlined style={{ fontSize: 18, color: 'var(--primary)' }} />
            <div className="result-stat-value">{score}/{totalMarks}</div>
            <div className="result-stat-label">{t('score')}</div>
          </div>
          <div className="result-stat-divider" />
          <div className="result-stat-item">
            <CheckCircleOutlined style={{ fontSize: 18, color: '#52c41a' }} />
            <div className="result-stat-value">{correctCount}</div>
            <div className="result-stat-label">Correct</div>
          </div>
          <div className="result-stat-divider" />
          <div className="result-stat-item">
            <CloseCircleOutlined style={{ fontSize: 18, color: '#ff4d4f' }} />
            <div className="result-stat-value">{incorrectCount}</div>
            <div className="result-stat-label">Incorrect</div>
          </div>
          <div className="result-stat-divider" />
          <div className="result-stat-item">
            <Tag color={passed ? 'green' : 'red'} style={{ fontSize: 13, padding: '2px 14px', margin: 0 }}>
              {passed ? t('passed') : t('failed')}
            </Tag>
            <div className="result-stat-label">{t('status')}</div>
          </div>
        </div>
      </div>

      {/* Detailed Question Review */}
      {quiz?.questions && quiz.questions.length > 0 && (
        <div className="result-breakdown">
          <div className="result-breakdown-header">
            <BookOutlined style={{ fontSize: 18 }} />
            <h3>Detailed Review</h3>
            <span className="result-breakdown-count">
              {correctCount}/{quiz.questions.length} correct
            </span>
          </div>

          {quiz.questions.map((question, idx) => {
            const answer = answers?.find(a => a.questionId === question._id);
            const isCorrect = answer?.isCorrect || false;
            const isUnanswered = !answer || (!answer.selectedOption && !answer.textAnswer);

            return (
              <div 
                key={question._id} 
                className={`result-question-card ${isCorrect ? 'correct' : 'incorrect'}`}
              >
                {/* Question Header */}
                <div className="result-question-header">
                  <div className="result-question-number">
                    <span className={`result-question-badge ${isCorrect ? 'correct' : 'incorrect'}`}>
                      {isCorrect ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    </span>
                    <span>Question {idx + 1}</span>
                    <Tag color={
                      question.questionType === 'mcq' ? 'blue' : 
                      question.questionType === 'true-false' ? 'purple' : 'orange'
                    } style={{ marginLeft: 8, fontSize: 11 }}>
                      {question.questionType === 'mcq' ? 'MCQ' : 
                       question.questionType === 'true-false' ? 'True/False' : 'Short Answer'}
                    </Tag>
                  </div>
                  <div className="result-question-marks">
                    {answer?.marks || 0}/{question.marks} {t('marks')}
                  </div>
                </div>

                {/* Question Text */}
                <div className="result-question-text">
                  {question.questionText}
                </div>

                {/* Options Display (for MCQ / True-False) */}
                {(question.questionType === 'mcq' || question.questionType === 'true-false') && question.options && (
                  <div className="result-options-list">
                    {question.options.map(opt => {
                      const isSelected = answer?.selectedOption === opt._id;
                      const isCorrectOption = opt.isCorrect;
                      
                      let optionClass = 'result-option';
                      if (isCorrectOption) optionClass += ' correct-option';
                      if (isSelected && !isCorrectOption) optionClass += ' wrong-selected';
                      if (isSelected && isCorrectOption) optionClass += ' correct-selected';

                      return (
                        <div key={opt._id} className={optionClass}>
                          <div className="result-option-marker">
                            {isCorrectOption ? (
                              <CheckCircleOutlined style={{ color: '#52c41a' }} />
                            ) : isSelected ? (
                              <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                            ) : (
                              <div className="result-option-dot" />
                            )}
                          </div>
                          <span className="result-option-text">{opt.text}</span>
                          <div className="result-option-tags">
                            {isSelected && (
                              <Tag color={isCorrectOption ? 'green' : 'red'} style={{ fontSize: 11, margin: 0 }}>
                                Your Answer
                              </Tag>
                            )}
                            {isCorrectOption && !isSelected && (
                              <Tag color="green" style={{ fontSize: 11, margin: 0 }}>
                                Correct
                              </Tag>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Short Answer Display */}
                {question.questionType === 'short-answer' && (
                  <div className="result-short-answer">
                    <div className="result-answer-row">
                      <div className={`result-answer-box ${isCorrect ? 'correct' : 'incorrect'}`}>
                        <div className="result-answer-label">
                          {isCorrect ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                          Your Answer
                        </div>
                        <div className="result-answer-value">
                          {isUnanswered ? <em style={{ color: 'var(--text-muted)' }}>Not answered</em> : answer?.textAnswer}
                        </div>
                      </div>
                      {!isCorrect && (
                        <div className="result-answer-box correct">
                          <div className="result-answer-label">
                            <CheckCircleOutlined />
                            Correct Answer
                          </div>
                          <div className="result-answer-value">
                            {question.correctAnswer}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Explanation */}
                <div className={`result-explanation ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <QuestionCircleOutlined />
                  <span>{getExplanation(question, answer)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Navigation */}
      <div className="result-nav-buttons">
        <Button icon={<HomeOutlined />} onClick={() => navigate('/student/dashboard')} size="large">
          {t('dashboard')}
        </Button>
        <Button type="primary" icon={<BarChartOutlined />} onClick={() => navigate('/student/results')} size="large">
          All {t('results')}
        </Button>
      </div>
    </div>
  );
};

export default QuizResult;
