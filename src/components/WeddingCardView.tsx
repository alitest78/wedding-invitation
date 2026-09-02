import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  Share2,
  Edit3,
  RotateCcw,
  Printer,
  CalendarPlus,
  Palette,
  Flower2
} from 'lucide-react';
import { WeddingDetails, RSVPResponse, ThemeVariant } from '../types';
import { CountdownTimer } from './CountdownTimer';
import { LocationRouter } from './LocationRouter';
import { RSVPSection } from './RSVPSection';
import { THEME_PRESETS } from '../utils/themePresets';
import { getCalendarEvent } from '../utils/cardUtils';

interface WeddingCardViewProps {
  wedding: WeddingDetails;
  rsvps: RSVPResponse[];
  onAddRSVP: (rsvp: Omit<RSVPResponse, 'id' | 'createdAt' | 'likes'>) => void;
  onLikeRSVP: (id: string) => void;
  onCloseToEnvelope: () => void;
  onOpenEditModal: () => void;
  onOpenShareModal: () => void;
  onThemeChange?: (theme: ThemeVariant) => void;
  petalsActive: boolean;
  onTogglePetals: () => void;
  isGuestMode?: boolean;
}

export const WeddingCardView: React.FC<WeddingCardViewProps> = ({
  wedding,
  rsvps,
  onAddRSVP,
  onLikeRSVP,
  onCloseToEnvelope,
  onOpenEditModal,
  onOpenShareModal,
  onThemeChange,
  petalsActive,
  onTogglePetals,
  isGuestMode = false,
}) => {
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);

  const currentTheme = THEME_PRESETS[wedding.theme] || THEME_PRESETS['sage-gold'];
  const calendarLinks = getCalendarEvent(wedding);

  const handlePrint = () => {
    window.print();
  };

  const hasBrideParents = Boolean(wedding.brideParents?.trim());
  const hasGroomParents = Boolean(wedding.groomParents?.trim());
  const hasParentsSection = hasBrideParents || hasGroomParents;

  const hasPoem = Boolean(wedding.poem?.trim());
  const hasInvitationNote = Boolean(wedding.invitationNote?.trim());

  const hasDate = Boolean(wedding.ceremonyDateShamsi?.trim());
  const hasTime = Boolean(wedding.ceremonyTime?.trim());
  const hasHall = Boolean(wedding.hallName?.trim());
  const scheduleItemCount = [hasDate, hasTime, hasHall].filter(Boolean).length;

  const hasReception = Boolean(wedding.receptionTime?.trim());
  const hasDinner = Boolean(wedding.dinnerTime?.trim());
  const hasDetailedTimes = hasReception || hasDinner;

  const hasCountdown = Boolean(wedding.ceremonyDateMiladi?.trim());

  const hasVenueLocation = Boolean(
    wedding.hallName?.trim() ||
    wedding.hallAddress?.trim() ||
    (wedding.hallLat && wedding.hallLng)
  );

  const hasGuestNotes = Boolean(wedding.guestNotes?.trim());

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -35 }}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      className="min-h-screen pb-28 px-3 sm:px-6 pt-3 max-w-4xl mx-auto"
      id="wedding-invitation-card-view"
    >
      {/* Top Floating Utility Navigation Dock (Apple Dynamic Island Capsule) */}
      <motion.div 
        layout
        className="sticky top-3 z-30 mb-6 flex flex-wrap items-center justify-between gap-2.5 liquid-glass-pill px-4 py-2.5 rounded-full shadow-2xl text-[#1C221A] border border-[#B89355]/35"
      >
        <div className="flex items-center gap-2">
          {/* Back to Envelope */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.94 }}
            id="re-envelope-btn"
            onClick={onCloseToEnvelope}
            className="flex items-center gap-1.5 text-xs text-[#1C221A] hover:bg-black/5 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#B88728]" />
            <span className="hidden xs:inline">بازگشت به پاکت</span>
          </motion.button>

          {/* Theme Switcher (Host Only) */}
          {!isGuestMode && (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.94 }}
                id="card-theme-toggle-btn"
                onClick={() => setShowThemePicker(!showThemePicker)}
                className="flex items-center gap-1.5 text-xs text-[#1C221A] hover:bg-black/5 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer border border-[#B89355]/30 font-medium"
                title="تغییر تم رنگی"
              >
                <Palette className="w-3.5 h-3.5 text-[#B88728]" />
                <span className="hidden sm:inline">پالت: {currentTheme.nameFa.split(' ')[0]}</span>
              </motion.button>

              <AnimatePresence>
                {showThemePicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    className="absolute top-full right-0 mt-2 p-2 w-64 liquid-glass rounded-[24px] shadow-2xl z-50 space-y-1.5 border border-[#B89355]/30"
                  >
                    <div className="text-[11px] font-bold text-[#946F29] px-2.5 py-1 border-b border-[#B89355]/20">
                      انتخاب پالت رنگی کارت:
                    </div>
                    {Object.values(THEME_PRESETS).map((t) => (
                      <motion.button
                        key={t.id}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          if (onThemeChange) onThemeChange(t.id);
                          setShowThemePicker(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                          wedding.theme === t.id
                            ? 'bg-gradient-to-r from-[#B88728] to-[#946F29] text-white font-bold shadow-md'
                            : 'text-[#1C221A] hover:bg-[#B89355]/15'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border border-black/15 shadow-sm flex-shrink-0"
                            style={{ backgroundColor: t.previewColor }}
                          ></span>
                          <span className="truncate">{t.nameFa}</span>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Toggle Petals */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            id="card-toggle-petals-btn"
            onClick={onTogglePetals}
            className={`flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full transition-colors cursor-pointer ${
              petalsActive 
                ? 'text-[#855E1C] border border-[#B89355]/50 bg-[#B88728]/15 font-bold shadow-xs' 
                : 'text-[#556251] hover:text-[#1C221A] hover:bg-black/5'
            }`}
            title="بارش گلبرگ"
          >
            <Flower2 className="w-3.5 h-3.5 text-[#B88728]" />
            <span className="hidden sm:inline">گلبرگ</span>
          </motion.button>
        </div>

        {/* Right Actions: Calendar, Edit, Share, Print */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Add to Calendar */}
          {hasCountdown && (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.94 }}
                id="add-to-calendar-btn"
                onClick={() => setShowCalendarMenu(!showCalendarMenu)}
                className="flex items-center gap-1.5 text-xs text-[#1C221A] hover:bg-black/5 border border-[#B89355]/30 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer shadow-xs font-medium"
                title="افزودن به تقویم گوگل و اپل"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-[#B88728]" />
                <span className="hidden sm:inline">افزودن به تقویم</span>
              </motion.button>

              <AnimatePresence>
                {showCalendarMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    className="absolute top-full left-0 mt-2 p-2 w-56 liquid-glass rounded-[22px] shadow-2xl z-50 space-y-1 border border-[#B89355]/30 text-[#1C221A]"
                  >
                    <a
                      href={calendarLinks.googleCalendar}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowCalendarMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#1C221A] hover:bg-[#B89355]/15 transition-colors font-medium"
                    >
                      <span>📅 تقویم گوگل (Google Calendar)</span>
                    </a>
                    <a
                      href={calendarLinks.icsDataUri}
                      download={`wedding-${wedding.brideName || 'card'}-${wedding.groomName || 'card'}.ics`}
                      onClick={() => setShowCalendarMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#1C221A] hover:bg-[#B89355]/15 transition-colors font-medium"
                    >
                      <span>🍏 تقویم اپل / اوت‌لوک (.ics)</span>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {!isGuestMode && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.94 }}
              id="card-edit-btn"
              onClick={onOpenEditModal}
              className="flex items-center gap-1.5 text-[#1C221A] hover:bg-black/5 border border-[#B89355]/30 px-3.5 py-1.5 rounded-full text-xs transition-colors cursor-pointer shadow-xs font-medium"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#B88728]" />
              <span className="hidden sm:inline">ویرایش</span>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            id="card-share-btn"
            onClick={onOpenShareModal}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#C59B3F] via-[#B88728] to-[#946F29] text-white font-bold px-4.5 py-1.5 rounded-full text-xs shadow-md shadow-[#B88728]/25 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-white" />
            <span>اشتراک</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            id="card-print-btn"
            onClick={handlePrint}
            className="hidden md:flex items-center gap-1 text-xs text-[#556251] hover:text-[#1C221A] hover:bg-black/5 p-2 rounded-full transition-colors cursor-pointer"
            title="چاپ کارت"
          >
            <Printer className="w-3.5 h-3.5 text-[#B88728]" />
          </motion.button>
        </div>
      </motion.div>

      {/* Main Luxury Wedding Invitation Card Container */}
      <div className={`rounded-[32px] apple-card-border ${currentTheme.cardBg} ${currentTheme.textColor} backdrop-blur-3xl p-5 sm:p-12 shadow-2xl relative overflow-hidden liquid-shimmer border ${currentTheme.borderColor}`}>
        {/* Persian Ornate Foil Corners & Borders */}
        <div className="absolute inset-3 sm:inset-5 border border-[#C5A46D]/30 rounded-[24px] pointer-events-none"></div>
        <div className="absolute inset-5 sm:inset-7 border border-[#C5A46D]/15 rounded-[20px] pointer-events-none"></div>

        {/* Botanical Corner Flourishes */}
        <div className="absolute top-4 left-4 text-[#F5C042]/50 text-lg sm:text-xl pointer-events-none select-none">
          ❦
        </div>
        <div className="absolute top-4 right-4 text-[#F5C042]/50 text-lg sm:text-xl pointer-events-none select-none">
          ❦
        </div>
        <div className="absolute bottom-4 left-4 text-[#F5C042]/50 text-lg sm:text-xl pointer-events-none select-none">
          ❦
        </div>
        <div className="absolute bottom-4 right-4 text-[#F5C042]/50 text-lg sm:text-xl pointer-events-none select-none">
          ❦
        </div>

        {/* Top Poetic & Sacred Invocation in Amiri & Cinzel */}
        <div className="text-center relative z-10 mb-6 sm:mb-9 space-y-1">
          <div className="font-cinzel text-[11px] sm:text-xs text-[#F5C042] tracking-[0.3em] uppercase font-bold">
            ROYAL WEDDING INVITATION
          </div>

          <div className="inline-flex items-center justify-center gap-2 font-amiri mb-2">
            <span className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#C5A46D] to-transparent"></span>
            <span className="text-xl sm:text-2xl font-bold">به نام پیوند‌دهنده دل‌ها و آغاز عشق</span>
            <span className="w-12 h-[1px] bg-gradient-to-l from-transparent via-[#C5A46D] to-transparent"></span>
          </div>

          {/* Parents Introductions (Only if filled) */}
          {hasParentsSection && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs sm:text-sm font-vazir my-3">
              {hasGroomParents && (
                <span className="liquid-glass px-4 py-1.5 rounded-full border border-[#B89355]/30 shadow-sm text-[#1C221A]">
                  خانواده محترم {wedding.groomParents}
                </span>
              )}
              {hasGroomParents && hasBrideParents && (
                <div className="w-7 h-7 rounded-full liquid-glass flex items-center justify-center border border-[#B88728]/50 shadow-inner">
                  <Heart className="w-3.5 h-3.5 text-[#B88728] fill-[#B88728]" />
                </div>
              )}
              {hasBrideParents && (
                <span className="liquid-glass px-4 py-1.5 rounded-full border border-[#B89355]/30 shadow-sm text-[#1C221A]">
                  خانواده محترم {wedding.brideParents}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Centerpiece: Bride & Groom Names in Amiri with Playfair Ampersand */}
        <div className="text-center relative z-10 my-6 sm:my-10">
          <div className="relative inline-block py-4 px-6 sm:px-14">
            {/* Ambient Radial Spotlight */}
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-70 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at center, ${currentTheme.glowColor} 0%, transparent 70%)` }}
            ></div>

            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
              {wedding.brideName?.trim() && (
                <span className="text-5xl sm:text-7xl lg:text-8xl font-amiri font-bold drop-shadow-lg py-1">
                  {wedding.brideName}
                </span>
              )}

              {wedding.brideName?.trim() && wedding.groomName?.trim() && (
                <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full liquid-glass border border-[#F5C042] shadow-lg">
                  <span className="font-playfair italic text-2xl text-[#F5C042] font-bold">&</span>
                </div>
              )}

              {wedding.groomName?.trim() && (
                <span className="text-5xl sm:text-7xl lg:text-8xl font-amiri font-bold drop-shadow-lg py-1">
                  {wedding.groomName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Persian Poem Banner in Amiri (Only if filled) */}
        {hasPoem && (
          <div className="relative z-10 max-w-xl mx-auto my-7 text-center liquid-glass rounded-[24px] p-5 sm:p-7 shadow-xl border border-white/10">
            <div className="text-[#F5C042] text-2xl font-amiri mb-1">❦</div>
            <p className="font-amiri text-xl sm:text-2xl font-bold leading-loose whitespace-pre-line">
              {wedding.poem}
            </p>
            <div className="text-[#F5C042] text-2xl font-amiri mt-1">❦</div>
          </div>
        )}

        {/* Formal Invitation Text in Clean Vazir (Only if filled) */}
        {hasInvitationNote && (
          <div className="relative z-10 max-w-2xl mx-auto text-center my-6">
            <p className="text-sm sm:text-base leading-relaxed font-vazir font-light opacity-95">
              {wedding.invitationNote}
            </p>
          </div>
        )}

        {/* Event Schedule Bento Grid (Apple HIG Bento layout) */}
        {scheduleItemCount > 0 && (
          <div className={`relative z-10 my-7 grid grid-cols-1 ${
            scheduleItemCount === 1 ? 'max-w-xs' : scheduleItemCount === 2 ? 'sm:grid-cols-2 max-w-lg' : 'sm:grid-cols-3 max-w-2xl'
          } gap-3 mx-auto text-center font-vazir`}>
            {/* Ceremony Date */}
            {hasDate && (
              <motion.div 
                whileHover={{ y: -3 }}
                className="liquid-glass rounded-[22px] p-4 flex flex-col items-center justify-center transition-all shadow-lg border border-white/10"
              >
                <Calendar className="w-6 h-6 text-[#F5C042] mb-1.5" />
                <span className="text-[11px] opacity-75">تاریخ فرخنده مراسم</span>
                <span className="text-xs sm:text-sm font-bold mt-1">
                  {wedding.ceremonyDateShamsi}
                </span>
              </motion.div>
            )}

            {/* Ceremony Time */}
            {hasTime && (
              <motion.div 
                whileHover={{ y: -3 }}
                className="liquid-glass rounded-[22px] p-4 flex flex-col items-center justify-center transition-all shadow-lg border border-white/10"
              >
                <Clock className="w-6 h-6 text-[#F5C042] mb-1.5" />
                <span className="text-[11px] opacity-75">ساعت حضور و شادمانی</span>
                <span className="text-xs sm:text-sm font-bold mt-1">
                  {wedding.ceremonyTime}
                </span>
              </motion.div>
            )}

            {/* Hall Name */}
            {hasHall && (
              <motion.div 
                whileHover={{ y: -3 }}
                className="liquid-glass rounded-[22px] p-4 flex flex-col items-center justify-center transition-all shadow-lg border border-white/10"
              >
                <MapPin className="w-6 h-6 text-[#F5C042] mb-1.5" />
                <span className="text-[11px] opacity-75">محل برگزاری بزم</span>
                <span className="text-xs sm:text-sm font-bold mt-1 truncate max-w-full">
                  {wedding.hallName}
                </span>
              </motion.div>
            )}
          </div>
        )}

        {/* Detailed Times: Reception & Dinner Badges (Only if filled) */}
        {hasDetailedTimes && (
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 text-xs my-4 font-vazir">
            {hasReception && (
              <span className="liquid-glass px-4 py-1.5 rounded-full border border-white/10 shadow-sm flex items-center gap-1.5">
                <span>☕ پذیرایی:</span>
                <span className="text-[#F5C042] font-semibold">{wedding.receptionTime}</span>
              </span>
            )}
            {hasDinner && (
              <span className="liquid-glass px-4 py-1.5 rounded-full border border-white/10 shadow-sm flex items-center gap-1.5">
                <span>🍽️ ضیافت شام:</span>
                <span className="text-[#F5C042] font-semibold">{wedding.dinnerTime}</span>
              </span>
            )}
          </div>
        )}

        {/* Live Countdown Timer Bento (Only if Miladi date is provided) */}
        {hasCountdown && (
          <div className="relative z-10">
            <CountdownTimer
              targetDate={wedding.ceremonyDateMiladi}
              shamsiDate={wedding.ceremonyDateShamsi}
            />
          </div>
        )}

        {/* Smart Venue Routing & Navigation Bento */}
        {hasVenueLocation && (
          <div className="relative z-10">
            <LocationRouter
              wedding={wedding}
              onOpenShareModal={onOpenShareModal}
            />
          </div>
        )}

        {/* Special Etiquette / Guest Notes */}
        {hasGuestNotes && (
          <div className="relative z-10 my-6 liquid-glass rounded-[24px] p-4 sm:p-5 max-w-2xl mx-auto text-xs leading-relaxed font-vazir shadow-inner border border-white/10">
            <div className="whitespace-pre-line leading-loose opacity-90">
              {wedding.guestNotes}
            </div>
          </div>
        )}

        {/* RSVP & Guest Congratulations Section */}
        <div className="relative z-10">
          <RSVPSection
            rsvps={rsvps}
            onAddRSVP={onAddRSVP}
            onLikeRSVP={onLikeRSVP}
          />
        </div>

        {/* Footer Signature */}
        <div className="relative z-10 text-center pt-8 border-t border-[#C5A46D]/20 mt-8 font-vazir">
          <div className="text-[#F5C042] font-amiri font-bold text-2xl sm:text-3xl mb-1">
            با آرزوی شادکامی، سلامتی و خوشبختی برای همه شما عزیزان
          </div>
          <div className="font-cinzel text-[10px] sm:text-xs text-[#F5C042]/80 tracking-[0.2em] uppercase mt-1 font-bold">
            CELEBRATING LOVE
          </div>
          <p className="text-[11px] opacity-75 font-vazir mt-1">
            کارت دعوت دیجیتال هوشمند عروسی • طراحی شده با عشق
          </p>
        </div>
      </div>
    </motion.div>
  );
};
