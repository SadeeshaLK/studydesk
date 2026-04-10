import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: values.email });
      setSent(true);
      message.success(t('reset_code_sent'));
      // Navigate to reset page with email pre-filled
      navigate('/reset-password', { state: { email: values.email } });
    } catch (error) {
      message.error(error.response?.data?.message || 'Something went wrong');
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
          {t('forgot_password_title')}
        </h2>
        <p style={{ textAlign: 'center', marginBottom: 28, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
          {t('forgot_password_subtitle')}
        </p>

        <Form layout="vertical" onFinish={onFinish} size="large" autoComplete="off">
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

          <Form.Item style={{ marginBottom: 16 }}>
            <Button type="primary" htmlType="submit" block loading={loading}
              style={{ height: 46, fontSize: 15, fontWeight: 600 }}>
              {t('send_reset_code')}
            </Button>
          </Form.Item>
        </Form>

        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
          <Link to="/login" style={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ArrowLeftOutlined /> {t('back_to_login')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
