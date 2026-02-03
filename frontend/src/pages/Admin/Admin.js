import React, { useState } from 'react';
import { 
  LayoutDashboard, FileText, Briefcase, Bell, Search, 
  CheckCircle, Clock, AlertTriangle, MapPin, TrendingUp,
  User, Settings, ChevronRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';



// Mock Data
const trendData = [
  { name: 'Jan', reports: 400, resolved: 240 },
  { name: 'Feb', reports: 300, resolved: 139 },
  { name: 'Mar', reports: 200, resolved: 980 },
  { name: 'Apr', reports: 278, resolved: 390 },
  { name: 'May', reports: 189, resolved: 480 },
];

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 mt=10 pt-8">
      {/* SIDEBAR
      <aside className="w-64 bg-[#1E293B] text-white flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <TrendingUp size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Ecosphere</h1>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
          <NavItem icon={<AlertTriangle size={20}/>} label="Case Management" />
          <NavItem icon={<Briefcase size={20}/>} label="Active Projects" />
          <NavItem icon={<FileText size={20}/>} label="Reports" />
        </nav>

        <div className="p-4 border-t border-slate-700">
          <NavItem icon={<Settings size={20}/>} label="Settings" />
        </div>
      </aside> */}

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* TOP NAV */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="relative w-96">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <Search size={18} />
            </span>
            <input 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-md text-sm focus:ring-2 focus:ring-emerald-500" 
              placeholder="Search cases, locations, or IDs..."
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative text-slate-500 hover:text-emerald-600">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] flex items-center justify-center rounded-full">3</span>
            </button>
            <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
              <div className="text-right">
                <p className="text-sm font-semibold">Urban Dev. Dept.</p>
                <p className="text-xs text-slate-500">Admin Panel</p>
              </div>
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                <User size={24} className="text-slate-400" />
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Departmental Overview</h2>
            <p className="text-slate-500 text-sm">Real-time environmental monitoring for New Delhi region.</p>
          </div>

          {/* KPI RIBBON */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard title="Total Reports" value="15,892" trend="+12%" color="bg-blue-600" />
            <KPICard title="Assigned Cases" value="3,450" subValue="/ 4,120" color="bg-emerald-600" />
            <KPICard title="Avg. Resolution" value="4.2 Days" icon={<Clock size={20}/>} color="bg-amber-500" />
            <KPICard title="Public Trust" value="88/100" icon={<CheckCircle size={20}/>} color="bg-emerald-700" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* MAP VIEW PLACEHOLDER */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold flex items-center gap-2">
                  <MapPin size={18} className="text-emerald-600" /> Eco-Map: High Issue Zones
                </h3>
                <button className="text-xs font-semibold text-blue-600 hover:underline">View Full Map</button>
              </div>
              <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-200">
                <p className="text-slate-400 italic">Interactive Map Interface Integration (Mapbox/Leaflet)</p>
              </div>
            </div>

            {/* PERFORMANCE TRENDS */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold mb-6">Performance Trends</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                    <YAxis axisLine={false} tickLine={false} fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={3} dot={{r: 4}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI INSIGHTS & ACTIONS */}
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 shadow-sm">
              <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                <TrendingUp size={18} /> AI Priority Insights
              </h3>
              <ul className="space-y-4">
                <li className="bg-white p-3 rounded-lg border border-emerald-200 shadow-sm">
                  <p className="text-xs font-bold text-rose-600 uppercase">Urgent</p>
                  <p className="text-sm font-semibold">Yamuna Chemical Spill detected near Okhla</p>
                </li>
                <li className="bg-white p-3 rounded-lg border border-emerald-200 shadow-sm">
                  <p className="text-xs font-bold text-amber-600 uppercase">High</p>
                  <p className="text-sm font-semibold">Ghazipur Landfill methane levels rising</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Sub-components
const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${active ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </div>
);

const KPICard = ({ title, value, subValue, trend, icon, color }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${color} text-white`}>
        {icon || <LayoutDashboard size={20} />}
      </div>
      {trend && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{trend}</span>}
    </div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <div className="flex items-baseline gap-2">
      <h4 className="text-2xl font-bold">{value}</h4>
      {subValue && <span className="text-slate-400 text-sm">{subValue}</span>}
    </div>
  </div>
);

export default Admin;