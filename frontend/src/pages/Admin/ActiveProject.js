import React, { useState } from 'react';
import { 
  FileBarChart, Download, Share2, ArrowRight, 
  Leaf, Droplet, Wind, Zap, CheckCircle2, 
  ExternalLink, Printer, Filter
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, ResponsiveContainer, AreaChart, 
  Area, XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';

// Mock Data for Comparative Analysis
const radiarechartslData = [
  { subject: 'Air Quality', A: 120, B: 110, fullMark: 150 },
  { subject: 'Waste Management', A: 98, B: 130, fullMark: 150 },
  { subject: 'Water Purity', A: 86, B: 130, fullMark: 150 },
  { subject: 'Green Cover', A: 99, B: 100, fullMark: 150 },
  { subject: 'Public Awareness', A: 85, B: 90, fullMark: 150 },
];

const timeSeriesData = [
  { month: 'Jan', baseline: 4000, current: 2400 },
  { month: 'Mar', baseline: 3000, current: 1398 },
  { month: 'May', baseline: 2000, current: 9800 },
  { month: 'Jul', baseline: 2780, current: 3908 },
  { month: 'Sep', baseline: 1890, current: 4800 },
  { month: 'Nov', baseline: 2390, current: 3800 },
];

const ActiveProject = ({ projectTitle = "Central Delhi Green Corridor" }) => {
  return (
    <div className="p-8 bg-slate-50 mt-10 min-h-screen font-sans print:bg-white print:p-0">
      {/* REPORT HEADER */}
      <div className="max-w-6xl mx-auto flex justify-between items-start mb-8 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold mb-2">
            <FileBarChart size={20} />
            <span className="uppercase tracking-widest text-xs">Analytical Intelligence</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">Project Impact Analysis</h1>
          <p className="text-slate-500">Official Performance Report: {projectTitle}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg bg-white font-bold text-sm text-slate-700 hover:bg-slate-50 transition-all">
            <Printer size={18} /> Print
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all">
            <Download size={18} /> Export PDF
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* EXECUTIVE SUMMARY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatBox 
            label="Carbon Offset" 
            value="42.5 Tons" 
            change="+18%" 
            icon={<Leaf size={24} className="text-emerald-500" />} 
            description="Equivalent to 2,020 mature trees"
          />
          <StatBox 
            label="Waste Diversion" 
            value="182 Tons" 
            change="+34%" 
            icon={<Zap size={24} className="text-amber-500" />} 
            description="Diverted from landfills to recycling"
          />
          <StatBox 
            label="Water Revived" 
            value="12.2 MLD" 
            change="+05%" 
            icon={<Droplet size={24} className="text-blue-500" />} 
            description="Million Liters per Day (Current)"
          />
        </div>

        {/* COMPARATIVE RADAR & TIME SERIES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Multi-Factor Analysis */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold mb-2 text-slate-900">Multi-Factor Performance</h3>
            <p className="text-sm text-slate-400 mb-6">Current performance vs. City-wide Baseline</p>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radialData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Radar name="Baseline" dataKey="A" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.2} />
                  <Radar name="Project Outcome" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <span className="w-3 h-3 bg-slate-200 rounded-full" /> Baseline
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                <span className="w-3 h-3 bg-emerald-500 rounded-full" /> Project Outcome
              </div>
            </div>
          </div>

          {/* Impact Over Time */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold mb-2 text-slate-900">PM2.5 Reduction Trend</h3>
            <p className="text-sm text-slate-400 mb-6">Longitudinal study of air quality in project zone</p>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeriesData}>
                  <defs>
                    <linearGradient id="colorCurr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} />
                  <YAxis axisLine={false} tickLine={false} fontSize={12} />
                  <Tooltip />
                  <Area type="monotone" dataKey="current" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCurr)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* COMPLIANCE & VERIFICATION LOG */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-900">Regulatory Compliance & Verification</h3>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">100% Compliant</span>
          </div>
          <div className="p-0">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Standard Body</th>
                  <th className="px-6 py-4">Metric Tracked</th>
                  <th className="px-6 py-4">Verification Method</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <VerificationRow agency="CPCB" metric="Particulate Matter" method="IoT Sensor Grid" status="Verified" />
                <VerificationRow agency="NGT" metric="Water BOD Levels" method="Third-party Lab" status="Verified" />
                <VerificationRow agency="Eco-Audit" metric="Tree Survival Rate" method="Drone GIS Survey" status="In Review" />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const StatBox = ({ label, value, change, icon, description }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-white transition-colors">{icon}</div>
      <span className="text-emerald-600 font-black text-sm bg-emerald-50 px-2 py-1 rounded-lg">{change}</span>
    </div>
    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{label}</p>
    <h2 className="text-3xl font-black text-slate-900 my-1">{value}</h2>
    <p className="text-slate-500 text-xs leading-relaxed mt-2">{description}</p>
  </div>
);

const VerificationRow = ({ agency, metric, method, status }) => (
  <tr className="hover:bg-slate-50/50 transition-colors">
    <td className="px-6 py-4 font-bold text-slate-900">{agency}</td>
    <td className="px-6 py-4 text-slate-600">{metric}</td>
    <td className="px-6 py-4 text-slate-500 italic">{method}</td>
    <td className="px-6 py-4">
      <div className={`flex items-center gap-1.5 font-bold ${status === 'Verified' ? 'text-emerald-600' : 'text-amber-500'}`}>
        <CheckCircle2 size={16} /> {status}
      </div>
    </td>
  </tr>
);

export default ActiveProject;