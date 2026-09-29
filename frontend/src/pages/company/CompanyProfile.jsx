import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import StatusBadge from '../../components/common/StatusBadge';
import companyService from '../../services/companyService';
import { useAuth } from '../../hooks/useAuth';
import { extractApiError } from '../../utils/errorHelper';
import { Building2, Globe, MapPin, AlertTriangle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const CompanyProfile = () => {
  const { refreshUser } = useAuth();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    location: '',
  });

  const fetchCompany = async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const res = await companyService.getMyCompany();
      if (res.success && res.data) {
        setCompany(res.data);
        setFormData({
          name: res.data.name || '',
          description: res.data.description || '',
          website: res.data.website || '',
          location: res.data.location || '',
        });
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true);
      } else {
        setError('Failed to load company profile.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Company name is required.');
      return;
    }

    setSaving(true);
    try {
      let res;
      if (company) {
        res = await companyService.updateCompany(formData);
      } else {
        res = await companyService.createCompany(formData);
      }
      if (res.success) {
        toast.success(company ? 'Company profile updated.' : 'Company profile created. Awaiting admin approval.');
        await refreshCompany();
        await refreshUser();
      }
    } catch (err) {
      toast.error(extractApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const refreshCompany = async () => {
    try {
      const res = await companyService.getMyCompany();
      if (res.success && res.data) {
        setCompany(res.data);
        setFormData({
          name: res.data.name || '',
          description: res.data.description || '',
          website: res.data.website || '',
          location: res.data.location || '',
        });
        setNotFound(false);
      }
    } catch {
      // Ignore refresh errors
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Company Profile">
        <Loader message="Loading company profile..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Company Profile">
        <ErrorState title="Error" message={error} onRetry={fetchCompany} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Company Profile"
      subtitle="Manage your company information and visibility on the platform."
    >
      {/* Status Banner */}
      {company && company.status === 'PENDING' && (
        <div style={{ backgroundColor: 'var(--color-warning-bg)', border: '1px solid var(--color-warning-border)', borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertTriangle size={20} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
          <div>
            <h4 style={{ color: 'var(--color-warning)', fontWeight: 700, fontSize: '0.9375rem' }}>Pending Admin Approval</h4>
            <p style={{ color: '#92400e', fontSize: '0.875rem' }}>Your company is awaiting administrator approval. You cannot post jobs until approved.</p>
          </div>
        </div>
      )}

      {company && company.status === 'APPROVED' && (
        <div style={{ backgroundColor: 'var(--color-success-bg)', border: '1px solid var(--color-success-border)', borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CheckCircle2 size={20} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
          <div>
            <h4 style={{ color: 'var(--color-success)', fontWeight: 700, fontSize: '0.9375rem' }}>Company Approved</h4>
            <p style={{ color: '#166534', fontSize: '0.875rem' }}>Your company is verified and you can post job openings.</p>
          </div>
        </div>
      )}

      <div className="card" style={{ maxWidth: '720px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '12px', backgroundColor: 'var(--color-brand-subtle)', color: 'var(--color-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.5rem' }}>
            {formData.name ? formData.name.charAt(0).toUpperCase() : <Building2 size={24} />}
          </div>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
              {company ? company.name : 'Create Company Profile'}
            </h3>
            {company && <StatusBadge status={company.status} />}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="Company Name"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Acme Corporation"
            required
            icon={Building2}
          />
          <div className="grid-2">
            <Input
              label="Website"
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://www.example.com"
              icon={Globe}
            />
            <Input
              label="Location"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Kathmandu, Nepal"
              icon={MapPin}
            />
          </div>
          <Textarea
            label="Company Description"
            id="description"
            name="description"
            rows={5}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your company, mission, culture, and what makes it a great place to work..."
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button type="submit" variant="primary" loading={saving} loadingText="Saving...">
              {company ? 'Update Profile' : 'Create Profile'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CompanyProfile;
