import React, { useState, useEffect } from 'react';
import { mentalHealthCategories } from '../data/mock';
import AudioPlayer from '../components/AudioPlayer';
import { Card, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { X, Wind, Moon, Sun, Zap, Brain, Activity } from 'lucide-react';

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
    <div className="min-h-screen bg-[#fafafa] pt-24 pb-12 px-4 md:px-6 font-sans">

      {/* HERO SECTION */}
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <div className="relative inline-block mb-6">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full blur opacity-25 animate-pulse"></div>
          <div className="relative bg-white p-4 rounded-full shadow-xl">
            <Activity className="w-12 h-12 text-emerald-500" />
          </div>
        </div>

        <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-4">
          Vibe Cure
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto font-medium leading-relaxed">
          Digital medicine for the modern mind. Frequencies designed to heal, rest, and energize.
        </p>
      </div>

      {/* GRID SECTION */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
        {mentalHealthCategories.map((category) => (
          <Card
            key={category.id}
            onClick={() => setActiveCategory(category)}
            className="group relative aspect-square overflow-hidden rounded-[3.5rem] border-none shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
          >
            {/* BACKGROUND IMAGE FROM MOCK DATA */}
            <div className="absolute inset-0 z-0">
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop';
                }}
              />
              {/* Overlay Gradient for readability */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-60 group-hover:opacity-40 transition-opacity duration-500`} />
              <div className="absolute inset-0 bg-black/10" /> 
            </div>

            {/* CARD CONTENT */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 p-4 bg-white/20 backdrop-blur-2xl rounded-[2.5rem] border border-white/30 shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                {getIcon(category.title)}
              </div>

              <CardTitle className="text-3xl font-black text-white drop-shadow-xl tracking-tight mb-3">
                {category.title}
              </CardTitle>

              <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                <span className="px-5 py-2 bg-white text-slate-900 text-[11px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl">
                  {category.tracks.length} Sessions
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* MODAL PLAYER OVERLAY */}
      {activeCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xl animate-in fade-in duration-500"
            onClick={() => setActiveCategory(null)}
          />

          <div className="relative w-full max-w-xl bg-white rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-500 max-h-[90vh] flex flex-col">

            {/* Modal Header */}
            <div className={`p-8 flex justify-between items-center bg-gradient-to-r ${activeCategory.color}`}>
              <div className="flex items-center gap-5">
                <div className="bg-white/30 p-3 rounded-2xl backdrop-blur-md">
                  {getIcon(activeCategory.title, "text-white")}
                </div>
                <h2 className="text-2xl font-black text-white tracking-tighter drop-shadow-sm">
                  {activeCategory.title}
                </h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveCategory(null)}
                className="rounded-full bg-white/40 hover:bg-white text-slate-900 h-12 w-12 transition-all shadow-lg"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
              <p className="text-slate-500 text-base mb-8 leading-relaxed font-medium">
                {activeCategory.description}
              </p>

              <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
                <AudioPlayer
                  tracks={activeCategory.tracks}
                  categoryColor={activeCategory.color}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentalHealthAudio;