import { encryptData, decryptData } from './security';

export enum SecureStorageKeys {
  USER_CREDENTIALS = 'secure_user_credentials',
  SESSION = 'secure_session',
  AUTH_TOKEN = 'secure_auth_token',
  USER_PREFERENCES = 'secure_user_preferences',
}

class SecureStorage {
  // Set encrypted data
  set<T>(key: string, value: T): void {
    try {
      const encrypted = encryptData(value);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Secure storage set error:', error);
    }
  }

  // Get decrypted data
  get<T>(key: string): T | null {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      return decryptData<T>(encrypted);
    } catch (error) {
      console.error('Secure storage get error:', error);
      return null;
    }
  }

  // Remove data
  remove(key: string): void {
    localStorage.removeItem(key);
  }

  // Clear all secure storage
  clear(): void {
    Object.values(SecureStorageKeys).forEach((key) => {
      this.remove(key);
    });
  }

  // Check if key exists
  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}

export const secureStorage = new SecureStorage();
