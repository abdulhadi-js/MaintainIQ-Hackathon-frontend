import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

export default function SupervisorDashboard() {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingReviews = async () => {
      try {
        const res = await api.get('/issues');
        // Filter issues that are marked as Resolved and pending supervisor approval
        setIssues(res.data.filter((i: any) => i.status === 'Resolved'));
      } catch (err) {
        console.error('Failed to fetch pending reviews', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingReviews();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Quality Review</h2>
          <p className="text-slate-500 mt-1">Review resolved issues before closing them permanently.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-semibold text-slate-900">Pending Approval Queue</h3>
          </div>
          <div className="p-0">
            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading pending reviews...</div>
            ) : issues.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No issues currently pending review.</div>
            ) : (
              issues.map((issue) => (
                <div key={issue.id} className="p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-900">{issue.id}: {issue.title}</span>
                      <span className="text-xs font-mono text-slate-500">Asset: {issue.asset?.code || 'Unknown'}</span>
                    </div>
                    <div className="text-sm text-slate-600 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-status-operational" />
                      Resolved by {issue.assignedTechnician?.name || 'Technician'} ({new Date(issue.updatedAt).toLocaleDateString()})
                    </div>
                  </div>
                  <Link to={`/supervisor/reviews/${issue.id}`} className="btn-secondary py-1.5 px-4 text-sm">Review</Link>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Review Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Pending Reviews</span>
                <span className="font-bold text-slate-900">{issues.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Approved Today</span>
                <span className="font-bold text-status-operational">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Rejected (Sent Back)</span>
                <span className="font-bold text-red-600">0</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-2">Reopen Rate</h3>
            <div className="text-3xl font-bold text-status-issue">4.2%</div>
            <p className="text-sm text-slate-500 mt-1">Issues reopened after resolution this month.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
