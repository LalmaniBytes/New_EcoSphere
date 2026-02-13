import React, { useState, useEffect } from 'react';
import { mentalHealthCategories } from '../data/mock';
import AudioPlayer from '../components/AudioPlayer';
import { Card, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  X, Wind, Moon, Sun, Zap, Brain, Activity, 
  Headphones, Sparkles, ShieldCheck, HeartPulse 
} from 'lucide-react';

const MentalHealthAudio = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    if (activeCategory) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [activeCategory]);

  const getIcon = (title, colorClass = "text-white") => {
    const t = title.toLowerCase();
    const props = { className: `w-8 h-8 ${colorClass}` };

    if (t.includes('stress')) return <Zap {...props} />;
    if (t.includes('sleep')) return <Moon {...props} />;
    if (t.includes('depression') || t.includes('mood')) return <Sun {...props} />;
    if (t.includes('heart')) return <Activity {...props} />;
    if (t.includes('cognitive') || t.includes('mental')) return <Brain {...props} />;
    if (t.includes('burnout')) return <Wind {...props} />;
    return <Activity {...props} />;
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pt-24 pb-20 px-4 md:px-6 font-sans overflow-x-hidden">
      
      {/* HERO SECTION */}
      <div className="max-w-4xl mx-auto mb-20 text-center animate-in fade-in slide-in-from-top-10 duration-1000">
        <div className="relative inline-block mb-6">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full blur opacity-25 animate-pulse"></div>
          <div className="relative bg-white p-5 rounded-full shadow-2xl">
            <Activity className="w-12 h-12 text-emerald-500" />
          </div>
        </div>

        <h1 className="text-7xl font-black text-slate-900 tracking-tighter mb-6">
          Vibe Cure
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Digital medicine for the modern mind. Frequencies designed to heal, rest, and energize your neural pathways.
        </p>
      </div>

      {/* NEW: INSTRUCTIONAL STEPS SECTION */}
      <div className="max-w-6xl mx-auto mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              step: "01", 
              title: "Pick Your Vibe", 
              desc: "Select a frequency category tailored to your current mental state.",
              icon: <Sparkles className="w-6 h-6 text-emerald-500" /> 
            },
            { 
              step: "02", 
              title: "Connect Audio", 
              desc: "Use high-quality headphones for the full spatial healing effect.",
              icon: <Headphones className="w-6 h-6 text-cyan-500" /> 
            },
            { 
              step: "03", 
              title: "Deep Immersion", 
              desc: "Close your eyes, breathe, and let the waves rewire your mind.",
              icon: <Wind className="w-6 h-6 text-blue-500" /> 
            }
          ].map((item, idx) => (
            <div key={idx} className="relative group p-8 bg-white rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                  {item.icon}
                </div>
                <span className="text-4xl font-black text-slate-100 group-hover:text-emerald-50 transition-colors">{item.step}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* GRID SECTION */}
      <div className="max-w-5xl mx-auto mb-24">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-slate-200" />
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Treatment Library</h2>
          <div className="h-px flex-1 bg-slate-200" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
          {mentalHealthCategories.map((category) => (
            <Card
              key={category.id}
              onClick={() => setActiveCategory(category)}
              className="group relative aspect-square overflow-hidden rounded-[3.5rem] border-none shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              <div className="absolute inset-0 z-0">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop';
                  }}
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-60 group-hover:opacity-40 transition-opacity duration-500`} />
                <div className="absolute inset-0 bg-black/10" /> 
              </div>

              <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 p-4 bg-white/20 backdrop-blur-2xl rounded-[2.5rem] border border-white/30 shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  {getIcon(category.title)}
                </div>

                <CardTitle className="text-4xl font-black text-white drop-shadow-xl tracking-tight mb-3">
                  {category.title}
                </CardTitle>

                <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  <span className="px-6 py-2 bg-white text-slate-900 text-[11px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl">
                    {category.tracks.length} Sessions Available
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* NEW: WHY VIBE CURE SECTION (Benefits) */}
      <div className="max-w-6xl mx-auto p-12 bg-slate-900 rounded-[4rem] text-center text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 blur-[100px]" />
        
        <h2 className="text-4xl font-black mb-12 tracking-tight">Scientifically Backed Healing</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: <HeartPulse />, label: "Heart Rate Stability", val: "92%" },
            { icon: <Brain />, label: "Focus Improvement", val: "85%" },
            { icon: <ShieldCheck />, label: "Cortisol Reduction", val: "78%" },
            { icon: <Zap />, label: "Energy Boost", val: "64%" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="text-emerald-400 mb-4">{stat.icon}</div>
              <div className="text-3xl font-black mb-1">{stat.val}</div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL PLAYER OVERLAY */}
      {activeCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-3xl animate-in fade-in duration-500"
            onClick={() => setActiveCategory(null)}
          />

          <div className="relative w-full max-w-xl bg-white rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-500 max-h-[90vh] flex flex-col">

            {/* Modal Header */}
            <div className={`p-8 flex justify-between items-center bg-gradient-to-r ${activeCategory.color}`}>
              <div className="flex items-center gap-5">
                <div className="bg-white/30 p-4 rounded-3xl backdrop-blur-md">
                  {getIcon(activeCategory.title, "text-white")}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tighter drop-shadow-sm leading-tight">
                    {activeCategory.title}
                  </h2>
                  <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Digital Therapy</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveCategory(null)}
                className="rounded-full bg-white/40 hover:bg-white text-slate-900 h-14 w-14 transition-all shadow-lg"
              >
                <X className="w-7 h-7" />
              </Button>
            </div>

            {/* Modal Body */}
            <div className="p-10 overflow-y-auto custom-scrollbar flex-1">
              <div className="mb-10">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-4">About this frequency</h4>
                <p className="text-slate-500 text-lg leading-relaxed font-medium">
                  {activeCategory.description}
                </p>
              </div>

              <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 shadow-inner">
                <AudioPlayer
                  tracks={activeCategory.tracks}
                  categoryColor={activeCategory.color}
                />
              </div>

              <div className="mt-8 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Optimal results achieved with 15 min sessions
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentalHealthAudio;