import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import adminService from '../../services/adminService';
import { Users, Building2, Briefcase, FileText, TrendingUp, Clock, CheckCircle2, BarChart3 } from 'lucide-react';

export const AdminStatistics = () => {
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
        setError('Unable to load statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Platform Statistics">
        <Loader message="Loading statistics..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Platform Statistics">
        <ErrorState title="Error" message={error} onRetry={() => window.location.reload()} />
      </DashboardLayout>
    );
  }

  const userStats = [
    { label: 'Total Users', value: stats?.users?.total || 0, icon: Users, color: 'var(--color-brand)', bg: 'var(--color-brand-subtle)' },
    { label: 'Job Seekers', value: stats?.users?.seekers || 0, icon: Users, color: 'var(--color-info)', bg: 'var(--color-info-bg)' },
    { label: 'Companies', value: stats?.users?.companies || 0, icon: Building2, color: 'var(--color-success)', bg: 'var(--color-success-bg)' },
  ];

  const companyStats = [
    { label: 'Pending Approval', value: stats?.companies?.pending || 0, icon: Clock, color: 'var(--color-warning)', bg: 'var(--color-warning-bg)' },
    { label: 'Approved', value: stats?.companies?.approved || 0, icon: CheckCircle2, color: 'var(--color-success)', bg: 'var(--color-success-bg)' },
  ];

  const jobStats = [
    { label: 'Total Jobs', value: stats?.jobs?.total || 0, icon: Briefcase, color: 'var(--color-primary)', bg: '#f1f5f9' },
    { label: 'Active Jobs', value: stats?.jobs?.active || 0, icon: TrendingUp, color: 'var(--color-success)', bg: 'var(--color-success-bg)' },
  ];

  const appStats = [
    { label: 'Total Applications', value: stats?.applications?.total || 0, icon: FileText, color: 'var(--color-brand)', bg: 'var(--color-brand-subtle)' },
  ];

  return (
    <DashboardLayout title="Platform Statistics" subtitle="Detailed analytics and metrics for the entire platform.">
      {/* User Statistics */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={20} /> User Statistics
        </h3>
        <div className="grid-3">
          {userStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>{stat.value}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Company Statistics */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building2 size={20} /> Company Statistics
        </h3>
        <div className="grid-2">
          {companyStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>{stat.value}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Job Statistics */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Briefcase size={20} /> Job Statistics
        </h3>
        <div className="grid-2">
          {jobStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>{stat.value}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Application Statistics */}
      <div className="card">
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 size={20} /> Application Statistics
        </h3>
        <div className="grid-2">
          {appStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>{stat.value}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminStatistics;
