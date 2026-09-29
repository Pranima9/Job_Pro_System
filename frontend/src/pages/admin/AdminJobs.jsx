import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Button from '../../components/common/Button';
import adminService from '../../services/adminService';
import { formatDate } from '../../utils/formatDate';
import { Briefcase, Trash2, Users, Building2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminJobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, job: null });

  const currentPage = parseInt(searchParams.get('page') || '1');

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getAllJobs({ page: currentPage, limit: 15 });
      if (res.success) {
        setJobs(res.data || []);
        setPagination(res.pagination || null);
      }
    } catch {
      setError('Unable to load jobs.');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const handleDeleteConfirm = async () => {
    const { job } = deleteDialog;
    if (!job) return;

    try {
      await adminService.deleteJob(job.id);
      toast.success('Job removed successfully.');
      fetchJobs();
    } catch {
      toast.error('Failed to delete job.');
    } finally {
      setDeleteDialog({ isOpen: false, job: null });
    }
  };

  return (
    <DashboardLayout title="Job Management" subtitle="View and manage all job postings on the platform.">
      {loading ? (
        <Loader message="Loading jobs..." />
      ) : error ? (
        <ErrorState title="Error Loading Jobs" message={error} onRetry={fetchJobs} />
      ) : jobs.length === 0 ? (
        <EmptyState icon={Briefcase} title="No jobs found" description="Jobs will appear here once companies start posting." />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Posted</th>
                  <th>Applicants</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <Link to={`/jobs/${job.id}`} style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>
                        {job.title}
                      </Link>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Building2 size={13} /> {job.company?.name || 'N/A'}
                      </span>
                    </td>
                    <td><StatusBadge status={job.type} /></td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{job.location}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{formatDate(job.createdAt)}</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Users size={13} /> {job._count?.applications || 0}
                      </span>
                    </td>
                    <td><StatusBadge status={job.isActive ? 'ACTIVE' : 'INACTIVE'} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
                        <Link to={`/jobs/${job.id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.375rem' }} title="View">
                          <Eye size={14} />
                        </Link>
                        <button
                          onClick={() => setDeleteDialog({ isOpen: true, job })}
                          className="btn btn-sm"
                          style={{ padding: '0.375rem', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', border: '1px solid var(--color-danger-border)' }}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
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

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, job: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Job?"
        message={`Are you sure you want to permanently delete "${deleteDialog.job?.title}"? This action cannot be undone.`}
        confirmText="Delete Job"
        variant="danger"
      />
    </DashboardLayout>
  );
};

export default AdminJobs;
