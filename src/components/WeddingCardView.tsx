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
  Sparkles,
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
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="min-h-screen pb-24 px-3 sm:px-6 pt-3 max-w-4xl mx-auto"
      id="wedding-invitation-card-view"
    >
      {/* Top Floating Utility Navigation Dock */}
      <div className="sticky top-3 z-30 mb-6 flex flex-wrap items-center justify-between gap-2.5 bg-[#20231F]/90 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-[#C5A46D]/40 shadow-2xl text-[#F5F0E8]">
        <div className="flex items-center gap-2">
          {/* Back to Envelope */}
          <button
            id="re-envelope-btn"
            onClick={onCloseToEnvelope}
            className="flex items-center gap-1.5 text-xs text-[#F5F0E8] hover:text-white hover:bg-[#707563] px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#C5A46D]" />
            <span className="hidden xs:inline">بازگشت به پاکت</span>
          </button>

          {/* Theme Switcher */}
          <div className="relative">
            <button
              id="card-theme-toggle-btn"
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="flex items-center gap-1.5 text-xs text-[#F5F0E8] hover:bg-[#707563] px-3 py-1.5 rounded-xl transition-colors cursor-pointer border border-[#C5A46D]/30"
              title="تغییر تم رنگی"
            >
              <Palette className="w-3.5 h-3.5 text-[#C5A46D]" />
              <span className="hidden sm:inline">پالت: {currentTheme.nameFa.split(' ')[0]}</span>
            </button>

            <AnimatePresence>
              {showThemePicker && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 p-2 w-64 bg-[#20231F]/95 backdrop-blur-2xl border border-[#C5A46D]/40 rounded-2xl shadow-2xl z-50 space-y-1.5"
                >
                  <div className="text-[11px] font-semibold text-[#C5A46D] px-2 py-1 border-b border-[#C5A46D]/20">
                    انتخاب پالت رنگی کارت:
                  </div>
                  {Object.values(THEME_PRESETS).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        if (onThemeChange) onThemeChange(t.id);
                        setShowThemePicker(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                        wedding.theme === t.id
                          ? 'bg-[#707563] text-[#F5F0E8] font-semibold border border-[#C5A46D]/50'
                          : 'text-[#E0D8CA] hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-white/20 shadow-sm flex-shrink-0"
                          style={{ backgroundColor: t.previewColor }}
                        ></span>
                        <span className="truncate">{t.nameFa}</span>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Toggle Petals */}
          <button
            id="card-toggle-petals-btn"
            onClick={onTogglePetals}
            className={`hidden sm:flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
              petalsActive ? 'text-[#C5A46D] bg-[#707563]/50 border border-[#C5A46D]/40' : 'text-[#E0D8CA] hover:text-white'
            }`}
            title="بارش گلبرگ"
          >
            <Flower2 className="w-3.5 h-3.5 text-[#C5A46D]" />
          </button>
        </div>

        {/* Right Actions: Calendar, Edit, Share, Print */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Add to Calendar (if date exists) */}
          {hasCountdown && (
            <div className="relative">
              <button
                id="add-to-calendar-btn"
                onClick={() => setShowCalendarMenu(!showCalendarMenu)}
                className="flex items-center gap-1.5 text-xs text-[#F5F0E8] bg-[#20231F] hover:bg-[#707563] border border-[#C5A46D]/40 px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow"
                title="افزودن به تقویم گوگل و اپل"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-[#C5A46D]" />
                <span className="hidden sm:inline">افزودن به تقویم</span>
              </button>

              <AnimatePresence>
                {showCalendarMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute top-full left-0 mt-2 p-2 w-52 bg-[#20231F]/95 backdrop-blur-2xl border border-[#C5A46D]/40 rounded-2xl shadow-2xl z-50 space-y-1"
                  >
                    <a
                      href={calendarLinks.googleCalendar}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowCalendarMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#F5F0E8] hover:bg-[#707563] transition-colors"
                    >
                      <span>📅 تقویم گوگل (Google Calendar)</span>
                    </a>
                    <a
                      href={calendarLinks.icsDataUri}
                      download={`wedding-${wedding.brideName || 'card'}-${wedding.groomName || 'card'}.ics`}
                      onClick={() => setShowCalendarMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#F5F0E8] hover:bg-[#707563] transition-colors"
                    >
                      <span>🍏 تقویم اپل / اوت‌لوک (.ics)</span>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <button
            id="card-edit-btn"
            onClick={onOpenEditModal}
            className="flex items-center gap-1.5 bg-[#20231F] hover:bg-[#707563] text-[#F5F0E8] border border-[#C5A46D]/40 px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer shadow"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#C5A46D]" />
            <span className="hidden sm:inline">ویرایش</span>
          </button>

          <button
            id="card-share-btn"
            onClick={onOpenShareModal}
            className="flex items-center gap-1.5 bg-[#20231F] hover:bg-[#707563] text-[#F5F0E8] font-bold px-3.5 py-1.5 rounded-xl text-xs border border-[#C5A46D] transition-all shadow-md cursor-pointer active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5 text-[#C5A46D]" />
            <span>اشتراک</span>
          </button>

          <button
            id="card-print-btn"
            onClick={handlePrint}
            className="hidden md:flex items-center gap-1 text-xs text-[#E0D8CA] hover:text-white hover:bg-[#707563] p-2 rounded-xl transition-colors cursor-pointer"
            title="چاپ کارت"
          >
            <Printer className="w-3.5 h-3.5 text-[#C5A46D]" />
          </button>
        </div>
      </div>

      {/* Main Luxury Wedding Invitation Card Container */}
      <div className={`rounded-3xl border border-[#C5A46D]/40 bg-[#3F473D] text-[#F5F0E8] backdrop-blur-2xl p-5 sm:p-12 shadow-2xl relative overflow-hidden`}>
        {/* Persian Ornate Foil Corners & Borders */}
        <div className="absolute inset-3 sm:inset-5 border border-[#C5A46D]/30 rounded-2xl pointer-events-none"></div>
        <div className="absolute inset-5 sm:inset-7 border border-[#C5A46D]/15 rounded-xl pointer-events-none"></div>

        {/* Botanical Corner Flourishes (Replaced text with elegant botanical ornaments) */}
        <div className="absolute top-4 left-4 text-[#C5A46D]/40 text-lg sm:text-xl pointer-events-none select-none">
          ❦
        </div>
        <div className="absolute top-4 right-4 text-[#C5A46D]/40 text-lg sm:text-xl pointer-events-none select-none">
          ❦
        </div>
        <div className="absolute bottom-4 left-4 text-[#C5A46D]/40 text-lg sm:text-xl pointer-events-none select-none">
          ❦
        </div>
        <div className="absolute bottom-4 right-4 text-[#C5A46D]/40 text-lg sm:text-xl pointer-events-none select-none">
          ❦
        </div>

        {/* Top Poetic & Sacred Invocation in Amiri & Cinzel */}
        <div className="text-center relative z-10 mb-6 sm:mb-9 space-y-1">
          <div className="font-cinzel text-[11px] sm:text-xs text-[#C5A46D] tracking-[0.3em] uppercase font-semibold">
            WEDDING INVITATION
          </div>

          <div className="inline-flex items-center justify-center gap-2 text-[#F5F0E8] font-amiri mb-2">
            <span className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#C5A46D] to-transparent"></span>
            <span className="text-xl sm:text-2xl font-bold">به نام پیوند‌دهنده دل‌ها و آغاز عشق</span>
            <span className="w-12 h-[1px] bg-gradient-to-l from-transparent via-[#C5A46D] to-transparent"></span>
          </div>

          {/* Parents Introductions (Only if filled) */}
          {hasParentsSection && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-[#F5F0E8] text-xs sm:text-sm font-vazir my-3">
              {hasGroomParents && (
                <span className="bg-[#20231F]/50 border border-[#C5A46D]/30 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
                  خانواده محترم {wedding.groomParents}
                </span>
              )}
              {hasGroomParents && hasBrideParents && (
                <div className="w-6 h-6 rounded-full bg-[#20231F] border border-[#C5A46D]/50 flex items-center justify-center">
                  <Heart className="w-3.5 h-3.5 text-[#C5A46D] fill-[#C5A46D]" />
                </div>
              )}
              {hasBrideParents && (
                <span className="bg-[#20231F]/50 border border-[#C5A46D]/30 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
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
              className="absolute inset-0 rounded-full blur-2xl opacity-60 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at center, rgba(197, 164, 109, 0.4) 0%, transparent 70%)` }}
            ></div>

            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
              {wedding.brideName?.trim() && (
                <span className="text-5xl sm:text-7xl lg:text-8xl font-amiri font-bold text-[#F5F0E8] drop-shadow-lg py-1">
                  {wedding.brideName}
                </span>
              )}

              {wedding.brideName?.trim() && wedding.groomName?.trim() && (
                <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#20231F] border border-[#C5A46D] shadow-inner">
                  <span className="font-playfair italic text-2xl text-[#C5A46D] font-bold">&</span>
                </div>
              )}

              {wedding.groomName?.trim() && (
                <span className="text-5xl sm:text-7xl lg:text-8xl font-amiri font-bold text-[#F5F0E8] drop-shadow-lg py-1">
                  {wedding.groomName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Persian Poem Banner in Amiri (Only if filled) */}
        {hasPoem && (
          <div className="relative z-10 max-w-xl mx-auto my-7 text-center bg-[#20231F]/60 border border-[#C5A46D]/40 rounded-2xl p-5 sm:p-7 shadow-inner backdrop-blur-sm">
            <div className="text-[#C5A46D] text-2xl font-amiri mb-1">❦</div>
            <p className="font-amiri text-xl sm:text-2xl font-bold text-[#F5F0E8] leading-loose whitespace-pre-line">
              {wedding.poem}
            </p>
            <div className="text-[#C5A46D] text-2xl font-amiri mt-1">❦</div>
          </div>
        )}

        {/* Formal Invitation Text in Clean Vazir (Only if filled) */}
        {hasInvitationNote && (
          <div className="relative z-10 max-w-2xl mx-auto text-center my-6">
            <p className="text-[#F5F0E8] text-sm sm:text-base leading-relaxed font-vazir font-light">
              {wedding.invitationNote}
            </p>
          </div>
        )}

        {/* Event Schedule Bento Grid (Only if at least one item filled) */}
        {scheduleItemCount > 0 && (
          <div className={`relative z-10 my-7 grid grid-cols-1 ${
            scheduleItemCount === 1 ? 'max-w-xs' : scheduleItemCount === 2 ? 'sm:grid-cols-2 max-w-lg' : 'sm:grid-cols-3 max-w-2xl'
          } gap-3 mx-auto text-center font-vazir`}>
            {/* Ceremony Date */}
            {hasDate && (
              <div className="bg-[#20231F]/60 border border-[#C5A46D]/30 hover:border-[#C5A46D]/70 rounded-2xl p-4 flex flex-col items-center justify-center transition-colors shadow-md">
                <Calendar className="w-6 h-6 text-[#C5A46D] mb-1.5" />
                <span className="text-[11px] text-[#E0D8CA]/80">تاریخ فرخنده مراسم</span>
                <span className="text-xs sm:text-sm font-bold text-[#F5F0E8] mt-1">
                  {wedding.ceremonyDateShamsi}
                </span>
              </div>
            )}

            {/* Ceremony Time */}
            {hasTime && (
              <div className="bg-[#20231F]/60 border border-[#C5A46D]/30 hover:border-[#C5A46D]/70 rounded-2xl p-4 flex flex-col items-center justify-center transition-colors shadow-md">
                <Clock className="w-6 h-6 text-[#C5A46D] mb-1.5" />
                <span className="text-[11px] text-[#E0D8CA]/80">ساعت حضور و شادمانی</span>
                <span className="text-xs sm:text-sm font-bold text-[#F5F0E8] mt-1">
                  {wedding.ceremonyTime}
                </span>
              </div>
            )}

            {/* Hall Name */}
            {hasHall && (
              <div className="bg-[#20231F]/60 border border-[#C5A46D]/30 hover:border-[#C5A46D]/70 rounded-2xl p-4 flex flex-col items-center justify-center transition-colors shadow-md">
                <MapPin className="w-6 h-6 text-[#C5A46D] mb-1.5" />
                <span className="text-[11px] text-[#E0D8CA]/80">محل برگزاری بزم</span>
                <span className="text-xs sm:text-sm font-bold text-[#F5F0E8] mt-1 truncate max-w-full">
                  {wedding.hallName}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Detailed Times: Reception & Dinner Badges (Only if filled) */}
        {hasDetailedTimes && (
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 text-xs text-[#F5F0E8] my-4 font-vazir">
            {hasReception && (
              <span className="bg-[#20231F]/60 px-4 py-1.5 rounded-full border border-[#C5A46D]/30 shadow-sm flex items-center gap-1.5">
                <span>☕ پذیرایی:</span>
                <span className="text-[#C5A46D] font-semibold">{wedding.receptionTime}</span>
              </span>
            )}
            {hasDinner && (
              <span className="bg-[#20231F]/60 px-4 py-1.5 rounded-full border border-[#C5A46D]/30 shadow-sm flex items-center gap-1.5">
                <span>🍽️ ضیافت شام:</span>
                <span className="text-[#C5A46D] font-semibold">{wedding.dinnerTime}</span>
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

        {/* Smart Venue Routing & Navigation Bento (Only if venue info is provided) */}
        {hasVenueLocation && (
          <div className="relative z-10">
            <LocationRouter
              wedding={wedding}
              onOpenShareModal={onOpenShareModal}
            />
          </div>
        )}

        {/* Special Etiquette / Guest Notes (Only if filled) */}
        {hasGuestNotes && (
          <div className="relative z-10 my-6 bg-[#20231F]/60 border border-[#C5A46D]/30 rounded-2xl p-4 sm:p-5 max-w-2xl mx-auto text-xs text-[#F5F0E8] leading-relaxed font-vazir shadow-inner">
            <div className="text-[#E0D8CA] whitespace-pre-line leading-loose">
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
        <div className="relative z-10 text-center pt-8 border-t border-[#C5A46D]/30 mt-8 font-vazir">
          <div className="text-[#C5A46D] font-amiri font-bold text-2xl sm:text-3xl mb-1">
            با آرزوی شادکامی، سلامتی و خوشبختی برای همه شما عزیزان
          </div>
          <div className="font-cinzel text-[10px] sm:text-xs text-[#C5A46D]/80 tracking-[0.2em] uppercase mt-1">
            CELEBRATING LOVE
          </div>
          <p className="text-[11px] text-[#E0D8CA] font-vazir mt-1">
            کارت دعوت دیجیتال هوشمند عروسی • طراحی شده با عشق
          </p>
        </div>
      </div>
    </motion.div>
  );
};
