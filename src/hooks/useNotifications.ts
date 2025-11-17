import { useState, useEffect } from 'react';

export interface Notification {
  id: string;
  type: 'order_status' | 'locker' | 'package' | 'system';
  title: string;
  message: string;
  orderId?: string;
  lockerId?: string;
  status?: string;
  read: boolean;
  createdAt: string;
}

const NOTIFICATIONS_STORAGE_KEY = 'user_notifications';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (stored) {
      setNotifications(JSON.parse(stored));
    }
  }, []);

  const saveNotifications = (newNotifications: Notification[]) => {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(newNotifications));
    setNotifications(newNotifications);
  };

  const addNotification = (
    type: Notification['type'],
    title: string,
    message: string,
    metadata?: { orderId?: string; lockerId?: string; status?: string }
  ): Notification => {
    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      orderId: metadata?.orderId,
      lockerId: metadata?.lockerId,
      status: metadata?.status,
      read: false,
      createdAt: new Date().toISOString(),
    };

    const newNotifications = [notification, ...notifications];
    saveNotifications(newNotifications);
    return notification;
  };

  const markAsRead = (notificationId: string) => {
    const newNotifications = notifications.map(notif =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    saveNotifications(newNotifications);
  };

  const markAllAsRead = () => {
    const newNotifications = notifications.map(notif => ({ ...notif, read: true }));
    saveNotifications(newNotifications);
  };

  const deleteNotification = (notificationId: string) => {
    const newNotifications = notifications.filter(notif => notif.id !== notificationId);
    saveNotifications(newNotifications);
  };

  const clearAllNotifications = () => {
    localStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);
    setNotifications([]);
  };

  const getUnreadCount = () => {
    return notifications.filter(notif => !notif.read).length;
  };

  const getNotificationsByType = (type: Notification['type']) => {
    return notifications.filter(notif => notif.type === type);
  };

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getUnreadCount,
    getNotificationsByType,
  };
};
