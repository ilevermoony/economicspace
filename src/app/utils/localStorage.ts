// Local Storage Utility for Economic Space
// Provides persistent storage for all application data

const STORAGE_PREFIX = 'economic_space_';

export const StorageKeys = {
  TUTORS: `${STORAGE_PREFIX}tutors`,
  STUDENTS: `${STORAGE_PREFIX}students`,
  BOOKINGS: `${STORAGE_PREFIX}bookings`,
  SESSIONS: `${STORAGE_PREFIX}sessions`,
  MATERIALS: `${STORAGE_PREFIX}materials`,
  PAYROLL: `${STORAGE_PREFIX}payroll`,
  AVAILABILITY: `${STORAGE_PREFIX}availability`,
  LOCATIONS: `${STORAGE_PREFIX}locations`,
  SESSION_COMPLETIONS: `${STORAGE_PREFIX}session_completions`,
  NOTIFICATIONS: `${STORAGE_PREFIX}notifications`,
  SESSION_EVIDENCES: `${STORAGE_PREFIX}session_evidences`,
} as const;

export const storage = {
  // Generic get method
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return null;
    }
  },

  // Generic set method
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
    }
  },

  // Remove item
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  },

  // Clear all app data
  clearAll(): void {
    Object.values(StorageKeys).forEach((key) => {
      localStorage.removeItem(key);
    });
  },

  // Check if data exists
  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  },
};
