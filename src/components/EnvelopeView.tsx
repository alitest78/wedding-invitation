import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
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
  const envelopeRef = useRef<HTMLDivElement>(null);

  // Emil Kowalski 3D Parallax Tilt Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for tilt
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), {
    stiffness: 260,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), {
    stiffness: 260,
    damping: 24,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isOpen || !envelopeRef.current) return;
    const rect = envelopeRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

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
      
      {/* Apple Dynamic Island Navigation Capsule (Liquid Glass Top Floating Bar) */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="w-full max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-2.5 z-30 mb-6 sm:mb-8 pt-1"
      >
        {/* Left: Brand Badge & Theme Picker */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              id="theme-switcher-toggle-btn"
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="flex items-center gap-1.5 liquid-glass-pill px-4 py-2 rounded-full text-xs text-[#1C221A] font-medium transition-all cursor-pointer shadow-md"
              title="تغییر تم رنگی کارت"
            >
              <Palette className="w-3.5 h-3.5 text-[#B88728]" />
              <span>پالت رنگی: {currentTheme.nameFa.split(' ')[0]}</span>
            </motion.button>

            {/* Theme Picker Dropdown (Liquid Glass Popover Style) */}
            <AnimatePresence>
              {showThemePicker && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  className="absolute top-full right-0 mt-2 p-2 w-64 liquid-glass rounded-[24px] shadow-2xl z-50 space-y-1.5 border border-[#B89355]/30"
                >
                  <div className="text-[11px] font-bold text-[#946F29] px-2.5 py-1 border-b border-[#B89355]/20">
                    انتخاب تم رنگی کارت:
                  </div>
                  {Object.values(THEME_PRESETS).map((t) => (
                    <motion.button
                      key={t.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        if (onThemeChange) onThemeChange(t.id);
                        setShowThemePicker(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                        wedding.theme === t.id
                          ? 'bg-gradient-to-r from-[#B88728] to-[#946F29] text-white font-bold shadow-md'
                          : 'text-[#2C3529] hover:bg-[#B89355]/15'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
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

          {/* Toggle Rose Petals */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            id="toggle-petals-btn"
            onClick={onTogglePetals}
            className={`hidden sm:flex items-center gap-1.5 liquid-glass-pill px-3.5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer shadow-md ${
              petalsActive ? 'border-[#B88728] text-[#B88728]' : 'text-[#475243]'
            }`}
            title="بارش گلبرگ و ذرات زرین"
          >
            <Flower2 className="w-3.5 h-3.5 text-[#B88728]" />
            <span>بارش گلبرگ</span>
          </motion.button>
        </div>

        {/* Right Actions: Edit & Share (Liquid Glass Capsule Buttons) */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            id="open-edit-modal-top-btn"
            onClick={onEditClick}
            className="flex items-center gap-1.5 liquid-glass-pill px-4 py-2 rounded-full text-xs text-[#1C221A] font-medium transition-all cursor-pointer shadow-md"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#B88728]" />
            <span>ویرایش مشخصات</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            id="open-share-top-btn"
            onClick={onShareClick}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#C59B3F] via-[#B88728] to-[#946F29] text-white font-bold px-4.5 py-2 rounded-full text-xs shadow-lg shadow-[#B88728]/25 transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-white" />
            <span>ارسال و اشتراک</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Persian & Latin Calligraphy Header with Apple-grade Typography Hierarchy */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className="text-center mb-6 sm:mb-8 z-20 space-y-2 max-w-2xl mx-auto px-2"
      >
        {/* Luxury Latin Subtitle (Cinzel) */}
        <div className={`text-[11px] sm:text-xs font-cinzel tracking-[0.3em] uppercase font-bold ${currentTheme.pageSubheadingColor}`}>
          ROYAL WEDDING INVITATION
        </div>

        {/* Sacred Title in Amiri */}
        <div className="inline-flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base font-amiri font-bold">
          <span className="w-8 sm:w-14 h-[1px] bg-gradient-to-r from-transparent via-[#B89355] to-transparent"></span>
          <span className={`text-xl sm:text-2xl font-bold drop-shadow-sm ${currentTheme.pageHeadingColor}`}>
            به نام پیوند‌دهنده دل‌ها و آغاز عشق
          </span>
          <span className="w-8 sm:w-14 h-[1px] bg-gradient-to-l from-transparent via-[#B89355] to-transparent"></span>
        </div>

        {/* Bride & Groom Names in Amiri with Gold Accent */}
        <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-amiri font-bold tracking-normal mb-1 drop-shadow-sm py-1 flex items-center justify-center gap-3 sm:gap-4 ${currentTheme.coupleNamesColor}`}>
          <span>{wedding.brideName}</span>
          <span className={`font-playfair italic text-3xl sm:text-5xl font-normal px-1 drop-shadow-sm ${currentTheme.ampersandColor}`}>
            &
          </span>
          <span>{wedding.groomName}</span>
        </h1>

        <p className={`text-xs sm:text-sm font-vazir font-semibold max-w-md mx-auto ${currentTheme.instructionTextColor}`}>
          برای گشودن پاکت و طنین موسیقی جشن، روی مهر موم کلیک فرمایید
        </p>
      </motion.div>

      {/* 3D Photorealistic Envelope with Emil Kowalski Physics & Parallax */}
      <motion.div
        ref={envelopeRef}
        style={{
          rotateX: isOpen ? 0 : rotateX,
          rotateY: isOpen ? 0 : rotateY,
          transformPerspective: 1200,
        }}
        whileHover={{ scale: 1.025 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        className="relative w-full max-w-[350px] sm:max-w-[450px] aspect-[4/3] cursor-pointer group z-20 perspective-1000 my-1"
        onClick={handleEnvelopeClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        id="wedding-envelope-container"
      >
        {/* Shimmering Ambient Glow behind envelope */}
        <div
          className="absolute -inset-8 rounded-[40px] blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-700 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${currentTheme.glowColor} 0%, transparent 70%)` }}
        ></div>

        {/* Envelope Main Outer Body with Liquid Glass Refraction */}
        <div
          className={`relative w-full h-full rounded-[32px] ${currentTheme.envelopeBg} border ${currentTheme.envelopeBorder} apple-card-border overflow-hidden flex flex-col justify-end shadow-2xl`}
        >
          {/* Subtle Golden Corner Flourishes */}
          <div className="absolute top-3 left-4 text-[#B88728]/45 text-lg pointer-events-none select-none">
            ❦
          </div>
          <div className="absolute bottom-3 right-4 text-[#B88728]/45 text-lg pointer-events-none select-none">
            ❦
          </div>

          {/* Invitation Card Peaking from inside envelope */}
          <motion.div
            initial={{ y: 0 }}
            animate={isOpen ? { y: -200, opacity: 0 } : { y: isHovered ? -28 : 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className={`absolute top-4 inset-x-4 sm:inset-x-6 h-[88%] ${currentTheme.cardBg} rounded-[22px] shadow-2xl border-2 border-[#B89355]/50 p-3 sm:p-4 flex flex-col items-center justify-between ${currentTheme.textColor} text-center z-10 overflow-hidden liquid-shimmer`}
          >
            {/* Inner Gold Foil Frame */}
            <div className="w-full h-full border border-[#B89355]/40 rounded-xl p-3 flex flex-col items-center justify-between bg-gradient-to-b from-white/60 to-white/20 relative">
              {/* Card Corner Ornaments */}
              <div className="absolute top-1.5 left-2 text-[#B88728]/70 text-xs select-none">❦</div>
              <div className="absolute top-1.5 right-2 text-[#B88728]/70 text-xs select-none">❦</div>

              {/* Card Header */}
              <div className="flex items-center gap-2 text-[#B88728] text-[10px] sm:text-[11px] font-cinzel tracking-[0.25em] font-bold">
                <span className="w-4 h-[1px] bg-[#B88728]/60"></span>
                <Heart className="w-3 h-3 text-[#B88728] fill-[#B88728]" />
                <span>SAVE THE DATE</span>
                <Heart className="w-3 h-3 text-[#B88728] fill-[#B88728]" />
                <span className="w-4 h-[1px] bg-[#B88728]/60"></span>
              </div>

              {/* Couple Names & Date (Only if filled) */}
              <div className="space-y-1 my-auto">
                <div className="text-2xl sm:text-4xl font-amiri font-bold text-[#1C221A] drop-shadow-sm flex items-center justify-center gap-2">
                  {wedding.brideName?.trim() && <span>{wedding.brideName}</span>}
                  {wedding.brideName?.trim() && wedding.groomName?.trim() && (
                    <span className="font-playfair italic text-xl sm:text-2xl text-[#B88728] font-normal">&</span>
                  )}
                  {wedding.groomName?.trim() && <span>{wedding.groomName}</span>}
                </div>
                {wedding.ceremonyDateShamsi?.trim() && (
                  <div className="text-xs sm:text-sm font-vazir font-medium text-[#475243]">
                    {wedding.ceremonyDateShamsi}
                  </div>
                )}
              </div>

              {/* Call to action badge */}
              <div className="text-[10px] sm:text-[11px] text-[#1C221A] font-vazir font-semibold flex items-center gap-1.5 bg-white/90 border border-[#B89355]/45 px-4 py-1.5 rounded-full shadow-md">
                <MailOpen className="w-3 h-3 text-[#B88728]" />
                <span>لمس جهت گشودن دعوت‌نامه</span>
              </div>
            </div>
          </motion.div>

          {/* Envelope Bottom Triangle Flap */}
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              clipPath: 'polygon(0% 100%, 50% 55%, 100% 100%, 100% 0%, 100% 100%, 0% 100%)',
              background: currentTheme.envelopeBottomFlap || 'linear-gradient(to top, rgba(234, 227, 215, 0.99) 0%, rgba(246, 241, 233, 0.96) 100%)',
              borderTop: '1.5px solid rgba(184, 147, 85, 0.6)'
            }}
          ></div>

          {/* Left / Right Envelope Flaps */}
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              clipPath: 'polygon(0% 0%, 50% 55%, 0% 100%)',
              background: currentTheme.envelopeSideFlap || 'linear-gradient(to right, rgba(230, 222, 210, 0.98) 0%, rgba(240, 234, 224, 0.95) 100%)',
            }}
          ></div>

          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              clipPath: 'polygon(100% 0%, 50% 55%, 100% 100%)',
              background: currentTheme.envelopeSideFlap || 'linear-gradient(to left, rgba(230, 222, 210, 0.98) 0%, rgba(240, 234, 224, 0.95) 100%)',
            }}
          ></div>

          {/* Top Flap (Animated 3D Flip) */}
          <motion.div
            animate={isOpen ? { rotateX: 180, zIndex: 0 } : { rotateX: 0, zIndex: 25 }}
            transition={{ duration: 0.75, ease: 'easeInOut' }}
            className="absolute top-0 inset-x-0 h-1/2 origin-top preserve-3d"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
              background: currentTheme.envelopeTopFlap || 'linear-gradient(to bottom, rgba(244, 239, 230, 0.99) 0%, rgba(228, 221, 209, 0.98) 100%)',
              borderBottom: '1.5px solid rgba(184, 147, 85, 0.65)'
            }}
          ></motion.div>

          {/* 3D Wax Seal with Liquid Gold Core and Tactile Pop */}
          <motion.div
            whileTap={{ scale: 0.88 }}
            animate={{
              scale: isHovered && !isOpen ? [1, 1.08, 1] : 1,
              boxShadow: isHovered ? '0 0 35px rgba(184, 147, 85, 0.65)' : '0 10px 25px rgba(140, 35, 46, 0.35)'
            }}
            transition={{ repeat: isHovered ? Infinity : 0, duration: 1.6 }}
            className={`absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr ${currentTheme.waxSealGradient} p-1.5 shadow-2xl flex items-center justify-center cursor-pointer`}
          >
            <div className={`w-full h-full rounded-full ${currentTheme.waxSealInner} border-2 border-[#F5C042] flex flex-col items-center justify-center ${currentTheme.waxSealText} shadow-inner relative overflow-hidden`}>
              {/* Organic Wax Texture & Specular Highlight */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/30 pointer-events-none"></div>

              {/* Concentric Embossed Gold Ring Detail */}
              <div className="absolute inset-1 border border-[#F5C042]/50 rounded-full pointer-events-none"></div>

              {/* Botanical Intertwined Rings Crest */}
              <div className="relative flex items-center justify-center mb-0.5">
                <div className="relative flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full border-2 border-[#F5C042] shadow-sm"></div>
                  <div className="w-5 h-5 rounded-full border-2 border-[#F5C042] shadow-sm -mr-2.5 bg-black/25"></div>
                </div>
              </div>

              {/* Persian Invitation Calligraphy */}
              <div className="text-[11px] sm:text-xs font-amiri font-bold text-[#FFE8A3] drop-shadow tracking-wider">
                بگشایید
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Pulsing Hint Badge and Music Track cleanly separated below the Envelope */}
      <div className="mt-8 z-20 flex flex-col items-center gap-2.5 text-center w-full max-w-md px-2">
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="flex items-center justify-center gap-2 text-[#1C221A] text-xs sm:text-sm font-semibold liquid-glass-pill px-5 py-2.5 rounded-full shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-[#B88728] animate-pulse" />
          <span>جهت گشودن کارت و نواختن موسیقی، روی مهر کلیک فرمایید</span>
        </motion.div>

        {/* Guest Quick Audio Track info */}
        <div className="text-xs font-vazir px-4 py-1.5 rounded-full border liquid-glass-subtle text-[#475243]">
          <span className="opacity-75">موسیقی منتخب: </span>
          <span className="font-bold text-[#946F29]">{wedding.musicTitle}</span>
        </div>
      </div>
    </div>
  );
};

