import { useEffect, useState } from 'react';
import { Package, AlertCircle, Wrench, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<any>({
    totalAssets: 0,
    openIssues: 0,
    criticalIssues: 0,
    assetsOutOfService: 0,
    overdueService: 0,
  });
  const [recentIssues, setRecentIssues] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, issuesRes] = await Promise.all([
          api.get('/analytics/summary'),
          api.get('/issues')
        ]);
        setSummary(summaryRes.data);
        
        // Filter for open issues and sort by date for recent
        const open = issuesRes.data
          .filter((i: any) => i.status === 'Reported' || i.status === 'Assigned')
          .slice(0, 5);
        setRecentIssues(open);
      } catch(e) {
        console.error('Failed to fetch dashboard data', e);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Assets', value: summary.totalAssets, icon: Package, color: 'text-primary-500' },
    { label: 'Open Issues', value: summary.openIssues, icon: AlertCircle, color: 'text-status-issue' },
    { label: 'Critical Issues', value: summary.criticalIssues, icon: AlertCircle, color: 'text-status-oos' },
    { label: 'Assets Out of Service', value: summary.assetsOutOfService, icon: Wrench, color: 'text-status-oos' },
    { label: 'Overdue Next-Service', value: summary.overdueService, icon: Activity, color: 'text-status-maintenance' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
        <button className="btn-primary">Generate Report</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 bg-slate-50 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Needs Attention (Open Issues)</h3>
          <div className="space-y-4">
            
            {recentIssues.length === 0 ? (
              <p className="text-slate-500 text-sm">No open issues require attention right now.</p>
            ) : (
              recentIssues.map(issue => (
                <div key={issue.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                        issue.priority === 'Critical' ? 'bg-red-100 text-red-700 border-red-200' :
                        issue.priority === 'High' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                        issue.priority === 'Medium' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        'bg-blue-100 text-blue-700 border-blue-200'
                      }`}>
                        {issue.priority.toUpperCase()}
                      </span>
                      <span className="font-semibold text-slate-900">{issue.title}</span>
                    </div>
                    <span className="text-sm text-slate-500">Asset: {issue.asset?.code || 'Unknown'} • Status: {issue.status}</span>
                  </div>
                  <button 
                    onClick={() => navigate(`/admin/issues/${issue.id}`)}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    Assign
                  </button>
                </div>
              ))
            )}
            </div>
          </div>

        <div className="col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {/* Timeline mock */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-status-operational text-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-slate-900 text-sm">Issue Resolved</div>
                  <time className="font-mono text-xs text-slate-500">10:45 AM</time>
                </div>
                <div className="text-sm text-slate-500">Sarah Jenkins resolved ISS-2930.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
