import { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Popconfirm, message, Spin, Empty, Input } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import api from '../../api/axios';

const QuizManager = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const { data } = await api.get('/quizzes/my-quizzes');
      setQuizzes(data.quizzes);
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/quizzes/${id}`);
      message.success('Quiz deleted successfully');
      setQuizzes(prev => prev.filter(q => q._id !== id));
    } catch (error) {
      message.error('Failed to delete quiz');
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      const { data } = await api.patch(`/quizzes/${id}/publish`);
      message.success(data.message);
      setQuizzes(prev => prev.map(q => q._id === id ? { ...q, isPublished: data.quiz.isPublished } : q));
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const filteredQuizzes = quizzes.filter(q => 
    q.title.toLowerCase().includes(search.toLowerCase()) ||
    q.course?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: t('quiz_title'),
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{text}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{record.course}</div>
        </div>
      ),
    },
    {
      title: t('questions'),
      key: 'questions',
      render: (_, r) => <span>{r.questions?.length || 0} Q</span>,
      width: 80,
    },
    {
      title: t('duration'),
      dataIndex: 'duration',
      key: 'duration',
      render: (d) => `${d} ${t('minutes')}`,
      width: 100,
    },
    {
      title: t('status'),
      key: 'status',
      render: (_, record) => {
        if (record.isPublished) {
          return <Tag color="green" icon={<CheckCircleOutlined />}>{t('published')}</Tag>;
        }
        return <Tag color="orange" icon={<ClockCircleOutlined />}>{t('draft')}</Tag>;
      },
      width: 120,
    },
    {
      title: 'Submissions',
      dataIndex: 'submissionCount',
      key: 'submissions',
      render: (count) => <span style={{ fontWeight: 600 }}>{count || 0}</span>,
      width: 100,
    },
    {
      title: t('date'),
      dataIndex: 'createdAt',
      key: 'date',
      render: (d) => dayjs(d).format('MMM DD, YYYY'),
      width: 130,
    },
    {
      title: t('actions'),
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} 
            onClick={() => navigate(`/lecturer/quizzes/edit/${record._id}`)}>
            {t('edit')}
          </Button>
          <Button type="link"
            onClick={() => handleTogglePublish(record._id)}>
            {record.isPublished ? t('unpublish') : t('publish')}
          </Button>
          <Popconfirm title={t('confirm_delete')} onConfirm={() => handleDelete(record._id)}>
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">{t('quizzes')}</h2>
          <p className="section-subtitle">Manage all your quizzes in one place</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large"
          onClick={() => navigate('/lecturer/quizzes/create')}>
          {t('create_quiz')}
        </Button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search quizzes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 400 }}
          size="large"
          allowClear
        />
      </div>

      <div className="data-table">
        <Table
          columns={columns}
          dataSource={filteredQuizzes}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: <Empty description={t('no_quizzes')} /> }}
          scroll={{ x: 800 }}
        />
      </div>
    </div>
  );
};

export default QuizManager;
