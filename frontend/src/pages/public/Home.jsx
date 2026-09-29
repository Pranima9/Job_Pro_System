import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import JobCard from '../../components/jobs/JobCard';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import jobService from '../../services/jobService';
import companyService from '../../services/companyService';
import { Search, MapPin, Briefcase, Building2, Users, ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [jobsRes, companiesRes] = await Promise.allSettled([
          jobService.getJobs({ limit: 6 }),
          companyService.getCompanies(),
        ]);

        if (jobsRes.status === 'fulfilled' && jobsRes.value.success) {
          setJobs(jobsRes.value.data || []);
        }
        if (companiesRes.status === 'fulfilled' && companiesRes.value.success) {
          setCompanies(companiesRes.value.data || []);
        }
      } catch {
        setError('Unable to load homepage data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (searchLocation) params.set('location', searchLocation);
    navigate(`/jobs?${params.toString()}`);
  };

  const stats = [
    { icon: Briefcase, label: 'Active Jobs', value: jobs.length + '+' },
    { icon: Building2, label: 'Companies', value: companies.length + '+' },
    { icon: Users, label: 'Job Seekers', value: '1000+' },
    { icon: TrendingUp, label: 'Placements', value: '500+' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Verified Companies',
      description: 'All companies are vetted and approved by our admin team before they can post jobs.',
    },
    {
      icon: Zap,
      title: 'Real-Time Updates',
      description: 'Get instant notifications when companies review or update your application status.',
    },
    {
      icon: Briefcase,
      title: 'Diverse Opportunities',
      description: 'Find internships, full-time, part-time, and contract positions across various industries.',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{ backgroundColor: 'var(--color-primary-dark)', color: '#fff', padding: '5rem 0 4rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Find Your Dream Job or Internship
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
            Connect with top companies and discover opportunities that match your skills and career goals.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', maxWidth: '700px', margin: '0 auto', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 240px', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Job title, skill, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 2.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #334155',
                  backgroundColor: '#1e293b',
                  color: '#f8fafc',
                  fontSize: '0.9375rem',
                  outline: 'none',
                }}
              />
            </div>
            <div style={{ flex: '1 1 180px', position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Location..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 2.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #334155',
                  backgroundColor: '#1e293b',
                  color: '#f8fafc',
                  fontSize: '0.9375rem',
                  outline: 'none',
                }}
              />
            </div>
            <Button type="submit" variant="primary" size="lg">
              Search Jobs
            </Button>
          </form>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '3rem 0', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="grid-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} style={{ textAlign: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--color-brand-subtle)', color: 'var(--color-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                    <Icon size={22} />
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>{stat.value}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>Featured Jobs</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>Latest opportunities from verified companies</p>
            </div>
            <Link to="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontWeight: 600, color: 'var(--color-brand)' }}>
              View All Jobs <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <Loader message="Loading featured jobs..." />
          ) : error ? (
            <ErrorState title="Error" message={error} />
          ) : jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
              No jobs available at the moment. Check back soon!
            </div>
          ) : (
            <div className="grid-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>How It Works</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', marginTop: '0.5rem' }}>Your journey to the perfect career starts here</p>
          </div>
          <div className="grid-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '12px', backgroundColor: 'var(--color-brand-subtle)', color: 'var(--color-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                    <Icon size={26} />
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>{feature.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--color-primary-dark)', color: '#fff' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>Ready to Get Started?</h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
            Create your account today and start applying to opportunities from verified companies.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register">
              <Button variant="primary" size="lg">Create Account</Button>
            </Link>
            <Link to="/jobs">
              <Button variant="secondary" size="lg" style={{ backgroundColor: '#1e293b', color: '#f8fafc', borderColor: '#334155' }}>
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
