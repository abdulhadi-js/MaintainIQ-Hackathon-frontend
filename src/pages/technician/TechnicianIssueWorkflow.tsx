import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, ClipboardCheck, Clock, Upload, Wrench, Loader2 } from 'lucide-react';
import api from '../../utils/api';

export default function TechnicianIssueWorkflow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [notes, setNotes] = useState('');
  const [issue, setIssue] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await api.get(`/issues/${id}`);
        setIssue(res.data);
      } catch (err) {
        console.error('Failed to fetch issue', err);
        // Fallback mock
        setIssue({
          id: id || 'ISS-2941',
          asset: { code: 'HVAC-ROOF-01', name: 'Main HVAC Unit' },
          title: 'Main HVAC Failure',
          priority: 'CRITICAL',
          description: 'The unit is making a loud grinding noise and cooling has stopped completely. Noticed water pooling around the base.',
          reporterName: 'Sarah Jenkins',
          createdAt: new Date().toISOString(),
          aiSuggestedCauses: ['Failed compressor motor', 'Blocked condensate drain', 'Refrigerant leak causing freezing'],
          aiInitialChecks: ['Ensure power is off before inspecting motor', 'Check drain pan for blockages', 'Inspect coils for ice buildup']
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchIssue();
  }, [id]);

  const handleResolve = async () => {
    setIsSaving(true);
    try {
      await api.post('/maintenance', {
        issueId: issue.id,
        workPerformed: notes,
        resolveIssue: true,
        finalCondition: 'Good'
      });
      setStep(3);
    } catch (err) {
      console.error('Failed to save maintenance', err);
      alert('Failed to resolve issue.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartInspection = async () => {
    try {
      await api.patch(`/issues/${issue.id}/status`, { status: 'Inspection Started' });
      setStep(2);
    } catch (err) {
      console.error(err);
      setStep(2);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading issue details...</div>;
  }

  if (!issue) {
    return <div className="p-8 text-center text-slate-500">Issue not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-slate-900">{issue.title}</h2>
            <span className="text-xs font-mono bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200">
              {issue.priority}
            </span>
          </div>
          <div className="text-slate-500 font-mono text-sm">
            {issue.id} • {issue.asset?.code} ({issue.asset?.name})
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 -z-10" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-500 -z-10 transition-all duration-500" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }} />
          
          <div className="flex flex-col items-center gap-2 bg-white px-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-slate-200 bg-white text-slate-400'}`}>
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <span className={`text-xs font-medium ${step >= 1 ? 'text-primary-700' : 'text-slate-500'}`}>Assigned</span>
          </div>
          <div className="flex flex-col items-center gap-2 bg-white px-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-slate-200 bg-white text-slate-400'}`}>
              <Wrench className="w-5 h-5" />
            </div>
            <span className={`text-xs font-medium ${step >= 2 ? 'text-primary-700' : 'text-slate-500'}`}>In Progress</span>
          </div>
          <div className="flex flex-col items-center gap-2 bg-white px-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-status-operational bg-status-operational/10 text-status-operational' : 'border-slate-200 bg-white text-slate-400'}`}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className={`text-xs font-medium ${step >= 3 ? 'text-status-operational' : 'text-slate-500'}`}>Resolved</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col - Context */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider">Report Details</h3>
            <div className="bg-slate-50 p-3 rounded border border-slate-100 text-sm text-slate-700 italic mb-4">
              "{issue.description}"
            </div>
            <div className="text-sm text-slate-500 flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4" /> {new Date(issue.createdAt).toLocaleDateString()} by {issue.reporterName}
            </div>
          </div>

          <div className="bg-blue-50/50 rounded-xl shadow-sm border border-blue-100 p-5">
            <div className="flex items-center gap-2 mb-4 text-blue-800">
              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">✨</div>
              <h3 className="font-semibold text-sm uppercase tracking-wider">AI Suggestions</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-blue-900 uppercase mb-2">Possible Causes</h4>
                <ul className="list-disc pl-4 text-sm text-blue-800 space-y-1">
                  {(issue.aiSuggestedCauses || []).map((cause: string, i: number) => <li key={i}>{cause}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold text-blue-900 uppercase mb-2">Safe Initial Checks</h4>
                <ul className="list-disc pl-4 text-sm text-blue-800 space-y-1">
                  {(issue.aiInitialChecks || []).map((check: string, i: number) => (
                    <li key={i} className={i === 0 ? "font-medium text-red-700" : ""}>{check}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col - Actions */}
        <div className="md:col-span-2">
          {step === 1 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <ClipboardCheck className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to begin?</h3>
              <p className="text-slate-500 mb-8 max-w-sm">Starting the inspection will update the asset status to "Under Inspection" and notify the reporter.</p>
              <button 
                onClick={handleStartInspection}
                className="btn-primary py-3 px-6 text-lg flex items-center gap-2 shadow-md"
              >
                <Wrench className="w-5 h-5" /> Start Inspection
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-200 bg-slate-50">
                <h3 className="font-semibold text-slate-900">Maintenance Log</h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Work Performed / Findings</label>
                  <textarea 
                    className="input-field min-h-[120px] resize-y" 
                    placeholder="Describe what you found and what was fixed..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Parts Used (Optional)</label>
                  <div className="flex gap-3">
                    <input type="text" placeholder="Part name" className="input-field flex-1" />
                    <input type="number" placeholder="Qty" className="input-field w-24" />
                    <button className="btn-secondary whitespace-nowrap">Add Part</button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Evidence / Photos</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-primary-400 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mb-3 text-slate-400" />
                    <span className="font-medium text-sm">Click to upload photos</span>
                    <span className="text-xs mt-1">PNG, JPG up to 10MB</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 flex justify-end gap-3">
                  <button className="btn-secondary text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 flex-1 sm:flex-none">
                    Mark Out of Service
                  </button>
                  <button className="btn-secondary">Save Draft</button>
                  <button 
                    onClick={handleResolve}
                    disabled={notes.length < 10 || isSaving}
                    className="btn-primary flex items-center gap-2"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Resolve Issue
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-100">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Issue Resolved</h3>
              <p className="text-slate-500 mb-8 max-w-sm">The maintenance log has been submitted for supervisor review and the asset is back to Operational status.</p>
              <button 
                onClick={() => navigate('/technician')}
                className="btn-secondary"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
