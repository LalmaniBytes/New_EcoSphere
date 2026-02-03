import React, { useState } from 'react';
import { 
  FileText, Folder, Search, Download, Filter, 
  MoreVertical, FileUp, Shield, Lock, Eye, 
  History, Trash2, ChevronRight, FileSpreadsheet
} from 'lucide-react';

// Mock Document Data
const documentList = [
  { id: 1, name: "State_Pollution_Audit_2025.pdf", category: "Audit", size: "4.2 MB", date: "Jan 12, 2026", owner: "CPCB Admin", access: "Restricted" },
  { id: 2, name: "Project_Ganga_Cleanup_Guidelines.docx", category: "Policy", size: "1.8 MB", date: "Dec 05, 2025", owner: "Min. of Jal Shakti", access: "Public" },
  { id: 3, name: "Quarterly_Impact_Data_Sheet.xlsx", category: "Data", size: "850 KB", date: "Jan 20, 2026", owner: "Ecosphere Core", access: "Departmental" },
  { id: 4, name: "Landfill_Decommissioning_Protocol.pdf", category: "Technical", size: "12.4 MB", date: "Jan 18, 2026", owner: "MCD Delhi", access: "Restricted" },
];

const ReportAndDocumentPage = () => {
  const [activeFolder, setActiveFolder] = useState('All');

  return (
    <div className="p-8 mt-5 bg-slate-50 min-h-screen font-sans">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Repository</h1>
          <p className="text-slate-500 font-medium">Manage environmental audits, policy docs, and compliance certificates.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Folder size={18} className="text-blue-500" /> New Folder
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1E293B] text-white rounded-xl text-sm font-bold hover:bg-slate-800 shadow-lg transition-all">
            <FileUp size={18} /> Upload Document
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* LEFT: Sidebar Filters */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Categories</h3>
            <nav className="space-y-1">
              <FolderItem label="All Documents" count={42} active={activeFolder === 'All'} onClick={() => setActiveFolder('All')} />
              <FolderItem label="Compliance Audits" count={12} active={activeFolder === 'Audit'} onClick={() => setActiveFolder('Audit')} />
              <FolderItem label="Policy & Guidelines" count={8} active={activeFolder === 'Policy'} onClick={() => setActiveFolder('Policy')} />
              <FolderItem label="Technical Reports" count={15} active={activeFolder === 'Technical'} onClick={() => setActiveFolder('Technical')} />
              <FolderItem label="Impact Spreadsheets" count={7} active={activeFolder === 'Data'} onClick={() => setActiveFolder('Data')} />
            </nav>
          </div>

          <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-100 relative overflow-hidden">
            <Shield className="absolute -right-4 -bottom-4 w-24 h-24 text-blue-500 opacity-50" />
            <h4 className="font-bold mb-2 flex items-center gap-2 relative z-10">
              <Lock size={16} /> Secure Storage
            </h4>
            <p className="text-xs text-blue-100 leading-relaxed relative z-10">
              Your connection is encrypted. All documents are stored following ISO 27001 data residency standards.
            </p>
          </div>
        </div>

        {/* RIGHT: Document List & Search */}
        <div className="col-span-12 lg:col-span-9 space-y-4">
          {/* SEARCH & FILTERS */}
          <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                placeholder="Search by filename, tag, or uploader..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100">
              <Filter size={18} /> Sort: Recent
            </button>
          </div>

          {/* DOCUMENT TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Document Name</th>
                  <th className="px-6 py-4">Status / Access</th>
                  <th className="px-6 py-4">Date Modified</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documentList.map((doc) => (
                  <tr key={doc.id} className="group hover:bg-slate-50/80 transition-all">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getFileColor(doc.category)}`}>
                          {doc.name.includes('xlsx') ? <FileSpreadsheet size={20} /> : <FileText size={20} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer">{doc.name}</p>
                          <p className="text-[11px] text-slate-400 font-medium">{doc.category} • {doc.size}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${doc.access === 'Restricted' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {doc.access === 'Restricted' ? <Lock size={10} /> : <Eye size={10} />}
                        {doc.access}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-slate-700">{doc.date}</p>
                      <p className="text-[10px] text-slate-400">{doc.owner}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <ActionButton icon={<Download size={16} />} tooltip="Download" />
                        <ActionButton icon={<History size={16} />} tooltip="History" />
                        <ActionButton icon={<MoreVertical size={16} />} tooltip="Options" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const FolderItem = ({ label, count, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${active ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-600'}`}
  >
    <div className="flex items-center gap-3">
      <Folder size={18} className={active ? 'text-blue-600' : 'text-slate-400'} fill={active ? 'currentColor' : 'none'} />
      <span className="text-sm font-bold">{label}</span>
    </div>
    <span className={`text-xs font-black ${active ? 'text-blue-400' : 'text-slate-300'}`}>{count}</span>
  </button>
);

const ActionButton = ({ icon, tooltip }) => (
  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title={tooltip}>
    {icon}
  </button>
);

const getFileColor = (cat) => {
  switch(cat) {
    case 'Audit': return 'bg-rose-50 text-rose-500';
    case 'Policy': return 'bg-blue-50 text-blue-500';
    case 'Data': return 'bg-emerald-50 text-emerald-500';
    default: return 'bg-slate-100 text-slate-500';
  }
};

export default ReportAndDocumentPage;