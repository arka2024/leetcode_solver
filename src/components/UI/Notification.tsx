import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Notification() {
  const { notifications, removeNotification } = useNotification();

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-200',
    error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-200',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-200',
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-200',
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {notifications.map((notification) => {
        const Icon = icons[notification.type];
        return (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border shadow-lg max-w-sm animate-in slide-in-from-right duration-300 ${colors[notification.type]}`}
          >
            <div className="flex items-start space-x-3">
              <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium">{notification.title}</h4>
                {notification.message && (
                  <p className="text-sm mt-1 opacity-90">{notification.message}</p>
                )}
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}