import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Navigation, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Compass, 
  Car 
} from 'lucide-react';
import { getNavigationLinks, getSocialShareLinks } from '../utils/cardUtils';
import { WeddingDetails } from '../types';

interface LocationRouterProps {
  wedding: WeddingDetails;
  onOpenShareModal: () => void;
}

export const LocationRouter: React.FC<LocationRouterProps> = ({ wedding, onOpenShareModal }) => {
  const [copied, setCopied] = useState(false);
  const navLinks = getNavigationLinks(wedding.hallLat, wedding.hallLng, wedding.hallName);
  const socialLinks = getSocialShareLinks(wedding);

  const hasAddress = Boolean(wedding.hallAddress?.trim());
  const hasHallName = Boolean(wedding.hallName?.trim());
  const hasCoordinates = Boolean(wedding.hallLat && wedding.hallLng);

  const handleCopyAddress = () => {
    const textToCopy = `📍 ${wedding.hallName || 'محل مراسم'}\n${hasAddress ? `آدرس: ${wedding.hallAddress}\n` : ''}مسیریابی گوگل مپس: ${navLinks.googleMaps}\nمسیریابی نشان: ${navLinks.neshan}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div id="venue-location-section" className="w-full my-8 liquid-glass-subtle rounded-[28px] p-5 sm:p-7 shadow-lg relative overflow-hidden text-[#1C221A] font-vazir border border-[#B89355]/25">
      {/* Decorative background glow */}
      <div className="absolute -top-10 -left-10 w-44 h-44 bg-[#B88728]/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5 border-b border-[#B89355]/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl liquid-glass p-0.5 shadow-md flex items-center justify-center border border-[#B88728]/50">
            <div className="w-full h-full bg-[#FAF6EE] rounded-[14px] flex items-center justify-center text-[#B88728]">
              <MapPin className="w-5 h-5 animate-bounce" />
            </div>
          </div>
          <div>
            <div className="font-cinzel text-[10px] text-[#946F29] tracking-[0.25em] uppercase font-bold">
              VENUE &amp; DIRECTIONS
            </div>
            <h3 className="font-amiri text-2xl sm:text-3xl font-bold text-[#1C221A] leading-tight">
              مکان و مسیریابی تالار
            </h3>
            <p className="text-xs text-[#556251]">
              راهنمای دسترسی و مسیریابی آسان به محل برگزاری جشن
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          id="share-venue-btn"
          onClick={onOpenShareModal}
          className="flex items-center gap-1.5 liquid-glass-pill px-3.5 py-1.5 rounded-full text-xs text-[#1C221A] font-medium transition-all cursor-pointer shadow-sm border border-[#B89355]/25"
          title="اشتراک‌گذاری لوکیشن"
        >
          <Share2 className="w-3.5 h-3.5 text-[#B88728]" />
          <span className="hidden sm:inline">اشتراک لوکیشن</span>
        </motion.button>
      </div>

      {/* Venue Name & Address details */}
      {(hasHallName || hasAddress) && (
        <div className="liquid-glass rounded-2xl p-4 sm:p-5 mb-6 border border-[#B89355]/25 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              {hasHallName && (
                <div className="text-xl font-bold text-[#1C221A] font-amiri mb-1">
                  {wedding.hallName}
                </div>
              )}
              {hasAddress && (
                <div className="text-[#3F4B3C] text-xs sm:text-sm leading-relaxed flex items-start gap-2 font-normal">
                  <MapPin className="w-4 h-4 text-[#B88728] flex-shrink-0 mt-0.5" />
                  <span>{wedding.hallAddress}</span>
                </div>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.94 }}
              id="copy-address-btn"
              onClick={handleCopyAddress}
              className="self-start sm:self-center flex items-center gap-1.5 liquid-glass-pill px-4 py-2 rounded-xl text-xs text-[#1C221A] font-medium transition-all flex-shrink-0 cursor-pointer shadow-sm border border-[#B89355]/30"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">آدرس کپی شد!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#B88728]" />
                  <span>کپی آدرس و لوکیشن</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      )}

      {/* Interactive Map Embed / Visualizer */}
      {hasCoordinates && (
        <div className="relative rounded-2xl overflow-hidden border-2 border-[#B88728]/40 mb-6 bg-white aspect-[16/9] sm:aspect-[21/9] shadow-lg">
          <iframe
            title="نقشه تالار"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${wedding.hallLng - 0.012}%2C${wedding.hallLat - 0.008}%2C${wedding.hallLng + 0.012}%2C${wedding.hallLat + 0.008}&layer=mapnik&marker=${wedding.hallLat}%2C${wedding.hallLng}`}
            className="w-full h-full border-0"
            loading="lazy"
          ></iframe>

          <div className="absolute top-3 right-3 liquid-glass-pill px-3 py-1.5 rounded-full text-xs text-[#1C221A] flex items-center gap-1.5 shadow-md border border-[#B89355]/30">
            <Compass className="w-3.5 h-3.5 text-[#B88728]" />
            <span className="text-[11px] font-medium">موقعیت روی نقشه</span>
          </div>

          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            href={navLinks.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 left-3 liquid-glass-pill px-3.5 py-1.5 rounded-full text-xs text-[#1C221A] font-medium flex items-center gap-1.5 shadow-md border border-[#B89355]/30"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#B88728]" />
            <span className="text-[11px]">مشاهده تمام‌صفحه در نقشه</span>
          </motion.a>
        </div>
      )}

      {/* Routing Apps Grid (نشان، بلد، گوگل مپس، ویز) */}
      <div className="mb-6">
        <div className="text-xs font-bold text-[#1C221A] mb-3 flex items-center gap-2">
          <Navigation className="w-4 h-4 text-[#B88728]" />
          <span>انتخاب مسیریاب دلخواه جهت حرکت به سوی تالار:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* نشان (Neshan) */}
          <motion.a
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            id="route-neshan-link"
            href={navLinks.neshan}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 liquid-glass text-[#1C221A] hover:border-[#B88728]/70 p-3 rounded-2xl text-xs font-semibold transition-all shadow-sm group cursor-pointer border border-[#B89355]/25"
          >
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
              ن
            </div>
            <span>مسیریابی نشان</span>
            <ExternalLink className="w-3 h-3 text-[#B88728] opacity-60 group-hover:opacity-100" />
          </motion.a>

          {/* بلد (Balad) */}
          <motion.a
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            id="route-balad-link"
            href={navLinks.balad}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 liquid-glass text-[#1C221A] hover:border-[#B88728]/70 p-3 rounded-2xl text-xs font-semibold transition-all shadow-sm group cursor-pointer border border-[#B89355]/25"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
              ب
            </div>
            <span>مسیریابی بلد</span>
            <ExternalLink className="w-3 h-3 text-[#B88728] opacity-60 group-hover:opacity-100" />
          </motion.a>

          {/* Google Maps */}
          <motion.a
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            id="route-googlemaps-link"
            href={navLinks.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 liquid-glass text-[#1C221A] hover:border-[#B88728]/70 p-3 rounded-2xl text-xs font-semibold transition-all shadow-sm group cursor-pointer border border-[#B89355]/25"
          >
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>گوگل مپس</span>
            <ExternalLink className="w-3 h-3 text-[#B88728] opacity-60 group-hover:opacity-100" />
          </motion.a>

          {/* Waze */}
          <motion.a
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            id="route-waze-link"
            href={navLinks.waze}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 liquid-glass text-[#1C221A] hover:border-[#B88728]/70 p-3 rounded-2xl text-xs font-semibold transition-all shadow-sm group cursor-pointer border border-[#B89355]/25"
          >
            <Car className="w-4 h-4 text-sky-500" />
            <span>ویز (Waze)</span>
            <ExternalLink className="w-3 h-3 text-[#B88728] opacity-60 group-hover:opacity-100" />
          </motion.a>
        </div>
      </div>

      {/* Quick Social Location Sharing Bar */}
      <div className="pt-4 border-t border-[#B89355]/20">
        <div className="text-[11px] text-[#556251] mb-2.5 font-medium flex items-center justify-between">
          <span>اشتراک مستقیم لوکیشن در پیام‌رسان‌ها:</span>
          <button 
            onClick={onOpenShareModal}
            className="text-[#946F29] font-bold hover:underline text-[11px] cursor-pointer"
          >
            مشاهده همه راه‌های اشتراک
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* WhatsApp */}
          <motion.a
            whileTap={{ scale: 0.94 }}
            id="quick-share-whatsapp"
            href={socialLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 liquid-glass-pill text-emerald-700 font-medium px-3.5 py-1.5 rounded-full text-xs transition-colors border border-emerald-500/20"
          >
            <span>واتساپ</span>
          </motion.a>

          {/* Telegram */}
          <motion.a
            whileTap={{ scale: 0.94 }}
            id="quick-share-telegram"
            href={socialLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 liquid-glass-pill text-sky-700 font-medium px-3.5 py-1.5 rounded-full text-xs transition-colors border border-sky-500/20"
          >
            <span>تلگرام</span>
          </motion.a>

          {/* Eitaa */}
          <motion.a
            whileTap={{ scale: 0.94 }}
            id="quick-share-eitaa"
            href={socialLinks.eitaa}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 liquid-glass-pill text-[#946F29] font-medium px-3.5 py-1.5 rounded-full text-xs transition-colors border border-[#B89355]/30"
          >
            <span>ایتا</span>
          </motion.a>

          {/* Bale */}
          <motion.a
            whileTap={{ scale: 0.94 }}
            id="quick-share-bale"
            href={socialLinks.bale}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 liquid-glass-pill text-teal-700 font-medium px-3.5 py-1.5 rounded-full text-xs transition-colors border border-teal-500/20"
          >
            <span>بله</span>
          </motion.a>

          {/* SMS */}
          <motion.a
            whileTap={{ scale: 0.94 }}
            id="quick-share-sms"
            href={socialLinks.sms}
            className="flex items-center gap-1.5 liquid-glass-pill text-purple-700 font-medium px-3.5 py-1.5 rounded-full text-xs transition-colors border border-purple-500/20"
          >
            <span>پیامک (SMS)</span>
          </motion.a>
        </div>
      </div>
    </div>
  );
};
