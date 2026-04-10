import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import AppLayout from './components/Layout/AppLayout';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import StudentDashboard from './pages/Student/StudentDashboard';
import QuizAttempt from './pages/Student/QuizAttempt';
import QuizResult from './pages/Student/QuizResult';
import ResultsHistory from './pages/Student/ResultsHistory';
import StudentWallet from './pages/Student/StudentWallet';
import GPACalculator from './pages/Student/GPACalculator';
import LecturerDashboard from './pages/Lecturer/LecturerDashboard';
import QuizManager from './pages/Lecturer/QuizManager';
import QuizEditor from './pages/Lecturer/QuizEditor';
import StudentSubmissions from './pages/Lecturer/StudentSubmissions';
import StudentList from './pages/Lecturer/StudentList';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManager from './pages/Admin/UserManager';
import PaymentManager from './pages/Admin/PaymentManager';
import './i18n';

const getDefaultPath = (role) => {
  switch (role) {
    case 'admin': return '/admin/dashboard';
    case 'lecturer': return '/lecturer/dashboard';
    default: return '/student/dashboard';
  }
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        user ? <Navigate to={getDefaultPath(user.role)} /> : <LoginPage />
      } />
      <Route path="/register" element={
        user ? <Navigate to={getDefaultPath(user.role)} /> : <RegisterPage />
      } />
      <Route path="/forgot-password" element={
        user ? <Navigate to={getDefaultPath(user.role)} /> : <ForgotPasswordPage />
      } />
      <Route path="/reset-password" element={
        user ? <Navigate to={getDefaultPath(user.role)} /> : <ResetPasswordPage />
      } />

      {/* Student Routes */}
      <Route path="/student" element={
        <ProtectedRoute allowedRoles={['student']}>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="quizzes" element={<StudentDashboard />} />
        <Route path="quiz/:id" element={<QuizAttempt />} />
        <Route path="result/:id" element={<QuizResult />} />
        <Route path="results" element={<ResultsHistory />} />
        <Route path="wallet" element={<StudentWallet />} />
        <Route path="gpa-calculator" element={<GPACalculator />} />
        <Route index element={<Navigate to="dashboard" />} />
      </Route>

      {/* Lecturer Routes */}
      <Route path="/lecturer" element={
        <ProtectedRoute allowedRoles={['lecturer']}>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<LecturerDashboard />} />
        <Route path="quizzes" element={<QuizManager />} />
        <Route path="quizzes/create" element={<QuizEditor />} />
        <Route path="quizzes/edit/:id" element={<QuizEditor />} />
        <Route path="students" element={<StudentList />} />
        <Route path="results" element={<StudentSubmissions />} />
        <Route index element={<Navigate to="dashboard" />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManager />} />
        <Route path="payments" element={<PaymentManager />} />
        <Route index element={<Navigate to="dashboard" />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={
        user ? <Navigate to={getDefaultPath(user.role)} /> : <Navigate to="/login" />
      } />

      {/* 404 */}
      <Route path="*" element={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <h1 style={{ fontSize: 72, fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>404</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 18 }}>Page not found</p>
          <a href="/" style={{ marginTop: 16, color: 'var(--primary)' }}>Go Home</a>
        </div>
      } />
    </Routes>
  );
};

const ThemedApp = () => {
  const { antDesignTheme, isDark } = useTheme();

  return (
    <ConfigProvider theme={antDesignTheme}>
      <Router>
        <AuthProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '10px',
                background: isDark ? '#1e2130' : '#fff',
                color: isDark ? '#e8eaed' : '#1a1a2e',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              },
            }}
          />
        </AuthProvider>
      </Router>
    </ConfigProvider>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
};

export default App;
