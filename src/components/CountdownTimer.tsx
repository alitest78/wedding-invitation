import React, { useEffect, useState } from 'react';
import { calculateTimeLeft, TimeLeft, toPersianDigits } from '../utils/cardUtils';
import { Clock, CalendarHeart } from 'lucide-react';

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
    <div className="w-full my-6 bg-[#20231F]/60 border border-[#C5A46D]/30 rounded-2xl p-4 sm:p-6 text-center shadow-lg relative overflow-hidden text-[#F5F0E8]">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A46D]/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="font-cinzel text-[10px] text-[#C5A46D] tracking-[0.25em] uppercase mb-0.5">
        COUNTDOWN TO CELEBRATION
      </div>
      <div className="flex items-center justify-center gap-2 text-[#F5F0E8] font-amiri font-bold text-lg sm:text-xl mb-1">
        <CalendarHeart className="w-5 h-5 text-[#C5A46D]" />
        <span>شمارش معکوس تا آغاز جشن و شادمانی</span>
      </div>
      <p className="text-xs text-[#E0D8CA]/80 mb-4 font-vazir">{shamsiDate}</p>

      {timeLeft.isPast ? (
        <div className="bg-[#3F473D] border border-[#C5A46D]/40 rounded-xl p-3 text-[#F5F0E8] text-sm font-medium">
          🎉 این پیوند فرخنده رقم خورده است؛ با آرزوی خوشبختی جاودان برای عروس و داماد عزیز! 🌸
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
          {/* Days */}
          <div className="bg-[#20231F]/90 border border-[#C5A46D]/30 rounded-xl p-2.5 sm:p-3 flex flex-col items-center justify-center shadow-md">
            <span className="text-xl sm:text-3xl font-bold font-vazir text-[#F5F0E8]">
              {toPersianDigits(timeLeft.days)}
            </span>
            <span className="text-[11px] sm:text-xs text-[#E0D8CA]/80 mt-1">روز</span>
          </div>

          {/* Hours */}
          <div className="bg-[#20231F]/90 border border-[#C5A46D]/30 rounded-xl p-2.5 sm:p-3 flex flex-col items-center justify-center shadow-md">
            <span className="text-xl sm:text-3xl font-bold font-vazir text-[#F5F0E8]">
              {toPersianDigits(timeLeft.hours)}
            </span>
            <span className="text-[11px] sm:text-xs text-[#E0D8CA]/80 mt-1">ساعت</span>
          </div>

          {/* Minutes */}
          <div className="bg-[#20231F]/90 border border-[#C5A46D]/30 rounded-xl p-2.5 sm:p-3 flex flex-col items-center justify-center shadow-md">
            <span className="text-xl sm:text-3xl font-bold font-vazir text-[#F5F0E8]">
              {toPersianDigits(timeLeft.minutes)}
            </span>
            <span className="text-[11px] sm:text-xs text-[#E0D8CA]/80 mt-1">دقیقه</span>
          </div>

          {/* Seconds */}
          <div className="bg-[#20231F]/90 border border-[#C5A46D]/30 rounded-xl p-2.5 sm:p-3 flex flex-col items-center justify-center shadow-md relative overflow-hidden">
            <span className="text-xl sm:text-3xl font-bold font-vazir text-[#C5A46D]">
              {toPersianDigits(timeLeft.seconds)}
            </span>
            <span className="text-[11px] sm:text-xs text-[#E0D8CA]/80 mt-1">ثانیه</span>
            <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#C5A46D]"></div>
          </div>
        </div>
      )}
    </div>
  );
};
