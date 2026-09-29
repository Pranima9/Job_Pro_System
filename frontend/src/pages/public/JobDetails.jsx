import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import ApplyModal from '../../components/jobs/ApplyModal';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import jobService from '../../services/jobService';
import bookmarkService from '../../services/bookmarkService';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatDate';
import { MapPin, DollarSign, Clock, Building2, Bookmark, ArrowLeft, Users, Calendar, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

export const JobDetails = () => {
  const { id } = useParams();
  const { isSeeker, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await jobService.getJobById(id);
        if (res.success) {
          setJob(res.data);
        }
      } catch {
        setError('Unable to load job details.');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  useEffect(() => {
    if (isSeeker && job) {
      bookmarkService.getBookmarks()
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            setIsBookmarked(res.data.some((b) => b.jobId === job.id));
          }
        })
        .catch(() => {});
    }
  }, [isSeeker, job]);

  const handleBookmarkToggle = async () => {
    try {
      if (isBookmarked) {
        await bookmarkService.removeBookmark(job.id);
        setIsBookmarked(false);
        toast.success('Removed from bookmarks.');
      } else {
        await bookmarkService.addBookmark(job.id);
        setIsBookmarked(true);
        toast.success('Job bookmarked.');
      }
    } catch {
      toast.error('Failed to update bookmark.');
    }
  };

  const handleApplySuccess = () => {
    setShowApplyModal(false);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader message="Loading job details..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ErrorState title="Job Not Found" message={error || 'This job posting does not exist or has been removed.'} onRetry={() => window.location.reload()} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '2.5rem 0', backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <Link to="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            <ArrowLeft size={16} /> Back to Jobs
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }} className="job-details-layout">
            {/* Main Content */}
            <div>
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <StatusBadge status={job.type} />
                      {job.isActive && <span className="badge badge-success">Active</span>}
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
                      {job.title}
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem', color: 'var(--color-text-muted)' }}>
                      <Building2 size={16} />
                      <Link to={`/companies/${job.company?.id}`} style={{ color: 'var(--color-brand)', fontWeight: 500 }}>
                        {job.company?.name}
                      </Link>
                    </div>
                  </div>
                  {isSeeker && (
                    <button
                      onClick={handleBookmarkToggle}
                      style={{
                        background: 'none',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.5rem',
                        cursor: 'pointer',
                        color: isBookmarked ? 'var(--color-brand)' : 'var(--color-text-subtle)',
                        backgroundColor: isBookmarked ? 'var(--color-brand-subtle)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                      title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Job'}
                    >
                      <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', padding: '1rem 0', borderTop: '1px solid var(--color-border-light)', borderBottom: '1px solid var(--color-border-light)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                    <MapPin size={15} /> {job.location}
                  </div>
                  {job.salary && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                      <DollarSign size={15} /> {job.salary}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                    <Clock size={15} /> Posted {formatDate(job.createdAt)}
                  </div>
                  {job.deadline && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                      <Calendar size={15} /> Deadline: {formatDate(job.deadline)}
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}>Job Description</h3>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {job.description}
                  </p>
                </div>

                {job.skills && (
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}>Required Skills</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {job.skills.split(',').map((skill, index) => (
                        <span key={index} style={{ fontSize: '0.8125rem', padding: '0.375rem 0.75rem', backgroundColor: 'var(--color-brand-subtle)', color: 'var(--color-brand)', borderRadius: 'var(--radius-full)', fontWeight: 500 }}>
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>Job Overview</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Job Type</span>
                    <StatusBadge status={job.type} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Location</span>
                    <span style={{ fontWeight: 500 }}>{job.location}</span>
                  </div>
                  {job.salary && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Salary</span>
                      <span style={{ fontWeight: 500 }}>{job.salary}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Posted</span>
                    <span style={{ fontWeight: 500 }}>{formatDate(job.createdAt)}</span>
                  </div>
                  {job.deadline && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Deadline</span>
                      <span style={{ fontWeight: 500 }}>{formatDate(job.deadline)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Applicants</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                      <Users size={14} /> {job._count?.applications ?? 0}
                    </span>
                  </div>
                </div>
              </div>

              {isSeeker && (
                <Button variant="primary" block size="lg" onClick={() => setShowApplyModal(true)} icon={Briefcase}>
                  Apply for this Job
                </Button>
              )}

              {!isAuthenticated && (
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Sign in to apply for this job</p>
                  <Link to={`/login?redirect=/jobs/${job.id}`}>
                    <Button variant="secondary" block>Sign In</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {showApplyModal && (
        <ApplyModal
          isOpen={showApplyModal}
          onClose={() => setShowApplyModal(false)}
          job={job}
          onApplicationSuccess={handleApplySuccess}
        />
      )}
    </div>
  );
};

export default JobDetails;
