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
import jobService from '../../services/jobService';
import { formatDate } from '../../utils/formatDate';
import { Briefcase, PlusCircle, Edit2, Trash2, Users, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export const ManageJobs = () => {
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
      const res = await jobService.getMyJobs({ page: currentPage, limit: 10 });
      if (res.success) {
        setJobs(res.data || []);
        setPagination(res.pagination || null);
      }
    } catch {
      setError('Unable to load your job postings.');
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

  const handleDeleteClick = (job) => {
    setDeleteDialog({ isOpen: true, job });
  };

  const handleDeleteConfirm = async () => {
    const { job } = deleteDialog;
    if (!job) return;

    try {
      await jobService.deleteJob(job.id);
      toast.success('Job deactivated successfully.');
      fetchJobs();
    } catch {
      toast.error('Failed to delete job.');
    } finally {
      setDeleteDialog({ isOpen: false, job: null });
    }
  };

  return (
    <DashboardLayout
      title="Manage Jobs"
      subtitle="View, edit, and manage your company's job postings."
      actions={
        <Link to="/company/jobs/create">
          <Button variant="primary" size="sm" icon={PlusCircle}>Post New Job</Button>
        </Link>
      }
    >
      {loading ? (
        <Loader message="Loading your job postings..." />
      ) : error ? (
        <ErrorState title="Error Loading Jobs" message={error} onRetry={fetchJobs} />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs posted yet"
          description="Start by creating your first job posting to attract candidates."
          action={
            <Link to="/company/jobs/create" className="btn btn-primary btn-sm">
              Post Your First Job
            </Link>
          }
        />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Job Title</th>
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
                      <div>
                        <Link to={`/jobs/${job.id}`} style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>
                          {job.title}
                        </Link>
                      </div>
                    </td>
                    <td><StatusBadge status={job.type} /></td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{job.location}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{formatDate(job.createdAt)}</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Users size={14} /> {job._count?.applications || 0}
                      </span>
                    </td>
                    <td><StatusBadge status={job.isActive ? 'ACTIVE' : 'INACTIVE'} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
                        <Link to={`/jobs/${job.id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.375rem' }} title="View">
                          <Eye size={14} />
                        </Link>
                        <Link to={`/company/jobs/${job.id}/edit`} className="btn btn-secondary btn-sm" style={{ padding: '0.375rem' }} title="Edit">
                          <Edit2 size={14} />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(job)}
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
        title="Deactivate Job?"
        message={`Are you sure you want to deactivate "${deleteDialog.job?.title}"? This will hide it from job seekers. This action can be reversed by re-activating the job later.`}
        confirmText="Deactivate"
        variant="danger"
      />
    </DashboardLayout>
  );
};

export default ManageJobs;
