import { useState, useEffect } from 'react';
import { Table, Tag, Button, Spin, Empty } from 'antd';
import { EyeOutlined, TrophyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import api from '../../api/axios';

const ResultsHistory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const { data } = await api.get('/submissions/my-results');
      setSubmissions(data.submissions);
    } catch (error) {
      console.error('Failed to fetch results:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: t('quiz'),
      dataIndex: ['quiz', 'title'],
      key: 'quiz',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{text}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{record.quiz?.course}</div>
        </div>
      ),
    },
    {
      title: t('score'),
      key: 'score',
      render: (_, record) => (
        <span style={{ fontWeight: 600 }}>{record.score} / {record.totalMarks}</span>
      ),
      width: 120,
    },
    {
      title: t('percentage'),
      dataIndex: 'percentage',
      key: 'percentage',
      render: (val) => <span style={{ fontWeight: 600 }}>{val}%</span>,
      width: 100,
    },
    {
      title: t('status'),
      key: 'status',
      render: (_, record) => (
        <Tag color={record.passed ? 'green' : 'red'} icon={record.passed ? <TrophyOutlined /> : null}>
          {record.passed ? t('passed') : t('failed')}
        </Tag>
      ),
      width: 100,
    },
    {
      title: t('date'),
      dataIndex: 'submittedAt',
      key: 'date',
      render: (date) => dayjs(date).format('MMM DD, YYYY hh:mm A'),
      width: 180,
    },
    {
      title: t('actions'),
      key: 'actions',
      render: (_, record) => (
        <Button type="link" icon={<EyeOutlined />} onClick={() => navigate(`/student/result/${record._id}`)}>
          {t('view')}
        </Button>
      ),
      width: 100,
    },
  ];

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">{t('my_results')}</h2>
          <p className="section-subtitle">View all your past quiz submissions</p>
        </div>
      </div>

      <div className="data-table">
        <Table
          columns={columns}
          dataSource={submissions}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: <Empty description={t('no_results')} /> }}
          scroll={{ x: 700 }}
        />
      </div>
    </div>
  );
};

export default ResultsHistory;
