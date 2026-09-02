import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  QrCode, 
  Send, 
  MessageSquare,
  Smartphone,
  ExternalLink,
  MapPin,
  Sparkles
} from 'lucide-react';
import { WeddingDetails } from '../types';
import { getSocialShareLinks, getNavigationLinks, encodeWeddingToURL } from '../utils/cardUtils';

interface ShareModalProps {
  wedding: WeddingDetails;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ wedding, isOpen, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? encodeWeddingToURL(wedding) : '';
  const socialLinks = getSocialShareLinks(wedding, currentUrl);
  const navLinks = getNavigationLinks(wedding.hallLat, wedding.hallLng, wedding.hallName);

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(currentUrl)}&color=217-119-6&bgcolor=18-15-24`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyInvitationText = () => {
    navigator.clipboard.writeText(socialLinks.rawText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `دعوت‌نامه عروسی ${wedding.brideName} و ${wedding.groomName}`,
          text: `دعوت‌نامه جشن عروسی ${wedding.brideName} و ${wedding.groomName} در ${wedding.hallName}`,
          url: currentUrl,
        });
      } catch (err) {
        console.log('Share dismissed', err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#181525] border border-amber-500/30 rounded-3xl p-5 sm:p-7 text-amber-100 shadow-2xl overflow-y-auto max-h-[90vh]"
        id="share-modal-container"
      >
        {/* Close Button */}
        <button
          id="close-share-modal-btn"
          onClick={onClose}
          className="absolute top-5 left-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-stone-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="font-cinzel text-[10px] text-amber-400/80 tracking-[0.25em] uppercase mb-1">
            SHARE INVITATION
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400 mb-3 shadow-inner">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="font-amiri text-2xl sm:text-3xl font-bold gold-text-gradient">
            اشتراک‌گذاری کارت دعوت و مکان تالار
          </h3>
          <p className="text-xs text-stone-300/80 mt-1 font-vazir">
            ارسال آسان دعوت‌نامه برای مهمانان و بستگان در پیام‌رسان‌ها
          </p>
        </div>

        {/* Smart Mobile Share Button (if supported) */}
        <button
          id="native-device-share-btn"
          onClick={handleNativeShare}
          className="w-full mb-4 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-300 text-stone-950 font-bold p-3.5 rounded-2xl text-sm transition-all shadow-lg active:scale-98 cursor-pointer"
        >
          <Smartphone className="w-5 h-5 text-stone-950" />
          <span>اشتراک‌گذاری هوشمند در گوشی (Web Share)</span>
        </button>

        {/* Link Copy Box */}
        <div className="bg-[#120f1e] border border-amber-500/20 rounded-2xl p-3 mb-5">
          <label className="text-[11px] text-amber-300/90 font-medium mb-1.5 block">
            لینک اختصاصی کارت دعوت شما:
          </label>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={currentUrl}
              className="w-full bg-black/40 border border-stone-700/50 rounded-xl px-3 py-2 text-xs text-stone-300 font-mono text-left focus:outline-none select-all"
            />
            <button
              id="copy-card-url-btn"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3 py-2 rounded-xl text-xs flex-shrink-0 transition-colors cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">کپی شد</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>کپی لینک</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social Platforms Direct Grid */}
        <div className="mb-6">
          <span className="text-xs font-semibold text-stone-300 block mb-3">
            ارسال مستقیم به پیام‌رسان‌ها:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {/* WhatsApp */}
            <a
              id="modal-share-whatsapp"
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#143321] hover:bg-[#1a442c] text-emerald-200 border border-emerald-500/30 p-2.5 rounded-xl text-xs transition-all shadow-sm"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center font-bold text-[10px]">
                W
              </div>
              <span className="font-medium">واتساپ (WhatsApp)</span>
            </a>

            {/* Telegram */}
            <a
              id="modal-share-telegram"
              href={socialLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#162e40] hover:bg-[#1f4058] text-sky-200 border border-sky-500/30 p-2.5 rounded-xl text-xs transition-all shadow-sm"
            >
              <Send className="w-4 h-4 text-sky-400" />
              <span className="font-medium">تلگرام (Telegram)</span>
            </a>

            {/* Eitaa */}
            <a
              id="modal-share-eitaa"
              href={socialLinks.eitaa}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#362414] hover:bg-[#4d331d] text-amber-200 border border-amber-500/30 p-2.5 rounded-xl text-xs transition-all shadow-sm"
            >
              <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-[10px]">
                ای
              </div>
              <span className="font-medium">پیام‌رسان ایتا</span>
            </a>

            {/* Bale */}
            <a
              id="modal-share-bale"
              href={socialLinks.bale}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#122e2e] hover:bg-[#1c4545] text-teal-200 border border-teal-500/30 p-2.5 rounded-xl text-xs transition-all shadow-sm"
            >
              <div className="w-5 h-5 rounded-full bg-teal-400 text-stone-950 flex items-center justify-center font-bold text-[10px]">
                ب
              </div>
              <span className="font-medium">پیام‌رسان بله</span>
            </a>

            {/* SMS */}
            <a
              id="modal-share-sms"
              href={socialLinks.sms}
              className="flex items-center gap-2 bg-[#2a1d3d] hover:bg-[#3b2956] text-purple-200 border border-purple-500/30 p-2.5 rounded-xl text-xs transition-all shadow-sm"
            >
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span className="font-medium">پیامک (SMS)</span>
            </a>

            {/* QR Code Toggle */}
            <button
              id="modal-share-qr-btn"
              onClick={() => setShowQR(!showQR)}
              className={`flex items-center gap-2 border p-2.5 rounded-xl text-xs transition-all shadow-sm cursor-pointer ${
                showQR
                  ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold'
                  : 'bg-stone-800/80 hover:bg-stone-700/80 text-amber-300 border-amber-500/30 font-medium'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>{showQR ? 'بستن بارکد' : 'بارکد QR کارت'}</span>
            </button>
          </div>
        </div>

        {/* QR Code Display section */}
        {showQR && (
          <div className="my-4 p-4 bg-[#120f1e] border border-amber-500/30 rounded-2xl text-center animate-in zoom-in-95 duration-200">
            <div className="text-xs text-amber-300 font-medium mb-3">
              بارکد اختصاصی کارت دعوت (اسکن با دوربین گوشی):
            </div>
            <div className="inline-block p-3 bg-white rounded-2xl shadow-xl">
              <img
                src={qrImageUrl}
                alt="QR Code کارت دعوت"
                className="w-44 h-44 rounded-lg object-contain mx-auto"
              />
            </div>
            <p className="text-[10px] text-stone-400 mt-2">
              می‌توانید این بارکد را ذخیره کرده و روی کارت چاپی یا استوری اینستاگرام قرار دهید.
            </p>
          </div>
        )}

        {/* Full Text Copy Button */}
        <div className="pt-3 border-t border-amber-500/20 flex items-center justify-between">
          <span className="text-[11px] text-stone-400">
            شامل تاریخ، ساعت، نام و لوکیشن تالار
          </span>

          <button
            id="copy-full-text-btn"
            onClick={handleCopyInvitationText}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-stone-200 border border-stone-600/40 px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
          >
            {copiedText ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">متن کپی شد</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-400" />
                <span>کپی کل متن دعوت</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
