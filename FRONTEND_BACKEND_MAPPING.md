# FRONTEND_BACKEND_MAPPING.md
# Frontend & Backend Compatibility Contract

This document provides the definitive contract mapping all React frontend pages, components, and services directly to the live Node.js/Express/Prisma REST API of the Job & Internship Portal.

---

## 1. System Enums & Types

| Backend Enum | Valid Values | Notes |
| :--- | :--- | :--- |
| **`Role`** | `SEEKER`, `COMPANY`, `ADMIN` | Strictly verified in auth & middleware |
| **`AuthProvider`** | `LOCAL`, `GOOGLE` | Google accounts are auto-verified |
| **`CompanyStatus`**| `PENDING`, `APPROVED`, `REJECTED` | Companies must be `APPROVED` to post jobs |
| **`JobType`** | `INTERNSHIP`, `FULL_TIME`, `PART_TIME`, `CONTRACT` | Available for job creation & filtering |
| **`ApplicationStatus`**| `PENDING`, `ACCEPTED`, `REJECTED` | Updated by company owners |

---

## 2. API Endpoint to Frontend Mapping

| Feature | Frontend Page / Component | Frontend Service Method | Backend Route | HTTP Method | Auth Required | Allowed Roles | Request Payload | Response Data Shape |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Register** | `Register.jsx` | `authService.register` | `/api/auth/register` | `POST` | No | Public | `{ email, password, role }` | `{ success: true, message, data: { email } }` |
| **Verify OTP** | `VerifyOTP.jsx` | `authService.verifyOTP` | `/api/auth/verify-otp` | `POST` | No | Public | `{ email, otp }` | `{ success: true, data: { token, user } }` |
| **Resend OTP** | `VerifyOTP.jsx` | `authService.resendOTP` | `/api/auth/resend-otp` | `POST` | No | Public | `{ email }` | `{ success: true, message }` |
| **Login** | `Login.jsx` | `authService.login` | `/api/auth/login` | `POST` | No | Public | `{ email, password }` | `{ success: true, data: { token, user } }` |
| **Current User** | `AuthContext.jsx` | `authService.getMe` | `/api/auth/me` | `GET` | Yes | All | None | `{ success: true, data: { id, email, role, createdAt, profile, company } }` |
| **Google OAuth** | `Login.jsx`, `Register.jsx` | Browser redirect | `/api/auth/google` | `GET` | No | Public | None | Redirects to Google OAuth consent screen |
| **OAuth Callback** | `AuthCallback.jsx` | Extracts token query param | `/api/auth/google/callback` | `GET` | No | Public | None | Redirects to `/auth/callback?token=...` |
| **Get Seeker Profile** | `SeekerProfile.jsx` | `userService.getProfile` | `/api/users/profile` | `GET` | Yes | `SEEKER` | None | `{ success: true, data: Profile & { user } }` |
| **Create Seeker Profile**| `SeekerProfile.jsx` | `userService.createProfile` | `/api/users/profile` | `POST` | Yes | `SEEKER` | `{ fullName, bio, skills, phone, location }` | `{ success: true, data: Profile }` |
| **Update Seeker Profile**| `SeekerProfile.jsx` | `userService.updateProfile` | `/api/users/profile` | `PUT` | Yes | `SEEKER` | `{ fullName, bio, skills, phone, location }` | `{ success: true, data: Profile }` |
| **Upload Resume** | `SeekerProfile.jsx` | `userService.uploadResume` | `/api/users/profile/resume` | `POST` | Yes | `SEEKER` | `FormData` with `resume` file | `{ success: true, data: { resumeUrl, profile } }` |
| **List Approved Companies** | `Companies.jsx` | `companyService.getCompanies` | `/api/companies` | `GET` | No | Public | None | `{ success: true, data: Company[] }` |
| **Company Details** | `CompanyDetails.jsx` | `companyService.getCompanyById` | `/api/companies/:id` | `GET` | No | Public | None | `{ success: true, data: Company & { jobs } }` |
| **My Company Profile** | `CompanyProfile.jsx` | `companyService.getMyCompany` | `/api/companies/my` | `GET` | Yes | `COMPANY` | None | `{ success: true, data: Company & { user } }` |
| **Create Company Profile** | `CompanyProfile.jsx` | `companyService.createCompany` | `/api/companies` | `POST` | Yes | `COMPANY` | `{ name, description, website, location }` | `{ success: true, data: Company }` |
| **Update Company Profile** | `CompanyProfile.jsx` | `companyService.updateCompany` | `/api/companies` | `PUT` | Yes | `COMPANY` | `{ name, description, website, location, logo }` | `{ success: true, data: Company }` |
| **List Public Jobs** | `Jobs.jsx`, `Home.jsx` | `jobService.getJobs` | `/api/jobs` | `GET` | No | Public | Query: `page`, `limit`, `search`, `type`, `location`, `salary` | `{ success: true, data: Job[], pagination }` |
| **Job Details** | `JobDetails.jsx` | `jobService.getJobById` | `/api/jobs/:id` | `GET` | No | Public | None | `{ success: true, data: Job & { company, _count } }` |
| **My Company Jobs** | `ManageJobs.jsx` | `jobService.getMyJobs` | `/api/jobs/my` | `GET` | Yes | `COMPANY` | Query: `page`, `limit` | `{ success: true, data: Job[], pagination }` |
| **Create Job** | `CreateJob.jsx` | `jobService.createJob` | `/api/jobs` | `POST` | Yes | `COMPANY` (Approved) | `{ title, description, location, type, salary, skills, deadline }` | `{ success: true, data: Job }` |
| **Update Job** | `EditJob.jsx` | `jobService.updateJob` | `/api/jobs/:id` | `PUT` | Yes | `COMPANY` | `{ title, description, location, type, salary, skills, deadline }` | `{ success: true, data: Job }` |
| **Delete (Deactivate) Job**| `ManageJobs.jsx` | `jobService.deleteJob` | `/api/jobs/:id` | `DELETE` | Yes | `COMPANY` | None | `{ success: true, message }` |
| **My Applications** | `MyApplications.jsx` | `applicationService.getMyApplications` | `/api/applications/my` | `GET` | Yes | `SEEKER` | Query: `page`, `limit` | `{ success: true, data: Application[], pagination }` |
| **Apply for Job** | `ApplyModal.jsx` | `applicationService.applyForJob` | `/api/applications/jobs/:jobId` | `POST` | Yes | `SEEKER` | `FormData`: `message`, `resume` (optional) | `{ success: true, data: Application }` |
| **Job Applicants** | `JobApplicants.jsx` | `applicationService.getApplicantsForJob` | `/api/applications/jobs/:jobId` | `GET` | Yes | `COMPANY` | Query: `page`, `limit` | `{ success: true, data: Application[], job, pagination }` |
| **Update Application Status** | `JobApplicants.jsx` | `applicationService.updateStatus` | `/api/applications/:id/status` | `PUT` | Yes | `COMPANY` | `{ status: 'ACCEPTED' \| 'REJECTED' }` | `{ success: true, data: Application }` |
| **List Bookmarks** | `Bookmarks.jsx` | `bookmarkService.getBookmarks` | `/api/bookmarks` | `GET` | Yes | `SEEKER` | None | `{ success: true, data: Bookmark[] }` |
| **Add Bookmark** | `JobCard.jsx`, `JobDetails.jsx` | `bookmarkService.addBookmark` | `/api/bookmarks/jobs/:jobId` | `POST` | Yes | `SEEKER` | None | `{ success: true, data: Bookmark }` |
| **Remove Bookmark** | `Bookmarks.jsx`, `JobCard.jsx` | `bookmarkService.removeBookmark` | `/api/bookmarks/jobs/:jobId` | `DELETE` | Yes | `SEEKER` | None | `{ success: true, message }` |
| **List Notifications** | `NotificationDropdown.jsx`, `NotificationsPage.jsx` | `notificationService.getNotifications` | `/api/notifications` | `GET` | Yes | All Authenticated | None | `{ success: true, data: Notification[] }` |
| **Mark Notification Read** | `NotificationDropdown.jsx` | `notificationService.markAsRead` | `/api/notifications/:id/read` | `PATCH` | Yes | All Authenticated | None | `{ success: true, data: Notification }` |
| **Mark All Notifications Read** | `NotificationDropdown.jsx`, `NotificationsPage.jsx` | `notificationService.markAllAsRead` | `/api/notifications/read-all` | `PATCH` | Yes | All Authenticated | None | `{ success: true, message }` |
| **Admin Stats** | `AdminDashboard.jsx` | `adminService.getStats` | `/api/admin/stats` | `GET` | Yes | `ADMIN` | None | `{ success: true, data: { users, companies, jobs, applications } }` |
| **Pending Companies** | `PendingCompanies.jsx` | `adminService.getPendingCompanies` | `/api/admin/companies/pending` | `GET` | Yes | `ADMIN` | Query: `page`, `limit` | `{ success: true, data: Company[], pagination }` |
| **Approve Company** | `PendingCompanies.jsx` | `adminService.approveCompany` | `/api/admin/companies/:id/approve` | `PUT` | Yes | `ADMIN` | None | `{ success: true, data: Company }` |
| **Reject Company** | `PendingCompanies.jsx` | `adminService.rejectCompany` | `/api/admin/companies/:id/reject` | `PUT` | Yes | `ADMIN` | None | `{ success: true, data: Company }` |
| **Admin List Users** | `ManageUsers.jsx` | `adminService.getAllUsers` | `/api/admin/users` | `GET` | Yes | `ADMIN` | Query: `page`, `limit` | `{ success: true, data: User[], pagination }` |
| **Admin Delete User** | `ManageUsers.jsx` | `adminService.deleteUser` | `/api/admin/users/:id` | `DELETE` | Yes | `ADMIN` | None | `{ success: true, message }` |
| **Admin List Jobs** | `ManageAllJobs.jsx` | `adminService.getAllJobs` | `/api/admin/jobs` | `GET` | Yes | `ADMIN` | Query: `page`, `limit` | `{ success: true, data: Job[], pagination }` |
| **Admin Hard Delete Job** | `ManageAllJobs.jsx` | `adminService.deleteJob` | `/api/admin/jobs/:id` | `DELETE` | Yes | `ADMIN` | None | `{ success: true, message }` |

---

## 3. Real-Time Socket Events

- **URL**: `http://localhost:5000`
- **Handshake Payload**: `{ auth: { token: '<jwt_token>' } }`
- **Server Room Join**: `user_${userId}`
- **Server to Client Event**: `'notification'`
  - Sent whenever an application status is modified or a new notification is created.
  - Client updates notification state, increments unread counter, and renders a toast notification.
