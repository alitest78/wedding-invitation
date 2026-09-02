import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  QrCode, 
  Send, 
  MessageSquare,
  Smartphone,
  Key,
  ShieldCheck,
  Sparkles,
  Link2,
  Edit2,
  RefreshCw,
  Globe
} from 'lucide-react';
import { WeddingDetails } from '../types';
import { 
  getSocialShareLinks, 
  getGuestInvitationUrl, 
  getAdminInvitationUrl,
  saveCardToServer 
} from '../utils/cardUtils';

interface ShareModalProps {
  wedding: WeddingDetails;
  isOpen: boolean;
  shortId?: string;
  onShortIdChange?: (id: string) => void;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ 
  wedding, 
  isOpen, 
  shortId: initialShortId,
  onShortIdChange,
  onClose 
}) => {
  const [currentShortId, setCurrentShortId] = useState<string | undefined>(initialShortId);
  const [customSlug, setCustomSlug] = useState<string>('');
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);
  const [isSavingShortLink, setIsSavingShortLink] = useState<boolean>(false);
  const [copiedGuestLink, setCopiedGuestLink] = useState(false);
  const [copiedAdminLink, setCopiedAdminLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showAdminLink, setShowAdminLink] = useState(false);

  // Auto-generate short ID if not exists when modal opens
  useEffect(() => {
    if (isOpen && !currentShortId) {
      setIsSavingShortLink(true);
      saveCardToServer(wedding).then((res) => {
        setIsSavingShortLink(false);
        if (res && res.id) {
          setCurrentShortId(res.id);
          if (onShortIdChange) onShortIdChange(res.id);
        }
      }).catch(() => {
        setIsSavingShortLink(false);
      });
    }
  }, [isOpen, wedding]);

  // Handle custom slug save (e.g. "ali-zahra")
  const handleSaveCustomSlug = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSlug.trim()) return;
    setIsSavingShortLink(true);
    try {
      const res = await saveCardToServer(wedding, customSlug.trim());
      if (res && res.id) {
        setCurrentShortId(res.id);
        if (onShortIdChange) onShortIdChange(res.id);
        setIsCustomizing(false);
      }
    } catch (e) {
      console.warn('Failed to save custom slug', e);
    } finally {
      setIsSavingShortLink(false);
    }
  };

  if (!isOpen) return null;

  const guestUrl = typeof window !== 'undefined' 
    ? getGuestInvitationUrl(wedding, currentShortId) 
    : '';
  const adminUrl = typeof window !== 'undefined' 
    ? getAdminInvitationUrl(wedding, currentShortId) 
    : '';
  const socialLinks = getSocialShareLinks(wedding, guestUrl);

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(guestUrl)}&color=184-135-40&bgcolor=250-246-238`;

  const handleCopyGuestLink = () => {
    navigator.clipboard.writeText(guestUrl);
    setCopiedGuestLink(true);
    setTimeout(() => setCopiedGuestLink(false), 2500);
  };

  const handleCopyAdminLink = () => {
    navigator.clipboard.writeText(adminUrl);
    setCopiedAdminLink(true);
    setTimeout(() => setCopiedAdminLink(false), 2500);
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
          text: `دعوت‌نامه جشن وصال ${wedding.brideName} و ${wedding.groomName} 🌸`,
          url: guestUrl,
        });
      } catch (err) {
        console.log('Share dismissed', err);
      }
    } else {
      handleCopyGuestLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
      <motion.div 
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
        className="relative w-full max-w-lg bg-[#FAF6EE] rounded-[32px] p-5 sm:p-8 text-[#1C221A] shadow-2xl overflow-y-auto max-h-[92vh] font-vazir border border-[#B89355]/30"
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
        <div className="text-center mb-5">
          <div className="font-cinzel text-[10px] text-[#946F29] tracking-[0.28em] uppercase mb-1 font-bold">
            SHORT LINK & GUEST INVITATION
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#F0E6D2] mx-auto flex items-center justify-center text-[#B88728] mb-2.5 shadow-inner border border-[#B89355]/30">
            <Link2 className="w-6 h-6" />
          </div>
          <h3 className="font-amiri text-2xl sm:text-3xl font-bold text-[#1C221A]">
            لینک کوتاه کارت دعوت عروسی
          </h3>
          <p className="text-xs text-[#556251] mt-1">
            لینک کوتاه، تمیز و قفل‌شده مخصوص ارسال به مهمانان و بستگان
          </p>
        </div>

        {/* Main Short Guest Link Box */}
        <div className="bg-gradient-to-br from-[#FFF9EE] to-[#F5EBD7] border-2 border-[#B88728]/50 rounded-2xl p-4 mb-4 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#855E1C]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>لینک کوتاه اختصاصی مهمانان (قفل‌شده):</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-full border border-amber-300">
                لینک کوتاه
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-300">
                بدون ویرایش
              </span>
            </div>
          </div>

          <p className="text-[11px] text-[#556251] mb-2.5 leading-relaxed">
            مهمانان با این لینک کوتاه فقط کارت کامل شما را مشاهده می‌کنند و دکمه‌های ویرایش برایشان مخفی است.
          </p>

          <div className="flex items-center gap-2 mb-2">
            <div className="relative w-full">
              <input
                readOnly
                value={guestUrl}
                className="w-full bg-white border border-[#B89355]/35 rounded-xl px-3 py-2 text-xs text-[#1C221A] font-mono text-left focus:outline-none select-all shadow-inner tracking-tight"
              />
              {isSavingShortLink && (
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-[#B88728] bg-white/90 px-2 py-0.5 rounded-md shadow-sm">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>تولید لینک...</span>
                </div>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.92 }}
              id="copy-guest-url-btn"
              onClick={handleCopyGuestLink}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#B88728] to-[#946F29] text-white font-bold px-4 py-2 rounded-xl text-xs flex-shrink-0 transition-all shadow cursor-pointer"
            >
              {copiedGuestLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>کپی شد!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>کپی لینک</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Custom Slug Name Option */}
          <div className="pt-2 border-t border-[#B89355]/20 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsCustomizing(!isCustomizing)}
              className="text-[11px] text-[#855E1C] hover:text-[#5B3E0C] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>{isCustomizing ? 'بستن تنظیم نام دلخواه' : 'شخصی‌سازی نام لینک (مثلاً نام عروس و داماد)'}</span>
            </button>
            {currentShortId && (
              <span className="text-[10px] font-mono text-[#556251] bg-white/60 px-2 py-0.5 rounded-md border border-[#B89355]/20">
                کد: {currentShortId}
              </span>
            )}
          </div>

          <AnimatePresence>
            {isCustomizing && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSaveCustomSlug}
                className="mt-2.5 pt-2.5 border-t border-[#B89355]/20"
              >
                <label className="block text-[11px] text-[#855E1C] font-medium mb-1">
                  نام انگلیسی دلخواه برای لینک (مثلاً: ali-zahra یا wedding-2026):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    placeholder="ali-maryam"
                    dir="ltr"
                    className="w-full bg-white border border-[#B89355]/35 rounded-xl px-3 py-1.5 text-xs text-[#1C221A] font-mono focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isSavingShortLink || !customSlug.trim()}
                    className="bg-[#B88728] hover:bg-[#946F29] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex-shrink-0 disabled:opacity-50"
                  >
                    {isSavingShortLink ? 'در حال ثبت...' : 'ثبت لینک'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Smart Mobile Share Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.96 }}
          id="native-device-share-btn"
          onClick={handleNativeShare}
          className="w-full mb-4 flex items-center justify-center gap-2 bg-[#1C221A] text-white font-bold p-3.5 rounded-2xl text-xs sm:text-sm transition-all shadow-md cursor-pointer hover:bg-black"
        >
          <Smartphone className="w-4 h-4 text-[#F5C042]" />
          <span>ارسال هوشمند در گوشی (واتساپ / تلگرام / ایتا)</span>
        </motion.button>

        {/* Social Platforms Direct Grid */}
        <div className="mb-4">
          <span className="text-xs font-bold text-[#1C221A] block mb-2.5">
            ارسال سریع به پیام‌رسان‌ها:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                W
              </div>
              <span className="font-semibold truncate">واتساپ</span>
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
              <span className="font-semibold truncate">تلگرام</span>
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
              <span className="font-semibold truncate">ایتا</span>
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
              <span className="font-semibold truncate">بله</span>
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
              <span className="font-semibold truncate">پیامک (SMS)</span>
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
              <span className="truncate">{showQR ? 'بستن بارکد' : 'بارکد QR کارت'}</span>
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
              className="my-3 p-4 bg-white border border-[#B89355]/30 rounded-2xl text-center shadow-md"
            >
              <div className="text-xs text-[#946F29] font-bold mb-2">
                بارکد اختصاصی مهمانان (اسکن با دوربین موبایل):
              </div>
              <div className="inline-block p-3 bg-[#FAF6EE] rounded-2xl shadow-sm border border-[#B89355]/30">
                <img
                  src={qrImageUrl}
                  alt="QR Code کارت دعوت"
                  className="w-44 h-44 rounded-xl object-contain mx-auto"
                />
              </div>
              <p className="text-[10px] text-[#556251] mt-2">
                می‌توانید این تصویر بارکد را برای چاپ روی کارت فیزیکی یا استوری اینستاگرام ذخیره کنید.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Host/Admin Link Section (Collapsible Accordion) */}
        <div className="mt-4 pt-3 border-t border-[#B89355]/20">
          <button
            type="button"
            onClick={() => setShowAdminLink(!showAdminLink)}
            className="w-full flex items-center justify-between text-xs text-[#855E1C] font-semibold hover:text-[#5B3E0C] cursor-pointer py-1"
          >
            <span className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#B88728]" />
              <span>لینک مدیریت کارت (جهت ویرایش‌های بعدی توسط شما)</span>
            </span>
            <span className="text-[10px] bg-[#B88728]/15 px-2 py-0.5 rounded-full">
              {showAdminLink ? 'بستن' : 'نمایش'}
            </span>
          </button>

          <AnimatePresence>
            {showAdminLink && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 p-3 bg-white/70 border border-[#B89355]/25 rounded-2xl"
              >
                <p className="text-[11px] text-[#556251] mb-2 leading-relaxed">
                  این لینک دارای دسترسی ویرایش است. آن را نزد خود ذخیره کنید تا هر زمان مایل بودید، ساعت یا تالار را تغییر دهید.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={adminUrl}
                    className="w-full bg-white border border-[#B89355]/30 rounded-xl px-2.5 py-1.5 text-xs text-[#1C221A] font-mono text-left focus:outline-none select-all"
                  />
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={handleCopyAdminLink}
                    className="flex items-center gap-1 bg-[#F0E6D2] hover:bg-[#E8DCC2] text-[#855E1C] border border-[#B89355]/35 px-3 py-1.5 rounded-xl text-xs flex-shrink-0 transition-colors cursor-pointer font-medium"
                  >
                    {copiedAdminLink ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedAdminLink ? 'کپی شد' : 'کپی'}</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Full Text Copy Button */}
        <div className="mt-3 pt-3 border-t border-[#B89355]/20 flex items-center justify-between">
          <span className="text-[11px] text-[#556251]">
            متن دعوت پیامکی همراه با لینک کوتاه کارت
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
                <span>کپی متن دعوت</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
