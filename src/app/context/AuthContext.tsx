import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { userDatabase } from '../utils/userDatabase';
import {
  auditLogger,
  AuditAction,
  loginRateLimiter,
  Session,
  createSession,
  isSessionValid as checkSessionValid,
  refreshSession,
  SESSION_IDLE_TIMEOUT
} from '../utils/security';
import { secureStorage, SecureStorageKeys } from '../utils/secureStorage';

export type UserRole = 'tutee' | 'tutor' | 'admin' | 'principal';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface LoginResult {
  success: boolean;
  error?: string;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => LoginResult;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isSessionValid: () => boolean;
  refreshUserSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  // Load session from secure storage on mount
  useEffect(() => {
    const storedSession = secureStorage.get<Session>(SecureStorageKeys.SESSION);
    if (storedSession && checkSessionValid(storedSession)) {
      const userCredential = userDatabase.getUserById(storedSession.userId);
      if (userCredential) {
        setUser({
          id: userCredential.id,
          name: userCredential.name,
          email: userCredential.email,
          role: userCredential.role,
          avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop`
        });
        setSession(storedSession);
      } else {
        // Invalid session - clear it
        secureStorage.remove(SecureStorageKeys.SESSION);
      }
    }
  }, []);

  // Session monitoring - check for inactivity
  useEffect(() => {
    if (!session) return;

    const checkSession = () => {
      if (!checkSessionValid(session)) {
        // Session expired
        auditLogger.log(AuditAction.SESSION_TIMEOUT, 'success', {
          userId: user?.id,
          userEmail: user?.email,
        });
        logout();
        return;
      }
    };

    // Check session every minute
    const interval = setInterval(checkSession, 60 * 1000);

    return () => clearInterval(interval);
  }, [session, user]);

  // Track user activity to refresh session
  useEffect(() => {
    if (!session) return;

    const handleActivity = () => {
      if (session && checkSessionValid(session)) {
        const updatedSession = refreshSession(session);
        setSession(updatedSession);
        secureStorage.set(SecureStorageKeys.SESSION, updatedSession);
      }
    };

    // Refresh session on user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, handleActivity));

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
    };
  }, [session]);

  const login = useCallback((email: string, password: string): LoginResult => {
    // Check rate limiting
    if (loginRateLimiter.isRateLimited(email)) {
      const remainingMinutes = loginRateLimiter.getRemainingTime(email);
      auditLogger.log(AuditAction.LOGIN_FAILED, 'failure', {
        userEmail: email,
        metadata: { reason: 'rate_limited', remainingMinutes }
      });
      return {
        success: false,
        error: `Terlalu banyak percobaan login. Coba lagi dalam ${remainingMinutes} menit.`
      };
    }

    // Check if account is locked
    const lockStatus = userDatabase.isAccountLocked(email);
    if (lockStatus.locked) {
      auditLogger.log(AuditAction.LOGIN_FAILED, 'failure', {
        userEmail: email,
        metadata: { reason: 'account_locked', remainingMinutes: lockStatus.remainingMinutes }
      });
      return {
        success: false,
        error: `Akun terkunci. Coba lagi dalam ${lockStatus.remainingMinutes} menit.`
      };
    }

    // Authenticate user
    const userCredential = userDatabase.authenticate(email, password);

    if (!userCredential) {
      loginRateLimiter.recordAttempt(email);
      auditLogger.log(AuditAction.LOGIN_FAILED, 'failure', {
        userEmail: email,
        metadata: { reason: 'invalid_credentials' }
      });
      return {
        success: false,
        error: 'Email atau password salah.'
      };
    }

    // Create session
    const newSession = createSession(userCredential.id, userCredential.role);
    const newUser: User = {
      id: userCredential.id,
      name: userCredential.name,
      email: userCredential.email,
      role: userCredential.role,
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop`
    };

    setUser(newUser);
    setSession(newSession);

    // Store session securely
    secureStorage.set(SecureStorageKeys.SESSION, newSession);

    // Reset rate limiter on successful login
    loginRateLimiter.reset(email);

    // Log successful login
    auditLogger.log(AuditAction.LOGIN, 'success', {
      userId: newUser.id,
      userEmail: newUser.email,
      resource: 'authentication',
    });

    return {
      success: true,
      user: newUser
    };
  }, []);

  const logout = useCallback(() => {
    if (user) {
      auditLogger.log(AuditAction.LOGOUT, 'success', {
        userId: user.id,
        userEmail: user.email,
      });
    }

    setUser(null);
    setSession(null);
    secureStorage.remove(SecureStorageKeys.SESSION);
  }, [user]);

  const switchRole = useCallback((role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);

      if (session) {
        const updatedSession = { ...session, role };
        setSession(updatedSession);
        secureStorage.set(SecureStorageKeys.SESSION, updatedSession);
      }

      auditLogger.log(AuditAction.ROLE_CHANGE, 'success', {
        userId: user.id,
        userEmail: user.email,
        metadata: { oldRole: user.role, newRole: role }
      });
    }
  }, [user, session]);

  const isSessionValidCheck = useCallback((): boolean => {
    if (!session) return false;
    return checkSessionValid(session);
  }, [session]);

  const refreshUserSession = useCallback(() => {
    if (session && checkSessionValid(session)) {
      const updatedSession = refreshSession(session);
      setSession(updatedSession);
      secureStorage.set(SecureStorageKeys.SESSION, updatedSession);
    }
  }, [session]);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      switchRole,
      isSessionValid: isSessionValidCheck,
      refreshUserSession
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
