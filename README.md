# MaintainIQ Frontend

The frontend user interface for MaintainIQ, designed to provide a seamless, mobile-responsive experience for public users scanning QR codes, and powerful administrative tools for technicians and supervisors. 

Built with **React**, **Vite**, and **Tailwind CSS v4**.

## Features & Workflows
* **Public QR Reporting (`/asset/:code/report`):** Allows unauthorized users to scan a QR code and report an issue. Features AI-driven triage (automatic priority/category generation) and inline photo uploads.
* **Admin Dashboard (`/admin`):** Complete overview of open tickets, system health, and asset creation. Includes team management and direct ticket assignment.
* **Technician Execution (`/technician`):** Ticket queues for technicians to claim, inspect, and resolve issues. Includes a history tab to view previously closed out tickets and recorded maintenance logs.
* **Supervisor Review (`/supervisor`):** Quality assurance portal where supervisors evaluate resolved tickets. Supervisors can approve (close out) or reject (re-open with a reason) tickets.

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
