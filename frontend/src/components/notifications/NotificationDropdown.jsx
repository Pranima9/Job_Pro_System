import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSocket } from '../../hooks/useSocket';
import { formatRelativeTime } from '../../utils/formatDate';

export const NotificationDropdown = () => {
  const { unreadCount, recentNotifications, markAllRead, markSingleRead } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          width: '38px',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-primary)',
          position: 'relative',
          cursor: 'pointer',
          backgroundColor: isOpen ? 'var(--color-surface-hover)' : 'var(--color-surface)',
        }}
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              backgroundColor: 'var(--color-danger)',
              color: '#ffffff',
              fontSize: '0.6875rem',
              fontWeight: 700,
              borderRadius: '999px',
              padding: '0.1rem 0.35rem',
              minWidth: '16px',
              textAlign: 'center',
              lineHeight: 1.2,
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '320px',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '0.875rem 1rem',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f8fafc',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-primary-dark)' }}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-brand)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <Check size={12} />
                Mark all read
              </button>
            )}
          </div>

          <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
            {recentNotifications.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                No notifications yet.
              </div>
            ) : (
              recentNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.isRead && markSingleRead(notif.id)}
                  style={{
                    padding: '0.875rem 1rem',
                    borderBottom: '1px solid var(--color-border-light)',
                    backgroundColor: notif.isRead ? '#ffffff' : '#f0f9ff',
                    cursor: notif.isRead ? 'default' : 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                    <h5 style={{ fontSize: '0.8125rem', fontWeight: 600, color: notif.isRead ? 'var(--color-primary)' : 'var(--color-brand-hover)' }}>
                      {notif.title}
                    </h5>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-subtle)' }}>
                      {formatRelativeTime(notif.createdAt)}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                    {notif.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
