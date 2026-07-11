# MaintainIQ Frontend

The frontend user interface for MaintainIQ, designed to provide a seamless, mobile-responsive experience for public users scanning QR codes, and powerful administrative tools for technicians and supervisors. 

Built with **React**, **Vite**, and **Tailwind CSS v4**.

## Sample Test Credentials
You can log in to the system using the following roles to test out the different dashboards. (Ensure the backend is running and seeded first).
* **Admin** 
  * Email: `admin@maintainiq.com`
  * Password: `password123`
* **Technician** 
  * Email: `technician@maintainiq.com`
  * Password: `password123`
* **Supervisor** 
  * Email: `supervisor@maintainiq.com`
  * Password: `password123`

## Application Routes & Workflows

### Public (No Auth Required)
* `/asset/:code` - View an asset's public dashboard
* `/asset/:code/report` - Scan a QR code and report an issue directly (features AI-driven triage and inline photo uploads)
* `/status` - Check the status of a reported issue

### Authentication
* `/login` - Role-based login gateway

### Admin Portal
* `/admin` - Dashboard overview of open tickets, system health, and general KPIs
* `/admin/assets` - Asset management (create, update, generate QR codes)
* `/admin/issues` - Issue tracking and assignment view
* `/admin/technicians` - Manage team members and register new accounts
* `/admin/analytics` - System metrics
* `/admin/settings` - Platform settings

### Technician Portal
* `/technician` - Primary dashboard. View assigned open tickets
* `/technician/issue/:id` - Active ticket execution (Progress from Assigned -> Inspection Started -> Resolved)
* `/technician/history` - History tab to view previously closed out tickets and recorded maintenance logs

### Supervisor Portal
* `/supervisor` - Quality assurance portal queueing all `Resolved` tickets
* `/supervisor/review/:id` - Evaluation screen where a supervisor can Approve (closes out ticket) or Reject (reopens with a reason)

## Tech Stack
* **Framework:** React 18 + Vite
* **Routing:** React Router v6
* **Styling:** Tailwind CSS v4 (with modern `@tailwindcss/vite` configuration)
* **Icons:** Lucide React
* **API Calls:** Axios (configured with JWT interceptors)

## Prerequisites
* Node.js (v18 or higher recommended)

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Environment Variables:
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:3000/api/v1
   ```

## Running the App

```bash
# development server
npm run dev

# build for production
npm run build

# preview production build
npm run preview
```

## Structure
* `src/components/` - Reusable UI elements (Layouts, Modals, Forms)
* `src/pages/` - Page-level components divided by role (`admin/`, `technician/`, `supervisor/`, `public/`)
* `src/utils/` - Utility functions, including the centralized Axios `api.ts` client.
* `src/index.css` - Global styles and Tailwind configuration imports.

## Authentication
Authentication relies on the backend issuing a JWT, which is stored in `localStorage`. The Axios interceptor (`src/utils/api.ts`) automatically attaches this token to all outgoing requests. Role-based routing automatically redirects users to their respective dashboards upon login.

## License
UNLICENSED
