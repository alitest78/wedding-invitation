import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, ListMusic, Sparkles } from 'lucide-react';
import { MUSIC_TRACKS } from '../data/defaultWedding';
import { MusicTrack } from '../types';
import { persianAudioEngine } from '../utils/persianAudioEngine';

interface MusicPlayerProps {
  currentUrl: string;
  musicTitle: string;
  musicArtist: string;
  autoPlayTrigger?: boolean;
  onTrackChange?: (track: MusicTrack) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentUrl,
  musicTitle,
  musicArtist,
  autoPlayTrigger,
  onTrackChange,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [showTrackList, setShowTrackList] = useState(false);
  const [isUsingSynth, setIsUsingSynth] = useState(false);
  const [hasAutoTriggered, setHasAutoTriggered] = useState(false);

  const isSynthUrl = (url: string) => !url || url.startsWith('synth://') || url.includes('musicdel.ir');

  // Sync volume with both HTML5 audio & Persian synth engine
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    persianAudioEngine.setVolume(volume);
  }, [volume]);

  // Sync mute state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
    persianAudioEngine.setMute(isMuted);
  }, [isMuted]);

  // Handle autoPlayTrigger when envelope opens
  useEffect(() => {
    if (autoPlayTrigger && !hasAutoTriggered) {
      setHasAutoTriggered(true);
      startPlayback();
    }
  }, [autoPlayTrigger, hasAutoTriggered, currentUrl]);

  // Track change handler
  useEffect(() => {
    if (isPlaying) {
      stopPlayback();
      setTimeout(() => {
        startPlayback();
      }, 100);
    }
  }, [currentUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, []);

  const startPlayback = () => {
    if (isSynthUrl(currentUrl)) {
      setIsUsingSynth(true);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      persianAudioEngine.start(musicTitle);
      setIsPlaying(true);
      return;
    }

    // Try HTML5 audio stream first
    if (audioRef.current) {
      setIsUsingSynth(false);
      audioRef.current.src = currentUrl;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((_err) => {
            // Autoplay policy or media source error -> seamlessly fallback to Persian Synth
            setIsUsingSynth(true);
            persianAudioEngine.start(musicTitle);
            setIsPlaying(true);
          });
      }
    }
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    persianAudioEngine.stop();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
  };

  const handleSelectTrack = (track: MusicTrack) => {
    if (onTrackChange) {
      onTrackChange(track);
    }
    setShowTrackList(false);
    stopPlayback();
    setTimeout(() => {
      if (track.src.startsWith('synth://')) {
        setIsUsingSynth(true);
        persianAudioEngine.start(track.title);
        setIsPlaying(true);
      } else if (audioRef.current) {
        setIsUsingSynth(false);
        audioRef.current.src = track.src;
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
          setIsUsingSynth(true);
          persianAudioEngine.start(track.title);
          setIsPlaying(true);
        });
      }
    }, 120);
  };

  return (
    <>
      {/* HTML5 Audio element for valid external streams */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => {
          if (!isUsingSynth) {
            setIsPlaying(false);
          }
        }}
        onError={() => {
          // If external stream has an issue, fallback directly to Persian acoustic synthesizer
          if (isPlaying) {
            setIsUsingSynth(true);
            persianAudioEngine.start(musicTitle);
          }
        }}
      />

      {/* Floating Persian Music Player Bar */}
      <div 
        id="floating-music-bar"
        className="fixed bottom-4 left-4 z-40 max-w-sm w-auto bg-[#20231F]/90 backdrop-blur-md border border-[#C5A46D]/40 rounded-2xl p-2.5 shadow-2xl shadow-stone-950/40 text-[#F5F0E8] transition-all duration-300 hover:border-[#C5A46D]"
      >
        <div className="flex items-center gap-3">
          {/* Rotating Vinyl Disc */}
          <button
            id="music-disc-toggle-btn"
            onClick={togglePlay}
            title={isPlaying ? 'توقف موسیقی' : 'پخش موسیقی'}
            className="relative w-11 h-11 rounded-full bg-[#20231F] border border-[#C5A46D] p-[2px] flex-shrink-0 cursor-pointer shadow-lg hover:scale-105 active:scale-95 transition-transform"
          >
            <div className={`w-full h-full bg-[#3F473D] rounded-full flex items-center justify-center relative overflow-hidden ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}>
              <div className="w-4 h-4 rounded-full bg-[#C5A46D] border-2 border-[#20231F] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#20231F]"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
            </div>
            
            {/* Center Play/Pause Badge */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#C5A46D] text-[#20231F] flex items-center justify-center shadow-md font-bold">
              {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
            </div>
          </button>

          {/* Track Info & Equalizer */}
          <div className="flex flex-col min-w-0 pr-1 pl-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A46D] animate-pulse flex-shrink-0" />
              <span className="text-xs font-semibold text-[#F5F0E8] truncate max-w-[170px]">
                {musicTitle || 'جینگو جینگ ساز میاد'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 mt-0.5">
              <span className="text-[10px] text-[#E0D8CA]/80 truncate max-w-[130px]">
                {musicArtist || 'موسیقی شاد شیرازی'}
              </span>

              {/* Animated Audio Equalizer Bars */}
              {isPlaying && (
                <div className="flex items-end gap-[2px] h-3 ml-1">
                  <span className="w-[2px] bg-[#C5A46D] rounded-full animate-[bounce_0.8s_infinite] h-full"></span>
                  <span className="w-[2px] bg-[#E0D8CA] rounded-full animate-[bounce_0.6s_infinite] h-2/3"></span>
                  <span className="w-[2px] bg-[#C5A46D] rounded-full animate-[bounce_0.9s_infinite] h-full"></span>
                  <span className="w-[2px] bg-[#E0D8CA] rounded-full animate-[bounce_0.5s_infinite] h-1/2"></span>
                </div>
              )}
            </div>
          </div>

          {/* Controls: Mute & Playlist Switcher */}
          <div className="flex items-center gap-1 border-r border-[#C5A46D]/30 pr-2">
            <button
              id="music-mute-btn"
              onClick={toggleMute}
              className="p-1.5 rounded-lg text-[#F5F0E8] hover:text-white hover:bg-[#707563] transition-colors cursor-pointer"
              title={isMuted ? 'صدادار' : 'بی‌صدا'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#C5A46D]" />}
            </button>

            <button
              id="music-playlist-toggle-btn"
              onClick={() => setShowTrackList(!showTrackList)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${showTrackList ? 'bg-[#707563] text-[#F5F0E8]' : 'text-[#F5F0E8] hover:bg-[#707563]'}`}
              title="انتخاب آهنگ"
            >
              <ListMusic className="w-4 h-4 text-[#C5A46D]" />
            </button>
          </div>
        </div>

        {/* Track Selection Dropdown */}
        {showTrackList && (
          <div className="mt-2 pt-2 border-t border-[#C5A46D]/30 space-y-1 max-h-48 overflow-y-auto">
            <div className="text-[11px] font-semibold text-[#C5A46D] mb-1 px-1">آهنگ‌های جشن عروسی:</div>
            {MUSIC_TRACKS.map((track) => (
              <button
                key={track.id}
                onClick={() => handleSelectTrack(track)}
                className={`w-full text-right px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  currentUrl === track.src
                    ? 'bg-[#707563] text-[#F5F0E8] font-medium'
                    : 'text-[#E0D8CA] hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="truncate">{track.title}</span>
                {track.isPopular && (
                  <span className="text-[9px] bg-[#C5A46D]/30 text-[#C5A46D] px-1.5 py-0.5 rounded-full mr-1 flex-shrink-0">
                    ویژه
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
