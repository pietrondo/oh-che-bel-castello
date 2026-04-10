import React, { useEffect, useState } from 'react';

interface Notification {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  icon: string;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onDismiss: (id: number) => void;
}

export function NotificationSystem({ notifications, onDismiss }: NotificationSystemProps) {
  return (
    <div className="notification-container">
      {notifications.map(n => (
        <div
          key={n.id}
          className={`notification notification-${n.type}`}
          onClick={() => onDismiss(n.id)}
        >
          <span className="notification-icon">
            {n.icon.startsWith('/') ? (
              <img src={n.icon} alt="" style={{ width: 20, height: 20 }} />
            ) : (
              <span>{n.icon}</span>
            )}
          </span>
          <span className="notification-message">{n.message}</span>
        </div>
      ))}
    </div>
  );
}

export function useGameNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [idCounter, setIdCounter] = useState(0);

  const addNotification = (message: string, type: Notification['type'] = 'info', icon: string = '📢') => {
    const id = idCounter;
    setNotifications(prev => [...prev, { id, message, type, icon }]);
    setIdCounter(prev => prev + 1);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const dismissNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return { notifications, addNotification, dismissNotification };
}
