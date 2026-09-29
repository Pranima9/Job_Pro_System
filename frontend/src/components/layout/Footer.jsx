import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--color-border)',
        marginTop: 'auto',
        padding: '3rem 0 2rem',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2.5rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Col 1 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.875rem' }}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--color-primary-dark)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Briefcase size={16} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--color-primary-dark)' }}>
                Lunar<span style={{ color: 'var(--color-brand)' }}>Jobs</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, maxWidth: '280px' }}>
              A specialized career and internship platform matching vetted talent with ambitious companies.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)', marginBottom: '1rem' }}>
              For Candidates
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              <li><Link to="/jobs?type=INTERNSHIP" style={{ color: 'var(--color-text-muted)' }}>Internships</Link></li>
              <li><Link to="/jobs?type=FULL_TIME" style={{ color: 'var(--color-text-muted)' }}>Full-Time Roles</Link></li>
              <li><Link to="/companies" style={{ color: 'var(--color-text-muted)' }}>Explore Companies</Link></li>
              <li><Link to="/register" style={{ color: 'var(--color-text-muted)' }}>Create Profile</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)', marginBottom: '1rem' }}>
              For Employers
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              <li><Link to="/register" style={{ color: 'var(--color-text-muted)' }}>Register Company</Link></li>
              <li><Link to="/company/jobs/create" style={{ color: 'var(--color-text-muted)' }}>Post an Opening</Link></li>
              <li><Link to="/company/dashboard" style={{ color: 'var(--color-text-muted)' }}>Employer Dashboard</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)', marginBottom: '1rem' }}>
              API & Support
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              <li><a href="http://localhost:5000/api/docs" target="_blank" rel="noreferrer" style={{ color: 'var(--color-text-muted)' }}>OpenAPI / Swagger</a></li>
              <li><a href="http://localhost:5000/health" target="_blank" rel="noreferrer" style={{ color: 'var(--color-text-muted)' }}>API Health Status</a></li>
            </ul>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8125rem',
            color: 'var(--color-text-subtle)',
          }}
        >
          <span>&copy; {new Date().getFullYear()} LunarJobs Portal. All rights reserved.</span>
          <span>Enterprise SaaS Frontend Architecture</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
