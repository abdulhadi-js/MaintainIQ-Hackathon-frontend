import { TrendingDown, Clock, AlertCircle } from 'lucide-react';

export default function AdminAnalytics() {
  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Analytics & Reporting</h2>
        <p className="text-slate-500 mt-1">Operational insights and performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="text-sm font-medium text-slate-500 mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Avg Resolution Time
          </div>
          <div className="text-3xl font-bold text-slate-900">4.2 <span className="text-lg text-slate-500 font-normal">hrs</span></div>
          <div className="text-sm text-green-600 mt-2 flex items-center gap-1 font-medium">
            <TrendingDown className="w-4 h-4" /> 12% faster than last month
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="text-sm font-medium text-slate-500 mb-2">Total Issues YTD</div>
          <div className="text-3xl font-bold text-slate-900">842</div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="text-sm font-medium text-slate-500 mb-2">Reopen Rate</div>
          <div className="text-3xl font-bold text-slate-900">3.1%</div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="text-sm font-medium text-slate-500 mb-2">Preventive vs Reactive</div>
          <div className="text-3xl font-bold text-slate-900">40 / 60</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Issues by Category</h3>
          <div className="h-64 bg-slate-50 rounded border border-slate-100 flex items-end justify-around p-4">
            {/* Mock Chart */}
            <div className="w-12 bg-primary-500 rounded-t" style={{ height: '80%' }}></div>
            <div className="w-12 bg-primary-400 rounded-t" style={{ height: '60%' }}></div>
            <div className="w-12 bg-primary-300 rounded-t" style={{ height: '40%' }}></div>
            <div className="w-12 bg-primary-200 rounded-t" style={{ height: '90%' }}></div>
            <div className="w-12 bg-slate-300 rounded-t" style={{ height: '30%' }}></div>
          </div>
          <div className="flex justify-around mt-2 text-xs text-slate-500 font-medium">
            <span>HVAC</span>
            <span>Elec</span>
            <span>Plumb</span>
            <span>Hard</span>
            <span>Other</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <h3 className="font-semibold text-slate-900 mb-4">Recurring Failures</h3>
          <div className="flex-1 space-y-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="flex items-center gap-2 text-red-800 font-bold mb-1">
                <AlertCircle className="w-4 h-4" /> Classroom Projector 01
              </div>
              <p className="text-sm text-red-700">Has had 4 HDMI-related issues in the last 60 days. Consider replacement.</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
              <div className="flex items-center gap-2 text-orange-800 font-bold mb-1">
                <AlertCircle className="w-4 h-4" /> Main Entrance Door
              </div>
              <p className="text-sm text-orange-700">Hinge requires maintenance twice a month. Higher grade hardware recommended.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
