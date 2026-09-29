import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import applicationService from '../../services/applicationService';
import bookmarkService from '../../services/bookmarkService';
import userService from '../../services/userService';
import { formatDate } from '../../utils/formatDate';
import {
  FileText,
  Bookmark,
  CheckCircle2,
  Clock,
  User,
  ArrowRight,
  Upload,
} from 'lucide-react';

export const SeekerDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profRes, appRes, bookRes] = await Promise.allSettled([
        userService.getProfile(),
        applicationService.getMyApplications({ limit: 5 }),
        bookmarkService.getBookmarks(),
      ]);

      if (profRes.status === 'fulfilled' && profRes.value.success) {
        setProfile(profRes.value.data);
      }
      if (appRes.status === 'fulfilled' && appRes.value.success) {
        setApplications(appRes.value.data || []);
      }
      if (bookRes.status === 'fulfilled' && bookRes.value.success) {
        setBookmarks(bookRes.value.data || []);
      }
    } catch {
      setError('Unable to load seeker dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const pendingCount = applications.filter((a) => a.status === 'PENDING').length;
  const acceptedCount = applications.filter((a) => a.status === 'ACCEPTED').length;

  return (
    <DashboardLayout
      title={`Welcome back${profile?.fullName ? `, ${profile.fullName}` : ''}`}
      subtitle="Track your applications, saved jobs, and profile status."
      actions={
        <Link to="/jobs">
          <Button variant="primary" size="sm">
            Search Openings
          </Button>
        </Link>
      }
    >
      {loading ? (
        <Loader message="Loading dashboard metrics..." />
      ) : error ? (
        <ErrorState title="Error Loading Dashboard" message={error} onRetry={fetchDashboardData} />
      ) : (
        <div>
          {/* Profile Warning if Incomplete */}
          {!profile && (
            <div
              style={{
                backgroundColor: 'var(--color-warning-bg)',
                border: '1px solid var(--color-warning-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem 1.5rem',
                marginBottom: '1.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <h4 style={{ color: 'var(--color-warning)', fontWeight: 700, fontSize: '0.9375rem' }}>
                  Complete Your Profile & Upload Resume
                </h4>
                <p style={{ color: '#92400e', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  Employers review candidate profiles and resumes during application screenings.
                </p>
              </div>
              <Link to="/seeker/profile">
                <Button variant="secondary" size="sm" icon={User}>
                  Set Up Profile
                </Button>
              </Link>
            </div>
          )}

          {/* Metric Cards */}
          <div className="grid-4" style={{ marginBottom: '2rem' }}>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                  Total Applications
                </span>
                <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: 'var(--color-brand-subtle)', color: 'var(--color-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={16} />
                </div>
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                {applications.length}
              </h3>
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                  Pending Reviews
                </span>
                <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={16} />
                </div>
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-warning)' }}>
                {pendingCount}
              </h3>
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                  Accepted Offers
                </span>
                <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={16} />
                </div>
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-success)' }}>
                {acceptedCount}
              </h3>
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                  Saved Jobs
                </span>
                <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#f1f5f9', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bookmark size={16} />
                </div>
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                {bookmarks.length}
              </h3>
            </div>
          </div>

          {/* Recent Applications Section */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                  Recent Applications
                </h3>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                  Your most recent job and internship submissions
                </span>
              </div>
              <Link to="/seeker/applications" style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                View All <ArrowRight size={13} />
              </Link>
            </div>

            {applications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                You haven't submitted any applications yet.{' '}
                <Link to="/jobs" style={{ fontWeight: 600 }}>Explore openings</Link> to apply.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Company</th>
                      <th>Applied Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.slice(0, 5).map((app) => (
                      <tr key={app.id}>
                        <td>
                          <Link to={`/jobs/${app.job?.id}`} style={{ fontWeight: 600, color: 'inherit' }}>
                            {app.job?.title}
                          </Link>
                        </td>
                        <td>{app.job?.company?.name || 'N/A'}</td>
                        <td style={{ color: 'var(--color-text-muted)' }}>
                          {formatDate(app.appliedAt)}
                        </td>
                        <td>
                          <StatusBadge status={app.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SeekerDashboard;
