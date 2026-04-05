import { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Popconfirm, message, Input, Select } from 'antd';
import {
  SearchOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DeleteOutlined,
  UserOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import api from '../../api/axios';

const UserManager = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (id) => {
    try {
      const { data } = await api.patch(`/admin/users/${id}/promote`);
      message.success(data.message);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role: 'lecturer' } : u));
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to promote user');
    }
  };

  const handleDemote = async (id) => {
    try {
      const { data } = await api.patch(`/admin/users/${id}/demote`);
      message.success(data.message);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role: 'student' } : u));
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to demote user');
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await api.delete(`/admin/users/${id}`);
      message.success(data.message);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'red';
      case 'lecturer': return 'purple';
      default: return 'blue';
    }
  };

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: record.role === 'admin' ? '#ff4d4f' : record.role === 'lecturer' ? '#722ed1' : '#1677ff',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 600, fontSize: 14
          }}>
            {record.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      key: 'role',
      render: (_, r) => (
        <Tag color={getRoleColor(r.role)} icon={r.role === 'admin' ? <CrownOutlined /> : <UserOutlined />}>
          {r.role.charAt(0).toUpperCase() + r.role.slice(1)}
        </Tag>
      ),
      width: 120,
    },
    {
      title: 'Stats',
      key: 'stats',
      render: (_, r) => {
        if (r.role === 'student') return <span>{r.submissionCount || 0} submissions</span>;
        if (r.role === 'lecturer') return <span>{r.quizCount || 0} quizzes</span>;
        return <span>—</span>;
      },
      width: 130,
      responsive: ['md'],
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'joined',
      render: (d) => dayjs(d).format('MMM DD, YYYY'),
      width: 130,
      responsive: ['md'],
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 260,
      render: (_, record) => {
        if (record.role === 'admin') return <Tag>Protected</Tag>;
        return (
          <Space size="small" wrap>
            {record.role === 'student' ? (
              <Popconfirm title="Promote to Lecturer?" onConfirm={() => handlePromote(record._id)}>
                <Button type="primary" size="small" icon={<ArrowUpOutlined />} 
                  style={{ background: '#722ed1', borderColor: '#722ed1' }}>
                  Promote
                </Button>
              </Popconfirm>
            ) : (
              <Popconfirm title="Demote to Student?" onConfirm={() => handleDemote(record._id)}>
                <Button size="small" icon={<ArrowDownOutlined />}>
                  Demote
                </Button>
              </Popconfirm>
            )}
            <Popconfirm title="Delete this user?" description="This action cannot be undone." onConfirm={() => handleDelete(record._id)}>
              <Button danger size="small" icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">User Management</h2>
          <p className="section-subtitle">Manage users, promote to lecturer, or remove accounts</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 300 }}
          size="large"
          allowClear
        />
        <Select
          value={roleFilter}
          onChange={setRoleFilter}
          style={{ width: 140 }}
          size="large"
          options={[
            { value: 'all', label: '🔍 All Roles' },
            { value: 'student', label: '🎓 Students' },
            { value: 'lecturer', label: '👨‍🏫 Lecturers' },
            { value: 'admin', label: '🛡️ Admins' },
          ]}
        />
      </div>

      <div className="data-table">
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 700 }}
        />
      </div>
    </div>
  );
};

export default UserManager;
