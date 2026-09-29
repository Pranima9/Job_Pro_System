import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider>
            {showIntro && (
              <div className="jobpro-intro" aria-live="polite">
                <div className="jobpro-intro-inner">
                  <div className="jobpro-logo-block" aria-label="JobPro logo">
                    <span className="jobpro-logo-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M8 7V6.75A2.75 2.75 0 0 1 10.75 4h2.5A2.75 2.75 0 0 1 16 6.75V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4.75 8.5A2.75 2.75 0 0 1 7.5 5.75h9A2.75 2.75 0 0 1 19.25 8.5v8.25A2.75 2.75 0 0 1 16.5 19.5h-9A2.75 2.75 0 0 1 4.75 16.75V8.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                        <path d="M8.5 12h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                      </svg>
                    </span>
                    <span className="jobpro-logo-text">Job<span className="jobpro-logo-accent">Pro</span></span>
                  </div>
                </div>
              </div>
            )}
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1e293b',
                  color: '#f8fafc',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                },
              }}
            />
          </SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
