import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';
import PublicAsset from './pages/public/PublicAsset';
import PublicReportIssue from './pages/public/PublicReportIssue';
import PublicIssueStatus from './pages/public/PublicIssueStatus';

import AdminAssets from './pages/admin/AdminAssets';
import AdminAssetForm from './pages/admin/AdminAssetForm';
import AdminIssues from './pages/admin/AdminIssues';
import AdminIssueDetail from './pages/admin/AdminIssueDetail';
import TechnicianIssueWorkflow from './pages/technician/TechnicianIssueWorkflow';
import SupervisorReview from './pages/supervisor/SupervisorReview';

import AdminTechnicians from './pages/admin/AdminTechnicians';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';
import TechnicianHistory from './pages/technician/TechnicianHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Public Routes - No Layout Sidebar */}
        <Route path="/asset/:code" element={<PublicAsset />} />
        <Route path="/asset/:code/report" element={<PublicReportIssue />} />
        <Route path="/status" element={<PublicIssueStatus />} />

        {/* Protected Routes inside Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="admin">
            <Route index element={<AdminDashboard />} />
            <Route path="assets" element={<AdminAssets />} />
            <Route path="assets/new" element={<AdminAssetForm />} />
            <Route path="issues" element={<AdminIssues />} />
            <Route path="issues/:id" element={<AdminIssueDetail />} />
            <Route path="technicians" element={<AdminTechnicians />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          <Route path="technician">
            <Route index element={<TechnicianDashboard />} />
            <Route path="issue/:id" element={<TechnicianIssueWorkflow />} />
            <Route path="history" element={<TechnicianHistory />} />
          </Route>
          <Route path="supervisor">
            <Route index element={<SupervisorDashboard />} />
            <Route path="reviews" element={<SupervisorDashboard />} />
            <Route path="reviews/:id" element={<SupervisorReview />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
