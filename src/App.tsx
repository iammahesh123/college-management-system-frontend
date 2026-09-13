import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { Layout } from './components/layout/Layout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdmissionsPage } from './pages/AdmissionsPage';
import { StudentsPage } from './pages/StudentsPage';
import { AcademicsPage } from './pages/AcademicsPage';
import { TimetablePage } from './pages/TimetablePage';
import { AttendancePage } from './pages/AttendancePage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { ExaminationsPage } from './pages/ExaminationsPage';
import { FinancePage } from './pages/FinancePage';
import { FacultyPage } from './pages/FacultyPage';
import { OperationsPage } from './pages/OperationsPage';
import { NoticesPage } from './pages/NoticesPage';

// Protected Route Guard
const ProtectedRoute: React.FC = () => {
  const { token } = useAuthStore();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Layout />;
};

export default function App() {
  const { token } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Public Authentication */}
        <Route 
          path="/login" 
          element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
        />

        {/* Protected ERP Modules wrapped in Layout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admissions" element={<AdmissionsPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/academics" element={<AcademicsPage />} />
          <Route path="/timetable" element={<TimetablePage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/examinations" element={<ExaminationsPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/faculty" element={<FacultyPage />} />
          <Route path="/operations" element={<OperationsPage />} />
          <Route path="/notices" element={<NoticesPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
