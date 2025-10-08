import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Card } from "./ui/card";

const AudioPlayer = ({ tracks, categoryColor }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
console.log("Ref" , audioRef)
  const currentTrack = tracks[currentTrackIndex];

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
      setCurrentTime(0);
      setDuration(0);
      if (isPlaying) {
        audioRef.current.play();
      }
    }
    console.log("currentTrack",audioRef.current.src );
  }, [currentTrack]);
  
  useEffect(() => {
    if (isPlaying) {
      // Adding a .catch() is good practice for play()
      audioRef.current
        ?.play()
        .catch((e) => console.error("Audio play failed:", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);
  // Attach audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const setAudioDuration = () => setDuration(audio.duration);
    const handleEnded = () => handleNext();

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setAudioDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setAudioDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentTrack]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
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
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value) => {
    const vol = value[0] / 100;
    if (audioRef.current) audioRef.current.volume = vol;
    setVolume(value[0]);
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
console.log("currentTrack",currentTrack); 
console.log("tracks",tracks);
  return (
    <div className="space-y-3">
      <audio ref={audioRef} />

      {/* Track List */}
      <div className="space-y-2">
        {tracks.map((track, index) => (
          <Card
            key={track.id}
            className={`p-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
              index === currentTrackIndex
                ? "border-2 border-primary bg-accent"
                : "hover:bg-accent/50"
            }`}
            onClick={() => {
              setCurrentTrackIndex(index);
              setIsPlaying(true);
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === currentTrackIndex && isPlaying
                      ? "bg-primary text-white"
                      : "bg-muted"
                  }`}
                >
                  {index === currentTrackIndex && isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <p
                    className={`font-medium ${
                      index === currentTrackIndex ? "text-primary" : ""
                    }`}
                  >
                    {track.title}
                  </p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                {track.duration}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Player Controls */}
      <Card className="p-4 bg-gradient-to-r from-slate-50 to-gray-50">
        <div className="space-y-4">
          {/* Current Track Info */}
          <div>
            <p className="font-semibold text-sm text-foreground">
              {currentTrack.title}
            </p>
            <p className="text-xs text-muted-foreground">
              Track {currentTrackIndex + 1} of {tracks.length}
            </p>
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
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
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
