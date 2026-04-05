import { useState, useEffect } from 'react';
import { Table, Spin, Empty, Input } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import api from '../../api/axios';

const StudentList = () => {
  const { t } = useTranslation();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/quizzes/students');
      setStudents(data.students);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', background: '#1677ff',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 600, fontSize: 14
          }}>
            {name.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontWeight: 500 }}>{name}</span>
        </div>
      ),
    },
    {
      title: t('email'),
      dataIndex: 'email',
      key: 'email',
      responsive: ['md'],
    },
    {
      title: t('quizzes_taken'),
      dataIndex: 'quizzesTaken',
      key: 'quizzesTaken',
      render: (v) => <span style={{ fontWeight: 600 }}>{v}</span>,
      width: 130,
      sorter: (a, b) => a.quizzesTaken - b.quizzesTaken,
    },
    {
      title: t('avg_score'),
      dataIndex: 'avgScore',
      key: 'avgScore',
      render: (v) => <span style={{ fontWeight: 600 }}>{v}%</span>,
      width: 130,
      sorter: (a, b) => a.avgScore - b.avgScore,
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'joined',
      render: (d) => dayjs(d).format('MMM DD, YYYY'),
      width: 140,
    },
  ];

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">{t('students')}</h2>
          <p className="section-subtitle">View all registered students and their performance</p>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search students..."
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
          dataSource={filteredStudents}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: <Empty description={t('no_students')} /> }}
          scroll={{ x: 600 }}
        />
      </div>
    </div>
  );
};

export default StudentList;
