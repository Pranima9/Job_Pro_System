import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import companyService from '../../services/companyService';
import jobService from '../../services/jobService';
import applicationService from '../../services/applicationService';
import { formatDate } from '../../utils/formatDate';
import { Briefcase, Users, FileText, Clock, CheckCircle2, PlusCircle, Building2, AlertTriangle } from 'lucide-react';

export const CompanyDashboard = () => {
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [companyRes, jobsRes] = await Promise.allSettled([
        companyService.getMyCompany(),
        jobService.getMyJobs({ limit: 5 }),
      ]);

      if (companyRes.status === 'fulfilled' && companyRes.value.success) {
        setCompany(companyRes.value.data);
      }
      if (jobsRes.status === 'fulfilled' && jobsRes.value.success) {
        setJobs(jobsRes.value.data || []);
      }

      // Fetch applicants for the most recent job
      if (jobsRes.status === 'fulfilled' && jobsRes.value.success && jobsRes.value.data?.length > 0) {
        const latestJob = jobsRes.value.data[0];
        try {
          const appRes = await applicationService.getApplicantsForJob(latestJob.id, { limit: 5 });
          if (appRes.success) {
            setRecentApplications(appRes.data || []);
          }
        } catch {
          // Silently fail for recent applications
        }
      }
    } catch {
      setError('Unable to load company dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalApplications = jobs.reduce((sum, job) => sum + (job._count?.applications || 0), 0);
  const activeJobs = jobs.filter((j) => j.isActive).length;
  const pendingJobs = jobs.filter((j) => j.isActive).length;

  if (loading) {
    return (
      <DashboardLayout title="Company Dashboard">
        <Loader message="Loading company dashboard..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Company Dashboard">
        <ErrorState title="Error Loading Dashboard" message={error} onRetry={fetchDashboardData} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={`Welcome${company?.name ? `, ${company.name}` : ''}`}
      subtitle="Manage your job postings and review candidate applications."
      actions={
        <Link to="/company/jobs/create">
          <Button variant="primary" size="sm" icon={PlusCircle}>Post New Job</Button>
        </Link>
      }
    >
      {/* Company Not Found Warning */}
      {!company && (
        <div style={{ backgroundColor: 'var(--color-warning-bg)', border: '1px solid var(--color-warning-border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={20} style={{ color: 'var(--color-warning)' }} />
            <div>
              <h4 style={{ color: 'var(--color-warning)', fontWeight: 700, fontSize: '0.9375rem' }}>Company Profile Required</h4>
              <p style={{ color: '#92400e', fontSize: '0.875rem' }}>Create your company profile before posting jobs.</p>
            </div>
          </div>
          <Link to="/company/profile">
            <Button variant="secondary" size="sm" icon={Building2}>Set Up Profile</Button>
          </Link>
        </div>
      )}

      {/* Pending Approval Warning */}
      {company && company.status === 'PENDING' && (
        <div style={{ backgroundColor: 'var(--color-warning-bg)', border: '1px solid var(--color-warning-border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Clock size={20} style={{ color: 'var(--color-warning)' }} />
          <div>
            <h4 style={{ color: 'var(--color-warning)', fontWeight: 700, fontSize: '0.9375rem' }}>Awaiting Admin Approval</h4>
            <p style={{ color: '#92400e', fontSize: '0.875rem' }}>Your company account is pending administrator approval. You can create a profile but cannot post jobs until approved.</p>
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Total Jobs</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: 'var(--color-brand-subtle)', color: 'var(--color-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={16} />
            </div>
          </div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>{jobs.length}</h3>
        </div>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Active Jobs</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-success)' }}>{activeJobs}</h3>
        </div>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Total Applicants</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#f1f5f9', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={16} />
            </div>
          </div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>{totalApplications}</h3>
        </div>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Company Status</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: company?.status === 'APPROVED' ? 'var(--color-success-bg)' : 'var(--color-warning-bg)', color: company?.status === 'APPROVED' ? 'var(--color-success)' : 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={16} />
            </div>
          </div>
          <StatusBadge status={company?.status || 'N/A'} />
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>Recent Job Postings</h3>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Your latest published positions</span>
          </div>
          <Link to="/company/jobs" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>View All</Link>
        </div>
        {jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            No jobs posted yet. <Link to="/company/jobs/create" style={{ fontWeight: 600 }}>Post your first job</Link>.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Posted</th>
                  <th>Applicants</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td style={{ fontWeight: 600 }}>{job.title}</td>
                    <td><StatusBadge status={job.type} /></td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{job.location}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{formatDate(job.createdAt)}</td>
                    <td>{job._count?.applications || 0}</td>
                    <td><StatusBadge status={job.isActive ? 'ACTIVE' : 'INACTIVE'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CompanyDashboard;
