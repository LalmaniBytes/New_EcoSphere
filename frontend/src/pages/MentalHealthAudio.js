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

  const getIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('stress')) return <Zap className="w-12 h-12 text-amber-500 mb-2" />;
    if (t.includes('sleep')) return <Moon className="w-12 h-12 text-indigo-500 mb-2" />;
    if (t.includes('anxiety')) return <Wind className="w-12 h-12 text-sky-500 mb-2" />;
    if (t.includes('focus')) return <Brain className="w-12 h-12 text-emerald-500 mb-2" />;
    if (t.includes('energy')) return <Sun className="text-orange-500 w-12 h-12 mb-2" />;
    return <Activity className="w-12 h-12 text-slate-500 mb-2" />;
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] pt-24 pb-12 px-4 md:px-6">
      
      {/* HERO SECTION: The Large Creative SVG Image */}
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <div className="relative inline-block mb-8">
          {/* Creative SVG Illustration Wrapper */}
          <svg width="300" height="200" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto drop-shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Abstract Person Silhouette in Meditation */}
            <circle cx="100" cy="50" r="25" fill="#10b981" fillOpacity="0.2"/>
            <path d="M100 75C70 75 50 95 50 125H150C150 95 130 75 100 75Z" fill="#10b981" fillOpacity="0.4"/>
            
            {/* Floating Anxiety/Stress Elements (Abstract Squiggles) */}
            <path d="M30 40Q45 20 60 40" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" className="animate-pulse"/>
            <path d="M140 30Q155 50 170 30" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" className="animate-pulse"/>
            
            {/* The 6 Pillars Symbols floating around */}
            <circle cx="40" cy="80" r="8" fill="#0ea5e9" fillOpacity="0.6" /> {/* Anxiety */}
            <circle cx="160" cy="80" r="8" fill="#6366f1" fillOpacity="0.6" /> {/* Sleep */}
            <circle cx="100" cy="20" r="6" fill="#f97316" fillOpacity="0.6" /> {/* Energy */}
            <circle cx="50" cy="30" r="5" fill="#10b981" fillOpacity="0.6" /> {/* Focus */}
          </svg>
        </div>
        
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Vibe Cure</h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto font-medium leading-relaxed">
          From chronic stress to restless nights—harmonize your mind with AI-driven frequencies.
        </p>
      </div>

      {/* GRID: 2 items per row with square interactive cards */}
      <div className="max-w-4xl mx-auto grid grid-cols-2 gap-4 md:gap-8">
        {mentalHealthCategories.map((category) => (
          <Card 
            key={category.id}
            onClick={() => setActiveCategory(category)}
            className={`aspect-square group relative flex flex-col items-center justify-center rounded-[2.5rem] border-none shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden bg-gradient-to-br ${category.color}`}
          >
            {/* Animated Background Pulse */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Large Central Icon */}
            <div className="relative z-10 flex flex-col items-center p-6 transform group-hover:scale-110 transition-transform duration-500">
              <div className="p-5 bg-white/40 backdrop-blur-md rounded-[2rem] shadow-inner mb-4">
                {getIcon(category.title)}
              </div>
              <CardTitle className="text-center text-lg md:text-2xl font-black text-slate-800 tracking-tight">
                {category.title}
              </CardTitle>
            </div>

            {/* Sub-label showing track count */}
            <div className="absolute bottom-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/60 px-3 py-1 rounded-full text-slate-900">
                {category.tracks.length} Tracks Available
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* MODAL PLAYER OVERLAY */}
      {activeCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
          <div 
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-500" 
            onClick={() => setActiveCategory(null)} 
          />
          
          <div className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 max-h-[85vh] flex flex-col">
            
            <div className={`p-8 flex justify-between items-center bg-gradient-to-r ${activeCategory.color}`}>
              <div className="flex items-center gap-4">
                <div className="bg-white/30 p-2 rounded-2xl">{getIcon(activeCategory.title)}</div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">{activeCategory.title}</h2>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setActiveCategory(null)}
                className="rounded-full bg-white/50 hover:bg-white text-slate-900 h-12 w-12 shadow-sm"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar">
              <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium italic">
                {activeCategory.description}
              </p>
              <AudioPlayer 
                tracks={activeCategory.tracks} 
                categoryColor={activeCategory.color} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentalHealthAudio;