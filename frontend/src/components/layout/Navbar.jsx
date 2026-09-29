import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, Menu, X, LogOut, User, LayoutDashboard, Building2, Bookmark, FileText } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import NotificationDropdown from '../notifications/NotificationDropdown';
import Button from '../common/Button';

export const Navbar = () => {
  const { isAuthenticated, user, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setUserDropdownOpen(false);
  };

  const getDashboardPath = () => {
    if (role === 'SEEKER') return '/seeker/dashboard';
    if (role === 'COMPANY') return '/company/dashboard';
    if (role === 'ADMIN') return '/admin/dashboard';
    return '/';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            color: 'var(--color-primary-dark)',
            fontWeight: 800,
            fontSize: '1.25rem',
            letterSpacing: '-0.02em',
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-primary-dark)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Briefcase size={18} />
          </div>
          <span>Job<span style={{ color: 'var(--color-brand)' }}>Pro</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.75rem',
          }}
          className="desktop-nav"
        >
          <Link
            to="/jobs"
            style={{
              color: isActive('/jobs') ? 'var(--color-brand)' : 'var(--color-text)',
              fontWeight: 500,
              fontSize: '0.9375rem',
            }}
          >
            Find Jobs
          </Link>
          <Link
            to="/companies"
            style={{
              color: isActive('/companies') ? 'var(--color-brand)' : 'var(--color-text)',
              fontWeight: 500,
              fontSize: '0.9375rem',
            }}
          >
            Companies
          </Link>
        </nav>

        {/* Desktop Auth Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
          className="desktop-auth"
        >
          {isAuthenticated ? (
            <>
              <NotificationDropdown />

              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: '1px solid var(--color-border)',
                    padding: '0.375rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    backgroundColor: userDropdownOpen ? 'var(--color-surface-hover)' : 'transparent',
                  }}
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-brand-subtle)',
                      color: 'var(--color-brand)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: '0.8125rem',
                    }}
                  >
                    {user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-primary)' }}>
                    {user?.profile?.fullName || user?.company?.name || user?.email?.split('@')[0]}
                  </span>
                  <span className="badge badge-neutral" style={{ fontSize: '0.625rem', padding: '0.15rem 0.4rem' }}>
                    {role}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 6px)',
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-lg)',
                      width: '200px',
                      overflow: 'hidden',
                      zIndex: 1000,
                    }}
                  >
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border-light)' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Signed in as</p>
                      <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      to={getDashboardPath()}
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.625rem',
                        padding: '0.625rem 1rem',
                        fontSize: '0.875rem',
                        color: 'var(--color-text)',
                        borderBottom: '1px solid var(--color-border-light)',
                      }}
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>

                    {role === 'SEEKER' && (
                      <>
                        <Link
                          to="/seeker/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.625rem',
                            padding: '0.625rem 1rem',
                            fontSize: '0.875rem',
                            color: 'var(--color-text)',
                          }}
                        >
                          <User size={16} />
                          My Profile
                        </Link>
                        <Link
                          to="/seeker/applications"
                          onClick={() => setUserDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.625rem',
                            padding: '0.625rem 1rem',
                            fontSize: '0.875rem',
                            color: 'var(--color-text)',
                          }}
                        >
                          <FileText size={16} />
                          My Applications
                        </Link>
                        <Link
                          to="/seeker/bookmarks"
                          onClick={() => setUserDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.625rem',
                            padding: '0.625rem 1rem',
                            fontSize: '0.875rem',
                            color: 'var(--color-text)',
                          }}
                        >
                          <Bookmark size={16} />
                          Saved Jobs
                        </Link>
                      </>
                    )}

                    {role === 'COMPANY' && (
                      <>
                        <Link
                          to="/company/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.625rem',
                            padding: '0.625rem 1rem',
                            fontSize: '0.875rem',
                            color: 'var(--color-text)',
                          }}
                        >
                          <Building2 size={16} />
                          Company Profile
                        </Link>
                        <Link
                          to="/company/jobs"
                          onClick={() => setUserDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.625rem',
                            padding: '0.625rem 1rem',
                            fontSize: '0.875rem',
                            color: 'var(--color-text)',
                          }}
                        >
                          <Briefcase size={16} />
                          Manage Jobs
                        </Link>
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.625rem',
                        padding: '0.625rem 1rem',
                        fontSize: '0.875rem',
                        color: 'var(--color-danger)',
                        background: 'none',
                        border: 'none',
                        width: '100%',
                        textAlign: 'left',
                        cursor: 'pointer',
                        borderTop: '1px solid var(--color-border-light)',
                      }}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-primary)',
            padding: '0.375rem',
            cursor: 'pointer',
          }}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid var(--color-border)',
            padding: '1rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
          className="mobile-drawer"
        >
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '0.5rem 0', fontWeight: 500, color: 'var(--color-text)' }}
          >
            Find Jobs
          </Link>
          <Link
            to="/companies"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '0.5rem 0', fontWeight: 500, color: 'var(--color-text)' }}
          >
            Companies
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                style={{ padding: '0.5rem 0', fontWeight: 600, color: 'var(--color-brand)' }}
              >
                Go to Dashboard ({role})
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  padding: '0.5rem 0',
                  color: 'var(--color-danger)',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.5rem' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="secondary" block>Sign In</Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" block>Register Account</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 769px) {
          .mobile-toggle, .mobile-drawer { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-nav, .desktop-auth { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
