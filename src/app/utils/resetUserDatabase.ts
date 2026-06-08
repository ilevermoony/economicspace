/**
 * Utility to reset user database
 * Run this in browser console if login not working:
 *
 * import { resetUserDatabase } from './app/utils/resetUserDatabase'
 * resetUserDatabase()
 */

export function resetUserDatabase() {
  console.log('[Reset] Clearing users database...');
  localStorage.removeItem('users_database');
  console.log('[Reset] ✅ Users database cleared');
  console.log('[Reset] Please refresh the page to reinitialize default users');

  // Also clear any session data
  localStorage.removeItem('secure_session');
  console.log('[Reset] ✅ Session data cleared');

  return 'Database reset successful. Please refresh the page.';
}

// Make it globally available for debugging
if (typeof window !== 'undefined') {
  (window as any).resetUserDatabase = resetUserDatabase;
  console.log('[Reset] Global function available: window.resetUserDatabase()');
}
