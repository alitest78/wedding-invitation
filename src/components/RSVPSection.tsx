import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Send, 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  MessageSquareHeart,
  Sparkles
} from 'lucide-react';
import { RSVPResponse } from '../types';
import { toPersianDigits } from '../utils/cardUtils';

interface RSVPSectionProps {
  rsvps: RSVPResponse[];
  onAddRSVP: (rsvp: Omit<RSVPResponse, 'id' | 'createdAt' | 'likes'>) => void;
  onLikeRSVP: (id: string) => void;
}

export const RSVPSection: React.FC<RSVPSectionProps> = ({ rsvps, onAddRSVP, onLikeRSVP }) => {
  const [guestName, setGuestName] = useState('');
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [congratulationMessage, setCongratulationMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    onAddRSVP({
      guestName: guestName.trim(),
      attending,
      guestCount: attending === 'yes' ? guestCount : 0,
      congratulationMessage: congratulationMessage.trim() || 'با آرزوی خوشبختی و سعادت برای عروس و داماد عزیز 🌸',
    });

    setSubmitted(true);
    setGuestName('');
    setCongratulationMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div id="rsvp-guestbook-section" className="w-full my-8 apple-glass-subtle rounded-[28px] p-5 sm:p-7 shadow-2xl text-[#F5F0E8] font-vazir">
      {/* Section Title */}
      <div className="text-center mb-6">
        <div className="font-cinzel text-[10px] text-[#C5A46D] tracking-[0.28em] uppercase mb-1 font-bold">
          R.S.V.P &amp; GUESTBOOK
        </div>
        <div className="inline-flex items-center gap-1.5 text-[#F5F0E8] text-xs font-semibold apple-glass-pill px-4 py-1.5 rounded-full mb-2">
          <Heart className="w-3.5 h-3.5 fill-[#C5A46D] text-[#C5A46D]" />
          <span>اعلام حضور و یادگاری مهمانان</span>
        </div>
        <h3 className="font-amiri text-3xl sm:text-4xl font-bold text-[#F5F0E8]">
          همراهی شما، افتخار بزم ماست
        </h3>
        <p className="text-xs text-[#E0D8CA] mt-1 max-w-md mx-auto">
          لطفاً جهت برنامه‌ریزی بهتر پذیرایی و ثبت پیام‌های پرمهرتان، فرم زیر را تکمیل فرمایید
        </p>
      </div>

      {/* RSVP Form */}
      <form onSubmit={handleSubmit} className="apple-glass rounded-2xl p-4 sm:p-6 mb-8 border border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Guest Name */}
          <div>
            <label className="block text-xs font-medium text-[#F5F0E8] mb-1.5">
              نام و نام خانوادگی گرامی:
            </label>
            <input
              type="text"
              required
              placeholder="مثال: علی بهرامی و خانواده"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full bg-black/30 border border-[#C5A46D]/35 rounded-xl px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D] focus:ring-1 focus:ring-[#C5A46D] placeholder:text-[#8C9488]"
            />
          </div>

          {/* Attendance Status (Apple Segmented Control) */}
          <div>
            <label className="block text-xs font-medium text-[#F5F0E8] mb-1.5">
              وضعیت حضور:
            </label>
            <div className="grid grid-cols-2 gap-2 bg-black/30 p-1 rounded-xl border border-white/10 relative">
              <button
                type="button"
                onClick={() => setAttending('yes')}
                className={`relative flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer z-10 ${
                  attending === 'yes' ? 'text-[#181B16] font-bold' : 'text-[#8C9488] hover:text-[#F5F0E8]'
                }`}
              >
                {attending === 'yes' && (
                  <motion.div
                    layoutId="attendance-active-pill"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    className="absolute inset-0 bg-gradient-to-r from-[#F5C042] to-[#C5A46D] rounded-lg -z-10 shadow-md"
                  />
                )}
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>با افتخار حضور می‌یابم</span>
              </button>

              <button
                type="button"
                onClick={() => setAttending('no')}
                className={`relative flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer z-10 ${
                  attending === 'no' ? 'text-[#F5F0E8] font-bold' : 'text-[#8C9488] hover:text-[#F5F0E8]'
                }`}
              >
                {attending === 'no' && (
                  <motion.div
                    layoutId="attendance-active-pill"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    className="absolute inset-0 bg-[#353D32] rounded-lg -z-10 border border-[#C5A46D]/50 shadow-md"
                  />
                )}
                <XCircle className="w-3.5 h-3.5 text-rose-300" />
                <span>امکان حضور ندارم</span>
              </button>
            </div>
          </div>
        </div>

        {/* Guest Count (if attending) */}
        {attending === 'yes' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            <label className="block text-xs font-medium text-[#F5F0E8] mb-1.5">
              تعداد نفرات همراه:
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6].map((count) => (
                <motion.button
                  key={count}
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setGuestCount(count)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold font-vazir transition-all cursor-pointer flex items-center justify-center ${
                    guestCount === count
                      ? 'bg-gradient-to-tr from-[#C5A46D] to-[#F5C042] text-[#181B16] shadow-md'
                      : 'bg-black/30 text-[#F5F0E8] border border-white/10 hover:border-[#C5A46D]/60'
                  }`}
                >
                  {toPersianDigits(count)}
                </motion.button>
              ))}
              <span className="text-xs text-[#E0D8CA] mr-2">نفر</span>
            </div>
          </motion.div>
        )}

        {/* Congratulatory Message */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-[#F5F0E8] mb-1.5">
            پیام تبریک و شادباش شما برای عروس و داماد:
          </label>
          <textarea
            rows={3}
            placeholder="آرزوی قلبی و کلام پرمهر خود را اینجا بنویسید..."
            value={congratulationMessage}
            onChange={(e) => setCongratulationMessage(e.target.value)}
            className="w-full bg-black/30 border border-[#C5A46D]/35 rounded-xl p-3 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D] focus:ring-1 focus:ring-[#C5A46D] placeholder:text-[#8C9488] resize-none leading-relaxed"
          />
        </div>

        {/* Submit button */}
        <div className="flex items-center justify-between gap-3">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-[#C5A46D] text-xs font-medium apple-glass-pill px-4 py-2 rounded-xl"
            >
              <CheckCircle2 className="w-4 h-4 text-[#F5C042]" />
              <span>پاسخ و پیام پرمهر شما با موفقیت ثبت شد. متشکریم!</span>
            </motion.div>
          ) : (
            <span className="text-[11px] text-[#E0D8CA]/70">
              پیام شما در تابلوی یادگاری عروسی نمایش داده می‌شود
            </span>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            id="submit-rsvp-btn"
            className="flex items-center gap-2 bg-gradient-to-r from-[#F5C042] to-[#C5A46D] text-[#181B16] font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-lg active:scale-95 cursor-pointer ml-auto"
          >
            <Send className="w-3.5 h-3.5 text-[#181B16]" />
            <span>ثبت اعلام حضور و پیام</span>
          </motion.button>
        </div>
      </form>

      {/* Guestbook List (تابلوی شادباش) */}
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-[#C5A46D]/20 pb-2">
          <div className="flex items-center gap-2">
            <MessageSquareHeart className="w-4 h-4 text-[#C5A46D]" />
            <h4 className="font-amiri text-xl font-bold text-[#F5F0E8]">
              تابلوی شادباش و پیام‌های مهمانان {rsvps.length > 0 && `(${toPersianDigits(rsvps.length)})`}
            </h4>
          </div>
        </div>

        {rsvps.length === 0 ? (
          <div className="text-center py-8 px-4 apple-glass rounded-2xl border border-white/10">
            <Sparkles className="w-6 h-6 text-[#C5A46D] mx-auto mb-2 opacity-80" />
            <p className="text-xs sm:text-sm text-[#E0D8CA]">
              هنوز پیام شادباشی ثبت نشده است.
            </p>
            <p className="text-[11px] text-[#C5A46D] mt-1">
              اولین نفری باشید که با تکمیل فرم بالا، برای عروس و داماد آرزوی خوشبختی می‌نویسد!
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {rsvps.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="apple-glass rounded-2xl p-4 text-xs transition-all border border-white/10 hover:border-[#C5A46D]/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#F5F0E8] font-amiri text-base">
                      {item.guestName}
                    </span>
                    {item.attending === 'yes' ? (
                      <span className="text-[10px] apple-glass-pill text-[#F5F0E8] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <UserCheck className="w-2.5 h-2.5 text-[#C5A46D]" />
                        <span>حضور ({toPersianDigits(item.guestCount)} نفر)</span>
                      </span>
                    ) : (
                      <span className="text-[10px] bg-black/40 text-[#8C9488] border border-white/10 px-2.5 py-0.5 rounded-full">
                        عدم امکان حضور
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] text-[#8C9488]">{item.createdAt}</span>
                </div>

                <p className="text-[#F5F0E8] leading-relaxed font-light mb-2">
                  {item.congratulationMessage}
                </p>

                <div className="flex items-center justify-end">
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    type="button"
                    onClick={() => onLikeRSVP(item.id)}
                    className="flex items-center gap-1.5 text-[11px] text-[#F5F0E8] apple-glass-pill px-3 py-1 rounded-full cursor-pointer"
                  >
                    <Heart className="w-3 h-3 fill-[#C5A46D] text-[#C5A46D]" />
                    <span>{toPersianDigits(item.likes || 1)}</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
