import { useState, useEffect } from 'react';
import { Clock, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

export default function TechnicianDashboard() {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    const fetchMyIssues = async () => {
      try {
        const res = await api.get('/issues');
        // Filter issues assigned to this tech
        const myIssues = res.data.filter((i: any) => i.assignedTechnician?.id === user?.id);
        setIssues(myIssues);
      } catch (err) {
        console.error('Failed to fetch assigned issues', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchMyIssues();
    else setLoading(false);
  }, [user?.id]);

  const pending = issues.filter(i => i.status === 'Assigned' || i.status === 'Reported').length;
  const inProgress = issues.filter(i => i.status === 'In Progress' || i.status === 'Inspection Started' || i.status === 'Maintenance in Progress').length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Good morning, {user?.name?.split(' ')[0] || 'Technician'}</h2>
          <p className="text-slate-500 mt-1">You have {issues.length} issues assigned to you today.</p>
        </div>
        <div className="flex gap-4">
          <div className="text-center bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
            <div className="text-2xl font-bold text-status-issue">{pending}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wide">Pending</div>
          </div>
          <div className="text-center bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
            <div className="text-2xl font-bold text-status-maintenance">{inProgress}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wide">In Progress</div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-200 overflow-x-auto pb-1">
        <button className="pb-2 border-b-2 border-primary-500 text-primary-600 font-medium text-sm whitespace-nowrap">All Assigned</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full p-8 text-center text-slate-500">Loading assignments...</div>
        ) : issues.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white rounded-xl border border-slate-200 shadow-sm text-slate-500">
            No issues currently assigned to you.
          </div>
        ) : (
          issues.map(issue => (
            <div key={issue.id} className={`bg-white rounded-xl shadow-sm border p-5 relative overflow-hidden ${
              issue.priority === 'Critical' ? 'border-red-200' : 'border-slate-200'
            }`}>
              <div className={`absolute top-0 left-0 w-1 h-full ${
                issue.priority === 'Critical' ? 'bg-red-500' : 
                issue.priority === 'High' ? 'bg-orange-500' :
                issue.priority === 'Medium' ? 'bg-amber-500' : 'bg-slate-300'
              }`} />
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded border mb-2 inline-block ${
                    issue.priority === 'Critical' ? 'bg-red-100 text-red-700 border-red-200' :
                    issue.priority === 'High' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                    issue.priority === 'Medium' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                    'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {issue.priority.toUpperCase()}
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg">{issue.title}</h3>
                  <p className="text-sm text-slate-500 font-mono mt-1">Asset: {issue.asset?.code || 'Unknown'}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded">
                  <Clock className="w-3 h-3" /> {new Date(issue.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                <span className={`text-sm font-medium ${
                  issue.status === 'Assigned' ? 'text-blue-600' :
                  issue.status.includes('Progress') ? 'text-status-maintenance' : 'text-slate-600'
                }`}>
                  {issue.status}
                </span>
                <Link to={`/technician/issue/${issue.id}`} className="btn-primary py-1.5 px-3 text-sm flex items-center gap-2">
                  <Wrench className="w-4 h-4" /> Go to Work Order
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
