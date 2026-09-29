import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import Button from '../../components/common/Button';
import notificationService from '../../services/notificationService';
import { useSocket } from '../../hooks/useSocket';
import { formatRelativeTime } from '../../utils/formatDate';
import { Bell, Check, CheckCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { refreshNotifications } = useSocket();

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await notificationService.getNotifications();
      if (res.success && Array.isArray(res.data)) {
        setNotifications(res.data);
      }
    } catch {
      setError('Unable to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      refreshNotifications();
      toast.success('All notifications marked as read.');
    } catch {
      toast.error('Failed to update notifications.');
    }
  };

  const handleMarkSingle = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      refreshNotifications();
    } catch {
      // Ignore
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <DashboardLayout
      title="Notifications"
      subtitle="Stay informed about application progress, status changes, and announcements."
      actions={
        unreadCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            icon={CheckCheck}
            onClick={handleMarkAllRead}
          >
            Mark All Read ({unreadCount})
          </Button>
        )
      }
    >
      {loading ? (
        <Loader message="Loading your notifications..." />
      ) : error ? (
        <ErrorState title="Error" message={error} onRetry={fetchNotifications} />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          description="You will receive alerts here when companies review your applications."
        />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => !notif.isRead && handleMarkSingle(notif.id)}
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--color-border-light)',
                backgroundColor: notif.isRead ? '#ffffff' : '#f0f9ff',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1rem',
                cursor: notif.isRead ? 'default' : 'pointer',
                transition: 'background-color 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: notif.isRead ? '#f1f5f9' : 'var(--color-brand-subtle)',
                    color: notif.isRead ? 'var(--color-text-muted)' : 'var(--color-brand)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '0.125rem',
                  }}
                >
                  <Bell size={18} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: notif.isRead ? 'var(--color-text)' : 'var(--color-brand-hover)' }}>
                      {notif.title}
                    </h4>
                    {!notif.isRead && (
                      <span className="badge badge-info" style={{ fontSize: '0.625rem' }}>
                        New
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    {notif.message}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginTop: '0.5rem', display: 'block' }}>
                    {formatRelativeTime(notif.createdAt)}
                  </span>
                </div>
              </div>

              {!notif.isRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkSingle(notif.id);
                  }}
                  style={{
                    background: 'none',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    flexShrink: 0,
                  }}
                >
                  <Check size={12} /> Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default NotificationsPage;
