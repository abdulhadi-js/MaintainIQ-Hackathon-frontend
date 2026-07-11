import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Sparkles, AlertTriangle } from 'lucide-react';
import api from '../../utils/api';

export default function AdminIssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<any>(null);
  const [techs, setTechs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTech, setSelectedTech] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [issueRes, techsRes] = await Promise.all([
          api.get(`/issues/${id}`),
          api.get('/users/technicians')
        ]);
        setIssue(issueRes.data);
        setTechs(techsRes.data);
      } catch (err) {
        console.error('Failed to load issue or techs', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadData();
  }, [id]);

  const handleAssign = async () => {
    if (!selectedTech) return;
    try {
      await api.post(`/issues/${id}/assign`, { technicianId: selectedTech });
      alert('Technician assigned successfully!');
      navigate('/admin/issues');
    } catch(err) {
      console.error('Failed to assign tech', err);
      alert('Failed to assign technician.');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading issue details...</div>;
  if (!issue) return <div className="p-8 text-center text-red-500">Issue not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <Link to="/admin/issues" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Issues
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-slate-900">{issue.title}</h2>
            <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
              issue.priority === 'Critical' ? 'bg-red-100 text-red-700 border-red-200' :
              issue.priority === 'High' ? 'bg-orange-100 text-orange-700 border-orange-200' :
              issue.priority === 'Medium' ? 'bg-amber-100 text-amber-700 border-amber-200' :
              'bg-blue-100 text-blue-700 border-blue-200'
            }`}>
              {issue.priority.toUpperCase()}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-status-issue/10 text-status-issue border-status-issue/20">
              {issue.status}
            </span>
          </div>
          <div className="text-slate-500 font-mono text-sm">
            {issue.id} • {issue.asset?.code || 'Unknown Asset'} ({issue.asset?.name || 'N/A'})
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider">Original Report</h3>
            <div className="bg-slate-50 p-4 rounded border border-slate-100 text-slate-700 italic mb-4">
              "{issue.description}"
            </div>
            <div className="text-sm text-slate-500 flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4" /> Reported by {issue.reporterName || 'Unknown'} ({new Date(issue.createdAt).toLocaleDateString()})
            </div>
          </div>

          {issue.aiInsights && (
            <div className="bg-blue-50/50 rounded-xl shadow-sm border border-blue-100 p-6">
              <div className="flex items-center gap-2 mb-4 text-blue-800">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-sm uppercase tracking-wider">AI Diagnostic Insights</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-800 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> Potential Causes
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
                    {issue.aiInsights.causes?.map((cause: string, i: number) => (
                      <li key={i}>{cause}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-800 mb-2">Recommended Checks</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
                    {issue.aiInsights.checks?.map((check: string, i: number) => (
                      <li key={i}>{check}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wider">Dispatch Technician</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assign To</label>
                <select 
                  className="input-field bg-slate-50"
                  value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value)}
                >
                  <option value="">Select a technician...</option>
                  {techs.map((tech) => (
                    <option key={tech.id} value={tech.id}>
                      {tech.name} - {tech.specialty || 'General'}
                    </option>
                  ))}
                </select>
              </div>
              <button 
                onClick={handleAssign}
                disabled={!selectedTech}
                className="btn-primary w-full"
              >
                Dispatch Work Order
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wider">Admin Actions</h3>
            <div className="space-y-3">
              <button className="btn-secondary w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">Mark Out of Service</button>
              <button className="btn-secondary w-full text-slate-500" disabled>Close Issue</button>
            </div>
            <p className="text-xs text-slate-400 mt-3 text-center">Issues can only be closed after a technician marks them resolved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
