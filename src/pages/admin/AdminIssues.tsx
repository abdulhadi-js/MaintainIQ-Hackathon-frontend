import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import api from '../../utils/api';

export default function AdminIssues() {
  const [search, setSearch] = useState('');
  const [issues, setIssues] = useState<any[]>([]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await api.get('/issues');
        setIssues(res.data);
      } catch (err) {
        console.error('Failed to fetch issues', err);
        // Fallback mock data
        setIssues([
          { id: 'ISS-2941', asset: { code: 'HVAC-ROOF-01' }, title: 'Main HVAC Failure', priority: 'CRITICAL', status: 'Reported', reporterName: 'Sarah Jenkins', assignedTechnician: null, createdAt: new Date().toISOString() },
        ]);
      }
    };
    fetchIssues();
  }, []);

  const getPriorityBadge = (priority: string) => {
    switch(priority.toUpperCase()) {
      case 'CRITICAL': return 'bg-red-100 text-red-700 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'MEDIUM': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Reported': return 'bg-status-issue/10 text-status-issue border-status-issue/20';
      case 'Assigned': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'In Progress': return 'bg-status-maintenance/10 text-status-maintenance border-status-maintenance/20';
      case 'Resolved': return 'bg-status-operational/10 text-status-operational border-status-operational/20';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Issues List</h2>
          <p className="text-slate-500 mt-1">Manage and assign reported maintenance issues.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/50">
          <div className="relative max-w-md w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search issues..." 
              className="input-field pl-10 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary flex items-center gap-2 bg-white">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                <th className="p-4 font-semibold">Issue #</th>
                <th className="p-4 font-semibold">Asset</th>
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Priority</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Technician</th>
                <th className="p-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {issues.map((issue) => (
                <tr key={issue.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                  <td className="p-4">
                    <Link to={`/admin/issues/${issue.id}`} className="font-mono text-sm font-medium text-primary-600 hover:underline">
                      {issue.id}
                    </Link>
                  </td>
                  <td className="p-4 font-mono text-sm text-slate-600">{issue.asset?.code || 'N/A'}</td>
                  <td className="p-4 font-medium text-slate-900">{issue.title}</td>
                  <td className="p-4">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded border ${getPriorityBadge(issue.priority)}`}>
                      {issue.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusBadge(issue.status)}`}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {!issue.assignedTechnician ? (
                      <button className="text-sm text-primary-600 font-medium hover:text-primary-700">Assign</button>
                    ) : (
                      <span className="text-sm text-slate-600">{issue.assignedTechnician?.name || 'Assigned'}</span>
                    )}
                  </td>
                  <td className="p-4 text-slate-500 text-sm">{new Date(issue.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
