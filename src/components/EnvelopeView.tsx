import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, MailOpen, Edit3, Share2, Palette, Flower2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WeddingDetails, ThemeVariant } from '../types';
import { THEME_PRESETS } from '../utils/themePresets';

interface EnvelopeViewProps {
  wedding: WeddingDetails;
  isOpen: boolean;
  onOpen: () => void;
  onEditClick: () => void;
  onShareClick: () => void;
  onThemeChange?: (theme: ThemeVariant) => void;
  petalsActive?: boolean;
  onTogglePetals?: () => void;
}

export const EnvelopeView: React.FC<EnvelopeViewProps> = ({
  wedding,
  isOpen,
  onOpen,
  onEditClick,
  onShareClick,
  onThemeChange,
  petalsActive = true,
  onTogglePetals,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const currentTheme = THEME_PRESETS[wedding.theme] || THEME_PRESETS['sage-gold'];

  const handleEnvelopeClick = () => {
    if (isOpen) return;

    // Luxurious golden celebratory confetti burst
    const count = 220;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#FFE29F', '#FFAE34', '#D49024', '#FFFFFF', '#F43F5E', '#10B981']
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, { spread: 30, startVelocity: 60 });
    fire(0.2, { spread: 65 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 130, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 130, startVelocity: 45 });

    onOpen();
  };

  return (
    <div className="relative min-h-[92vh] flex flex-col items-center justify-start sm:justify-center px-4 py-4 sm:py-8 overflow-hidden select-none pb-28 sm:pb-16">
      
      {/* Top Floating Control Bar (Natural flex flow - never overlaps content) */}
      <div className="w-full max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2.5 z-30 mb-6 sm:mb-8 pt-1">
        {/* Left: Brand Badge & Theme Picker */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              id="theme-switcher-toggle-btn"
              onClick={() => setShowThemePicker(!showThemePicker)}
              className={`flex items-center gap-1.5 ${currentTheme.navBtnBg} backdrop-blur-md px-3.5 py-1.5 rounded-full border ${currentTheme.navBtnBorder} text-xs ${currentTheme.navBtnText} transition-all cursor-pointer shadow-lg active:scale-95`}
              title="تغییر تم رنگی کارت"
            >
              <Palette className="w-3.5 h-3.5 text-[#C5A46D]" />
              <span>پالت رنگی: {currentTheme.nameFa.split(' ')[0]}</span>
            </button>

            {/* Theme Picker Dropdown */}
            <AnimatePresence>
              {showThemePicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 p-2 w-64 bg-[#1E1B2C]/98 backdrop-blur-xl border border-[#C5A46D]/40 rounded-2xl shadow-2xl z-50 space-y-1.5"
                >
                  <div className="text-[11px] font-semibold text-[#C5A46D] px-2 py-1 border-b border-[#C5A46D]/20">
                    انتخاب تم رنگی کارت:
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
                          ? 'bg-[#3F473D] text-[#F5F0E8] font-semibold border border-[#C5A46D]/60'
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

          {/* Toggle Rose Petals */}
          <button
            id="toggle-petals-btn"
            onClick={onTogglePetals}
            className={`hidden sm:flex items-center gap-1.5 backdrop-blur-md px-3 py-1.5 rounded-full border text-xs transition-all cursor-pointer shadow-lg active:scale-95 ${
              petalsActive
                ? 'bg-[#3F473D] border-[#C5A46D] text-[#F5F0E8]'
                : `${currentTheme.navBtnBg} ${currentTheme.navBtnBorder} ${currentTheme.navBtnText}`
            }`}
            title="بارش گلبرگ و ذرات زرین"
          >
            <Flower2 className="w-3.5 h-3.5 text-[#C5A46D]" />
            <span>بارش گلبرگ</span>
          </button>
        </div>

        {/* Right Actions: Edit & Share */}
        <div className="flex items-center gap-2">
          <button
            id="open-edit-modal-top-btn"
            onClick={onEditClick}
            className={`flex items-center gap-1.5 ${currentTheme.navBtnBg} ${currentTheme.navBtnText} backdrop-blur-md px-3.5 py-1.5 rounded-full border ${currentTheme.navBtnBorder} text-xs transition-all cursor-pointer shadow-lg active:scale-95`}
          >
            <Edit3 className="w-3.5 h-3.5 text-[#C5A46D]" />
            <span>ویرایش مشخصات</span>
          </button>

          <button
            id="open-share-top-btn"
            onClick={onShareClick}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#C5A46D] to-[#9E7B3B] text-[#1A1815] font-bold px-4 py-1.5 rounded-full text-xs border border-[#FFF6D5]/60 transition-all cursor-pointer shadow-lg active:scale-95 hover:brightness-110"
          >
            <Share2 className="w-3.5 h-3.5 text-[#1A1815]" />
            <span>ارسال و اشتراک</span>
          </button>
        </div>
      </div>

      {/* Persian & Latin Calligraphy Header with High Dynamic Contrast */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-6 sm:mb-8 z-20 space-y-2 max-w-2xl mx-auto px-2"
      >
        {/* Luxury Latin Subtitle (Cinzel) */}
        <div className={`text-[11px] sm:text-xs font-cinzel tracking-[0.28em] uppercase font-bold ${currentTheme.pageSubheadingColor}`}>
          ROYAL WEDDING INVITATION
        </div>

        {/* Sacred Title in Amiri */}
        <div className="inline-flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base font-amiri font-bold">
          <span className="w-8 sm:w-14 h-[1px] bg-gradient-to-r from-transparent via-[#C5A46D] to-transparent"></span>
          <span className={`text-xl sm:text-2xl font-bold drop-shadow-sm ${currentTheme.pageHeadingColor}`}>
            به نام پیوند‌دهنده دل‌ها و آغاز عشق
          </span>
          <span className="w-8 sm:w-14 h-[1px] bg-gradient-to-l from-transparent via-[#C5A46D] to-transparent"></span>
        </div>

        {/* Bride & Groom Names in Amiri with Gold Accent */}
        <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-amiri font-bold tracking-normal mb-1 drop-shadow-md py-1 flex items-center justify-center gap-3 sm:gap-4 ${currentTheme.coupleNamesColor}`}>
          <span>{wedding.brideName}</span>
          <span className={`font-playfair italic text-3xl sm:text-5xl font-normal px-1 drop-shadow-sm ${currentTheme.ampersandColor}`}>
            &
          </span>
          <span>{wedding.groomName}</span>
        </h1>

        <p className={`text-xs sm:text-sm font-vazir font-semibold max-w-md mx-auto ${currentTheme.instructionTextColor}`}>
          برای گشودن پاکت و طنین موسیقی جشن، روی مهر موم طلایی کلیک کنید
        </p>
      </motion.div>

      {/* 3D Photorealistic Envelope */}
      <div
        className="relative w-full max-w-[350px] sm:max-w-[440px] aspect-[4/3] cursor-pointer group z-20 perspective-1000 my-1"
        onClick={handleEnvelopeClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        id="wedding-envelope-container"
      >
        {/* Shimmering Ambient Glow behind envelope */}
        <div
          className="absolute -inset-6 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${currentTheme.glowColor} 0%, transparent 70%)` }}
        ></div>

        {/* Envelope Main Outer Body */}
        <motion.div
          animate={{
            scale: isHovered && !isOpen ? 1.025 : 1,
            y: isHovered && !isOpen ? -6 : 0
          }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          className={`relative w-full h-full rounded-3xl ${currentTheme.envelopeBg} border ${currentTheme.envelopeBorder} shadow-2xl overflow-hidden flex flex-col justify-end`}
        >
          {/* Subtle Golden Corner Flourishes */}
          <div className="absolute top-3 left-4 text-[#C5A46D]/25 text-lg pointer-events-none select-none">
            ❦
          </div>
          <div className="absolute bottom-3 right-4 text-[#C5A46D]/25 text-lg pointer-events-none select-none">
            ❦
          </div>

          {/* Invitation Card Peaking from inside envelope */}
          <motion.div
            initial={{ y: 0 }}
            animate={isOpen ? { y: -200, opacity: 0 } : { y: isHovered ? -26 : 0 }}
            transition={{ duration: 0.65, ease: 'easeInOut' }}
            className={`absolute top-4 inset-x-4 sm:inset-x-6 h-[88%] ${currentTheme.cardBg} rounded-2xl shadow-2xl border-2 border-[#C5A46D]/60 p-3 sm:p-4 flex flex-col items-center justify-between text-[#F5F0E8] text-center z-10 overflow-hidden`}
          >
            {/* Inner Gold Foil Frame */}
            <div className="w-full h-full border border-[#C5A46D]/40 rounded-xl p-3 flex flex-col items-center justify-between bg-gradient-to-b from-black/20 to-black/40 relative">
              {/* Card Corner Ornaments */}
              <div className="absolute top-1.5 left-2 text-[#C5A46D]/50 text-xs select-none">❦</div>
              <div className="absolute top-1.5 right-2 text-[#C5A46D]/50 text-xs select-none">❦</div>

              {/* Card Header */}
              <div className="flex items-center gap-2 text-[#C5A46D] text-[10px] sm:text-[11px] font-cinzel tracking-[0.25em] font-bold">
                <span className="w-4 h-[1px] bg-[#C5A46D]/60"></span>
                <Heart className="w-3 h-3 text-[#C5A46D] fill-[#C5A46D]" />
                <span>SAVE THE DATE</span>
                <Heart className="w-3 h-3 text-[#C5A46D] fill-[#C5A46D]" />
                <span className="w-4 h-[1px] bg-[#C5A46D]/60"></span>
              </div>

              {/* Couple Names & Date (Only if filled) */}
              <div className="space-y-1 my-auto">
                <div className="text-2xl sm:text-4xl font-amiri font-bold text-[#F5F0E8] drop-shadow-md flex items-center justify-center gap-2">
                  {wedding.brideName?.trim() && <span>{wedding.brideName}</span>}
                  {wedding.brideName?.trim() && wedding.groomName?.trim() && (
                    <span className="font-playfair italic text-xl sm:text-2xl text-[#C5A46D] font-normal">&</span>
                  )}
                  {wedding.groomName?.trim() && <span>{wedding.groomName}</span>}
                </div>
                {wedding.ceremonyDateShamsi?.trim() && (
                  <div className="text-xs sm:text-sm font-vazir font-medium text-[#E0D8CA]">
                    {wedding.ceremonyDateShamsi}
                  </div>
                )}
              </div>

              {/* Call to action badge */}
              <div className="text-[10px] sm:text-[11px] text-[#F5F0E8] font-vazir font-semibold flex items-center gap-1.5 bg-[#20231F] border border-[#C5A46D]/50 px-4 py-1.5 rounded-full shadow-md">
                <MailOpen className="w-3 h-3 text-[#C5A46D]" />
                <span>لمس جهت گشودن دعوت‌نامه</span>
              </div>
            </div>
          </motion.div>

          {/* Envelope Bottom Triangle Flap */}
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              clipPath: 'polygon(0% 100%, 50% 55%, 100% 100%, 100% 0%, 100% 100%, 0% 100%)',
              background: 'linear-gradient(to top, rgba(30, 36, 29, 0.99) 0%, rgba(55, 63, 53, 0.96) 100%)',
              borderTop: '1.5px solid rgba(197, 164, 109, 0.55)'
            }}
          ></div>

          {/* Left / Right Envelope Flaps */}
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              clipPath: 'polygon(0% 0%, 50% 55%, 0% 100%)',
              background: 'linear-gradient(to right, rgba(35, 42, 34, 0.98) 0%, rgba(52, 60, 50, 0.95) 100%)',
            }}
          ></div>

          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              clipPath: 'polygon(100% 0%, 50% 55%, 100% 100%)',
              background: 'linear-gradient(to left, rgba(35, 42, 34, 0.98) 0%, rgba(52, 60, 50, 0.95) 100%)',
            }}
          ></div>

          {/* Top Flap (Animated 3D Flip) */}
          <motion.div
            animate={isOpen ? { rotateX: 180, zIndex: 0 } : { rotateX: 0, zIndex: 25 }}
            transition={{ duration: 0.75, ease: 'easeInOut' }}
            className="absolute top-0 inset-x-0 h-1/2 origin-top preserve-3d"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
              background: 'linear-gradient(to bottom, rgba(62, 72, 60, 0.99) 0%, rgba(45, 52, 43, 0.98) 100%)',
              borderBottom: '1.5px solid rgba(197, 164, 109, 0.6)'
            }}
          ></motion.div>

          {/* 3D Wax Seal with Embossed Botanical Rings Crest (No Initials) */}
          <motion.div
            animate={{
              scale: isHovered && !isOpen ? [1, 1.08, 1] : 1,
              boxShadow: isHovered ? '0 0 35px rgba(197, 164, 109, 0.65)' : '0 0 16px rgba(197, 164, 109, 0.3)'
            }}
            transition={{ repeat: isHovered ? Infinity : 0, duration: 1.6 }}
            className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#20231F] via-[#3F473D] to-[#C5A46D] p-1.5 shadow-2xl flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
          >
            <div className="w-full h-full rounded-full bg-[#20231F] border-2 border-[#C5A46D] flex flex-col items-center justify-center text-[#C5A46D] shadow-inner relative overflow-hidden">
              {/* Organic Wax Texture & Specular Highlight */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-[#C5A46D]/20 pointer-events-none"></div>

              {/* Concentric Embossed Gold Ring Detail */}
              <div className="absolute inset-1 border border-[#C5A46D]/30 rounded-full pointer-events-none"></div>

              {/* Botanical Intertwined Rings Crest */}
              <div className="relative flex items-center justify-center mb-0.5">
                <div className="relative flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full border-2 border-[#C5A46D] shadow-sm"></div>
                  <div className="w-5 h-5 rounded-full border-2 border-[#C5A46D] shadow-sm -mr-2.5 bg-[#20231F]/60"></div>
                </div>
              </div>

              {/* Persian Invitation Calligraphy */}
              <div className="text-[11px] sm:text-xs font-amiri font-bold text-[#F5F0E8] drop-shadow tracking-wider">
                بگشایید
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Pulsing Hint Badge and Music Track cleanly separated below the Envelope */}
      <div className="mt-8 z-20 flex flex-col items-center gap-2.5 text-center w-full max-w-md px-2">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="flex items-center justify-center gap-2 text-[#F5F0E8] text-xs sm:text-sm font-medium bg-[#20231F]/95 backdrop-blur-md px-5 py-2.5 rounded-full border border-[#C5A46D]/60 shadow-xl"
        >
          <Sparkles className="w-4 h-4 text-[#C5A46D] animate-pulse" />
          <span>جهت گشودن کارت و نواختن موسیقی، روی مهر کلیک فرمایید</span>
        </motion.div>

        {/* Guest Quick Audio Track info */}
        <div className={`text-xs font-vazir px-4 py-1.5 rounded-full border shadow-sm ${currentTheme.navBtnBg} ${currentTheme.navBtnBorder} ${currentTheme.navBtnText}`}>
          <span className="opacity-75">موسیقی منتخب: </span>
          <span className="font-bold text-[#C5A46D]">{wedding.musicTitle}</span>
        </div>
      </div>
    </div>
  );
};
