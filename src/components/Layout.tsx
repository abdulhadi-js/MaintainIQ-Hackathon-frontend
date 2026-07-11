import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, Settings, Users, Package, AlertCircle, BarChart3, History } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const role = location.pathname.split('/')[1] || 'admin';

  // Mock links based on role
  const links = {
    admin: [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      { name: 'Assets', path: '/admin/assets', icon: Package },
      { name: 'Issues', path: '/admin/issues', icon: AlertCircle },
      { name: 'Technicians', path: '/admin/technicians', icon: Users },
      { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
      { name: 'Settings', path: '/admin/settings', icon: Settings },
    ],
    technician: [
      { name: 'Dashboard', path: '/technician', icon: LayoutDashboard },
      { name: 'My History', path: '/technician/history', icon: History },
    ],
    supervisor: [
      { name: 'Dashboard', path: '/supervisor', icon: LayoutDashboard },
    ]
  }[role] || [];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-slate-850 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-sm">IQ</span>
            MaintainIQ
          </h1>
          <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{role} Portal</div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active ? 'bg-primary-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <Link to="/login" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar (optional, empty for now) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
              {role.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-slate-700 capitalize">{role} User</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
