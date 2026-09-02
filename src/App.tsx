import React, { useState, useEffect } from 'react';
import { EnvelopeView } from './components/EnvelopeView';
import { WeddingCardView } from './components/WeddingCardView';
import { EditCardModal } from './components/EditCardModal';
import { ShareModal } from './components/ShareModal';
import { MusicPlayer } from './components/MusicPlayer';
import { FloatingPetals } from './components/FloatingPetals';
import { INITIAL_WEDDING, INITIAL_RSVPS } from './data/defaultWedding';
import { WeddingDetails, RSVPResponse, MusicTrack, ThemeVariant } from './types';
import { decodeWeddingFromURL } from './utils/cardUtils';
import { THEME_PRESETS } from './utils/themePresets';

export default function App() {
  const [wedding, setWedding] = useState<WeddingDetails>(() => {
    const urlWedding = decodeWeddingFromURL();
    if (urlWedding) return urlWedding;
    const local = localStorage.getItem('wedding_card_details');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (parsed.musicUrl && parsed.musicUrl.includes('musicdel.ir')) {
          parsed.musicUrl = 'synth://shirazi';
          parsed.musicArtist = 'موسیقی شاد شیرازی (سنتور، تار و تمبک ۶/۸)';
        }
        if (parsed.dressCode === 'کد پوشش: رسمی و مجلسی (رنگ‌های شاد و پاستلی)') {
          parsed.dressCode = '';
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse local wedding data', e);
      }
    }
    return INITIAL_WEDDING;
  });

  const [rsvps, setRsvps] = useState<RSVPResponse[]>(() => {
    const local = localStorage.getItem('wedding_rsvps');
    if (local) {
      try {
        const parsed: RSVPResponse[] = JSON.parse(local);
        // Filter out legacy mock demo items
        return parsed.filter((item) => item.id !== '1' && item.id !== '2' && item.id !== '3');
      } catch (e) {
        console.error('Failed to parse local RSVPs', e);
      }
    }
    return INITIAL_RSVPS;
  });

  const [isOpen, setIsOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [autoPlayMusic, setAutoPlayMusic] = useState(false);
  const [petalsActive, setPetalsActive] = useState(true);

  const currentTheme = THEME_PRESETS[wedding.theme] || THEME_PRESETS['emerald-gold'];

  // Save changes to localStorage
  const handleSaveWedding = (updated: WeddingDetails) => {
    setWedding(updated);
    localStorage.setItem('wedding_card_details', JSON.stringify(updated));
  };

  const handleThemeChange = (theme: ThemeVariant) => {
    const updated = { ...wedding, theme };
    setWedding(updated);
    localStorage.setItem('wedding_card_details', JSON.stringify(updated));
  };

  const handleAddRSVP = (newRsvp: Omit<RSVPResponse, 'id' | 'createdAt' | 'likes'>) => {
    const rsvpItem: RSVPResponse = {
      ...newRsvp,
      id: Date.now().toString(),
      createdAt: 'همین الان',
      likes: 1,
    };
    const updated = [rsvpItem, ...rsvps];
    setRsvps(updated);
    localStorage.setItem('wedding_rsvps', JSON.stringify(updated));
  };

  const handleLikeRSVP = (id: string) => {
    const updated = rsvps.map((r) => (r.id === id ? { ...r, likes: (r.likes || 0) + 1 } : r));
    setRsvps(updated);
    localStorage.setItem('wedding_rsvps', JSON.stringify(updated));
  };

  const handleEnvelopeOpen = () => {
    setIsOpen(true);
    setAutoPlayMusic(true);
    // Smooth scroll down to card content
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };

  const handleTrackChange = (track: MusicTrack) => {
    const updated = {
      ...wedding,
      musicUrl: track.src,
      musicTitle: track.title,
      musicArtist: track.artist,
    };
    setWedding(updated);
    localStorage.setItem('wedding_card_details', JSON.stringify(updated));
  };

  return (
    <div className={`min-h-screen ${currentTheme.bgGradient} ${currentTheme.textColor} font-vazir persian-pattern-overlay selection:bg-amber-500/30 selection:text-amber-200 relative overflow-x-hidden transition-colors duration-700`}>
      {/* Floating Rose Petals & 24K Gold Shimmer particles */}
      <FloatingPetals active={petalsActive} theme={wedding.theme} />

      {/* Background Ambience / Subtle Golden Light Spotlights */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-400/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Main Container */}
      <main className="relative z-20 w-full min-h-screen">
        {!isOpen ? (
          <EnvelopeView
            wedding={wedding}
            isOpen={isOpen}
            onOpen={handleEnvelopeOpen}
            onEditClick={() => setShowEditModal(true)}
            onShareClick={() => setShowShareModal(true)}
            onThemeChange={handleThemeChange}
            petalsActive={petalsActive}
            onTogglePetals={() => setPetalsActive(!petalsActive)}
          />
        ) : (
          <WeddingCardView
            wedding={wedding}
            rsvps={rsvps}
            onAddRSVP={handleAddRSVP}
            onLikeRSVP={handleLikeRSVP}
            onCloseToEnvelope={() => setIsOpen(false)}
            onOpenEditModal={() => setShowEditModal(true)}
            onOpenShareModal={() => setShowShareModal(true)}
            onThemeChange={handleThemeChange}
            petalsActive={petalsActive}
            onTogglePetals={() => setPetalsActive(!petalsActive)}
          />
        )}
      </main>

      {/* Background Music Player Floating Bar */}
      <MusicPlayer
        currentUrl={wedding.musicUrl}
        musicTitle={wedding.musicTitle}
        musicArtist={wedding.musicArtist}
        autoPlayTrigger={autoPlayMusic}
        onTrackChange={handleTrackChange}
      />

      {/* Edit Wedding Details Modal */}
      <EditCardModal
        isOpen={showEditModal}
        wedding={wedding}
        onSave={handleSaveWedding}
        onClose={() => setShowEditModal(false)}
      />

      {/* Social Sharing & Routing Links Modal */}
      <ShareModal
        isOpen={showShareModal}
        wedding={wedding}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
}
