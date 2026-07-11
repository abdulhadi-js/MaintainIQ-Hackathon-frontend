import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, MoreVertical, QrCode } from 'lucide-react';
import api from '../../utils/api';

export default function AdminAssets() {
  const [search, setSearch] = useState('');
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await api.get('/assets');
        setAssets(res.data);
      } catch (err) {
        console.error('Failed to fetch assets', err);
        // Fallback mock data
        setAssets([
          { id: '1', code: 'PROJ-101', name: 'Classroom Projector 01', category: 'Electrical', location: 'Room 101', status: 'Operational', nextServiceDate: '2026-06-15' },
          { id: '2', code: 'HVAC-ROOF-01', name: 'Main HVAC Unit', category: 'HVAC', location: 'Roof North', status: 'Out of Service', nextServiceDate: '2026-05-20' }
        ]);
      }
    };
    fetchAssets();
  }, []);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Operational': return 'bg-status-operational/10 text-status-operational border-status-operational/20';
      case 'Out of Service': return 'bg-status-oos/10 text-status-oos border-status-oos/20';
      case 'Under Maintenance': return 'bg-status-maintenance/10 text-status-maintenance border-status-maintenance/20';
      case 'Issue Reported': return 'bg-status-issue/10 text-status-issue border-status-issue/20';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Asset Management</h2>
          <p className="text-slate-500 mt-1">View, track, and register facility assets.</p>
        </div>
        <Link to="/admin/assets/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Register New Asset
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/50">
          <div className="relative max-w-md w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by asset name or code..." 
              className="input-field pl-10 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary flex items-center gap-2 bg-white">
              <Filter className="w-4 h-4" /> Filters
            </button>
            <button className="btn-secondary flex items-center gap-2 bg-white">
              <QrCode className="w-4 h-4" /> Bulk QR Labels
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                <th className="p-4 font-semibold">Asset Code</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Next Service</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded text-slate-700 border border-slate-200">
                      {asset.code}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-900">{asset.name}</td>
                  <td className="p-4 text-slate-600 text-sm">{asset.category}</td>
                  <td className="p-4 text-slate-600 text-sm">{asset.location}</td>
                  <td className="p-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusBadge(asset.status)}`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 text-sm">{asset.nextServiceDate || asset.nextService || 'N/A'}</td>
                  <td className="p-4 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-primary-600 rounded transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-sm text-slate-600">
          <span>Showing 1 to 4 of 4 assets</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-300 rounded bg-white text-slate-400 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-slate-300 rounded bg-white text-slate-400 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
