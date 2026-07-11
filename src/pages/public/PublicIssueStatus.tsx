import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function PublicIssueStatus() {
  const [issueId, setIssueId] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  
  // Mock search result
  const result = {
    found: true,
    id: 'ISS-8492',
    status: 'In Progress', // 'Reported', 'In Progress', 'Resolved'
    asset: 'Classroom Projector 01',
    reportedDate: 'Oct 24, 2026',
    resolvedDate: null,
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (issueId.trim().length > 3) {
      setHasSearched(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      <div className="w-full max-w-lg bg-white min-h-screen shadow-sm pb-20">
        <div className="bg-slate-850 text-white p-6 pb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-sm">IQ</span>
              MaintainIQ
            </h1>
          </div>
          <h2 className="text-2xl font-bold">Check Status</h2>
          <p className="text-slate-300 text-sm mt-1">Track the progress of a reported issue.</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSearch} className="mb-8 relative">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Enter Issue Number (e.g., ISS-8492)" 
                className="input-field pl-10 w-full py-3"
                value={issueId}
                onChange={(e) => setIssueId(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary w-full mt-3 py-3 shadow-sm">Check Status</button>
          </form>

          {hasSearched && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              {result.found ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900">{result.id}</span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-status-maintenance/10 text-status-maintenance border-status-maintenance/20">
                      {result.status}
                    </span>
                  </div>
                  
                  <div className="p-6 space-y-5">
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Related Asset</div>
                      <div className="font-medium text-slate-900">{result.asset}</div>
                    </div>

                    <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
                      <div className="relative">
                        <div className="absolute -left-[29px] top-0 w-4 h-4 bg-primary-100 rounded-full border-2 border-white flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                        </div>
                        <div className="font-medium text-slate-900 text-sm">Issue Reported</div>
                        <div className="text-xs text-slate-500">{result.reportedDate}</div>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute -left-[29px] top-0 w-4 h-4 bg-primary-100 rounded-full border-2 border-white flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
                        </div>
                        <div className="font-medium text-slate-900 text-sm">Technician Assigned</div>
                        <div className="text-xs text-slate-500">Currently inspecting</div>
                      </div>

                      <div className="relative opacity-50">
                        <div className="absolute -left-[29px] top-0 w-4 h-4 bg-slate-100 rounded-full border-2 border-white" />
                        <div className="font-medium text-slate-900 text-sm">Resolved</div>
                        <div className="text-xs text-slate-500">Pending</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="font-medium text-slate-900">Issue not found</p>
                  <p className="text-sm text-slate-500 mt-1">Please check the issue number and try again.</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-slate-200 text-center">
            <Link to="/asset/PROJ-101" className="text-primary-600 font-medium text-sm hover:underline">
              Return to Asset Scanner
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
