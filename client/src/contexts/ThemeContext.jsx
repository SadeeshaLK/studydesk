import { createContext, useContext, useState, useEffect } from 'react';
import { theme as antTheme } from 'antd';

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('studydesk_theme');
    return saved === 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('studydesk_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  const antDesignTheme = {
    algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    token: {
      colorPrimary: '#1677ff',
      borderRadius: 8,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      colorBgContainer: isDark ? '#1e2130' : '#ffffff',
      colorBgLayout: isDark ? '#0f1117' : '#f5f7fa',
      colorBorder: isDark ? '#2d3148' : '#e8ecf1',
      colorText: isDark ? '#e8eaed' : '#1a1a2e',
      colorTextSecondary: isDark ? '#9aa0b0' : '#64748b',
    },
    components: {
      Menu: {
        itemBg: 'transparent',
        subMenuItemBg: 'transparent',
        darkItemBg: 'transparent',
      },
      Layout: {
        siderBg: isDark ? '#1a1d27' : '#ffffff',
        headerBg: isDark ? '#1a1d27' : '#ffffff',
        bodyBg: isDark ? '#0f1117' : '#f5f7fa',
      },
      Table: {
        headerBg: isDark ? '#1a1d27' : '#fafbfc',
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, antDesignTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
