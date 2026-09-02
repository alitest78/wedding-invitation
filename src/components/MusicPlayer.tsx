import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, ListMusic, Sparkles, SlidersHorizontal, Music2 } from 'lucide-react';
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
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
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
          if (isPlaying) {
            setIsUsingSynth(true);
            persianAudioEngine.start(musicTitle);
          }
        }}
      />

      {/* Apple Dynamic Island Floating Music Capsule */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 360, damping: 26 }}
        id="floating-music-bar"
        className="fixed bottom-4 left-4 z-40 max-w-sm w-auto liquid-glass-pill rounded-[24px] p-2 sm:p-2.5 text-[#1C221A] font-vazir shadow-xl border border-[#B89355]/30"
      >
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Tactile Vinyl Disc / Play Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 450, damping: 20 }}
            id="music-disc-toggle-btn"
            onClick={togglePlay}
            title={isPlaying ? 'توقف موسیقی' : 'پخش موسیقی'}
            className="relative w-11 h-11 rounded-full bg-[#2A3326] border border-[#B88728]/70 p-[2px] flex-shrink-0 cursor-pointer shadow-md overflow-visible"
          >
            <div
              className={`w-full h-full bg-[#1C231A] rounded-full flex items-center justify-center relative overflow-hidden ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '3.5s' }}
            >
              <div className="w-4 h-4 rounded-full bg-[#B88728] border-2 border-[#1C231A] flex items-center justify-center shadow-inner">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1C231A]"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-black/40 pointer-events-none"></div>
            </div>

            {/* Apple Dynamic Badge */}
            <motion.div
              animate={{ scale: isPlaying ? [1, 1.15, 1] : 1 }}
              transition={{ repeat: isPlaying ? Infinity : 0, duration: 1.8 }}
              className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-gradient-to-tr from-[#946F29] to-[#B88728] text-white flex items-center justify-center shadow-md font-bold"
            >
              {isPlaying ? <Pause className="w-2.5 h-2.5 fill-current" /> : <Play className="w-2.5 h-2.5 fill-current ml-0.5" />}
            </motion.div>
          </motion.button>

          {/* Track Info & Equalizer */}
          <div className="flex flex-col min-w-0 pr-1 pl-1.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#B88728] animate-pulse flex-shrink-0" />
              <span className="text-xs font-bold text-[#1C221A] truncate max-w-[155px] tracking-tight">
                {musicTitle || 'جینگو جینگ ساز میاد'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 mt-0.5">
              <span className="text-[10px] text-[#556251] truncate max-w-[120px] font-medium">
                {musicArtist || 'موسیقی شاد شیرازی'}
              </span>

              {/* Apple Soundwave Indicator */}
              {isPlaying && (
                <div className="flex items-end gap-[2px] h-3 mr-1">
                  <motion.span
                    animate={{ height: ['25%', '100%', '40%'] }}
                    transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
                    className="w-[2.5px] bg-[#B88728] rounded-full"
                  ></motion.span>
                  <motion.span
                    animate={{ height: ['70%', '30%', '90%'] }}
                    transition={{ repeat: Infinity, duration: 0.7, ease: 'easeInOut' }}
                    className="w-[2.5px] bg-[#8C9886] rounded-full"
                  ></motion.span>
                  <motion.span
                    animate={{ height: ['40%', '90%', '20%'] }}
                    transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut' }}
                    className="w-[2.5px] bg-[#B88728] rounded-full"
                  ></motion.span>
                  <motion.span
                    animate={{ height: ['90%', '45%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
                    className="w-[2.5px] bg-[#8C9886] rounded-full"
                  ></motion.span>
                </div>
              )}
            </div>
          </div>

          {/* Controls Capsule: Mute, Volume Expand & Playlist */}
          <div className="flex items-center gap-1 border-r border-[#B89355]/25 pr-2 mr-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.88 }}
              id="music-mute-btn"
              onClick={toggleMute}
              className="p-1.5 rounded-full text-[#1C221A] hover:bg-black/5 transition-colors cursor-pointer"
              title={isMuted ? 'با صدا' : 'بی‌صدا'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5 text-[#B88728]" />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.88 }}
              id="music-volume-slider-btn"
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                showVolumeSlider ? 'bg-[#B88728] text-white font-bold' : 'text-[#556251] hover:bg-black/5'
              }`}
              title="تنظیم بلندی صدا"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.88 }}
              id="music-playlist-toggle-btn"
              onClick={() => setShowTrackList(!showTrackList)}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                showTrackList ? 'bg-[#B88728] text-white font-bold' : 'text-[#556251] hover:bg-black/5'
              }`}
              title="لیست ترانه‌ها"
            >
              <ListMusic className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>

        {/* Expandable Volume Slider */}
        <AnimatePresence>
          {showVolumeSlider && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="overflow-hidden pt-2 border-t border-[#B89355]/20 mt-2 px-1 flex items-center gap-2.5"
            >
              <Volume2 className="w-3 h-3 text-[#B88728]" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  if (isMuted && val > 0) setIsMuted(false);
                }}
                className="w-full h-1.5 bg-black/15 rounded-lg appearance-none cursor-pointer accent-[#B88728]"
              />
              <span className="text-[10px] text-[#556251] font-mono w-7 text-left">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Track Selection Dropdown (Apple iOS Menu Style) */}
        <AnimatePresence>
          {showTrackList && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="mt-2 pt-2 border-t border-[#B89355]/25 space-y-1 max-h-52 overflow-y-auto"
            >
              <div className="flex items-center justify-between px-1 py-1 mb-0.5">
                <span className="text-[11px] font-bold text-[#946F29]">آهنگ‌های منتخب جشن:</span>
                <Music2 className="w-3.5 h-3.5 text-[#B88728]" />
              </div>
              {MUSIC_TRACKS.map((track) => (
                <motion.button
                  key={track.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelectTrack(track)}
                  className={`w-full text-right px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                    currentUrl === track.src
                      ? 'bg-gradient-to-r from-[#DFCDA7] to-[#C5A46D] text-[#1C221A] font-bold shadow-sm'
                      : 'text-[#1C221A] hover:bg-black/5'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="truncate">{track.title}</span>
                    <span className="text-[10px] text-[#556251]">{track.artist}</span>
                  </div>
                  {track.isPopular && (
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full flex-shrink-0 mr-1 ${
                        currentUrl === track.src
                          ? 'bg-[#1C221A] text-white'
                          : 'bg-[#B88728]/15 text-[#855E1C] border border-[#B88728]/30 font-semibold'
                      }`}
                    >
                      ویژه
                    </span>
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};
