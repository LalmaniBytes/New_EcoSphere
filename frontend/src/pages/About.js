import React from 'react';
import { 
  BarChart3, 
  Search, 
  Users, 
  ShieldCheck, 
  Globe, 
  Lightbulb, 
  PieChart, 
  ArrowRight 
} from 'lucide-react';

const About = () => {
  return (
    <div className="font-sans text-slate-900 bg-[#FFFFFF]">
      {/* 1. HERO SECTION: THE IDENTITY */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#00BCD4]/20 py-20 px-6">
        {/* Subtle animated gradient background  */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        <div className="relative z-10 max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 drop-shadow-md">
            Ecosphere: Data-Driven Change 
          </h1>
          
          {/* Glassmorphism Card  */}
          <div className="backdrop-blur-md bg-white/10 p-8 rounded-3xl border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
            <p className="text-xl md:text-2xl text-white mb-8 leading-relaxed">
              <span className="font-bold">Who We Are:</span> We are a technology-driven initiative bridging the gap between urban data and on-ground environmental action.  We empower citizens to turn insights into a cleaner, healthier world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-[#00BCD4] hover:bg-[#00acc1] text-white font-bold rounded-full transition-all shadow-lg">
                Explore Data 
              </button>
              <button className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-bold rounded-full backdrop-blur-sm border border-white/30 transition-all">
                Join the Movement 
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MISSION & VISION */}
      <section className="py-24 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:translate-y-[-5px] transition-transform">
          <div className="w-12 h-12 bg-[#1B5E20]/10 rounded-xl flex items-center justify-center mb-6">
            <Globe className="text-[#1B5E20]" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-[#1B5E20]">Our Vision</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            To build sustainable communities through knowledge and collective action.
          </p>
        </div>
        
        <div className="bg-[#1B5E20] p-10 rounded-3xl text-white shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:translate-y-[-5px] transition-transform">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
            <Lightbulb className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <ul className="space-y-3 opacity-90">
            <li className="flex gap-2"><span>1.</span> Make civic data impactful.</li>
            <li className="flex gap-2"><span>2.</span> Bridge gaps in waste systems. </li>
            <li className="flex gap-2"><span>3.</span> Support tech-driven environmental action.</li>
          </ul>
        </div>
      </section>

      {/* 3. WHAT WE DO  */}
      <section className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">What We Do</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <BarChart3 className="text-[#00BCD4] mb-4 w-10 h-10" />
              <h3 className="text-xl font-bold mb-3">Data-Driven Awareness </h3>
              <p className="text-slate-600 mb-6">Insights on waste patterns and health impacts.</p>
              <div className="h-32 bg-slate-100 rounded-lg flex items-end p-4 gap-2">
                {/* Visual placeholder for Bar Graph  */}
                <div className="w-full bg-[#1B5E20] h-[40%] rounded-t-sm"></div>
                <div className="w-full bg-[#00BCD4] h-[80%] rounded-t-sm"></div>
                <div className="w-full bg-[#1B5E20] h-[60%] rounded-t-sm"></div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <Search className="text-[#00BCD4] mb-4 w-10 h-10" />
              <h3 className="text-xl font-bold mb-3">Civic Engagement </h3>
              <p className="text-slate-600">Studying platform efficiency and encouraging governance discussion.</p>
              <div className="mt-6 flex justify-center opacity-20">
                 <Globe size={80} /> {/* City grid placeholder visual */}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <Users className="text-[#00BCD4] mb-4 w-10 h-10" />
              <h3 className="text-xl font-bold mb-3">Community Participation </h3>
              <p className="text-slate-600">Collaboration between developers, students, and advocates.</p>
              <div className="mt-6 flex justify-center text-[#1B5E20]/20 italic">
                [Network-style graphic] 
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE VALUES  */}
      <section className="py-24 max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-16">Our Core Values</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {[
            { label: 'Sustainability', sub: 'Longterm-Responsibility' },
            { label: 'Transparency', sub: 'Open Processes' },
            { label: 'Community', sub: 'Collective Effort' },
            { label: 'Tech for Good', sub: 'Purposeful Innovation' },
            { label: 'Accountability', sub: 'Responsible Data' }
          ].map((val, idx) => (
            <div key={idx} className="group cursor-default">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 group-hover:bg-[#1B5E20] group-hover:text-white transition-all">
                <ShieldCheck />
              </div>
              <h4 className="font-bold mb-1">{val.label}</h4>
              <p className="text-xs text-slate-400 group-hover:text-[#1B5E20] transition-colors">{val.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FINANCIAL TRANSPARENCY */}
      <section className="py-24 bg-[#1B5E20] text-white px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">How We Use Your Support </h2>
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Visual: Donut Chart Placeholder  */}
            <div className="relative w-64 h-64 flex-shrink-0">
               <div className="w-full h-full rounded-full border-[20px] border-[#00BCD4] border-l-[#FFFFFF] border-b-[#81c784]"></div>
               <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <PieChart size={40} className="mb-2 opacity-50" />
                  <span className="text-2xl font-bold">100%</span>
               </div>
            </div>
            
            <div className="flex-grow text-left space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full bg-white"></div>
                <p><span className="font-bold">45% On-Ground Action:</span> Clean-up drives & segregation kits. </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full bg-[#00BCD4]"></div>
                <p><span className="font-bold">35% Operations:</span> Data research, platform hosting, and fair dev pay. </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full bg-[#81c784]"></div>
                <p><span className="font-bold">20% Community Outreach:</span> Educational content & volunteer coordination.</p>
              </div>
              <p className="mt-8 pt-6 border-t border-white/20 text-sm italic opacity-70">
                Note: Funded entirely via crowdfunding and sponsorships for total independence. 
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHY WE MATTER  */}
      <section className="py-24 max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">The Gap We Bridge</h2>
        <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-[#1B5E20] uppercase text-sm tracking-wider">
              <tr>
                <th className="p-6">The Problem </th>
                <th className="p-6">The Ecosphere Solution </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-6">Limited Awareness</td>
                <td className="p-6 font-medium">Accessible Data Dashboards </td>
              </tr>
              <tr>
                <td className="p-6">Low Engagement </td>
                <td className="p-6 font-medium text-[#00BCD4]">Community-Driven Tools </td>
              </tr>
              <tr>
                <td className="p-6">System Gaps </td>
                <td className="p-6 font-medium">Research-Based Advocacy </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. CALL TO ACTION & ROADMAP  */}
      <footer className="bg-slate-900 text-white pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">Join the Ecosphere </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Are you a Developer? Researcher? Citizen? Let's build together. 
          </p>
          
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-2 mb-20">
            <input 
              type="email" 
              placeholder="Enter Email for Updates" 
              className="bg-slate-800 border border-slate-700 px-6 py-4 rounded-xl flex-grow focus:outline-none focus:border-[#00BCD4]" 
            />
            <button className="bg-[#1B5E20] px-8 py-4 rounded-xl font-bold hover:bg-[#256f2a] transition-all">
              Sign Up 
            </button>
          </div>

          <div className="border-t border-slate-800 pt-16">
            <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-[#00BCD4] mb-12">Looking Ahead </h3>
            <div className="flex overflow-x-auto pb-8 gap-12 justify-center no-scrollbar">
              {[
                { quarter: 'Q3', text: 'Expanded Data Coverage ' },
                { quarter: 'Q4', text: 'Visual Dashboards ' },
                { quarter: 'Next Year', text: 'Global Participation Tools ' }
              ].map((item, i) => (
                <div key={i} className="flex-shrink-0 flex items-center gap-4">
                  <span className="text-2xl font-black text-slate-800">{item.quarter}</span>
                  <ArrowRight className="text-slate-700" size={16} />
                  <span className="text-lg whitespace-nowrap text-slate-400">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;