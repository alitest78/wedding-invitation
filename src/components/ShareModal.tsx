import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  QrCode, 
  Send, 
  MessageSquare,
  Smartphone
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

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(currentUrl)}&color=245-192-66&bgcolor=24-27-22`;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl animate-in fade-in duration-200">
      <motion.div 
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
        className="relative w-full max-w-lg apple-glass rounded-[32px] p-6 sm:p-8 text-[#F5F0E8] shadow-2xl overflow-y-auto max-h-[90vh] font-vazir"
        id="share-modal-container"
      >
        {/* Apple Close Button */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          id="close-share-modal-btn"
          onClick={onClose}
          className="absolute top-5 left-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#E0D8CA] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </motion.button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="font-cinzel text-[10px] text-[#C5A46D] tracking-[0.28em] uppercase mb-1 font-bold">
            SHARE INVITATION
          </div>
          <div className="w-12 h-12 rounded-2xl apple-glass-pill mx-auto flex items-center justify-center text-[#F5C042] mb-3 shadow-inner">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="font-amiri text-2xl sm:text-3xl font-bold text-[#F5F0E8]">
            اشتراک‌گذاری کارت دعوت و مکان تالار
          </h3>
          <p className="text-xs text-[#E0D8CA]/80 mt-1">
            ارسال آسان دعوت‌نامه برای مهمانان و بستگان در پیام‌رسان‌ها
          </p>
        </div>

        {/* Smart Mobile Share Button (Apple HIG Primary Action Button) */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          id="native-device-share-btn"
          onClick={handleNativeShare}
          className="w-full mb-4 flex items-center justify-center gap-2 bg-gradient-to-r from-[#F5C042] to-[#C5A46D] text-[#181B16] font-bold p-3.5 rounded-2xl text-sm transition-all shadow-lg cursor-pointer"
        >
          <Smartphone className="w-5 h-5 text-[#181B16]" />
          <span>اشتراک‌گذاری هوشمند در گوشی (Web Share)</span>
        </motion.button>

        {/* Link Copy Box */}
        <div className="bg-black/35 border border-white/10 rounded-2xl p-3.5 mb-5">
          <label className="text-[11px] text-[#C5A46D] font-medium mb-1.5 block">
            لینک اختصاصی کارت دعوت شما:
          </label>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={currentUrl}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-[#E0D8CA] font-mono text-left focus:outline-none select-all"
            />
            <motion.button
              whileTap={{ scale: 0.92 }}
              id="copy-card-url-btn"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 bg-[#C5A46D]/20 hover:bg-[#C5A46D]/30 text-[#F5C042] border border-[#C5A46D]/40 px-3 py-2 rounded-xl text-xs flex-shrink-0 transition-colors cursor-pointer"
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
            </motion.button>
          </div>
        </div>

        {/* Social Platforms Direct Grid */}
        <div className="mb-6">
          <span className="text-xs font-semibold text-[#F5F0E8] block mb-3">
            ارسال مستقیم به پیام‌رسان‌ها:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {/* WhatsApp */}
            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              id="modal-share-whatsapp"
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#143321]/80 hover:bg-[#1a442c] text-emerald-200 border border-emerald-500/30 p-2.5 rounded-2xl text-xs transition-all shadow-sm"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center font-bold text-[10px]">
                W
              </div>
              <span className="font-medium">واتساپ (WhatsApp)</span>
            </motion.a>

            {/* Telegram */}
            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              id="modal-share-telegram"
              href={socialLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#162e40]/80 hover:bg-[#1f4058] text-sky-200 border border-sky-500/30 p-2.5 rounded-2xl text-xs transition-all shadow-sm"
            >
              <Send className="w-4 h-4 text-sky-400" />
              <span className="font-medium">تلگرام (Telegram)</span>
            </motion.a>

            {/* Eitaa */}
            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              id="modal-share-eitaa"
              href={socialLinks.eitaa}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#362414]/80 hover:bg-[#4d331d] text-[#F5C042] border border-[#C5A46D]/30 p-2.5 rounded-2xl text-xs transition-all shadow-sm"
            >
              <div className="w-5 h-5 rounded-full bg-[#F5C042] text-stone-950 flex items-center justify-center font-bold text-[10px]">
                ای
              </div>
              <span className="font-medium">پیام‌رسان ایتا</span>
            </motion.a>

            {/* Bale */}
            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              id="modal-share-bale"
              href={socialLinks.bale}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#122e2e]/80 hover:bg-[#1c4545] text-teal-200 border border-teal-500/30 p-2.5 rounded-2xl text-xs transition-all shadow-sm"
            >
              <div className="w-5 h-5 rounded-full bg-teal-400 text-stone-950 flex items-center justify-center font-bold text-[10px]">
                ب
              </div>
              <span className="font-medium">پیام‌رسان بله</span>
            </motion.a>

            {/* SMS */}
            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              id="modal-share-sms"
              href={socialLinks.sms}
              className="flex items-center gap-2 bg-[#2a1d3d]/80 hover:bg-[#3b2956] text-purple-200 border border-purple-500/30 p-2.5 rounded-2xl text-xs transition-all shadow-sm"
            >
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span className="font-medium">پیامک (SMS)</span>
            </motion.a>

            {/* QR Code Toggle */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              id="modal-share-qr-btn"
              onClick={() => setShowQR(!showQR)}
              className={`flex items-center gap-2 border p-2.5 rounded-2xl text-xs transition-all shadow-sm cursor-pointer ${
                showQR
                  ? 'bg-[#F5C042] text-[#181B16] border-[#C5A46D] font-bold'
                  : 'apple-glass text-[#F5C042] border-white/10 font-medium'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>{showQR ? 'بستن بارکد' : 'بارکد QR کارت'}</span>
            </motion.button>
          </div>
        </div>

        {/* QR Code Display section */}
        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="my-4 p-4 bg-black/40 border border-[#C5A46D]/30 rounded-2xl text-center"
            >
              <div className="text-xs text-[#C5A46D] font-medium mb-3">
                بارکد اختصاصی کارت دعوت (اسکن با دوربین گوشی):
              </div>
              <div className="inline-block p-3 bg-[#181B16] rounded-2xl shadow-xl border border-[#C5A46D]/30">
                <img
                  src={qrImageUrl}
                  alt="QR Code کارت دعوت"
                  className="w-44 h-44 rounded-xl object-contain mx-auto"
                />
              </div>
              <p className="text-[10px] text-[#E0D8CA]/80 mt-2">
                می‌توانید این بارکد را ذخیره کرده و روی کارت چاپی یا استوری اینستاگرام قرار دهید.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Full Text Copy Button */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] text-[#E0D8CA]/70">
            شامل تاریخ، ساعت، نام و لوکیشن تالار
          </span>

          <motion.button
            whileTap={{ scale: 0.92 }}
            id="copy-full-text-btn"
            onClick={handleCopyInvitationText}
            className="flex items-center gap-1.5 apple-glass text-[#F5F0E8] border border-white/10 px-3.5 py-1.5 rounded-full text-xs transition-colors cursor-pointer"
          >
            {copiedText ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">متن کپی شد</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#C5A46D]" />
                <span>کپی کل متن دعوت</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
