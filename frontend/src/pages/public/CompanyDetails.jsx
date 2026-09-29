import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import JobCard from '../../components/jobs/JobCard';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import companyService from '../../services/companyService';
import { Building2, MapPin, Globe, ArrowLeft, Briefcase } from 'lucide-react';

export const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await companyService.getCompanyById(id);
        if (res.success) {
          setCompany(res.data);
        }
      } catch {
        setError('Unable to load company details.');
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader message="Loading company details..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ErrorState title="Company Not Found" message={error || 'This company does not exist.'} onRetry={() => window.location.reload()} />
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
          <Link to="/companies" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            <ArrowLeft size={16} /> Back to Companies
          </Link>

          {/* Company Header */}
          <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '14px', backgroundColor: 'var(--color-brand-subtle)', color: 'var(--color-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 800, fontSize: '1.75rem' }}>
                {company.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
                  {company.name}
                </h1>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  {company.location && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <MapPin size={14} /> {company.location}
                    </span>
                  )}
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--color-brand)' }}>
                      <Globe size={14} /> {company.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
              </div>
            </div>
            {company.description && (
              <p style={{ marginTop: '1.5rem', fontSize: '0.9375rem', color: 'var(--color-text-muted)', lineHeight: 1.7, borderTop: '1px solid var(--color-border-light)', paddingTop: '1.5rem' }}>
                {company.description}
              </p>
            )}
          </div>

          {/* Company Jobs */}
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={20} /> Open Positions ({company.jobs?.length || 0})
            </h2>
            {!company.jobs || company.jobs.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                <Building2 size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <p>No open positions at this time. Check back later!</p>
              </div>
            ) : (
              <div className="grid-3">
                {company.jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CompanyDetails;
