import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { ProtectedLayout } from './components/ProtectedLayout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { TuteeDashboard } from './pages/tutee/Dashboard';
import { BookSession } from './pages/tutee/BookSession';
import { TuteeSessions } from './pages/tutee/Sessions';
import { TuteeMaterials } from './pages/tutee/Materials';
import { TuteeFeedback } from './pages/tutee/Feedback';
import { BookingConfirmation } from './pages/tutee/BookingConfirmation';
import { TutorDashboard } from './pages/tutor/Dashboard';
import { TutorSchedule } from './pages/tutor/Schedule';
import { TutorStudents } from './pages/tutor/Students';
import { TutorMaterials } from './pages/tutor/Materials';
import { TutorLocations } from './pages/tutor/Locations';
import { TutorEvidence } from './pages/tutor/Evidence';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminPayments } from './pages/admin/Payments';
import { AdminSessions } from './pages/admin/Sessions';
import { AdminTutors } from './pages/admin/Tutors';
import { AdminStudents } from './pages/admin/Students';
import { AdminPayroll } from './pages/admin/Payroll';
import { SecurityLogs } from './pages/admin/SecurityLogs';
import { EvidenceVerification } from './pages/admin/EvidenceVerification';
import { PrincipalDashboard } from './pages/principal/Dashboard';
import { TestUpload } from './pages/TestUpload';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/tutee',
    element: <ProtectedLayout allowedRoles={['tutee']} />,
    children: [
      { index: true, element: <Navigate to="/tutee/dashboard" replace /> },
      { path: 'dashboard', element: <TuteeDashboard /> },
      { path: 'book', element: <BookSession /> },
      { path: 'sessions', element: <TuteeSessions /> },
      { path: 'materials', element: <TuteeMaterials /> },
      { path: 'feedback', element: <TuteeFeedback /> },
      { path: 'booking-confirmation', element: <BookingConfirmation /> },
    ],
  },
  {
    path: '/tutor',
    element: <ProtectedLayout allowedRoles={['tutor']} />,
    children: [
      { index: true, element: <Navigate to="/tutor/dashboard" replace /> },
      { path: 'dashboard', element: <TutorDashboard /> },
      { path: 'schedule', element: <TutorSchedule /> },
      { path: 'students', element: <TutorStudents /> },
      { path: 'materials', element: <TutorMaterials /> },
      { path: 'locations', element: <TutorLocations /> },
      { path: 'evidence', element: <TutorEvidence /> },
    ],
  },
  {
    path: '/admin',
    element: <ProtectedLayout allowedRoles={['admin']} />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'payments', element: <AdminPayments /> },
      { path: 'tutors', element: <AdminTutors /> },
      { path: 'students', element: <AdminStudents /> },
      { path: 'sessions', element: <AdminSessions /> },
      { path: 'payroll', element: <AdminPayroll /> },
      { path: 'security', element: <SecurityLogs /> },
      { path: 'evidence', element: <EvidenceVerification /> },
    ],
  },
  {
    path: '/principal',
    element: <ProtectedLayout allowedRoles={['principal']} />,
    children: [
      { index: true, element: <Navigate to="/principal/dashboard" replace /> },
      { path: 'dashboard', element: <PrincipalDashboard /> },
      { path: 'analytics', element: <div>Principal Analytics Page</div> },
      { path: 'revenue', element: <div>Principal Revenue Page</div> },
      { path: 'performance', element: <div>Principal Performance Page</div> },
    ],
  },
  {
    path: '/settings',
    element: <ProtectedLayout />,
    children: [{ index: true, element: <div>Settings Page</div> }],
  },
  {
    path: '/test-upload',
    element: <TestUpload />,
  },
  {
    path: '*',
    element: <div className="min-h-screen flex items-center justify-center">404 - Not Found</div>,
  },
]);