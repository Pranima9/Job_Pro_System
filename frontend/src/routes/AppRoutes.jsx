import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/layout/ProtectedRoute';

// Public pages
import Home from '../pages/public/Home';
import Jobs from '../pages/public/Jobs';
import JobDetails from '../pages/public/JobDetails';
import Companies from '../pages/public/Companies';
import CompanyDetails from '../pages/public/CompanyDetails';
import NotFound from '../pages/public/NotFound';

// Auth pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import VerifyOTP from '../pages/auth/VerifyOTP';
import AuthCallback from '../pages/auth/AuthCallback';

// Seeker pages
import SeekerDashboard from '../pages/seeker/SeekerDashboard';
import SeekerProfile from '../pages/seeker/SeekerProfile';
import MyApplications from '../pages/seeker/MyApplications';
import Bookmarks from '../pages/seeker/Bookmarks';
import NotificationsPage from '../pages/seeker/NotificationsPage';

// Company pages
import CompanyDashboard from '../pages/company/CompanyDashboard';
import CompanyProfile from '../pages/company/CompanyProfile';
import ManageJobs from '../pages/company/ManageJobs';
import CreateJob from '../pages/company/CreateJob';
import EditJob from '../pages/company/EditJob';
import CompanyApplications from '../pages/company/CompanyApplications';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminCompanies from '../pages/admin/AdminCompanies';
import AdminJobs from '../pages/admin/AdminJobs';
import AdminStatistics from '../pages/admin/AdminStatistics';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/jobs/:id" element={<JobDetails />} />
      <Route path="/companies" element={<Companies />} />
      <Route path="/companies/:id" element={<CompanyDetails />} />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Seeker Routes */}
      <Route
        path="/seeker/dashboard"
        element={
          <ProtectedRoute allowedRoles={['SEEKER']}>
            <SeekerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seeker/profile"
        element={
          <ProtectedRoute allowedRoles={['SEEKER']}>
            <SeekerProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seeker/applications"
        element={
          <ProtectedRoute allowedRoles={['SEEKER']}>
            <MyApplications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seeker/bookmarks"
        element={
          <ProtectedRoute allowedRoles={['SEEKER']}>
            <Bookmarks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seeker/notifications"
        element={
          <ProtectedRoute allowedRoles={['SEEKER']}>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      {/* Company Routes */}
      <Route
        path="/company/dashboard"
        element={
          <ProtectedRoute allowedRoles={['COMPANY']}>
            <CompanyDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/profile"
        element={
          <ProtectedRoute allowedRoles={['COMPANY']}>
            <CompanyProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/jobs"
        element={
          <ProtectedRoute allowedRoles={['COMPANY']}>
            <ManageJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/jobs/create"
        element={
          <ProtectedRoute allowedRoles={['COMPANY']}>
            <CreateJob />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/jobs/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['COMPANY']}>
            <EditJob />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/applications"
        element={
          <ProtectedRoute allowedRoles={['COMPANY']}>
            <CompanyApplications />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/companies"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminCompanies />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/jobs"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/statistics"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminStatistics />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
