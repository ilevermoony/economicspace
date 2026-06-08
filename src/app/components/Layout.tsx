import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  DollarSign,
  Settings,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Menu,
  X,
  GraduationCap,
  BarChart3,
  Clock,
  MapPin,
  MessageSquare,
  Shield,
  Upload,
} from 'lucide-react';
import logo from '../../imports/Logo_Baru_-_White__1_.png';
import { NotificationPanel } from './NotificationPanel';
import { SessionTimeout } from './SessionTimeout';
import { notifications as allNotifications } from '../data/mockData';

const menuItemsByRole = {
  tutee: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/tutee/dashboard' },
    { icon: Calendar, label: 'Pesan Tutoring', path: '/tutee/book' },
    { icon: Clock, label: 'Sesi Saya', path: '/tutee/sessions' },
    { icon: FileText, label: 'Materi', path: '/tutee/materials' },
    { icon: MessageSquare, label: 'Umpan Balik', path: '/tutee/feedback' },
  ],
  tutor: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/tutor/dashboard' },
    { icon: Calendar, label: 'Jadwal Saya', path: '/tutor/schedule' },
    { icon: Users, label: 'Mahasiswa', path: '/tutor/students' },
    { icon: FileText, label: 'Materi', path: '/tutor/materials' },
    { icon: MapPin, label: 'Lokasi', path: '/tutor/locations' },
    { icon: Upload, label: 'Bukti Pelaksanaan', path: '/tutor/evidence' },
  ],
  admin: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: DollarSign, label: 'Verifikasi Pembayaran', path: '/admin/payments' },
    { icon: Upload, label: 'Verifikasi Bukti', path: '/admin/evidence' },
    { icon: Users, label: 'Tutor', path: '/admin/tutors' },
    { icon: GraduationCap, label: 'Mahasiswa', path: '/admin/students' },
    { icon: Calendar, label: 'Sesi', path: '/admin/sessions' },
    { icon: FileText, label: 'Materi', path: '/admin/materials' },
    { icon: DollarSign, label: 'Penggajian', path: '/admin/payroll' },
    { icon: Shield, label: 'Security Logs', path: '/admin/security' },
  ],
  principal: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/principal/dashboard' },
    { icon: BarChart3, label: 'Analitik', path: '/principal/analytics' },
    { icon: DollarSign, label: 'Pendapatan', path: '/principal/revenue' },
    { icon: Users, label: 'Kinerja', path: '/principal/performance' },
  ],
};

export function Layout() {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const menuItems = menuItemsByRole[user.role];

  // Get unread notification count for current user
  const userNotifications = allNotifications.filter((n) => n.userRole === user.role);
  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRoleSwitch = (role: typeof user.role) => {
    switchRole(role);
    navigate(`/${role}/dashboard`);
    setProfileOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white border-r border-gray-200 w-64`}
      >
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
          <img src={logo} alt="Economic Space Logo" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="font-bold text-lg text-gray-900">Economic Space</h1>
            <p className="text-xs text-gray-500">Unlock Your Academic Potential</p>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={() => navigate('/settings')}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Pengaturan</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-0'} transition-margin`}>
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari..."
                  className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-700" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <p className="font-medium text-sm text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Ganti Peran</p>
                    </div>
                    {(['tutee', 'tutor', 'admin', 'principal'] as const).map((role) => (
                      <button
                        key={role}
                        onClick={() => handleRoleSwitch(role)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                          user.role === role ? 'bg-primary/10 text-primary' : 'text-gray-700'
                        }`}
                      >
                        <span className="capitalize">{role}</span>
                      </button>
                    ))}
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Notification Panel */}
      <NotificationPanel isOpen={notificationOpen} onClose={() => setNotificationOpen(false)} />

      {/* Session Timeout Monitor */}
      <SessionTimeout />
    </div>
  );
}
