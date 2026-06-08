import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth, UserRole } from '../context/AuthContext';
import { Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import logo from '../../imports/Logo_Baru_-_White__1_.png';
import { SecureInput } from '../components/SecureInput';
import { isValidEmail, validatePasswordStrength } from '../utils/security';
import { userDatabase } from '../utils/userDatabase';
import { Alert, AlertDescription } from '../components/ui/alert';

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('tutee');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Quick login helper
  const quickLogin = (demoEmail: string, demoPassword: string, demoRole: UserRole) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setRole(demoRole);
    setIsLogin(true);
    setError('');
    setSuccess('');

    // Auto submit after a brief delay
    setTimeout(() => {
      const result = login(demoEmail, demoPassword);
      if (result.success && result.user) {
        setSuccess('Login berhasil! Mengalihkan...');
        setTimeout(() => {
          navigate(`/${result.user!.role}/dashboard`);
        }, 500);
      } else {
        setError(result.error || 'Login gagal. Silakan coba lagi.');
      }
    }, 100);
  };

  // Check if session expired
  React.useEffect(() => {
    const state = location.state as any;
    if (state?.sessionExpired) {
      setError('Sesi Anda telah berakhir. Silakan login kembali.');
    }
  }, [location]);

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (!isLogin && value) {
      const validation = validatePasswordStrength(value);
      setPasswordErrors(validation.errors);
    } else {
      setPasswordErrors([]);
    }
  };

  const validateForm = (): boolean => {
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Email dan password harus diisi.');
      return false;
    }

    if (!isValidEmail(email)) {
      setError('Format email tidak valid.');
      return false;
    }

    if (!isLogin) {
      if (!name) {
        setError('Nama lengkap harus diisi.');
        return false;
      }

      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        setError('Password tidak memenuhi persyaratan keamanan.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        // Login
        const result = login(email, password);

        if (result.success && result.user) {
          setSuccess('Login berhasil! Mengalihkan...');
          setTimeout(() => {
            const from = (location.state as any)?.from?.pathname || `/${result.user!.role}/dashboard`;
            navigate(from);
          }, 500);
        } else {
          setError(result.error || 'Login gagal. Silakan coba lagi.');
        }
      } else {
        // Register
        const existingUser = userDatabase.getUserByEmail(email);
        if (existingUser) {
          setError('Email sudah terdaftar. Silakan gunakan email lain atau login.');
          return;
        }

        const newUser = userDatabase.createUser(email, password, role, name);
        if (newUser) {
          setSuccess('Registrasi berhasil! Silakan login.');
          setIsLogin(true);
          setPassword('');
        } else {
          setError('Registrasi gagal. Silakan coba lagi.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F3ED] via-white to-[#F0F9F7] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <img src={logo} alt="Economic Space Logo" className="w-14 h-14 object-contain" />
            <h1 className="font-bold text-2xl text-gray-900">Economic Space</h1>
          </div>
          <p className="text-gray-600">Unlock Your Academic Potential</p>
        </div>

        {/* Login/Register Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                isLogin
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                !isLogin
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Daftar
            </button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                  <SecureInput
                    type="text"
                    value={name}
                    onChange={setName}
                    className="pl-10"
                    placeholder="Nama Anda"
                    required
                    maxLength={100}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <SecureInput
                  type="email"
                  value={email}
                  onChange={setEmail}
                  className="pl-10"
                  placeholder="anda@universitas.ac.id"
                  required
                  maxLength={100}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <SecureInput
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="pl-10 pr-10"
                  placeholder="••••••••"
                  required
                  sanitize={false}
                  showPasswordToggle={true}
                />
              </div>

              {!isLogin && passwordErrors.length > 0 && (
                <div className="mt-2 space-y-1">
                  {passwordErrors.map((err, idx) => (
                    <p key={idx} className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {err}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isLogin ? 'Masuk sebagai' : 'Daftar sebagai'}
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="tutee">Mahasiswa</option>
                <option value="tutor">Tutor</option>
                <option value="admin">Administrator</option>
                <option value="principal">Principal / Pemilik</option>
              </select>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-600">Ingat saya</span>
                </label>
                <button type="button" className="text-primary hover:text-primary/80">
                  Lupa kata sandi?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Memproses...' : isLogin ? 'Masuk' : 'Buat Akun'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <div className="space-y-2">
              <p className="font-medium text-gray-700">Akun Demo - Klik untuk Login Cepat:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => quickLogin('tutee@economicspace.com', 'Tutee@123', 'tutee')}
                  className="p-2 bg-gray-50 rounded hover:bg-blue-50 hover:border-blue-300 border border-transparent transition-colors text-left"
                >
                  <p className="font-medium text-blue-600">Tutee</p>
                  <p>tutee@economicspace.com</p>
                  <p className="text-gray-500">Tutee@123</p>
                </button>
                <button
                  type="button"
                  onClick={() => quickLogin('tutor@economicspace.com', 'Tutor@123', 'tutor')}
                  className="p-2 bg-gray-50 rounded hover:bg-green-50 hover:border-green-300 border border-transparent transition-colors text-left"
                >
                  <p className="font-medium text-green-600">Tutor</p>
                  <p>tutor@economicspace.com</p>
                  <p className="text-gray-500">Tutor@123</p>
                </button>
                <button
                  type="button"
                  onClick={() => quickLogin('admin@economicspace.com', 'Admin@123', 'admin')}
                  className="p-2 bg-gray-50 rounded hover:bg-orange-50 hover:border-orange-300 border border-transparent transition-colors text-left"
                >
                  <p className="font-medium text-orange-600">Admin</p>
                  <p>admin@economicspace.com</p>
                  <p className="text-gray-500">Admin@123</p>
                </button>
                <button
                  type="button"
                  onClick={() => quickLogin('principal@economicspace.com', 'Principal@123', 'principal')}
                  className="p-2 bg-gray-50 rounded hover:bg-purple-50 hover:border-purple-300 border border-transparent transition-colors text-left"
                >
                  <p className="font-medium text-purple-600">Principal</p>
                  <p>principal@economicspace.com</p>
                  <p className="text-gray-500">Principal@123</p>
                </button>
              </div>

              <div className="mt-4 p-2 bg-blue-50 border border-blue-200 rounded">
                <p className="text-xs text-blue-700 mb-2">
                  <strong>Login bermasalah?</strong> Reset database:
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Reset user database? Ini akan menghapus semua user dan membuat ulang akun demo. Lanjutkan?')) {
                      localStorage.removeItem('users_database');
                      localStorage.removeItem('secure_session');
                      window.location.reload();
                    }
                  }}
                  className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Reset Database
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            ← Kembali ke beranda
          </button>
        </div>
      </div>
    </div>
  );
}
