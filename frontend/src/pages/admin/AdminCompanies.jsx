import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { Building2, CheckCircle2, XCircle, Mail, Calendar, Globe, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminCompanies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [companies, setCompanies] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionDialog, setActionDialog] = useState({ isOpen: false, company: null, action: null });

  const currentPage = parseInt(searchParams.get('page') || '1');

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getPendingCompanies({ page: currentPage, limit: 15 });
      if (res.success) {
        setCompanies(res.data || []);
        setPagination(res.pagination || null);
      }
    } catch {
      setError('Unable to load pending companies.');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const handleAction = (company, action) => {
    setActionDialog({ isOpen: true, company, action });
  };

  const handleActionConfirm = async () => {
    const { company, action } = actionDialog;
    if (!company || !action) return;

    try {
      if (action === 'approve') {
        await adminService.approveCompany(company.id);
        toast.success(`${company.name} has been approved.`);
      } else {
        await adminService.rejectCompany(company.id);
        toast.success(`${company.name} has been rejected.`);
      }
      fetchCompanies();
    } catch {
      toast.error(`Failed to ${action} company.`);
    } finally {
      setActionDialog({ isOpen: false, company: null, action: null });
    }
  };

  return (
    <DashboardLayout title="Company Approvals" subtitle="Review and approve new company registrations.">
      {loading ? (
        <Loader message="Loading pending companies..." />
      ) : error ? (
        <ErrorState title="Error Loading Companies" message={error} onRetry={fetchCompanies} />
      ) : companies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No pending companies"
          description="All company registrations have been reviewed. New submissions will appear here."
        />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600 }}>{company.name}</div>
                        {company.website && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            <Globe size={11} /> {company.website.replace(/^https?:\/\//, '')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem' }}>
                        <Mail size={12} /> {company.user?.email}
                      </div>
                    </td>
                    <td>
                      {company.location ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem' }}>
                          <MapPin size={12} /> {company.location}
                        </span>
                      ) : 'N/A'}
                    </td>
                    <td style={{ color: 'var(--color-text-muted)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={12} /> {formatDate(company.user?.createdAt)}
                      </span>
                    </td>
                    <td><StatusBadge status={company.status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={CheckCircle2}
                          onClick={() => handleAction(company, 'approve')}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={XCircle}
                          onClick={() => handleAction(company, 'reject')}
                        >
                          Reject
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

      <ConfirmDialog
        isOpen={actionDialog.isOpen}
        onClose={() => setActionDialog({ isOpen: false, company: null, action: null })}
        onConfirm={handleActionConfirm}
        title={actionDialog.action === 'approve' ? 'Approve Company?' : 'Reject Company?'}
        message={
          actionDialog.action === 'approve'
            ? `Are you sure you want to approve "${actionDialog.company?.name}"? They will be able to post job openings immediately.`
            : `Are you sure you want to reject "${actionDialog.company?.name}"? They will need to reapply.`
        }
        confirmText={actionDialog.action === 'approve' ? 'Approve' : 'Reject'}
        variant={actionDialog.action === 'approve' ? 'primary' : 'danger'}
      />
    </DashboardLayout>
  );
};

export default AdminCompanies;
