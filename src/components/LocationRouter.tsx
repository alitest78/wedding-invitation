import React, { useState } from 'react';
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
    <div id="venue-location-section" className="w-full my-8 bg-[#20231F]/60 border border-[#C5A46D]/30 rounded-3xl p-5 sm:p-7 shadow-xl backdrop-blur-md relative overflow-hidden text-[#F5F0E8]">
      {/* Decorative background glow */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#C5A46D]/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5 border-b border-[#C5A46D]/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#20231F] border border-[#C5A46D]/40 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-[#3F473D] rounded-[10px] flex items-center justify-center text-[#C5A46D]">
              <MapPin className="w-5 h-5 animate-bounce" />
            </div>
          </div>
          <div>
            <div className="font-cinzel text-[10px] text-[#C5A46D] tracking-[0.2em] uppercase">
              VENUE &amp; DIRECTIONS
            </div>
            <h3 className="font-amiri text-2xl font-bold text-[#F5F0E8]">
              مکان و مسیریابی تالار
            </h3>
            <p className="text-xs text-[#E0D8CA]/80 font-vazir">
              راهنمای دسترسی و مسیریابی آسان به محل برگزاری جشن
            </p>
          </div>
        </div>

        <button
          id="share-venue-btn"
          onClick={onOpenShareModal}
          className="flex items-center gap-1.5 bg-[#20231F] hover:bg-[#707563] text-[#F5F0E8] border border-[#C5A46D]/40 px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
          title="اشتراک‌گذاری لوکیشن"
        >
          <Share2 className="w-3.5 h-3.5 text-[#C5A46D]" />
          <span className="hidden sm:inline">اشتراک لوکیشن</span>
        </button>
      </div>

      {/* Venue Name & Address details */}
      {(hasHallName || hasAddress) && (
        <div className="bg-[#20231F]/80 border border-[#C5A46D]/20 rounded-2xl p-4 sm:p-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              {hasHallName && (
                <div className="text-lg font-bold text-[#F5F0E8] font-amiri mb-1">
                  {wedding.hallName}
                </div>
              )}
              {hasAddress && (
                <div className="text-[#E0D8CA] text-xs sm:text-sm leading-relaxed flex items-start gap-1.5 font-vazir">
                  <MapPin className="w-4 h-4 text-[#C5A46D] flex-shrink-0 mt-0.5" />
                  <span>{wedding.hallAddress}</span>
                </div>
              )}
            </div>

            <button
              id="copy-address-btn"
              onClick={handleCopyAddress}
              className="self-start sm:self-center flex items-center gap-1.5 bg-[#20231F] hover:bg-[#707563] text-[#F5F0E8] border border-[#C5A46D]/40 px-3.5 py-2 rounded-xl text-xs transition-all flex-shrink-0 active:scale-95 cursor-pointer shadow"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-medium font-vazir">آدرس کپی شد!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#C5A46D]" />
                  <span className="font-vazir">کپی آدرس و لوکیشن</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Interactive Map Embed / Visualizer (Only if coordinates exist) */}
      {hasCoordinates && (
        <div className="relative rounded-2xl overflow-hidden border-2 border-[#C5A46D]/40 mb-6 bg-white aspect-[16/9] sm:aspect-[21/9] shadow-lg">
          <iframe
            title="نقشه تالار"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${wedding.hallLng - 0.012}%2C${wedding.hallLat - 0.008}%2C${wedding.hallLng + 0.012}%2C${wedding.hallLat + 0.008}&layer=mapnik&marker=${wedding.hallLat}%2C${wedding.hallLng}`}
            className="w-full h-full border-0"
            loading="lazy"
          ></iframe>

          <div className="absolute top-2.5 right-2.5 bg-[#20231F]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#C5A46D]/40 text-xs text-[#F5F0E8] flex items-center gap-1.5 shadow-md">
            <Compass className="w-3.5 h-3.5 text-[#C5A46D]" />
            <span className="font-vazir text-[11px]">موقعیت روی نقشه</span>
          </div>

          <a
            href={navLinks.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2.5 left-2.5 bg-[#20231F]/90 hover:bg-[#3F473D] backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#C5A46D]/40 text-xs text-[#F5F0E8] flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#C5A46D]" />
            <span className="font-vazir text-[11px]">مشاهده تمام‌صفحه در نقشه</span>
          </a>
        </div>
      )}

      {/* Routing Apps Grid (نشان، بلد، گوگل مپس، ویز) */}
      <div className="mb-6">
        <div className="text-xs font-semibold text-[#F5F0E8] mb-3 flex items-center gap-1.5 font-vazir">
          <Navigation className="w-4 h-4 text-[#C5A46D]" />
          <span>انتخاب مسیریاب دلخواه جهت حرکت به سوی تالار:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* نشان (Neshan) */}
          <a
            id="route-neshan-link"
            href={navLinks.neshan}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#20231F] hover:bg-[#707563] text-[#F5F0E8] border border-[#C5A46D]/30 hover:border-[#C5A46D]/60 p-3 rounded-xl text-xs font-medium transition-all shadow-md active:scale-95 group font-vazir"
          >
            <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-[10px]">
              ن
            </div>
            <span>مسیریابی نشان</span>
            <ExternalLink className="w-3 h-3 text-[#C5A46D] opacity-60 group-hover:opacity-100" />
          </a>

          {/* بلد (Balad) */}
          <a
            id="route-balad-link"
            href={navLinks.balad}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#20231F] hover:bg-[#707563] text-[#F5F0E8] border border-[#C5A46D]/30 hover:border-[#C5A46D]/60 p-3 rounded-xl text-xs font-medium transition-all shadow-md active:scale-95 group font-vazir"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px]">
              ب
            </div>
            <span>مسیریابی بلد</span>
            <ExternalLink className="w-3 h-3 text-[#C5A46D] opacity-60 group-hover:opacity-100" />
          </a>

          {/* Google Maps */}
          <a
            id="route-googlemaps-link"
            href={navLinks.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#20231F] hover:bg-[#707563] text-[#F5F0E8] border border-[#C5A46D]/30 hover:border-[#C5A46D]/60 p-3 rounded-xl text-xs font-medium transition-all shadow-md active:scale-95 group font-vazir"
          >
            <MapPin className="w-4 h-4 text-rose-400" />
            <span>گوگل مپس</span>
            <ExternalLink className="w-3 h-3 text-[#C5A46D] opacity-60 group-hover:opacity-100" />
          </a>

          {/* Waze */}
          <a
            id="route-waze-link"
            href={navLinks.waze}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#20231F] hover:bg-[#707563] text-[#F5F0E8] border border-[#C5A46D]/30 hover:border-[#C5A46D]/60 p-3 rounded-xl text-xs font-medium transition-all shadow-md active:scale-95 group font-vazir"
          >
            <Car className="w-4 h-4 text-cyan-400" />
            <span>ویز (Waze)</span>
            <ExternalLink className="w-3 h-3 text-[#C5A46D] opacity-60 group-hover:opacity-100" />
          </a>
        </div>
      </div>

      {/* Quick Social Location Sharing Bar */}
      <div className="pt-4 border-t border-[#C5A46D]/20">
        <div className="text-[11px] text-[#E0D8CA] mb-2.5 font-medium flex items-center justify-between font-vazir">
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
          <a
            id="quick-share-whatsapp"
            href={socialLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#20231F] hover:bg-[#707563] text-emerald-300 border border-[#C5A46D]/30 px-3 py-1.5 rounded-lg text-xs transition-colors font-vazir"
          >
            <span>واتساپ</span>
          </a>

          {/* Telegram */}
          <a
            id="quick-share-telegram"
            href={socialLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#20231F] hover:bg-[#707563] text-sky-300 border border-[#C5A46D]/30 px-3 py-1.5 rounded-lg text-xs transition-colors font-vazir"
          >
            <span>تلگرام</span>
          </a>

          {/* Eitaa */}
          <a
            id="quick-share-eitaa"
            href={socialLinks.eitaa}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#20231F] hover:bg-[#707563] text-[#C5A46D] border border-[#C5A46D]/30 px-3 py-1.5 rounded-lg text-xs transition-colors font-vazir"
          >
            <span>ایتا</span>
          </a>

          {/* Bale */}
          <a
            id="quick-share-bale"
            href={socialLinks.bale}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#20231F] hover:bg-[#707563] text-teal-300 border border-[#C5A46D]/30 px-3 py-1.5 rounded-lg text-xs transition-colors font-vazir"
          >
            <span>بله</span>
          </a>

          {/* SMS */}
          <a
            id="quick-share-sms"
            href={socialLinks.sms}
            className="flex items-center gap-1.5 bg-[#20231F] hover:bg-[#707563] text-purple-300 border border-[#C5A46D]/30 px-3 py-1.5 rounded-lg text-xs transition-colors font-vazir"
          >
            <span>پیامک (SMS)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
