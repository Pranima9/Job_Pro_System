import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import StatusBadge from '../../components/common/StatusBadge';
import adminService from '../../services/adminService';
import { Users, Building2, Briefcase, FileText, Clock, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await adminService.getStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch {
        setError('Unable to load platform statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Admin Dashboard">
        <Loader message="Loading platform statistics..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Admin Dashboard">
        <ErrorState title="Error Loading Dashboard" message={error} onRetry={() => window.location.reload()} />
      </DashboardLayout>
    );
  }

  const statCards = [
    { icon: Users, label: 'Total Users', value: stats?.users?.total || 0, color: 'var(--color-brand)', bg: 'var(--color-brand-subtle)' },
    { icon: Users, label: 'Seekers', value: stats?.users?.seekers || 0, color: 'var(--color-info)', bg: 'var(--color-info-bg)' },
    { icon: Building2, label: 'Companies', value: stats?.users?.companies || 0, color: 'var(--color-success)', bg: 'var(--color-success-bg)' },
    { icon: Clock, label: 'Pending Approvals', value: stats?.companies?.pending || 0, color: 'var(--color-warning)', bg: 'var(--color-warning-bg)' },
    { icon: Briefcase, label: 'Total Jobs', value: stats?.jobs?.total || 0, color: 'var(--color-primary)', bg: '#f1f5f9' },
    { icon: CheckCircle2, label: 'Active Jobs', value: stats?.jobs?.active || 0, color: 'var(--color-success)', bg: 'var(--color-success-bg)' },
    { icon: FileText, label: 'Applications', value: stats?.applications?.total || 0, color: 'var(--color-brand)', bg: 'var(--color-brand-subtle)' },
    { icon: TrendingUp, label: 'Approved Companies', value: stats?.companies?.approved || 0, color: 'var(--color-success)', bg: 'var(--color-success-bg)' },
  ];

  return (
    <DashboardLayout
      title="Platform Overview"
      subtitle="Monitor platform activity, user growth, and content moderation."
    >
      {/* Stats Grid */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>{stat.label}</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} />
                </div>
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>{stat.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/companies" className="btn btn-primary btn-sm">
            <Building2 size={14} /> Review Companies
          </Link>
          <Link to="/admin/users" className="btn btn-secondary btn-sm">
            <Users size={14} /> Manage Users
          </Link>
          <Link to="/admin/jobs" className="btn btn-secondary btn-sm">
            <Briefcase size={14} /> Manage Jobs
          </Link>
          <Link to="/admin/statistics" className="btn btn-secondary btn-sm">
            <TrendingUp size={14} /> View Statistics
          </Link>
        </div>
      </div>

      {/* Pending Approvals Alert */}
      {stats?.companies?.pending > 0 && (
        <div style={{ backgroundColor: 'var(--color-warning-bg)', border: '1px solid var(--color-warning-border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={20} style={{ color: 'var(--color-warning)' }} />
            <div>
              <h4 style={{ color: 'var(--color-warning)', fontWeight: 700, fontSize: '0.9375rem' }}>
                {stats.companies.pending} Company(ies) Pending Approval
              </h4>
              <p style={{ color: '#92400e', fontSize: '0.875rem' }}>Review and approve new company registrations.</p>
            </div>
          </div>
          <Link to="/admin/companies">
            <span className="btn btn-primary btn-sm">Review Now</span>
          </Link>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
