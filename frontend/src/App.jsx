import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider>
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
