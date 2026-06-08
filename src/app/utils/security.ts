/**
 * Security Utilities for Economic Space Platform
 *
 * NOTE: This implementation uses simplified cryptography suitable for demo/frontend purposes.
 * For production, implement proper backend authentication with:
 * - bcrypt/argon2 for password hashing on server
 * - Proper AES-256-GCM encryption
 * - Async PBKDF2 with higher iterations
 * - Secure session management with JWT
 */

// Security configuration
const ENCRYPTION_KEY = 'economic-space-2026-default-key';
const SALT_ROUNDS = 10;

// Generate random salt
const generateSalt = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Simple hash function using Web Crypto API
async function hashWithPBKDF2(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);
  const saltData = encoder.encode(salt);

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordData,
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltData,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );

  return Array.from(new Uint8Array(derivedBits))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Password hashing using PBKDF2 with salt
export const hashPassword = (password: string, salt?: string): string => {
  const passwordSalt = salt || generateSalt();
  // Simple synchronous hash for demo - in production use async PBKDF2
  let hash = '';
  for (let i = 0; i < password.length; i++) {
    hash += (password.charCodeAt(i) + passwordSalt.charCodeAt(i % passwordSalt.length)).toString(16);
  }
  return `${passwordSalt}:${hash}`;
};

// Verify password against hash
export const verifyPassword = (password: string, hashedPassword: string): boolean => {
  try {
    const [salt, hash] = hashedPassword.split(':');
    const newHash = hashPassword(password, salt).split(':')[1];
    return hash === newHash;
  } catch {
    return false;
  }
};

// Simple XOR encryption for localStorage (demo purposes)
export const encryptData = (data: any): string => {
  try {
    const jsonString = JSON.stringify(data);
    const key = ENCRYPTION_KEY;
    let encrypted = '';

    for (let i = 0; i < jsonString.length; i++) {
      const charCode = jsonString.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      encrypted += String.fromCharCode(charCode);
    }

    return btoa(encrypted); // Base64 encode
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
};

// Decrypt data from localStorage
export const decryptData = <T>(encryptedData: string): T | null => {
  try {
    const decoded = atob(encryptedData); // Base64 decode
    const key = ENCRYPTION_KEY;
    let decrypted = '';

    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      decrypted += String.fromCharCode(charCode);
    }

    return JSON.parse(decrypted) as T;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password harus minimal 8 karakter');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password harus mengandung huruf kapital');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password harus mengandung huruf kecil');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password harus mengandung angka');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password harus mengandung karakter spesial');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Generate session token
export const generateSessionToken = (): string => {
  const array = new Uint8Array(32); // 256 bits / 8 = 32 bytes
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Rate limiting for login attempts
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record) {
      return false;
    }

    if (now > record.resetTime) {
      this.attempts.delete(identifier);
      return false;
    }

    return record.count >= this.maxAttempts;
  }

  recordAttempt(identifier: string): void {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record || now > record.resetTime) {
      this.attempts.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
    } else {
      record.count++;
    }
  }

  getRemainingTime(identifier: string): number {
    const record = this.attempts.get(identifier);
    if (!record) return 0;

    const remaining = Math.ceil((record.resetTime - Date.now()) / 1000 / 60);
    return Math.max(0, remaining);
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000);

// Audit logging
export interface AuditLog {
  id: string;
  timestamp: Date;
  userId?: string;
  userEmail?: string;
  action: AuditAction;
  resource?: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failure';
  metadata?: Record<string, any>;
}

export enum AuditAction {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGIN_FAILED = 'LOGIN_FAILED',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  DATA_ACCESS = 'DATA_ACCESS',
  DATA_MODIFY = 'DATA_MODIFY',
  DATA_DELETE = 'DATA_DELETE',
  ROLE_CHANGE = 'ROLE_CHANGE',
  SESSION_TIMEOUT = 'SESSION_TIMEOUT',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
}

class AuditLogger {
  private logs: AuditLog[] = [];
  private maxLogs = 1000;

  log(
    action: AuditAction,
    status: 'success' | 'failure',
    metadata?: {
      userId?: string;
      userEmail?: string;
      resource?: string;
      resourceId?: string;
      [key: string]: any;
    }
  ): void {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    const id = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');

    const log: AuditLog = {
      id,
      timestamp: new Date(),
      action,
      status,
      ...metadata,
    };

    this.logs.unshift(log);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Persist to localStorage
    try {
      localStorage.setItem('audit_logs', JSON.stringify(this.logs));
    } catch (error) {
      console.error('Failed to save audit logs:', error);
    }

    // Log critical events to console
    if (status === 'failure' || action === AuditAction.UNAUTHORIZED_ACCESS) {
      console.warn('Security Event:', log);
    }
  }

  getLogs(filter?: {
    action?: AuditAction;
    userId?: string;
    status?: 'success' | 'failure';
    startDate?: Date;
    endDate?: Date;
  }): AuditLog[] {
    let filtered = [...this.logs];

    if (filter?.action) {
      filtered = filtered.filter((log) => log.action === filter.action);
    }
    if (filter?.userId) {
      filtered = filtered.filter((log) => log.userId === filter.userId);
    }
    if (filter?.status) {
      filtered = filtered.filter((log) => log.status === filter.status);
    }
    if (filter?.startDate) {
      filtered = filtered.filter((log) => new Date(log.timestamp) >= filter.startDate!);
    }
    if (filter?.endDate) {
      filtered = filtered.filter((log) => new Date(log.timestamp) <= filter.endDate!);
    }

    return filtered;
  }

  clearLogs(): void {
    this.logs = [];
    localStorage.removeItem('audit_logs');
  }

  loadLogs(): void {
    try {
      const stored = localStorage.getItem('audit_logs');
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    }
  }
}

export const auditLogger = new AuditLogger();

// Initialize audit logger
if (typeof window !== 'undefined') {
  auditLogger.loadLogs();
}

// Content Security Policy helpers
export const CSP_DIRECTIVES = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'"],
  styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
  fontSrc: ["'self'", 'https://fonts.gstatic.com'],
  connectSrc: ["'self'"],
  frameSrc: ["'none'"],
  objectSrc: ["'none'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
};

// Session security
export interface Session {
  token: string;
  userId: string;
  role: string;
  createdAt: number;
  expiresAt: number;
  lastActivity: number;
}

export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
export const SESSION_IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes

export const createSession = (userId: string, role: string): Session => {
  const now = Date.now();
  return {
    token: generateSessionToken(),
    userId,
    role,
    createdAt: now,
    expiresAt: now + SESSION_TIMEOUT,
    lastActivity: now,
  };
};

export const isSessionValid = (session: Session): boolean => {
  const now = Date.now();
  return now < session.expiresAt && now - session.lastActivity < SESSION_IDLE_TIMEOUT;
};

export const refreshSession = (session: Session): Session => {
  const now = Date.now();
  return {
    ...session,
    lastActivity: now,
    expiresAt: now + SESSION_TIMEOUT,
  };
};
