import { useParams, Link } from 'react-router-dom';
import { AlertCircle, Calendar, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function PublicAsset() {
  const { code } = useParams();

  // Mock public view data
  const isOutOfService = false;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      <div className="w-full max-w-lg bg-white min-h-screen shadow-sm pb-20">
        <div className="bg-slate-850 text-white p-6 pb-12 rounded-b-3xl shadow-md relative">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-sm">IQ</span>
              MaintainIQ
            </h1>
          </div>
          <h2 className="text-2xl font-bold mb-1">Classroom Projector 01</h2>
          <div className="flex items-center gap-2 text-slate-300 font-mono text-sm">
            <span>Code: {code || 'PROJ-101'}</span>
            <span>•</span>
            <span>Room 101</span>
          </div>
        </div>

        <div className="px-6 -mt-6">
          <div className={`p-4 rounded-xl shadow-sm border flex items-center gap-3 ${
            isOutOfService 
              ? 'bg-red-50 border-red-200 text-red-800' 
              : 'bg-green-50 border-green-200 text-green-800'
          }`}>
            {isOutOfService ? <AlertTriangle className="w-8 h-8 shrink-0" /> : <CheckCircle2 className="w-8 h-8 shrink-0" />}
            <div>
              <div className="font-bold text-lg">{isOutOfService ? 'Out of Service' : 'Operational'}</div>
              <div className="text-sm opacity-90">
                {isOutOfService 
                  ? 'Please do not use this equipment until further notice.' 
                  : 'This equipment is ready for use.'}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Service Information</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <ShieldCheck className="w-5 h-5 text-slate-400" />
                <span className="font-medium w-24">Condition:</span>
                <span>Good</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <Calendar className="w-5 h-5 text-slate-400" />
                <span className="font-medium w-24">Last Service:</span>
                <span>Jan 15, 2026</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Recent Activity</h3>
            <div className="border-l-2 border-slate-200 ml-3 pl-4 space-y-4">
              <div className="relative">
                <div className="absolute -left-6 top-1 w-3 h-3 bg-slate-300 rounded-full border-2 border-white" />
                <p className="text-sm font-medium text-slate-900">Maintenance Completed</p>
                <p className="text-xs text-slate-500">Jan 15, 2026</p>
              </div>
              <div className="relative">
                <div className="absolute -left-6 top-1 w-3 h-3 bg-slate-300 rounded-full border-2 border-white" />
                <p className="text-sm font-medium text-slate-900">Issue Reported</p>
                <p className="text-xs text-slate-500">Jan 12, 2026</p>
              </div>
            </div>
          </div>

          <Link to={`/asset/${code || 'PROJ-101'}/report`} className="btn-primary w-full py-3.5 text-lg shadow-md mt-4 flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Report an Issue
          </Link>
        </div>
      </div>
    </div>
  );
}
