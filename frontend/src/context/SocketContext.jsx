import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import notificationService from '../services/notificationService';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const socketRef = useRef(null);

  // Fetch initial notifications when authenticated
  const loadNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await notificationService.getNotifications();
      if (res.success && Array.isArray(res.data)) {
        setRecentNotifications(res.data);
        const unread = res.data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch {
      // Notification fetch error silently ignored or retried later
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
      }
      setUnreadCount(0);
      setRecentNotifications([]);
      return;
    }

    loadNotifications();

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl, {
      auth: { token },
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      // Socket connected
    });

    // Real-time notification event from backend sendToUser(userId, 'notification', notification)
    newSocket.on('notification', (notification) => {
      setRecentNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Toast alert
      toast.success(notification.title || 'New Notification', {
        icon: '🔔',
        duration: 5000,
      });
    });

    newSocket.on('connect_error', () => {
      // Socket connection error handled gracefully
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, token]);

  const markAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setRecentNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  const markSingleRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setRecentNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Ignore
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        unreadCount,
        recentNotifications,
        refreshNotifications: loadNotifications,
        markAllRead,
        markSingleRead,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export default SocketContext;
