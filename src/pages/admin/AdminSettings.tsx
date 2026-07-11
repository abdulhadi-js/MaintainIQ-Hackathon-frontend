import { Bell, Lock, Package, Building, Save } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Organization Settings</h2>
        <p className="text-slate-500 mt-1">Manage organization profile, categories, and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 shrink-0 space-y-1">
          <button className="w-full text-left px-4 py-2.5 rounded-lg font-medium bg-primary-50 text-primary-700 flex items-center gap-3">
            <Building className="w-5 h-5" /> Profile
          </button>
          <button className="w-full text-left px-4 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-3">
            <Package className="w-5 h-5" /> Categories
          </button>
          <button className="w-full text-left px-4 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-3">
            <Bell className="w-5 h-5" /> Notifications
          </button>
          <button className="w-full text-left px-4 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-3">
            <Lock className="w-5 h-5" /> Security
          </button>
        </div>

        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Organization Profile</h3>
            <p className="text-sm text-slate-500 mt-1">This information appears on your printed QR labels.</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 font-medium text-xs text-center cursor-pointer hover:bg-slate-50 transition-colors">
                Upload Logo
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
                  <input type="text" className="input-field" defaultValue="MaintainIQ Demo Corp" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Support Email</label>
                  <input type="email" className="input-field" defaultValue="support@maintainiq.com" />
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-200 flex justify-end">
              <button className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
