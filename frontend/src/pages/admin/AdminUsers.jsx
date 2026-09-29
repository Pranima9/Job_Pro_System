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
import { Users, Trash2, Mail, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminUsers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, user: null });

  const currentPage = parseInt(searchParams.get('page') || '1');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getAllUsers({ page: currentPage, limit: 15 });
      if (res.success) {
        setUsers(res.data || []);
        setPagination(res.pagination || null);
      }
    } catch {
      setError('Unable to load users.');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const handleDeleteConfirm = async () => {
    const { user } = deleteDialog;
    if (!user) return;

    try {
      await adminService.deleteUser(user.id);
      toast.success('User deleted successfully.');
      fetchUsers();
    } catch {
      toast.error('Failed to delete user.');
    } finally {
      setDeleteDialog({ isOpen: false, user: null });
    }
  };

  return (
    <DashboardLayout title="User Management" subtitle="View and manage all registered platform users.">
      {loading ? (
        <Loader message="Loading users..." />
      ) : error ? (
        <ErrorState title="Error Loading Users" message={error} onRetry={fetchUsers} />
      ) : users.length === 0 ? (
        <EmptyState icon={Users} title="No users found" description="Users will appear here once they register on the platform." />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Profile</th>
                  <th>Joined</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600 }}>{user.profile?.fullName || 'N/A'}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          <Mail size={11} /> {user.email}
                        </div>
                      </div>
                    </td>
                    <td><StatusBadge status={user.role} /></td>
                    <td>
                      <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-text-muted)' }}>
                      {user.company?.name || user.profile?.fullName || 'N/A'}
                    </td>
                    <td style={{ color: 'var(--color-text-muted)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={12} /> {formatDate(user.createdAt)}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={Trash2}
                          onClick={() => setDeleteDialog({ isOpen: true, user })}
                          style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger-border)' }}
                        >
                          Delete
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
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, user: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete User?"
        message={`Are you sure you want to delete ${deleteDialog.user?.email}? This will permanently remove the user and all associated data (profile, applications, bookmarks, notifications).`}
        confirmText="Delete User"
        variant="danger"
      />
    </DashboardLayout>
  );
};

export default AdminUsers;
