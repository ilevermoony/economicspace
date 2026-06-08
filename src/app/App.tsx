import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { DataProvider } from './context/DataContext';
import { ToastContainer } from './components/Toast';
import { ProtectedLayout } from './components/ProtectedLayout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { TestUpload } from './pages/TestUpload';

// Tutee pages
import { TuteeDashboard } from './pages/tutee/Dashboard';
import { BookSession } from './pages/tutee/BookSession';
import { TuteeSessions } from './pages/tutee/Sessions';
import { TuteeMaterials } from './pages/tutee/Materials';
import { TuteeFeedback } from './pages/tutee/Feedback';
import { BookingConfirmation } from './pages/tutee/BookingConfirmation';

// Tutor pages
import { TutorDashboard } from './pages/tutor/Dashboard';
import { TutorSchedule } from './pages/tutor/Schedule';
import { TutorStudents } from './pages/tutor/Students';
import { TutorMaterials } from './pages/tutor/Materials';
import { TutorLocations } from './pages/tutor/Locations';
import { TutorEvidence } from './pages/tutor/Evidence';

// Admin pages
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminPayments } from './pages/admin/Payments';
import { AdminSessions } from './pages/admin/Sessions';
import { AdminTutors } from './pages/admin/Tutors';
import { AdminStudents } from './pages/admin/Students';
import { AdminPayroll } from './pages/admin/Payroll';
import { SecurityLogs } from './pages/admin/SecurityLogs';
import { EvidenceVerification } from './pages/admin/EvidenceVerification';
import { AdminMaterials } from './pages/admin/Materials';

// Principal pages
import { PrincipalDashboard } from './pages/principal/Dashboard';
import { PrincipalReports } from './pages/principal/Reports';
import { RevenueReport } from './pages/principal/reports/RevenueReport';
import { PayrollReport } from './pages/principal/reports/PayrollReport';
import { FinancialReport } from './pages/principal/reports/FinancialReport';
import { TutorsReport } from './pages/principal/reports/TutorsReport';
import { SubjectsReport } from './pages/principal/reports/SubjectsReport';
import { StudentsReport } from './pages/principal/reports/StudentsReport';
import { OperationalReport } from './pages/principal/reports/OperationalReport';

// Settings
import { Settings } from './pages/Settings';

import './utils/resetUserDatabase'; // Initialize reset utility

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/test-upload" element={<TestUpload />} />

              {/* Tutee Routes */}
              <Route path="/tutee" element={<ProtectedLayout allowedRoles={['tutee']} />}>
                <Route index element={<Navigate to="/tutee/dashboard" replace />} />
                <Route path="dashboard" element={<TuteeDashboard />} />
                <Route path="book" element={<BookSession />} />
                <Route path="sessions" element={<TuteeSessions />} />
                <Route path="materials" element={<TuteeMaterials />} />
                <Route path="feedback" element={<TuteeFeedback />} />
                <Route path="booking-confirmation" element={<BookingConfirmation />} />
              </Route>

              {/* Tutor Routes */}
              <Route path="/tutor" element={<ProtectedLayout allowedRoles={['tutor']} />}>
                <Route index element={<Navigate to="/tutor/dashboard" replace />} />
                <Route path="dashboard" element={<TutorDashboard />} />
                <Route path="schedule" element={<TutorSchedule />} />
                <Route path="students" element={<TutorStudents />} />
                <Route path="materials" element={<TutorMaterials />} />
                <Route path="locations" element={<TutorLocations />} />
                <Route path="evidence" element={<TutorEvidence />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedLayout allowedRoles={['admin']} />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="tutors" element={<AdminTutors />} />
                <Route path="students" element={<AdminStudents />} />
                <Route path="sessions" element={<AdminSessions />} />
                <Route path="payroll" element={<AdminPayroll />} />
                <Route path="security" element={<SecurityLogs />} />
                <Route path="evidence" element={<EvidenceVerification />} />
                <Route path="materials" element={<AdminMaterials />} />
              </Route>

              {/* Principal Routes */}
              <Route path="/principal" element={<ProtectedLayout allowedRoles={['principal']} />}>
                <Route index element={<Navigate to="/principal/dashboard" replace />} />
                <Route path="dashboard" element={<PrincipalDashboard />} />
                <Route path="reports" element={<PrincipalReports />} />
                <Route path="reports/revenue" element={<RevenueReport />} />
                <Route path="reports/payroll" element={<PayrollReport />} />
                <Route path="reports/financial" element={<FinancialReport />} />
                <Route path="reports/tutors" element={<TutorsReport />} />
                <Route path="reports/subjects" element={<SubjectsReport />} />
                <Route path="reports/students" element={<StudentsReport />} />
                <Route path="reports/operational" element={<OperationalReport />} />
                <Route path="revenue" element={<RevenueReport />} />
              </Route>

              {/* Settings */}
              <Route path="/settings" element={<ProtectedLayout />}>
                <Route index element={<Settings />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<div className="min-h-screen flex items-center justify-center">404 - Not Found</div>} />
            </Routes>
          </BrowserRouter>
          <ToastContainer />
        </NotificationProvider>
      </DataProvider>
    </AuthProvider>
  );
}