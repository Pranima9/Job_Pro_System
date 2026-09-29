import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import applicationService from '../../services/applicationService';
import { formatDate } from '../../utils/formatDate';
import { FileText, Building2, MapPin, ExternalLink, Download } from 'lucide-react';

export const MyApplications = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentPage = parseInt(searchParams.get('page') || '1');

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await applicationService.getMyApplications({ page: currentPage, limit: 10 });
      if (res.success) {
        setApplications(res.data || []);
        setPagination(res.pagination || null);
      }
    } catch {
      setError('Unable to load your applications.');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const getFullResumeUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    return `${socketUrl}${path}`;
  };

  return (
    <DashboardLayout
      title="My Applications"
      subtitle="Monitor the review status of your active job and internship applications."
      actions={
        <Link to="/jobs" className="btn btn-primary btn-sm">
          Browse More Jobs
        </Link>
      }
    >
      {loading ? (
        <Loader message="Loading your submitted applications..." />
      ) : error ? (
        <ErrorState title="Error Loading Applications" message={error} onRetry={fetchApplications} />
      ) : applications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No applications submitted yet"
          description="You haven't submitted applications to any employers yet. Browse openings to apply."
          action={
            <Link to="/jobs" className="btn btn-primary btn-sm">
              Explore Open Jobs
            </Link>
          }
        />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Job Opening</th>
                  <th>Company</th>
                  <th>Role Type</th>
                  <th>Submitted Date</th>
                  <th>Custom Resume</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div>
                        <Link to={`/jobs/${app.job?.id}`} style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>
                          {app.job?.title}
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
                          <MapPin size={12} />
                          <span>{app.job?.location}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Link to={`/companies/${app.job?.company?.id}`} style={{ color: 'inherit', fontWeight: 500 }}>
                        {app.job?.company?.name || 'N/A'}
                      </Link>
                    </td>
                    <td>
                      <StatusBadge status={app.job?.type} />
                    </td>
                    <td style={{ color: 'var(--color-text-muted)' }}>
                      {formatDate(app.appliedAt)}
                    </td>
                    <td>
                      {app.resumeUrl ? (
                        <a
                          href={getFullResumeUrl(app.resumeUrl)}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.75rem',
                            color: 'var(--color-brand)',
                            fontWeight: 500,
                          }}
                        >
                          <Download size={13} /> Attached
                        </a>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Profile Resume</span>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={app.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ padding: '0 1.5rem 1rem' }}>
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyApplications;
