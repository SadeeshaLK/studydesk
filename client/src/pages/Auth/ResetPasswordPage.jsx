import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined, LockOutlined, SafetyOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Pre-fill email from the forgot-password page navigation state
  const emailFromState = location.state?.email || '';

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', {
        email: values.email,
        code: values.code,
        password: values.password
      });

      // Auto-login after successful reset
      localStorage.setItem('studydesk_token', data.token);
      localStorage.setItem('studydesk_user', JSON.stringify(data.user));

      message.success(t('password_reset_success'));
      
      // Navigate to appropriate dashboard
      const dashboardPath = data.user.role === 'lecturer' ? '/lecturer/dashboard' : '/student/dashboard';
      navigate(dashboardPath);
      // Force page reload to re-initialize auth state
      window.location.href = dashboardPath;
    } catch (error) {
      message.error(error.response?.data?.message || 'Password reset failed');
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
          {t('reset_password_title')}
        </h2>
        <p style={{ textAlign: 'center', marginBottom: 28, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
          {t('reset_password_subtitle')}
        </p>

        <Form 
          layout="vertical" 
          onFinish={onFinish} 
          size="large" 
          autoComplete="off"
          initialValues={{ email: emailFromState }}
        >
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
            name="code" 
            label={t('reset_code')}
            rules={[{ required: true, message: 'Please enter the 6-digit code' }]}
          >
            <Input 
              prefix={<SafetyOutlined />} 
              placeholder="123456"
              maxLength={6}
              style={{ letterSpacing: 4, fontWeight: 700, fontSize: 18, fontFamily: "'Courier New', monospace" }}
            />
          </Form.Item>

          <Form.Item 
            name="password" 
            label={t('new_password')}
            rules={[
              { required: true, message: 'Please enter a new password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Min. 6 characters" />
          </Form.Item>

          <Form.Item 
            name="confirmPassword" 
            label={t('confirm_password')}
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Re-enter new password" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button type="primary" htmlType="submit" block loading={loading}
              style={{ height: 46, fontSize: 15, fontWeight: 600 }}>
              {t('reset_password')}
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 24 }}>
          <Link to="/forgot-password" style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            {t('resend_code')}
          </Link>
          <Link to="/login" style={{ fontWeight: 600, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <ArrowLeftOutlined /> {t('back_to_login')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
