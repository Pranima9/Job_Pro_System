# Lunar Jobs — Frontend

A production-quality React frontend for the Job & Internship Portal, built with Vite and integrated with the existing Node.js/Express/Prisma backend.

## Tech Stack

- **React 19** — UI library
- **Vite 8** — Build tool & dev server
- **React Router 7** — Client-side routing
- **Axios** — HTTP client
- **Socket.IO Client** — Real-time notifications
- **React Hot Toast** — Toast notifications
- **Lucide React** — Icon library
- **CSS Custom Properties** — Design system (no CSS framework)

## Getting Started

### Prerequisites

- Node.js 18+
- Backend server running on `http://localhost:5000`

### Installation

```bash
cd frontend
npm install
```

### Environment Configuration

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Running the Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### Building for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── api/                    # Axios client & interceptors
├── components/
│   ├── common/             # Reusable UI components
│   ├── layout/             # Navbar, Sidebar, Footer, etc.
│   ├── jobs/               # JobCard, JobFilter, ApplyModal
│   ├── companies/          # CompanyCard
│   ├── applications/       # ApplicationCard
│   └── notifications/      # NotificationDropdown
├── context/                # AuthContext, SocketContext
├── hooks/                  # useAuth, useSocket, useDebounce
├── pages/
│   ├── public/             # Home, Jobs, JobDetails, Companies
│   ├── auth/               # Login, Register, VerifyOTP, AuthCallback
│   ├── seeker/             # Seeker dashboard, profile, applications
│   ├── company/            # Company dashboard, jobs, applications
│   └── admin/              # Admin dashboard, users, companies, jobs
├── routes/                 # AppRoutes.jsx
├── services/               # API service modules
├── utils/                  # Helpers (formatDate, errorHelper, etc.)
├── App.jsx                 # Root component
├── main.jsx                # Entry point
└── index.css               # Design system & global styles
```

## Authentication Flow

1. **Register** → User creates account → OTP sent to email
2. **Verify OTP** → User enters 6-digit code → Account activated → JWT issued
3. **Login** → User enters credentials → JWT issued → Stored in localStorage
4. **Google OAuth** → Redirect to Google → Callback with token → Session established
5. **Session Persistence** → Token in localStorage → AuthContext fet user on mount

## Role-Based Access

| Role | Access |
|------|--------|
| **SEEKER** | Dashboard, Profile, Applications, Bookmarks, Notifications |
| **COMPANY** | Dashboard, Profile, Job Management, Applications |
| **ADMIN** | Dashboard, User Management, Company Approvals, Job Management, Statistics |

## API Integration

All API communication goes through the centralized Axios client (`src/api/client.js`) which:
- Attaches JWT token from localStorage
- Handles 401 responses (session expired)
- Normalizes error responses

## Backend Requirement

This frontend requires the backend server to be running. See the backend README for setup instructions.

## License

ISC
