import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { calculateTimeLeft, TimeLeft, toPersianDigits } from '../utils/cardUtils';
import { Clock, CalendarHeart, Sparkles } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string; // e.g. "2026-10-15"
  shamsiDate: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, shamsiDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false
  });

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(targetDate));
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="w-full my-6 apple-glass-subtle rounded-[26px] p-4 sm:p-6 text-center shadow-xl relative overflow-hidden text-[#F5F0E8]">
      <div className="absolute top-0 right-0 w-36 h-36 bg-[#C5A46D]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="font-cinzel text-[10px] text-[#C5A46D] tracking-[0.28em] uppercase mb-0.5">
        COUNTDOWN TO CELEBRATION
      </div>
      <div className="flex items-center justify-center gap-2 text-[#F5F0E8] font-amiri font-bold text-lg sm:text-xl mb-1">
        <CalendarHeart className="w-5 h-5 text-[#C5A46D]" />
        <span>شمارش معکوس تا آغاز جشن و شادمانی</span>
      </div>
      <p className="text-xs text-[#E0D8CA]/80 mb-4 font-vazir">{shamsiDate}</p>

      {timeLeft.isPast ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="apple-glass rounded-2xl p-4 text-[#F5F0E8] text-sm font-medium border border-[#C5A46D]/40"
        >
          🎉 این پیوند فرخنده رقم خورده است؛ با آرزوی خوشبختی جاودان برای عروس و داماد عزیز! 🌸
        </motion.div>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:gap-3.5 max-w-md mx-auto">
          {/* Days */}
          <motion.div 
            whileHover={{ y: -2 }}
            className="apple-glass rounded-2xl p-2.5 sm:p-3.5 flex flex-col items-center justify-center shadow-lg border border-white/10"
          >
            <span className="text-2xl sm:text-3xl font-bold font-vazir text-[#F5F0E8] tabular-nums tracking-tight">
              {toPersianDigits(timeLeft.days)}
            </span>
            <span className="text-[10px] sm:text-xs text-[#E0D8CA]/80 mt-1 font-vazir font-medium">روز</span>
          </motion.div>

          {/* Hours */}
          <motion.div 
            whileHover={{ y: -2 }}
            className="apple-glass rounded-2xl p-2.5 sm:p-3.5 flex flex-col items-center justify-center shadow-lg border border-white/10"
          >
            <span className="text-2xl sm:text-3xl font-bold font-vazir text-[#F5F0E8] tabular-nums tracking-tight">
              {toPersianDigits(timeLeft.hours)}
            </span>
            <span className="text-[10px] sm:text-xs text-[#E0D8CA]/80 mt-1 font-vazir font-medium">ساعت</span>
          </motion.div>

          {/* Minutes */}
          <motion.div 
            whileHover={{ y: -2 }}
            className="apple-glass rounded-2xl p-2.5 sm:p-3.5 flex flex-col items-center justify-center shadow-lg border border-white/10"
          >
            <span className="text-2xl sm:text-3xl font-bold font-vazir text-[#F5F0E8] tabular-nums tracking-tight">
              {toPersianDigits(timeLeft.minutes)}
            </span>
            <span className="text-[10px] sm:text-xs text-[#E0D8CA]/80 mt-1 font-vazir font-medium">دقیقه</span>
          </motion.div>

          {/* Seconds */}
          <motion.div 
            whileHover={{ y: -2 }}
            className="apple-glass rounded-2xl p-2.5 sm:p-3.5 flex flex-col items-center justify-center shadow-lg border border-[#C5A46D]/40 relative overflow-hidden"
          >
            <span className="text-2xl sm:text-3xl font-bold font-vazir text-[#F5C042] tabular-nums tracking-tight">
              {toPersianDigits(timeLeft.seconds)}
            </span>
            <span className="text-[10px] sm:text-xs text-[#E0D8CA]/80 mt-1 font-vazir font-medium">ثانیه</span>
            <motion.div 
              key={timeLeft.seconds}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease: 'linear' }}
              className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-[#C5A46D] to-[#F5C042]"
            ></motion.div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
