import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import { formatDate } from '../../utils/formatDate';
import { MapPin, Building2, Calendar, Download } from 'lucide-react';

export const ApplicationCard = ({ application, showJob = true, showCandidate = false }) => {
  if (!application) return null;

  const getFullResumeUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    return `${socketUrl}${path}`;
  };

  const resumeUrl = application.resumeUrl || application.user?.profile?.resumeUrl;

  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          {showJob && application.job && (
            <div style={{ marginBottom: '0.5rem' }}>
              <Link to={`/jobs/${application.job.id}`} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary-dark)' }}>
                {application.job.title}
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                <Building2 size={14} />
                <Link to={`/companies/${application.job.company?.id}`} style={{ color: 'inherit' }}>
                  {application.job.company?.name}
                </Link>
              </div>
            </div>
          )}

          {showCandidate && application.user && (
            <div style={{ marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary-dark)' }}>
                {application.user.profile?.fullName || 'N/A'}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                {application.user.email}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
            {application.job?.location && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPin size={12} /> {application.job.location}
              </span>
            )}
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar size={12} /> {formatDate(application.appliedAt)}
            </span>
            {resumeUrl && (
              <a
                href={getFullResumeUrl(resumeUrl)}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-brand)', fontWeight: 500 }}
              >
                <Download size={12} /> Resume
              </a>
            )}
          </div>

          {application.message && (
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.75rem', lineHeight: 1.5, fontStyle: 'italic' }}>
              "{application.message.length > 150 ? application.message.substring(0, 150) + '...' : application.message}"
            </p>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          <StatusBadge status={application.status} />
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
