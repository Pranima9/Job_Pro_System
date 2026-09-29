import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Globe, Building2 } from 'lucide-react';

export const CompanyCard = ({ company }) => {
  if (!company) return null;

  return (
    <Link
      to={`/companies/${company.id}`}
      className="card"
      style={{ display: 'block', textDecoration: 'none', color: 'inherit', transition: 'border-color 0.15s ease, box-shadow 0.15s ease' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: 'var(--color-brand-subtle)', color: 'var(--color-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: '1.125rem' }}>
          {company.name?.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {company.name}
          </h3>
          {company.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              <MapPin size={12} />
              {company.location}
            </div>
          )}
        </div>
      </div>
      {company.description && (
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {company.description}
        </p>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border-light)' }}>
        {company.website ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
            <Globe size={12} />
            {company.website.replace(/^https?:\/\//, '')}
          </span>
        ) : (
          <span />
        )}
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-brand)' }}>
          <Building2 size={12} /> View Company
        </span>
      </div>
    </Link>
  );
};

export default CompanyCard;
