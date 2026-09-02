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
    <div id="venue-location-section" className="w-full my-8 apple-glass-subtle rounded-[28px] p-5 sm:p-7 shadow-2xl relative overflow-hidden text-[#F5F0E8] font-vazir">
      {/* Decorative background glow */}
      <div className="absolute -top-10 -left-10 w-44 h-44 bg-[#C5A46D]/12 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5 border-b border-[#C5A46D]/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl apple-glass p-0.5 shadow-lg flex items-center justify-center border border-[#C5A46D]/40">
            <div className="w-full h-full bg-[#2A3127] rounded-[14px] flex items-center justify-center text-[#F5C042]">
              <MapPin className="w-5 h-5 animate-bounce" />
            </div>
          </div>
          <div>
            <div className="font-cinzel text-[10px] text-[#C5A46D] tracking-[0.25em] uppercase font-bold">
              VENUE &amp; DIRECTIONS
            </div>
            <h3 className="font-amiri text-2xl sm:text-3xl font-bold text-[#F5F0E8] leading-tight">
              مکان و مسیریابی تالار
            </h3>
            <p className="text-xs text-[#E0D8CA]/80">
              راهنمای دسترسی و مسیریابی آسان به محل برگزاری جشن
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          id="share-venue-btn"
          onClick={onOpenShareModal}
          className="flex items-center gap-1.5 apple-glass-pill px-3.5 py-1.5 rounded-full text-xs text-[#F5F0E8] transition-all cursor-pointer shadow"
          title="اشتراک‌گذاری لوکیشن"
        >
          <Share2 className="w-3.5 h-3.5 text-[#C5A46D]" />
          <span className="hidden sm:inline">اشتراک لوکیشن</span>
        </motion.button>
      </div>

      {/* Venue Name & Address details */}
      {(hasHallName || hasAddress) && (
        <div className="apple-glass rounded-2xl p-4 sm:p-5 mb-6 border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              {hasHallName && (
                <div className="text-xl font-bold text-[#F5F0E8] font-amiri mb-1">
                  {wedding.hallName}
                </div>
              )}
              {hasAddress && (
                <div className="text-[#E0D8CA] text-xs sm:text-sm leading-relaxed flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#C5A46D] flex-shrink-0 mt-0.5" />
                  <span>{wedding.hallAddress}</span>
                </div>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.94 }}
              id="copy-address-btn"
              onClick={handleCopyAddress}
              className="self-start sm:self-center flex items-center gap-1.5 apple-glass-pill px-4 py-2 rounded-xl text-xs text-[#F5F0E8] transition-all flex-shrink-0 cursor-pointer shadow"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-medium">آدرس کپی شد!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#C5A46D]" />
                  <span>کپی آدرس و لوکیشن</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      )}

      {/* Interactive Map Embed / Visualizer */}
      {hasCoordinates && (
        <div className="relative rounded-2xl overflow-hidden border border-[#C5A46D]/40 mb-6 bg-white aspect-[16/9] sm:aspect-[21/9] shadow-xl">
          <iframe
            title="نقشه تالار"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${wedding.hallLng - 0.012}%2C${wedding.hallLat - 0.008}%2C${wedding.hallLng + 0.012}%2C${wedding.hallLat + 0.008}&layer=mapnik&marker=${wedding.hallLat}%2C${wedding.hallLng}`}
            className="w-full h-full border-0"
            loading="lazy"
          ></iframe>

          <div className="absolute top-3 right-3 apple-glass-pill px-3 py-1.5 rounded-full text-xs text-[#F5F0E8] flex items-center gap-1.5 shadow-md">
            <Compass className="w-3.5 h-3.5 text-[#C5A46D]" />
            <span className="text-[11px] font-medium">موقعیت روی نقشه</span>
          </div>

          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            href={navLinks.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 left-3 apple-glass-pill px-3.5 py-1.5 rounded-full text-xs text-[#F5F0E8] flex items-center gap-1.5 shadow-md"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#C5A46D]" />
            <span className="text-[11px]">مشاهده تمام‌صفحه در نقشه</span>
          </motion.a>
        </div>
      )}

      {/* Routing Apps Grid (نشان، بلد، گوگل مپس، ویز) */}
      <div className="mb-6">
        <div className="text-xs font-semibold text-[#F5F0E8] mb-3 flex items-center gap-2">
          <Navigation className="w-4 h-4 text-[#C5A46D]" />
          <span>انتخاب مسیریاب دلخواه جهت حرکت به سوی تالار:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* نشان (Neshan) */}
          <motion.a
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            id="route-neshan-link"
            href={navLinks.neshan}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 apple-glass text-[#F5F0E8] hover:border-[#C5A46D]/70 p-3 rounded-2xl text-xs font-medium transition-all shadow-md group"
          >
            <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
              ن
            </div>
            <span>مسیریابی نشان</span>
            <ExternalLink className="w-3 h-3 text-[#C5A46D] opacity-60 group-hover:opacity-100" />
          </motion.a>

          {/* بلد (Balad) */}
          <motion.a
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            id="route-balad-link"
            href={navLinks.balad}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 apple-glass text-[#F5F0E8] hover:border-[#C5A46D]/70 p-3 rounded-2xl text-xs font-medium transition-all shadow-md group"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
              ب
            </div>
            <span>مسیریابی بلد</span>
            <ExternalLink className="w-3 h-3 text-[#C5A46D] opacity-60 group-hover:opacity-100" />
          </motion.a>

          {/* Google Maps */}
          <motion.a
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            id="route-googlemaps-link"
            href={navLinks.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 apple-glass text-[#F5F0E8] hover:border-[#C5A46D]/70 p-3 rounded-2xl text-xs font-medium transition-all shadow-md group"
          >
            <MapPin className="w-4 h-4 text-rose-400" />
            <span>گوگل مپس</span>
            <ExternalLink className="w-3 h-3 text-[#C5A46D] opacity-60 group-hover:opacity-100" />
          </motion.a>

          {/* Waze */}
          <motion.a
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            id="route-waze-link"
            href={navLinks.waze}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 apple-glass text-[#F5F0E8] hover:border-[#C5A46D]/70 p-3 rounded-2xl text-xs font-medium transition-all shadow-md group"
          >
            <Car className="w-4 h-4 text-cyan-400" />
            <span>ویز (Waze)</span>
            <ExternalLink className="w-3 h-3 text-[#C5A46D] opacity-60 group-hover:opacity-100" />
          </motion.a>
        </div>
      </div>

      {/* Quick Social Location Sharing Bar */}
      <div className="pt-4 border-t border-[#C5A46D]/20">
        <div className="text-[11px] text-[#E0D8CA] mb-2.5 font-medium flex items-center justify-between">
          <span>اشتراک مستقیم لوکیشن در پیام‌رسان‌ها:</span>
          <button 
            onClick={onOpenShareModal}
            className="text-[#C5A46D] hover:underline text-[11px] cursor-pointer"
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
            className="flex items-center gap-1.5 apple-glass-pill text-emerald-300 px-3.5 py-1.5 rounded-full text-xs transition-colors"
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
            className="flex items-center gap-1.5 apple-glass-pill text-sky-300 px-3.5 py-1.5 rounded-full text-xs transition-colors"
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
            className="flex items-center gap-1.5 apple-glass-pill text-[#F5C042] px-3.5 py-1.5 rounded-full text-xs transition-colors"
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
            className="flex items-center gap-1.5 apple-glass-pill text-teal-300 px-3.5 py-1.5 rounded-full text-xs transition-colors"
          >
            <span>بله</span>
          </motion.a>

          {/* SMS */}
          <motion.a
            whileTap={{ scale: 0.94 }}
            id="quick-share-sms"
            href={socialLinks.sms}
            className="flex items-center gap-1.5 apple-glass-pill text-purple-300 px-3.5 py-1.5 rounded-full text-xs transition-colors"
          >
            <span>پیامک (SMS)</span>
          </motion.a>
        </div>
      </div>
    </div>
  );
};
