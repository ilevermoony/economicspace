import { hashPassword, verifyPassword } from './security';

export interface UserCredential {
  id: string;
  email: string;
  passwordHash: string;
  role: 'tutee' | 'tutor' | 'admin' | 'principal';
  name: string;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  failedLoginAttempts: number;
  lockedUntil?: Date;
}

// Mock user database - in production, this would be in a secure backend
const USERS_DB_KEY = 'users_database';

class UserDatabase {
  private users: Map<string, UserCredential> = new Map();

  constructor() {
    this.loadUsers();
    this.initializeDefaultUsers();
  }

  private loadUsers(): void {
    try {
      const stored = localStorage.getItem(USERS_DB_KEY);
      if (stored) {
        const usersArray: UserCredential[] = JSON.parse(stored);
        this.users = new Map(usersArray.map((u) => [u.email, u]));
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  }

  private saveUsers(): void {
    try {
      const usersArray = Array.from(this.users.values());
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersArray));
    } catch (error) {
      console.error('Failed to save users:', error);
    }
  }

  private initializeDefaultUsers(): void {
    console.log('[UserDatabase] Initializing default users...');
    console.log('[UserDatabase] Current users count:', this.users.size);

    const defaultUsers = [
      {
        id: '1',
        email: 'tutee@economicspace.com',
        password: 'Tutee@123',
        role: 'tutee' as const,
        name: 'Sarah Johnson',
      },
      {
        id: '2',
        email: 'tutor@economicspace.com',
        password: 'Tutor@123',
        role: 'tutor' as const,
        name: 'Dr. Michael Chen',
      },
      {
        id: '3',
        email: 'admin@economicspace.com',
        password: 'Admin@123',
        role: 'admin' as const,
        name: 'Emily Roberts',
      },
      {
        id: '4',
        email: 'principal@economicspace.com',
        password: 'Principal@123',
        role: 'principal' as const,
        name: 'James Wilson',
      },
    ];

    // Ensure default users exist
    defaultUsers.forEach((user) => {
      if (!this.users.has(user.email)) {
        console.log(`[UserDatabase] Creating default user: ${user.email}`);
        this.createUser(user.email, user.password, user.role, user.name);
      } else {
        console.log(`[UserDatabase] Default user already exists: ${user.email}`);
      }
    });

    console.log('[UserDatabase] ✅ Default users initialized. Total users:', this.users.size);
  }

  createUser(
    email: string,
    password: string,
    role: 'tutee' | 'tutor' | 'admin' | 'principal',
    name: string
  ): UserCredential | null {
    if (this.users.has(email)) {
      console.log(`[UserDatabase] User already exists: ${email}`);
      return null; // User already exists
    }

    console.log(`[UserDatabase] Creating user: ${email}`);
    const passwordHash = hashPassword(password);
    console.log(`[UserDatabase] Password hash generated for ${email}`);

    const user: UserCredential = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      passwordHash,
      role,
      name,
      createdAt: new Date(),
      isActive: true,
      failedLoginAttempts: 0,
    };

    this.users.set(email, user);
    this.saveUsers();
    console.log(`[UserDatabase] ✅ User created: ${email} (${role})`);
    return user;
  }

  authenticate(email: string, password: string): UserCredential | null {
    console.log(`[UserDatabase] Attempting authentication for: ${email}`);

    const user = this.users.get(email);

    if (!user) {
      console.error(`[UserDatabase] User not found: ${email}`);
      console.log('[UserDatabase] Available users:', Array.from(this.users.keys()));
      return null; // User not found
    }

    console.log(`[UserDatabase] User found: ${email} (${user.role})`);

    if (!user.isActive) {
      console.error(`[UserDatabase] Account disabled: ${email}`);
      return null; // Account disabled
    }

    // Check if account is locked
    if (user.lockedUntil && new Date() < user.lockedUntil) {
      console.error(`[UserDatabase] Account locked: ${email}`);
      return null; // Account locked
    }

    // Verify password
    console.log(`[UserDatabase] Verifying password for: ${email}`);
    const passwordValid = verifyPassword(password, user.passwordHash);
    console.log(`[UserDatabase] Password verification result: ${passwordValid}`);

    if (!passwordValid) {
      // Increment failed attempts
      user.failedLoginAttempts++;
      console.error(`[UserDatabase] Invalid password for ${email}. Failed attempts: ${user.failedLoginAttempts}`);

      // Lock account after 5 failed attempts for 15 minutes
      if (user.failedLoginAttempts >= 5) {
        user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
        console.error(`[UserDatabase] Account locked due to failed attempts: ${email}`);
      }

      this.users.set(email, user);
      this.saveUsers();
      return null;
    }

    // Successful login - reset failed attempts
    console.log(`[UserDatabase] ✅ Authentication successful for: ${email}`);
    user.failedLoginAttempts = 0;
    user.lockedUntil = undefined;
    user.lastLogin = new Date();
    this.users.set(email, user);
    this.saveUsers();

    return user;
  }

  getUserByEmail(email: string): UserCredential | null {
    return this.users.get(email) || null;
  }

  getUserById(id: string): UserCredential | null {
    return Array.from(this.users.values()).find((u) => u.id === id) || null;
  }

  updateUser(email: string, updates: Partial<UserCredential>): boolean {
    const user = this.users.get(email);
    if (!user) return false;

    this.users.set(email, { ...user, ...updates });
    this.saveUsers();
    return true;
  }

  changePassword(email: string, oldPassword: string, newPassword: string): boolean {
    const user = this.users.get(email);
    if (!user) return false;

    if (!verifyPassword(oldPassword, user.passwordHash)) {
      return false;
    }

    user.passwordHash = hashPassword(newPassword);
    this.users.set(email, user);
    this.saveUsers();
    return true;
  }

  deleteUser(email: string): boolean {
    const deleted = this.users.delete(email);
    if (deleted) {
      this.saveUsers();
    }
    return deleted;
  }

  getAllUsers(): UserCredential[] {
    return Array.from(this.users.values());
  }

  isAccountLocked(email: string): { locked: boolean; remainingMinutes?: number } {
    const user = this.users.get(email);
    if (!user || !user.lockedUntil) {
      return { locked: false };
    }

    const now = new Date();
    if (now < user.lockedUntil) {
      const remainingMs = user.lockedUntil.getTime() - now.getTime();
      const remainingMinutes = Math.ceil(remainingMs / 1000 / 60);
      return { locked: true, remainingMinutes };
    }

    return { locked: false };
  }
}

export const userDatabase = new UserDatabase();
