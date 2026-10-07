import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/common/Layout';
import Login from './pages/Login';

// Instructor Pages
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import WeeklyProgressDashboard from './pages/instructor/WeeklyProgressDashboard';
import PresentationDashboard from './pages/instructor/PresentationDashboard';
import StudentList from './pages/instructor/StudentList';
import StudentDetail from './pages/instructor/StudentDetail';
import ProjectTracking from './pages/instructor/ProjectTracking';
import InstructorProjects from './pages/instructor/InstructorProjects';
import LearningAnalytics from './pages/instructor/LearningAnalytics';
import DocumentManagement from './pages/instructor/DocumentManagement';
import NotificationCenter from './pages/instructor/NotificationCenter';
import ReportsPage from './pages/instructor/ReportsPage';
import InstructorSettings from './pages/instructor/InstructorSettings';
import ApprovalCenter from './pages/instructor/ApprovalCenter';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyProject from './pages/student/MyProject';
import MyWeeklyProgress from './pages/student/MyWeeklyProgress';
import MyPresentation from './pages/student/MyPresentation';
import MyDocuments from './pages/student/MyDocuments';
import MyFeedback from './pages/student/MyFeedback';
import MyCalendar from './pages/student/MyCalendar';
import MyNotifications from './pages/student/MyNotifications';
import StudentSettings from './pages/student/StudentSettings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ProjectManagement from './pages/admin/ProjectManagement';
import CriteriaManagement from './pages/admin/CriteriaManagement';
import AdminReports from './pages/admin/AdminReports';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && !allowedRoles.includes(role)) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, role } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to={`/${role}`} replace /> : <Login />
      } />

      {/* Instructor Routes */}
      <Route path="/instructor" element={
        <ProtectedRoute allowedRoles={['instructor']}>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<InstructorDashboard />} />
        <Route path="projects" element={<InstructorProjects />} />
        <Route path="approvals" element={<ApprovalCenter />} />
        <Route path="students" element={<StudentList />} />
        <Route path="students/:studentId" element={<StudentDetail />} />
        <Route path="tracking" element={<ProjectTracking />} />
        <Route path="weekly-progress" element={<WeeklyProgressDashboard />} />
        <Route path="presentations" element={<PresentationDashboard />} />
        <Route path="analytics" element={<LearningAnalytics />} />
        <Route path="risk-score" element={<Navigate to="/instructor/analytics" replace />} />
        <Route path="notifications" element={<NotificationCenter />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="documents" element={<DocumentManagement />} />
        <Route path="settings" element={<InstructorSettings />} />
      </Route>

      {/* Student Routes */}
      <Route path="/student" element={
        <ProtectedRoute allowedRoles={['student']}>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<StudentDashboard />} />
        <Route path="my-project" element={<MyProject />} />
        <Route path="weekly-progress" element={<MyWeeklyProgress />} />
        <Route path="presentations" element={<MyPresentation />} />
        <Route path="risk-score" element={<Navigate to="/student" replace />} />
        <Route path="documents" element={<MyDocuments />} />
        <Route path="feedback" element={<MyFeedback />} />
        <Route path="calendar" element={<MyCalendar />} />
        <Route path="notifications" element={<MyNotifications />} />
        <Route path="settings" element={<StudentSettings />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="students" element={<Navigate to="/admin/users?role=student" replace />} />
        <Route path="instructors" element={<Navigate to="/admin/users?role=instructor" replace />} />
        <Route path="projects" element={<ProjectManagement />} />
        <Route path="criteria" element={<CriteriaManagement />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
