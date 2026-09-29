import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import companyService from '../../services/companyService';
import { Building2, MapPin, Globe, ArrowRight } from 'lucide-react';

export const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await companyService.getCompanies();
        if (res.success) {
          setCompanies(res.data || []);
        }
      } catch {
        setError('Unable to load companies. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '2.5rem 0', backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>Companies</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
              Explore verified companies hiring on our platform
            </p>
          </div>

          {loading ? (
            <Loader message="Loading companies..." />
          ) : error ? (
            <ErrorState title="Error Loading Companies" message={error} onRetry={() => window.location.reload()} />
          ) : companies.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No companies found"
              description="Companies will appear here once they are verified and approved by our admin team."
            />
          ) : (
            <div className="grid-3">
              {companies.map((company) => (
                <Link
                  key={company.id}
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
                      View Jobs <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Companies;
