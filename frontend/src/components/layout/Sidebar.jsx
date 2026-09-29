import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FileText,
  Bookmark,
  Bell,
  Building2,
  Briefcase,
  PlusCircle,
  Users,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = () => {
  const { role, isCompany, companyStatus } = useAuth();

  const seekerLinks = [
    { to: '/seeker/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/seeker/profile', label: 'My Profile', icon: User },
    { to: '/seeker/applications', label: 'My Applications', icon: FileText },
    { to: '/seeker/bookmarks', label: 'Saved Jobs', icon: Bookmark },
    { to: '/seeker/notifications', label: 'Notifications', icon: Bell },
  ];

  const companyLinks = [
    { to: '/company/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/company/profile', label: 'Company Profile', icon: Building2 },
    { to: '/company/jobs', label: 'Job Postings', icon: Briefcase },
    { to: '/company/jobs/create', label: 'Post New Job', icon: PlusCircle },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Platform Stats', icon: LayoutDashboard },
    { to: '/admin/companies', label: 'Company Approvals', icon: Building2 },
    { to: '/admin/users', label: 'User Directory', icon: Users },
    { to: '/admin/jobs', label: 'Job Listings', icon: Briefcase },
  ];

  const getLinks = () => {
    if (role === 'SEEKER') return seekerLinks;
    if (role === 'COMPANY') return companyLinks;
    if (role === 'ADMIN') return adminLinks;
    return [];
  };

  const links = getLinks();

  return (
    <aside
      style={{
        width: '240px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid var(--color-border)',
        minHeight: 'calc(100vh - 64px)',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem',
        flexShrink: 0,
      }}
      className="dashboard-sidebar"
    >
      <div style={{ padding: '0 0.5rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-subtle)' }}>
        {role} Workspace
      </div>

      {isCompany && companyStatus === 'PENDING' && (
        <div
          style={{
            padding: '0.75rem',
            backgroundColor: 'var(--color-warning-bg)',
            border: '1px solid var(--color-warning-border)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '0.75rem',
            fontSize: '0.75rem',
            color: 'var(--color-warning)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <ShieldAlert size={16} />
          <span>Pending Admin Approval</span>
        </div>
      )}

      {links.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to.endsWith('/dashboard')}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.625rem 0.875rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: isActive ? 'var(--color-brand)' : 'var(--color-text)',
              backgroundColor: isActive ? 'var(--color-brand-subtle)' : 'transparent',
              transition: 'all 0.15s ease',
            })}
          >
            <Icon size={18} />
            <span>{link.label}</span>
          </NavLink>
        );
      })}
    </aside>
  );
};

export default Sidebar;
