import React, { useState, useEffect } from 'react';
import { Filter, Search, ChevronDown, CheckCircle2 } from 'lucide-react';
import api from '../../utils/api';

export default function TechnicianHistory() {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/issues');
        // Filter issues assigned to this tech that are resolved or closed
        const myResolved = res.data.filter((i: any) => 
          i.assignedTechnician?.id === user?.id && 
          (i.status === 'Resolved' || i.status === 'Closed')
        );
        setHistory(myResolved);
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchHistory();
    else setLoading(false);
  }, [user?.id]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredHistory = history.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) || 
    item.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">My Maintenance History</h2>
        <p className="text-slate-500 mt-1">Review your previously resolved issues and maintenance logs.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/50">
          <div className="relative max-w-md w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search history..." 
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
                <th className="p-4 font-semibold w-12"></th>
                <th className="p-4 font-semibold">Issue ID & Title</th>
                <th className="p-4 font-semibold">Asset</th>
                <th className="p-4 font-semibold">Resolution Date</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading history...</td></tr>
              ) : filteredHistory.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No resolved issues found in your history.</td></tr>
              ) : filteredHistory.map((item) => (
                <React.Fragment key={item.id}>
                  <tr 
                    onClick={() => toggleExpand(item.id)}
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                  >
                    <td className="p-4 text-slate-400">
                      <ChevronDown className={`w-5 h-5 transition-transform ${expandedId === item.id ? 'rotate-180' : ''}`} />
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{item.title}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{item.id}</div>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-700">{item.asset?.code || 'Unknown'}</td>
                    <td className="p-4 text-sm text-slate-500">{new Date(item.updatedAt || item.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-status-operational bg-status-operational/10 px-2 py-1 rounded-full border border-status-operational/20">
                        <CheckCircle2 className="w-3 h-3" /> {item.status}
                      </span>
                    </td>
                  </tr>
                  {expandedId === item.id && (
                    <tr className="bg-slate-50 border-t border-slate-100">
                      <td colSpan={5} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Original Description</h4>
                            <p className="text-sm text-slate-700 bg-white p-3 border border-slate-200 rounded">{item.description}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Maintenance Notes</h4>
                            <p className="text-sm text-slate-700 bg-white p-3 border border-slate-200 rounded">{item.maintenanceRecords?.[0]?.workPerformed || 'No notes available'}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
