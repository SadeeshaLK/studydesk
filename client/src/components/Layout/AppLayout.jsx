import { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Drawer, Select } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  TeamOutlined,
  BarChartOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SunOutlined,
  MoonOutlined,
  GlobalOutlined,
  DollarOutlined,
  SettingOutlined,
  CrownOutlined,
  WalletOutlined,
  CalculatorOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const { Sider, Header, Content } = Layout;

const AppLayout = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMobileDrawerOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('studydesk_lang', lang);
  };

  const studentMenuItems = [
    { key: '/student/dashboard', icon: <DashboardOutlined />, label: t('dashboard') },
    { key: '/student/quizzes', icon: <FileTextOutlined />, label: t('quizzes') },
    { key: '/student/wallet', icon: <WalletOutlined />, label: 'Wallet' },
    { key: '/student/results', icon: <BarChartOutlined />, label: t('results') },
    { key: '/student/gpa-calculator', icon: <CalculatorOutlined />, label: 'GPA Calculator' },
  ];

  const lecturerMenuItems = [
    { key: '/lecturer/dashboard', icon: <DashboardOutlined />, label: t('dashboard') },
    { key: '/lecturer/quizzes', icon: <FileTextOutlined />, label: t('quizzes') },
    { key: '/lecturer/students', icon: <TeamOutlined />, label: t('students') },
    { key: '/lecturer/results', icon: <BarChartOutlined />, label: t('results') },
  ];

  const adminMenuItems = [
    { key: '/admin/dashboard', icon: <DashboardOutlined />, label: t('dashboard') },
    { key: '/admin/users', icon: <TeamOutlined />, label: 'Users' },
    { key: '/admin/payments', icon: <DollarOutlined />, label: 'Payments' },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin': return adminMenuItems;
      case 'lecturer': return lecturerMenuItems;
      default: return studentMenuItems;
    }
  };

  const menuItems = getMenuItems();
  const currentKey = menuItems.find(item => location.pathname.startsWith(item.key))?.key || menuItems[0]?.key;

  const handleMenuClick = ({ key }) => {
    navigate(key);
    if (isMobile) setMobileDrawerOpen(false);
  };

  const userMenu = {
    items: [
      { key: 'profile', icon: <UserOutlined />, label: `${user?.name}`, disabled: true },
      { type: 'divider' },
      { key: 'logout', icon: <LogoutOutlined />, label: t('logout'), danger: true },
    ],
    onClick: ({ key }) => {
      if (key === 'logout') handleLogout();
    }
  };

  const getRoleBadge = () => {
    switch (user?.role) {
      case 'admin': return '🛡️';
      case 'lecturer': return '👨‍🏫';
      default: return '🎓';
    }
  };

  const sidebarContent = (
    <>
      <div className="sidebar-logo">
        {collapsed && !isMobile ? (
          <span className="logo-icon">📚</span>
        ) : (
          <>
            <h2>📚 StudyDesk</h2>
            <span>{t('tagline')}</span>
          </>
        )}
      </div>
      <Menu
        className="sidebar-menu"
        mode="inline"
        selectedKeys={[currentKey]}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </>
  );

  return (
    <Layout className="app-layout" style={{ minHeight: '100vh' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider
          className="app-sidebar"
          width={260}
          collapsedWidth={80}
          trigger={null}
          collapsible
          collapsed={collapsed}
        >
          {sidebarContent}
        </Sider>
      )}

      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        width={260}
        styles={{ body: { padding: 0 } }}
      >
        {sidebarContent}
      </Drawer>

      <Layout style={{ marginLeft: isMobile ? 0 : (collapsed ? 80 : 260), transition: 'margin-left 0.3s' }}>
        <Header className="app-header">
          <div className="header-left">
            <Button
              type="text"
              icon={isMobile ? <MenuUnfoldOutlined /> : (collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)}
              onClick={() => isMobile ? setMobileDrawerOpen(true) : setCollapsed(!collapsed)}
              style={{ fontSize: 18 }}
            />
          </div>

          <div className="header-right">
            <Select
              size="small"
              value={i18n.language}
              onChange={changeLanguage}
              style={{ width: 80 }}
              suffixIcon={<GlobalOutlined />}
              options={[
                { value: 'en', label: 'EN' },
                { value: 'si', label: 'සිං' },
                { value: 'ta', label: 'தமி' },
              ]}
            />

            <Button
              type="text"
              icon={isDark ? <SunOutlined style={{ color: '#faad14' }} /> : <MoonOutlined />}
              onClick={toggleTheme}
              style={{ fontSize: 18 }}
            />

            <Dropdown menu={userMenu} placement="bottomRight">
              <div className="header-user">
                <Avatar
                  style={{ 
                    backgroundColor: user?.role === 'admin' ? '#ff4d4f' : 
                                     user?.role === 'lecturer' ? '#722ed1' : '#1677ff' 
                  }}
                  icon={<UserOutlined />}
                  size={36}
                />
                {!isMobile && (
                  <div>
                    <div className="header-user-name">{user?.name}</div>
                    <div className="header-user-role">{getRoleBadge()} {t(user?.role)}</div>
                  </div>
                )}
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="app-content">
          <div className="page-enter">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
