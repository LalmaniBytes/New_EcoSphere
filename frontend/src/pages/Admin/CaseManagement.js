import React, { useState } from 'react';
import { 
  MapPin, Clock, User, ShieldCheck, ChevronLeft, 
  MessageSquare, Camera, AlertCircle, Send, Share2 
} from 'lucide-react';

const CaseManagement = () => {
  const [activeTab, setActiveTab] = useState('timeline');
  const [showInternalNotes, setShowInternalNotes] = useState(false);

  // Mock Case Data
  const caseData = {
    id: "EC-98214",
    category: "Illegal Waste Dumping",
    status: "In Progress",
    priority: "Critical",
    location: "Sector 5, Rohini, New Delhi",
    reportedAt: "Jan 22, 2026 - 10:30 AM",
    deadline: "Jan 24, 2026 - 10:30 AM",
    reporter: "Siddharth V. (Verified Volunteer)",
    description: "Large scale industrial plastic waste dumped near the community park. Harmful fumes reported by residents.",
  };

  const timelineSteps = [
    { label: "Reported", date: "Jan 22, 10:30 AM", completed: true },
    { label: "Verified", date: "Jan 22, 11:15 AM", completed: true },
    { label: "Assigned", date: "Jan 22, 01:40 PM", completed: true },
    { label: "Action Taken", date: "Pending", completed: false },
    { label: "Resolved", date: "Pending", completed: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 mt-10 p-6 font-sans">
      {/* HEADER NAV */}
      <div className="max-w-7xl mx-auto mb-6 flex items-center justify-between">
        <button className="flex items-center gap-2 text-slate-600 hover:text-emerald-700 transition-colors">
          <ChevronLeft size={20} />
          <span className="font-medium">Back to All Cases</span>
        </button>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm font-semibold hover:bg-slate-50">Escalate Case</button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 shadow-sm">Mark as Resolved</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Main Evidence & Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Case Status Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-1 rounded">
                  {caseData.priority} Priority
                </span>
                <h1 className="text-2xl font-bold mt-2 text-slate-900">Case ID: {caseData.id}</h1>
                <p className="text-slate-500 flex items-center gap-1 mt-1 text-sm">
                  <MapPin size={14} /> {caseData.location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-medium">SLA REMAINING</p>
                <div className="flex items-center gap-2 text-amber-600 font-mono font-bold text-xl">
                  <Clock size={20} /> 14h 22m 10s
                </div>
              </div>
            </div>

            {/* Status Stepper */}
            <div className="flex items-center justify-between mb-2">
              {timelineSteps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step.completed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                      {step.completed ? '✓' : idx + 1}
                    </div>
                    <span className={`text-[11px] font-bold uppercase ${step.completed ? 'text-emerald-700' : 'text-slate-400'}`}>{step.label}</span>
                  </div>
                  {idx < timelineSteps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 -mt-6 rounded ${timelineSteps[idx+1].completed ? 'bg-emerald-600' : 'bg-slate-200'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Evidence Comparison */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Camera size={18} /> Evidence Logs
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 border-r border-slate-100">
                <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">Citizen Report (Before)</p>
                <div className="aspect-video bg-slate-200 rounded-xl overflow-hidden relative group cursor-pointer">
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm">View Full Image</div>
                  <div className="w-full h-full flex items-center justify-center italic text-slate-400">
                    [Photo of Plastic Waste]
                  </div>
                </div>
              </div>
              <div className="p-6 bg-slate-50/50">
                <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">Department Action (After)</p>
                <div className="aspect-video border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400">
                  <Camera size={32} className="mb-2 opacity-50" />
                  <p className="text-xs font-semibold">Awaiting Verification Photo</p>
                  <button className="mt-4 text-xs bg-white border border-slate-200 px-4 py-2 rounded-lg text-emerald-600 font-bold hover:shadow-sm">Upload Proof</button>
                </div>
              </div>
            </div>
          </div>

          {/* Description Block */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-3">Issue Description</h3>
            <p className="text-slate-600 leading-relaxed italic border-l-4 border-emerald-500 pl-4">
              "{caseData.description}"
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Activity & Logistics */}
        <div className="space-y-6">
          
          {/* Assignment Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4">Ownership</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Department</p>
                  <p className="text-sm font-bold text-slate-900">Waste Management Dept.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Assigned Officer</p>
                  <p className="text-sm font-bold text-slate-900">Rahul K. (Sub-Inspector)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log (Timeline) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-[500px] flex flex-col">
            <div className="flex gap-4 border-b border-slate-100 mb-4 pb-2 text-sm">
              <button 
                className={`pb-2 transition-all ${activeTab === 'timeline' ? 'border-b-2 border-emerald-600 text-emerald-600 font-bold' : 'text-slate-400'}`}
                onClick={() => setActiveTab('timeline')}
              >
                Log
              </button>
              <button 
                className={`pb-2 transition-all ${activeTab === 'notes' ? 'border-b-2 border-emerald-600 text-emerald-600 font-bold' : 'text-slate-400'}`}
                onClick={() => setActiveTab('notes')}
              >
                Internal Notes
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              <LogItem 
                user="Admin" 
                action="Case Verified & Prioritized" 
                time="Jan 22, 11:15 AM" 
                detail="Assigned 'Critical' due to proximity to residential area."
              />
              <LogItem 
                user="System" 
                action="SLA Trigger Set" 
                time="Jan 22, 01:40 PM" 
                detail="Resolution window: 48 Hours."
              />
              <LogItem 
                user="Officer Rahul K." 
                action="Site Inspection Started" 
                time="Jan 23, 09:00 AM" 
                detail="Field team dispatched to Sector 5."
              />
            </div>

            {/* Chat Input */}
            <div className="mt-4 pt-4 border-t border-slate-100 relative">
              <input 
                placeholder="Type a log update..." 
                className="w-full bg-slate-50 border-none rounded-lg py-3 pl-4 pr-12 text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
              />
              <button className="absolute right-2 top-[22px] text-emerald-600 hover:text-emerald-700">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Log Sub-component
const LogItem = ({ user, action, time, detail }) => (
  <div className="relative pl-6 border-l-2 border-slate-100">
    <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-slate-300 border-2 border-white"></div>
    <p className="text-[10px] font-bold text-slate-400 uppercase">{time}</p>
    <p className="text-sm font-bold text-slate-900 mt-1">{action}</p>
    <p className="text-xs text-slate-500 mt-0.5">{detail}</p>
    <p className="text-[10px] mt-2 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">BY: {user}</p>
  </div>
);

export default CaseManagement;