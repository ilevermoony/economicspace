import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../context/AuthContext';
import { Layout } from './Layout';
import { useNavigate } from 'react-router';

interface ProtectedLayoutProps {
  allowedRoles?: UserRole[];
}

export function ProtectedLayout({ allowedRoles }: ProtectedLayoutProps) {
  const { user, isSessionValid } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Check if authentication is required
  if (!user) {
    console.log('[ProtectedLayout] No user, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if session is still valid
  if (!isSessionValid()) {
    console.log('[ProtectedLayout] Session invalid, redirecting to login');
    return <Navigate to="/login" state={{ from: location, sessionExpired: true }} replace />;
  }

  // Check if user has required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log(`[ProtectedLayout] Access denied. User role: ${user.role}, Required: ${allowedRoles.join(', ')}`);
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEFEFE]">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#3D3B46] mb-2">Akses Ditolak</h2>
            <p className="text-gray-600 mb-4">
              Anda tidak memiliki izin untuk mengakses halaman ini.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Role Anda: <strong>{user.role}</strong><br />
              Halaman ini untuk: <strong>{allowedRoles?.join(', ')}</strong>
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-[#915D16] text-white rounded-lg hover:bg-[#7A4D12] transition-colors"
              >
                Ke Beranda
              </button>
              <button
                onClick={() => navigate(`/${user.role}/dashboard`)}
                className="px-6 py-2 border border-[#915D16] text-[#915D16] rounded-lg hover:bg-[#915D16]/10 transition-colors"
              >
                Ke Dashboard Saya
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log(`[ProtectedLayout] Access granted for ${user.role}`);
  return <Layout />;
}
