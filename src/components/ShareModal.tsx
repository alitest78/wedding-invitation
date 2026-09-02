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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
      <motion.div 
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
        className="relative w-full max-w-lg bg-[#FAF6EE] rounded-[32px] p-6 sm:p-8 text-[#1C221A] shadow-2xl overflow-y-auto max-h-[90vh] font-vazir border border-[#B89355]/30"
        id="share-modal-container"
      >
        {/* Apple Close Button */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          id="close-share-modal-btn"
          onClick={onClose}
          className="absolute top-5 left-5 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#556251] hover:text-[#1C221A] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </motion.button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="font-cinzel text-[10px] text-[#946F29] tracking-[0.28em] uppercase mb-1 font-bold">
            SHARE INVITATION
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#F0E6D2] mx-auto flex items-center justify-center text-[#B88728] mb-3 shadow-inner border border-[#B89355]/30">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="font-amiri text-2xl sm:text-3xl font-bold text-[#1C221A]">
            اشتراک‌گذاری کارت دعوت و مکان تالار
          </h3>
          <p className="text-xs text-[#556251] mt-1">
            ارسال آسان دعوت‌نامه برای مهمانان و بستگان در پیام‌رسان‌ها
          </p>
        </div>

        {/* Smart Mobile Share Button (Apple HIG Primary Action Button) */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          id="native-device-share-btn"
          onClick={handleNativeShare}
          className="w-full mb-4 flex items-center justify-center gap-2 bg-gradient-to-r from-[#B88728] to-[#946F29] text-white font-bold p-3.5 rounded-2xl text-sm transition-all shadow-md cursor-pointer"
        >
          <Smartphone className="w-5 h-5 text-white" />
          <span>اشتراک‌گذاری هوشمند در گوشی (Web Share)</span>
        </motion.button>

        {/* Link Copy Box */}
        <div className="bg-white/70 border border-[#B89355]/25 rounded-2xl p-3.5 mb-5 shadow-sm">
          <label className="text-[11px] text-[#946F29] font-bold mb-1.5 block">
            لینک اختصاصی کارت دعوت شما:
          </label>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={currentUrl}
              className="w-full bg-white border border-[#B89355]/30 rounded-xl px-3 py-2 text-xs text-[#1C221A] font-mono text-left focus:outline-none select-all shadow-inner"
            />
            <motion.button
              whileTap={{ scale: 0.92 }}
              id="copy-card-url-btn"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 bg-[#B88728]/15 hover:bg-[#B88728]/25 text-[#855E1C] font-semibold border border-[#B88728]/40 px-3 py-2 rounded-xl text-xs flex-shrink-0 transition-colors cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">کپی شد</span>
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
          <span className="text-xs font-bold text-[#1C221A] block mb-3">
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
              className="flex items-center gap-2 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-500/30 p-2.5 rounded-2xl text-xs transition-all shadow-sm"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                W
              </div>
              <span className="font-semibold">واتساپ (WhatsApp)</span>
            </motion.a>

            {/* Telegram */}
            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              id="modal-share-telegram"
              href={socialLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white hover:bg-sky-50 text-sky-800 border border-sky-500/30 p-2.5 rounded-2xl text-xs transition-all shadow-sm"
            >
              <Send className="w-4 h-4 text-sky-600" />
              <span className="font-semibold">تلگرام (Telegram)</span>
            </motion.a>

            {/* Eitaa */}
            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              id="modal-share-eitaa"
              href={socialLinks.eitaa}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white hover:bg-amber-50 text-[#855E1C] border border-[#B89355]/35 p-2.5 rounded-2xl text-xs transition-all shadow-sm"
            >
              <div className="w-5 h-5 rounded-full bg-[#B88728] text-white flex items-center justify-center font-bold text-[10px]">
                ای
              </div>
              <span className="font-semibold">پیام‌رسان ایتا</span>
            </motion.a>

            {/* Bale */}
            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              id="modal-share-bale"
              href={socialLinks.bale}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white hover:bg-teal-50 text-teal-800 border border-teal-500/30 p-2.5 rounded-2xl text-xs transition-all shadow-sm"
            >
              <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px]">
                ب
              </div>
              <span className="font-semibold">پیام‌رسان بله</span>
            </motion.a>

            {/* SMS */}
            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              id="modal-share-sms"
              href={socialLinks.sms}
              className="flex items-center gap-2 bg-white hover:bg-purple-50 text-purple-800 border border-purple-500/30 p-2.5 rounded-2xl text-xs transition-all shadow-sm"
            >
              <MessageSquare className="w-4 h-4 text-purple-600" />
              <span className="font-semibold">پیامک (SMS)</span>
            </motion.a>

            {/* QR Code Toggle */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              id="modal-share-qr-btn"
              onClick={() => setShowQR(!showQR)}
              className={`flex items-center gap-2 border p-2.5 rounded-2xl text-xs transition-all shadow-sm cursor-pointer ${
                showQR
                  ? 'bg-[#B88728] text-white border-[#946F29] font-bold'
                  : 'bg-white text-[#946F29] border-[#B89355]/30 font-semibold hover:bg-amber-50'
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
              className="my-4 p-4 bg-white border border-[#B89355]/30 rounded-2xl text-center shadow-md"
            >
              <div className="text-xs text-[#946F29] font-bold mb-3">
                بارکد اختصاصی کارت دعوت (اسکن با دوربین گوشی):
              </div>
              <div className="inline-block p-3 bg-[#FAF6EE] rounded-2xl shadow-sm border border-[#B89355]/30">
                <img
                  src={qrImageUrl}
                  alt="QR Code کارت دعوت"
                  className="w-44 h-44 rounded-xl object-contain mx-auto"
                />
              </div>
              <p className="text-[10px] text-[#556251] mt-2">
                می‌توانید این بارکد را ذخیره کرده و روی کارت چاپی یا استوری اینستاگرام قرار دهید.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Full Text Copy Button */}
        <div className="pt-3 border-t border-[#B89355]/20 flex items-center justify-between">
          <span className="text-[11px] text-[#556251]">
            شامل تاریخ، ساعت، نام و لوکیشن تالار
          </span>

          <motion.button
            whileTap={{ scale: 0.92 }}
            id="copy-full-text-btn"
            onClick={handleCopyInvitationText}
            className="flex items-center gap-1.5 bg-white text-[#1C221A] font-medium border border-[#B89355]/30 px-3.5 py-1.5 rounded-full text-xs transition-colors cursor-pointer shadow-sm hover:bg-amber-50"
          >
            {copiedText ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">متن کپی شد</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#B88728]" />
                <span>کپی کل متن دعوت</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
