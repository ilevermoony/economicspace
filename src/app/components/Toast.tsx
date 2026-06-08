import React from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export function ToastContainer() {
  const { toasts, removeToast } = useNotification();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-50 space-y-3 max-w-md">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  onClose: () => void;
}

function Toast({ type, title, message, onClose }: ToastProps) {
  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-accent',
      textColor: 'text-white',
      borderColor: 'border-accent',
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-600',
      textColor: 'text-white',
      borderColor: 'border-red-600',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-secondary',
      textColor: 'text-white',
      borderColor: 'border-secondary',
    },
    info: {
      icon: Info,
      bgColor: 'bg-primary',
      textColor: 'text-white',
      borderColor: 'border-primary',
    },
  };

  const { icon: Icon, bgColor, textColor, borderColor } = config[type];

  return (
    <div
      className={`${bgColor} ${textColor} rounded-xl shadow-lg border-2 ${borderColor} p-4 animate-slide-in-right flex items-start gap-3 min-w-[320px]`}
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-semibold">{title}</p>
        {message && <p className="text-sm opacity-90 mt-1">{message}</p>}
      </div>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
