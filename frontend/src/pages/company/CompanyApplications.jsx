import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import applicationService from '../../services/applicationService';
import jobService from '../../services/jobService';
import { formatDate } from '../../utils/formatDate';
import { extractApiError } from '../../utils/errorHelper';
import { FileText, Users, Mail, Phone, Download, CheckCircle2, XCircle, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

export const CompanyApplications = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [error, setError] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const currentPage = parseInt(searchParams.get('page') || '1');

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await jobService.getMyJobs({ limit: 100 });
      if (res.success) {
        setJobs(res.data || []);
        if (res.data?.length > 0 && !selectedJob) {
          setSelectedJob(res.data[0]);
        }
      }
    } catch {
      setError('Unable to load jobs.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchApplications = useCallback(async () => {
    if (!selectedJob) return;
    setLoadingApps(true);
    try {
      const res = await applicationService.getApplicantsForJob(selectedJob.id, { page: currentPage, limit: 10 });
      if (res.success) {
        setApplications(res.data || []);
        setPagination(res.pagination || null);
      }
    } catch {
      toast.error('Failed to load applications.');
    } finally {
      setLoadingApps(false);
    }
  }, [selectedJob, currentPage]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const handleViewDetails = (app) => {
    setSelectedApp(app);
    setShowDetailModal(true);
  };

  const handleUpdateStatus = async (app, status) => {
    try {
      await applicationService.updateStatus(app.id, status);
      toast.success(`Application ${status.toLowerCase()}.`);
      setApplications((prev) =>
        prev.map((a) => (a.id === app.id ? { ...a, status } : a))
      );
      setShowDetailModal(false);
    } catch (err) {
      toast.error(extractApiError(err));
    }
  };

  const getFullResumeUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    return `${socketUrl}${path}`;
  };

  return (
    <DashboardLayout title="Applications" subtitle="Review and manage candidate applications for your jobs.">
      {loading ? (
        <Loader message="Loading applications..." />
      ) : error ? (
        <ErrorState title="Error" message={error} onRetry={fetchJobs} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }} className="company-apps-layout">
          {/* Job Selector */}
          <div className="card" style={{ padding: '1rem', height: 'fit-content' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}>Select a Job</h4>
            {jobs.length === 0 ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>No jobs posted yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {jobs.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => { setSelectedJob(job); setApplications([]); }}
                    style={{
                      padding: '0.625rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: selectedJob?.id === job.id ? '2px solid var(--color-brand)' : '1px solid var(--color-border)',
                      backgroundColor: selectedJob?.id === job.id ? 'var(--color-brand-subtle)' : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: selectedJob?.id === job.id ? 600 : 400,
                      color: selectedJob?.id === job.id ? 'var(--color-brand)' : 'var(--color-text)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: '0.125rem' }}>{job.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {job._count?.applications || 0} applicants
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Applications List */}
          <div>
            {loadingApps ? (
              <Loader message="Loading applications..." />
            ) : !selectedJob ? (
              <EmptyState icon={Briefcase} title="Select a job" description="Choose a job from the list to view its applications." />
            ) : applications.length === 0 ? (
              <EmptyState icon={Users} title="No applications yet" description={`No candidates have applied for "${selectedJob.title}" yet.`} />
            ) : (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-responsive" style={{ border: 'none' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Applied Date</th>
                        <th>Resume</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr key={app.id}>
                          <td>
                            <div>
                              <div style={{ fontWeight: 600 }}>{app.user?.profile?.fullName || 'N/A'}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{app.user?.email}</div>
                            </div>
                          </td>
                          <td style={{ color: 'var(--color-text-muted)' }}>{formatDate(app.appliedAt)}</td>
                          <td>
                            {app.resumeUrl || app.user?.profile?.resumeUrl ? (
                              <a
                                href={getFullResumeUrl(app.resumeUrl || app.user?.profile?.resumeUrl)}
                                target="_blank"
                                rel="noreferrer"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--color-brand)', fontWeight: 500 }}
                              >
                                <Download size={12} /> View
                              </a>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>None</span>
                            )}
                          </td>
                          <td><StatusBadge status={app.status} /></td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
                              <Button variant="secondary" size="sm" onClick={() => handleViewDetails(app)}>
                                View
                              </Button>
                            </div>
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
          </div>
        </div>
      )}

      {/* Application Detail Modal */}
      {showDetailModal && selectedApp && (
        <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Application Details" maxWidth="600px">
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-brand-subtle)', color: 'var(--color-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.125rem' }}>
                {selectedApp.user?.profile?.fullName?.charAt(0) || '?'}
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                  {selectedApp.user?.profile?.fullName || 'N/A'}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{selectedApp.user?.email}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              {selectedApp.user?.profile?.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={14} /> {selectedApp.user.profile.phone}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={14} /> Applied: {formatDate(selectedApp.appliedAt)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={14} /> Status: <StatusBadge status={selectedApp.status} />
              </div>
            </div>
          </div>

          {selectedApp.user?.profile?.skills && (
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Skills</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {selectedApp.user.profile.skills.split(',').map((skill, i) => (
                  <span key={i} style={{ fontSize: '0.75rem', padding: '0.25rem 0.625rem', backgroundColor: 'var(--color-brand-subtle)', color: 'var(--color-brand)', borderRadius: 'var(--radius-full)' }}>
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {selectedApp.message && (
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Cover Letter / Message</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                {selectedApp.message}
              </p>
            </div>
          )}

          {(selectedApp.resumeUrl || selectedApp.user?.profile?.resumeUrl) && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Resume</h4>
              <a
                href={getFullResumeUrl(selectedApp.resumeUrl || selectedApp.user?.profile?.resumeUrl)}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
              >
                <Download size={14} /> View Resume
              </a>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
            {selectedApp.status === 'PENDING' && (
              <>
                <Button variant="danger" size="sm" icon={XCircle} onClick={() => handleUpdateStatus(selectedApp, 'REJECTED')}>
                  Reject
                </Button>
                <Button variant="primary" size="sm" icon={CheckCircle2} onClick={() => handleUpdateStatus(selectedApp, 'ACCEPTED')}>
                  Accept
                </Button>
              </>
            )}
            {selectedApp.status !== 'PENDING' && (
              <Button variant="secondary" size="sm" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
            )}
          </div>
        </Modal>
      )}

      <style>{`
        @media (max-width: 860px) {
          .company-apps-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default CompanyApplications;
