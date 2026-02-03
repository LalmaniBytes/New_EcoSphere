import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  AlertTriangle,
  Briefcase,
  FileText,
  Settings,
  TrendingUp
} from "lucide-react";

const AdminNavItem = ({ icon, label, path }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const active = location.pathname === path;

  return (
    <div
      onClick={() => navigate(path)}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors
      ${active ? "bg-emerald-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  );
};

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50">

      {/* ADMIN SIDEBAR */}
      <aside className="w-64 bg-[#1E293B] text-white flex flex-col">
        <div className="p-6 flex items-center gap-2 text-xl font-bold">
          <TrendingUp size={20} />
          Admin Panel
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <AdminNavItem icon={<LayoutDashboard size={18} />} label="Dashboard" path="/admin" />
          <AdminNavItem icon={<AlertTriangle size={18} />} label="Case Management" path="/admin/cases" />
          <AdminNavItem icon={<Briefcase size={18} />} label="Active Projects" path="/admin/projects" />
          <AdminNavItem icon={<FileText size={18} />} label="Reports" path="/admin/reports" />
        </nav>

        <div className="p-4 border-t border-slate-700">
          <AdminNavItem icon={<Settings size={18} />} label="Settings" path="/admin/settings" />
        </div>
      </aside>

      {/* RIGHT CONTENT (ADMIN PAGES) */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
