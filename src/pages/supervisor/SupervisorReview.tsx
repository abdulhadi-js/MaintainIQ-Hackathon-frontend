import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ClipboardCheck, Clock, FileText, Image as ImageIcon } from 'lucide-react';
import api from '../../utils/api';

export default function SupervisorReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reopenReason, setReopenReason] = useState('');

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await api.get(`/issues/${id}`);
        setIssue(res.data);
      } catch (err) {
        console.error('Failed to load issue for review', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchIssue();
  }, [id]);

  const handleApprove = async () => {
    try {
      await api.patch(`/issues/${id}/status`, { status: 'Closed' });
      navigate('/supervisor');
    } catch (err) {
      console.error(err);
      alert('Failed to approve issue.');
    }
  };

  const handleReject = async () => {
    if (!reopenReason.trim()) {
      alert('Please provide a reason for reopening.');
      return;
    }
    try {
      await api.patch(`/issues/${id}/status`, { status: 'Reopened' });
      // In a real app we'd also log the reopen reason to the maintenance record or history
      navigate('/supervisor');
    } catch (err) {
      console.error(err);
      alert('Failed to reject issue.');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading issue details...</div>;
  if (!issue) return <div className="p-8 text-center text-red-500">Issue not found.</div>;

  const maintenance = issue.maintenanceRecords?.[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <Link to="/supervisor" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Queue
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-slate-900">{issue.title}</h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-blue-100 text-blue-700 border-blue-200 flex items-center gap-1">
              <ClipboardCheck className="w-3 h-3" /> Pending Review
            </span>
          </div>
          <div className="text-slate-500 font-mono text-sm">
            {issue.id} • {issue.asset?.code} ({issue.asset?.name})
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 font-semibold text-slate-900">
              Resolution Details
            </div>
            <div className="p-6 space-y-6">
              <div>
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Original Complaint</div>
                <p className="text-slate-700 text-sm italic border-l-2 border-slate-300 pl-3 py-1">
                  "{issue.description}"
                </p>
              </div>

              <div>
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Maintenance Notes</div>
                <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 text-sm text-blue-800 mb-2 font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Resolved by {maintenance?.technician?.name || issue.assignedTechnician?.name || 'Technician'}
                  </div>
                  <p className="text-slate-700 text-sm">
                    {maintenance?.workPerformed || 'No work details provided.'}
                  </p>
                  <div className="mt-3 text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Completed {new Date(maintenance?.createdAt || issue.updatedAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Parts & Cost
                </div>
                <div className="text-sm text-slate-500 italic">No parts recorded for this maintenance event.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 font-semibold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-slate-500" /> Evidence Photos
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">Reported</div>
                <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 text-slate-400 overflow-hidden">
                  {issue.evidenceUrls?.length > 0 ? (
                    <img src={issue.evidenceUrls[0]} alt="Before" className="w-full h-full object-cover" />
                  ) : (
                    <span>No Photo</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">Resolved</div>
                <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 text-slate-400 overflow-hidden">
                  <span>No Photo</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wider">Supervisor Actions</h3>
            
            <div className="space-y-4">
              <button onClick={handleApprove} className="btn-primary w-full py-3 text-lg bg-status-operational hover:bg-green-600 focus:ring-green-500 border-none">
                Approve & Close Issue
              </button>
              
              <div className="pt-4 border-t border-slate-200">
                <label className="block text-sm font-medium text-slate-700 mb-2">Reopen Reason (Required if rejecting)</label>
                <textarea value={reopenReason} onChange={e => setReopenReason(e.target.value)} className="input-field w-full text-sm mb-3" rows={2} placeholder="Explain why this needs more work..." />
                <button onClick={handleReject} className="btn-secondary w-full text-red-600 border-red-200 hover:bg-red-50">
                  Reject & Reopen Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
