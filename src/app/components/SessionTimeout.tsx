import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { SESSION_IDLE_TIMEOUT } from '../utils/security';
import { Clock } from 'lucide-react';

const WARNING_TIME = 2 * 60 * 1000; // Show warning 2 minutes before timeout

export function SessionTimeout() {
  const { user, isSessionValid, refreshUserSession, logout } = useAuth();
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const handleActivity = useCallback(() => {
    setLastActivity(Date.now());
    setShowWarning(false);
  }, []);

  useEffect(() => {
    if (!user) return;

    // Track user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, handleActivity));

    return () => {
      events.forEach((event) => window.removeEventListener(event, handleActivity));
    };
  }, [user, handleActivity]);

  useEffect(() => {
    if (!user) return;

    const checkIdleTime = setInterval(() => {
      const idleTime = Date.now() - lastActivity;
      const timeUntilTimeout = SESSION_IDLE_TIMEOUT - idleTime;

      // Show warning if approaching timeout
      if (timeUntilTimeout <= WARNING_TIME && timeUntilTimeout > 0) {
        setShowWarning(true);
        setCountdown(Math.ceil(timeUntilTimeout / 1000));
      }

      // Logout if timeout reached
      if (timeUntilTimeout <= 0) {
        logout();
        navigate('/login', { state: { sessionExpired: true } });
      }
    }, 1000);

    return () => clearInterval(checkIdleTime);
  }, [user, lastActivity, logout, navigate]);

  const handleContinue = () => {
    refreshUserSession();
    handleActivity();
  };

  if (!user) return null;

  return (
    <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            Sesi Akan Berakhir
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Sesi Anda akan berakhir dalam <strong className="text-orange-600">{countdown} detik</strong>{' '}
              karena tidak ada aktivitas.
            </p>
            <p>Klik tombol di bawah untuk melanjutkan sesi Anda.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleContinue} className="bg-[#915D16] hover:bg-[#7A4D12]">
            Lanjutkan Sesi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
