import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Card } from './ui/card';

const AudioPlayer = ({ tracks, categoryColor }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const currentTrack = tracks[currentTrackIndex];

  // Simulate audio duration from mock data
  useEffect(() => {
    if (currentTrack && currentTrack.duration) {
      const [minutes, seconds] = currentTrack.duration.split(':').map(Number);
      setDuration((minutes * 60) + seconds);
      setCurrentTime(0);
    }
  }, [currentTrack]);

  // Simulate playback progress
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
      setIsPlaying(false);
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handleSeek = (value) => {
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value) => {
    setVolume(value[0]);
    setIsMuted(value[0] === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-3">
      {/* Track List */}
      <div className="space-y-2">
        {tracks.map((track, index) => (
          <Card
            key={track.id}
            className={`p-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
              index === currentTrackIndex ? 'border-2 border-primary bg-accent' : 'hover:bg-accent/50'
            }`}
            onClick={() => {
              setCurrentTrackIndex(index);
              setIsPlaying(true);
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index === currentTrackIndex && isPlaying ? 'bg-primary text-white' : 'bg-muted'
                }`}>
                  {index === currentTrackIndex && isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <p className={`font-medium ${
                    index === currentTrackIndex ? 'text-primary' : ''
                  }`}>
                    {track.title}
                  </p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">{track.duration}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Player Controls */}
      <Card className="p-4 bg-gradient-to-r from-slate-50 to-gray-50">
        <div className="space-y-4">
          {/* Current Track Info */}
          <div>
            <p className="font-semibold text-sm text-foreground">{currentTrack.title}</p>
            <p className="text-xs text-muted-foreground">Track {currentTrackIndex + 1} of {tracks.length}</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                disabled={currentTrackIndex === 0}
                className="transition-transform hover:scale-110"
              >
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                onClick={togglePlay}
                className="w-12 h-12 rounded-full transition-transform hover:scale-110"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                disabled={currentTrackIndex === tracks.length - 1}
                className="transition-transform hover:scale-110"
              >
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2 w-32">
              <Button variant="ghost" size="icon" onClick={toggleMute}>
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AudioPlayer;