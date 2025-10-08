import React, { useState } from 'react';
import { mentalHealthCategories } from '../data/mock';
import AudioPlayer from '../components/AudioPlayer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ChevronDown, ChevronUp, Brain } from 'lucide-react';

const MentalHealthAudio = () => {
  const [playingCategory, setPlayingCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mental Health Audio Therapy</h1>
              <p className="text-sm text-gray-600 mt-1">Curated audio sessions for your mental well-being</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[96px] pb-12">
        <div className="space-y-12">
          {mentalHealthCategories.map((category, index) => (
            <Card 
              key={category.id} 
              className={`overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${
                playingCategory === category.id ? 'border-l-primary' : 'border-l-transparent'
              }`}
            >
              <CardHeader className={`bg-gradient-to-r ${category.color} pb-6 cursor-pointer`} onClick={() => toggleCategory(category.id)}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {category.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed text-gray-700">
                      {category.description}
                    </CardDescription>
                  </div>
                  <div className="ml-4 flex items-center gap-3">
                    <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="text-sm font-semibold text-gray-700">
                        {category.tracks.length} Tracks
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="bg-white/80 backdrop-blur-sm hover:bg-white transition-all"
                    >
                      {expandedCategories[category.id] ? (
                        <ChevronUp className="w-5 h-5 text-gray-700" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-700" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {expandedCategories[category.id] && (
                <CardContent className="pt-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                  <AudioPlayer tracks={category.tracks} categoryColor={category.color} />
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="py-8">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">How to Use These Audio Sessions</h3>
              <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Find a quiet, comfortable space where you won't be disturbed. Use headphones for the best experience. 
                Listen regularly to build resilience and create lasting positive changes in your mental well-being. 
                Each session is designed to be used independently or as part of a daily wellness routine.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthAudio;