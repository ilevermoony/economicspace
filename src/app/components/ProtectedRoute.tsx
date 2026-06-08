import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { auditLogger, AuditAction } from '../utils/security';
import { UserRole } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  requireAuth = true,
}: ProtectedRouteProps) {
  const { user, isSessionValid } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Log unauthorized access attempts
    if (requireAuth && !user) {
      auditLogger.log(AuditAction.UNAUTHORIZED_ACCESS, 'failure', {
        resource: location.pathname,
      });
    }

    if (user && allowedRoles && !allowedRoles.includes(user.role)) {
      auditLogger.log(AuditAction.UNAUTHORIZED_ACCESS, 'failure', {
        userId: user.id,
        userEmail: user.email,
        resource: location.pathname,
        metadata: { attemptedRole: user.role, allowedRoles },
      });
    }
  }, [user, location.pathname, requireAuth, allowedRoles]);

  // Check if authentication is required
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if session is still valid
  if (user && !isSessionValid()) {
    return <Navigate to="/login" state={{ from: location, sessionExpired: true }} replace />;
  }

  // Check if user has required role
  if (user && allowedRoles && !allowedRoles.includes(user.role)) {
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
            <p className="text-gray-600 mb-6">
              Anda tidak memiliki izin untuk mengakses halaman ini.
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-[#915D16] text-white rounded-lg hover:bg-[#7A4D12] transition-colors"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
