import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Camera, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import api from '../../utils/api';

export default function PublicReportIssue() {
  const { code } = useParams();
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock AI response state
  const [aiAnalysis, setAiAnalysis] = useState({
    title: 'AC Unit Leaking Water',
    category: 'HVAC',
    priority: 'MEDIUM',
    causes: ['Clogged condensate drain line', 'Frozen evaporator coils', 'Damaged drain pan'],
    checks: ['Turn off the unit immediately if water is near electrical outlets', 'Check if the air filter is dirty/blocked'],
  });

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    try {
      // Call the AI Triage backend endpoint
      const res = await api.post('/ai/triage', { 
        complaint: description,
        assetCode: code || 'PROJ-101'
      });
      
      setAiAnalysis({
        title: res.data.title || 'Unknown Issue',
        category: res.data.category || 'General',
        priority: (res.data.priority || 'MEDIUM').toUpperCase(),
        causes: res.data.possibleCauses || [],
        checks: res.data.initialChecks || [],
      });
    } catch (err) {
      console.error('Failed to get AI triage', err);
      // Fallback to mock/default data on failure
    } finally {
      setIsAnalyzing(false);
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    setIsAnalyzing(true);
    try {
      await api.post('/issues', {
        assetCode: code || 'PROJ-101',
        title: aiAnalysis.title,
        description,
        category: aiAnalysis.category || 'General',
        priority: aiAnalysis.priority.charAt(0).toUpperCase() + aiAnalysis.priority.slice(1).toLowerCase(),
        reporterName: 'Anonymous User', // For public submission
        aiSuggestedDetails: aiAnalysis,
        evidenceUrls: photoUrl ? [photoUrl] : []
      });
      setStep(3);
    } catch(err) {
      console.error('Failed to submit issue', err);
      alert('Failed to submit issue');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      <div className="w-full max-w-lg bg-white min-h-screen shadow-sm pb-20">
        
        {/* Header */}
        <div className="bg-slate-850 text-white p-6 pb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-sm">IQ</span>
              MaintainIQ
            </h1>
          </div>
          <h2 className="text-xl font-bold">Report an Issue</h2>
          <div className="text-slate-300 text-sm mt-1">
            Asset: <span className="font-mono bg-slate-800 px-1.5 rounded">{code || 'PROJ-101'}</span>
          </div>
        </div>

        <div className="p-6">
          {/* Stepper Progress */}
          <div className="flex items-center mb-8">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400'}`}>1</div>
            <div className={`flex-1 h-1 ${step >= 2 ? 'bg-primary-600' : 'bg-slate-100'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400'}`}>2</div>
            <div className={`flex-1 h-1 ${step >= 3 ? 'bg-primary-600' : 'bg-slate-100'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400'}`}>3</div>
          </div>

          {/* STEP 1: COMPLAINT INPUT */}
          {step === 1 && (
            <form onSubmit={handleAnalyze} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Describe the problem in your own words</label>
                <textarea 
                  required
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field w-full text-base"
                  placeholder="e.g., The AC is leaking water, making unusual noise, and cooling is weak."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Attach Photo/Video (Optional)</label>
                <label className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 bg-slate-50/50 cursor-pointer hover:bg-slate-100 transition-colors">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setPhotoUrl(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }} />
                  {photoUrl ? (
                    <img src={photoUrl} alt="Preview" className="max-h-32 rounded-lg object-contain" />
                  ) : (
                    <>
                      <Camera className="w-8 h-8 mb-2 text-slate-400" />
                      <span className="font-medium text-sm text-center">Tap to take a photo or upload</span>
                    </>
                  )}
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Your Contact Info (Optional)</label>
                <input type="text" placeholder="Name or Room Number" className="input-field mb-3" />
                <input type="email" placeholder="Email for status updates" className="input-field" />
              </div>

              <button 
                type="submit" 
                disabled={isAnalyzing || description.length < 5}
                className="btn-primary w-full py-4 text-lg shadow-md flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    Continue <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: AI TRIAGE REVIEW */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="w-24 h-24 text-blue-500" />
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-blue-900">AI Suggested Details</h3>
                </div>

                <div className="space-y-4 relative z-10">
                  <div>
                    <label className="text-xs font-semibold text-blue-800 uppercase tracking-wider">Suggested Title</label>
                    <input type="text" value={aiAnalysis.title} onChange={e => setAiAnalysis({...aiAnalysis, title: e.target.value})} className="input-field bg-white/80 border-blue-200 focus:border-blue-500 mt-1" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-blue-800 uppercase tracking-wider">Category</label>
                      <select value={aiAnalysis.category} onChange={e => setAiAnalysis({...aiAnalysis, category: e.target.value})} className="input-field bg-white/80 border-blue-200 mt-1">
                        <option>HVAC</option>
                        <option>Electrical</option>
                        <option>Hardware</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-blue-800 uppercase tracking-wider">Priority</label>
                      <select value={aiAnalysis.priority} onChange={e => setAiAnalysis({...aiAnalysis, priority: e.target.value})} className="input-field bg-white/80 border-blue-200 mt-1">
                        <option>LOW</option>
                        <option>MEDIUM</option>
                        <option>HIGH</option>
                        <option>CRITICAL</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-white/60 p-3 rounded border border-blue-100">
                    <h4 className="text-xs font-bold text-blue-900 uppercase mb-2">Possible Causes</h4>
                    <ul className="list-disc pl-4 text-sm text-slate-700 space-y-1">
                      {aiAnalysis.causes.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>

                  <div className="bg-red-50 border border-red-100 p-3 rounded">
                    <h4 className="text-xs font-bold text-red-800 flex items-center gap-1 mb-2">
                      <AlertTriangle className="w-4 h-4" /> Safety Notice
                    </h4>
                    <ul className="list-disc pl-4 text-sm text-red-700 space-y-1">
                      {aiAnalysis.checks.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-sm text-slate-600 text-center mb-4">
                  The AI output is advisory only. Please review and adjust the details before submitting.
                </p>
                <button 
                  onClick={handleSubmit}
                  disabled={isAnalyzing}
                  className="btn-primary w-full py-4 text-lg shadow-md flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Issue'
                  )}
                </button>
                <button 
                  onClick={() => setStep(1)}
                  className="w-full py-3 text-sm text-slate-500 font-medium mt-2"
                >
                  Go Back
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 3 && (
            <div className="text-center py-12 animate-in fade-in zoom-in">
              <div className="w-24 h-24 bg-green-50 border-4 border-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Issue Reported!</h2>
              <p className="text-slate-600 mb-6">Your report has been received and assigned to a technician.</p>
              
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 text-left">
                <div className="text-sm text-slate-500 mb-1">Your Reference Number:</div>
                <div className="text-2xl font-mono font-bold tracking-wider text-slate-900">ISS-8492</div>
              </div>

              <Link to={`/asset/${code}`} className="btn-secondary w-full flex items-center justify-center gap-2 py-3">
                Return to Asset Page
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
