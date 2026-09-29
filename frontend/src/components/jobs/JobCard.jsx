import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Clock, Building2, Bookmark } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { formatDate } from '../../utils/formatDate';
import { useAuth } from '../../hooks/useAuth';

export const JobCard = ({
  job,
  isBookmarked = false,
  onBookmarkToggle,
  showCompany = true,
}) => {
  if (!job) return null;

  const { isSeeker } = useAuth();

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
              <StatusBadge status={job.type} />
              {job.deadline && (
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                  Closes {formatDate(job.deadline)}
                </span>
              )}
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-primary-dark)' }}>
              <Link to={`/jobs/${job.id}`} style={{ color: 'inherit' }}>
                {job.title}
              </Link>
            </h3>
          </div>

          {isSeeker && onBookmarkToggle && (
            <button
              onClick={() => onBookmarkToggle(job.id)}
              style={{
                background: 'none',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.375rem',
                cursor: 'pointer',
                color: isBookmarked ? 'var(--color-brand)' : 'var(--color-text-subtle)',
                backgroundColor: isBookmarked ? 'var(--color-brand-subtle)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Job'}
              aria-label="Bookmark"
            >
              <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>

        {showCompany && job.company && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.875rem' }}>
            <Building2 size={15} />
            <Link to={`/companies/${job.company.id}`} style={{ color: 'inherit', fontWeight: 500 }}>
              {job.company.name}
            </Link>
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <MapPin size={14} />
            <span>{job.location}</span>
          </div>

          {job.salary && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <DollarSign size={14} />
              <span>{job.salary}</span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={14} />
            <span>Posted {formatDate(job.createdAt)}</span>
          </div>
        </div>

        {job.skills && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1.25rem' }}>
            {job.skills.split(',').map((skill, index) => (
              <span
                key={index}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.5rem',
                  backgroundColor: '#f1f5f9',
                  color: 'var(--color-text-muted)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--color-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
          {job._count?.applications ?? 0} applied
        </span>
        <Link to={`/jobs/${job.id}`} className="btn btn-secondary btn-sm">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
