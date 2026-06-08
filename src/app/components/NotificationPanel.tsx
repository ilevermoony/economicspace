import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  CheckCircle,
  Calendar,
  DollarSign,
  Clock,
  BookOpen,
  Bell,
  AlertCircle,
  MessageSquare,
  BarChart3,
  TrendingUp,
  Star,
  X,
} from 'lucide-react';
import { notifications as allNotifications } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  if (!isOpen || !user) return null;

  const userNotifications = allNotifications.filter((n) => n.userRole === user.role);

  const filteredNotifications =
    filter === 'unread'
      ? userNotifications.filter((n) => !n.isRead)
      : userNotifications;

  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      'check-circle': CheckCircle,
      calendar: Calendar,
      'dollar-sign': DollarSign,
      clock: Clock,
      'book-open': BookOpen,
      bell: Bell,
      'alert-circle': AlertCircle,
      'message-square': MessageSquare,
      'bar-chart': BarChart3,
      'trending-up': TrendingUp,
      star: Star,
    };
    return icons[iconName] || Bell;
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      primary: 'bg-primary/15 text-primary',
      secondary: 'bg-secondary/10 text-secondary',
      accent: 'bg-accent/20 text-accent',
    };
    return colors[color] || 'bg-gray-100 text-gray-700';
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} menit yang lalu`;
    if (hours < 24) return `${hours} jam yang lalu`;
    return `${days} hari yang lalu`;
  };

  const handleNotificationClick = (notification: any) => {
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-16 right-6 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg text-gray-900">Notifikasi</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Belum Dibaca ({unreadCount})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => {
                const Icon = getIcon(notification.icon);
                const colorClasses = getColorClasses(notification.color);

                return (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.isRead ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClasses}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-sm text-gray-900">
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {getTimeAgo(notification.timestamp)}
                          </span>
                          {notification.actionLabel && (
                            <span className="text-xs text-primary font-medium">
                              {notification.actionLabel} →
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-bold text-lg text-gray-900 mb-2">Tidak Ada Notifikasi</h3>
              <p className="text-gray-600 text-sm">
                {filter === 'unread'
                  ? 'Semua notifikasi sudah dibaca'
                  : 'Anda tidak memiliki notifikasi'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredNotifications.length > 0 && (
          <div className="p-3 border-t border-gray-200">
            <button className="w-full text-sm text-primary hover:text-primary/80 font-medium text-center">
              Tandai Semua Sudah Dibaca
            </button>
          </div>
        )}
      </div>
    </>
  );
}
