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
    <div id="rsvp-guestbook-section" className="w-full my-8 liquid-glass-subtle rounded-[28px] p-5 sm:p-7 shadow-lg text-[#1C221A] font-vazir border border-[#B89355]/25 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-44 h-44 bg-[#B88728]/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Section Title */}
      <div className="text-center mb-6">
        <div className="font-cinzel text-[10px] text-[#946F29] tracking-[0.28em] uppercase mb-1 font-bold">
          R.S.V.P &amp; GUESTBOOK
        </div>
        <div className="inline-flex items-center gap-1.5 text-[#1C221A] text-xs font-semibold liquid-glass-pill px-4 py-1.5 rounded-full mb-2 border border-[#B89355]/25">
          <Heart className="w-3.5 h-3.5 fill-[#B88728] text-[#B88728]" />
          <span>اعلام حضور و یادگاری مهمانان</span>
        </div>
        <h3 className="font-amiri text-3xl sm:text-4xl font-bold text-[#1C221A]">
          همراهی شما، افتخار بزم ماست
        </h3>
        <p className="text-xs text-[#556251] mt-1 max-w-md mx-auto">
          لطفاً جهت برنامه‌ریزی بهتر پذیرایی و ثبت پیام‌های پرمهرتان، فرم زیر را تکمیل فرمایید
        </p>
      </div>

      {/* RSVP Form */}
      <form onSubmit={handleSubmit} className="liquid-glass rounded-2xl p-4 sm:p-6 mb-8 border border-[#B89355]/25 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Guest Name */}
          <div>
            <label className="block text-xs font-semibold text-[#1C221A] mb-1.5">
              نام و نام خانوادگی گرامی:
            </label>
            <input
              type="text"
              required
              placeholder="مثال: علی بهرامی و خانواده"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full bg-white/70 border border-[#B89355]/40 rounded-xl px-3.5 py-2.5 text-xs text-[#1C221A] focus:outline-none focus:border-[#B88728] focus:ring-1 focus:ring-[#B88728] placeholder:text-[#8C9886]"
            />
          </div>

          {/* Attendance Status (Apple Segmented Control) */}
          <div>
            <label className="block text-xs font-semibold text-[#1C221A] mb-1.5">
              وضعیت حضور:
            </label>
            <div className="grid grid-cols-2 gap-2 bg-white/50 p-1 rounded-xl border border-[#B89355]/20 relative">
              <button
                type="button"
                onClick={() => setAttending('yes')}
                className={`relative flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer z-10 ${
                  attending === 'yes' ? 'text-[#1C221A] font-bold' : 'text-[#687764] hover:text-[#1C221A]'
                }`}
              >
                {attending === 'yes' && (
                  <motion.div
                    layoutId="attendance-active-pill"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    className="absolute inset-0 bg-gradient-to-r from-[#DFCDA7] to-[#C5A46D] rounded-lg -z-10 shadow-sm"
                  />
                )}
                <CheckCircle2 className="w-3.5 h-3.5 text-[#855E1C]" />
                <span>با افتخار حضور می‌یابم</span>
              </button>

              <button
                type="button"
                onClick={() => setAttending('no')}
                className={`relative flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer z-10 ${
                  attending === 'no' ? 'text-[#1C221A] font-bold' : 'text-[#687764] hover:text-[#1C221A]'
                }`}
              >
                {attending === 'no' && (
                  <motion.div
                    layoutId="attendance-active-pill"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    className="absolute inset-0 bg-white rounded-lg -z-10 border border-[#B89355]/40 shadow-sm"
                  />
                )}
                <XCircle className="w-3.5 h-3.5 text-rose-500" />
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
            <label className="block text-xs font-semibold text-[#1C221A] mb-1.5">
              تعداد نفرات همراه:
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6].map((count) => (
                <motion.button
                  key={count}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setGuestCount(count)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold font-vazir transition-all cursor-pointer flex items-center justify-center ${
                    guestCount === count
                      ? 'bg-gradient-to-tr from-[#C5A46D] to-[#B88728] text-white shadow-sm'
                      : 'bg-white/60 text-[#1C221A] border border-[#B89355]/25 hover:border-[#B88728]/60'
                  }`}
                >
                  {toPersianDigits(count)}
                </motion.button>
              ))}
              <span className="text-xs text-[#556251] mr-2">نفر</span>
            </div>
          </motion.div>
        )}

        {/* Congratulatory Message */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-[#1C221A] mb-1.5">
            پیام تبریک و شادباش شما برای عروس و داماد:
          </label>
          <textarea
            rows={3}
            placeholder="آرزوی قلبی و کلام پرمهر خود را اینجا بنویسید..."
            value={congratulationMessage}
            onChange={(e) => setCongratulationMessage(e.target.value)}
            className="w-full bg-white/70 border border-[#B89355]/40 rounded-xl p-3 text-xs text-[#1C221A] focus:outline-none focus:border-[#B88728] focus:ring-1 focus:ring-[#B88728] placeholder:text-[#8C9886] resize-none leading-relaxed"
          />
        </div>

        {/* Submit button */}
        <div className="flex items-center justify-between gap-3">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-[#946F29] text-xs font-medium liquid-glass-pill px-4 py-2 rounded-xl border border-[#B89355]/30"
            >
              <CheckCircle2 className="w-4 h-4 text-[#B88728]" />
              <span>پاسخ و پیام پرمهر شما با موفقیت ثبت شد. متشکریم!</span>
            </motion.div>
          ) : (
            <span className="text-[11px] text-[#556251]">
              پیام شما در تابلوی یادگاری عروسی نمایش داده می‌شود
            </span>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            id="submit-rsvp-btn"
            className="flex items-center gap-2 bg-gradient-to-r from-[#B88728] to-[#946F29] text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md active:scale-95 cursor-pointer ml-auto"
          >
            <Send className="w-3.5 h-3.5 text-white" />
            <span>ثبت اعلام حضور و پیام</span>
          </motion.button>
        </div>
      </form>

      {/* Guestbook List (تابلوی شادباش) */}
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-[#B89355]/20 pb-2">
          <div className="flex items-center gap-2">
            <MessageSquareHeart className="w-4 h-4 text-[#B88728]" />
            <h4 className="font-amiri text-xl font-bold text-[#1C221A]">
              تابلوی شادباش و پیام‌های مهمانان {rsvps.length > 0 && `(${toPersianDigits(rsvps.length)})`}
            </h4>
          </div>
        </div>

        {rsvps.length === 0 ? (
          <div className="text-center py-8 px-4 liquid-glass rounded-2xl border border-[#B89355]/25">
            <Sparkles className="w-6 h-6 text-[#B88728] mx-auto mb-2 opacity-80" />
            <p className="text-xs sm:text-sm text-[#556251]">
              هنوز پیام شادباشی ثبت نشده است.
            </p>
            <p className="text-[11px] text-[#946F29] mt-1 font-medium">
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
                whileHover={{ scale: 1.01 }}
                className="liquid-glass rounded-2xl p-4 text-xs transition-all border border-[#B89355]/25 hover:border-[#B88728]/50 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1C221A] font-amiri text-base">
                      {item.guestName}
                    </span>
                    {item.attending === 'yes' ? (
                      <span className="text-[10px] liquid-glass-pill text-[#1C221A] px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#B89355]/25">
                        <UserCheck className="w-2.5 h-2.5 text-[#B88728]" />
                        <span>حضور ({toPersianDigits(item.guestCount)} نفر)</span>
                      </span>
                    ) : (
                      <span className="text-[10px] bg-white/60 text-[#687764] border border-[#B89355]/20 px-2.5 py-0.5 rounded-full">
                        عدم امکان حضور
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] text-[#687764]">{item.createdAt}</span>
                </div>

                <p className="text-[#1C221A] leading-relaxed font-normal mb-2">
                  {item.congratulationMessage}
                </p>

                <div className="flex items-center justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.88 }}
                    type="button"
                    onClick={() => onLikeRSVP(item.id)}
                    className="flex items-center gap-1.5 text-[11px] text-[#1C221A] liquid-glass-pill px-3 py-1 rounded-full cursor-pointer border border-[#B89355]/25"
                  >
                    <Heart className="w-3 h-3 fill-[#B88728] text-[#B88728]" />
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
