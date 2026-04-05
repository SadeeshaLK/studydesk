import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await register(values.name, values.email, values.password);
      message.success('Account created successfully!');
      navigate('/student/dashboard');
    } catch (error) {
      message.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>📚 StudyDesk</h1>
          <p>{t('tagline')}</p>
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: 4, fontSize: 22, fontWeight: 700 }}>
          {t('register_title')}
        </h2>
        <p style={{ textAlign: 'center', marginBottom: 28, color: 'var(--text-secondary)', fontSize: 14 }}>
          {t('register_subtitle')}
        </p>

        <Form layout="vertical" onFinish={onFinish} size="large" autoComplete="off">
          <Form.Item 
            name="name" 
            label={t('name')}
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="John Doe" />
          </Form.Item>

          <Form.Item 
            name="email" 
            label={t('email')}
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="you@university.edu" />
          </Form.Item>

          <Form.Item 
            name="password" 
            label={t('password')}
            rules={[
              { required: true, message: 'Please enter a password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Min. 6 characters" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button type="primary" htmlType="submit" block loading={loading}
              style={{ height: 46, fontSize: 15, fontWeight: 600 }}>
              {t('register')}
            </Button>
          </Form.Item>
        </Form>

        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
          {t('have_account')}{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>{t('login')}</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
