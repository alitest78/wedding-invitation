import { WeddingDetails } from '../types';

// Convert English numbers to Persian numbers
export function toPersianDigits(num: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/[0-9]/g, (w) => persianDigits[+w]);
}

// Generate navigation links for popular Iranian & global navigation apps
export function getNavigationLinks(lat: number, lng: number, title: string) {
  const encodedTitle = encodeURIComponent(title);
  return {
    neshan: `https://neshan.org/maps/@${lat},${lng},16z`,
    balad: `https://balad.ir/location?latitude=${lat}&longitude=${lng}`,
    googleMaps: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    waze: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`,
    appleMaps: `https://maps.apple.com/?q=${encodedTitle}&ll=${lat},${lng}`,
    geoUri: `geo:${lat},${lng}?q=${lat},${lng}(${encodedTitle})`
  };
}

// Generate Calendar event links (Google Calendar & iCal .ics download)
export function getCalendarEvent(wedding: WeddingDetails) {
  const title = `جشن عروسی ${wedding.brideName} و ${wedding.groomName}`;
  const description = `جشن وصال و پیوند فرخنده ${wedding.brideName} و ${wedding.groomName}\nمکان: ${wedding.hallName}\nآدرس: ${wedding.hallAddress}\nساعت: ${wedding.ceremonyTime}`;
  const location = `${wedding.hallName} - ${wedding.hallAddress}`;

  // Approximate start/end timestamps from ceremonyDateMiladi
  let startDate = wedding.ceremonyDateMiladi.replace(/-/g, '') + 'T190000';
  let endDate = wedding.ceremonyDateMiladi.replace(/-/g, '') + 'T233000';

  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

  const generateIcsDataUri = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Persian Wedding Card//FA',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
      `LOCATION:${location}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
  };

  return {
    googleCalendar: googleCalUrl,
    icsDataUri: generateIcsDataUri()
  };
}

// Generate social share links
export function getSocialShareLinks(wedding: WeddingDetails, cardUrl?: string) {
  const currentUrl = cardUrl || (typeof window !== 'undefined' ? window.location.href : '');
  
  const textMessage = `🎉 دعوت‌نامه جشن عروسی ${wedding.brideName} و ${wedding.groomName} 🌸
📅 تاریخ: ${wedding.ceremonyDateShamsi}
⏰ زمان: ${wedding.ceremonyTime}
📍 مکان: ${wedding.hallName}
آدرس: ${wedding.hallAddress}

مشاهده کارت دعوت دیجیتال و لوکیشن تالار:
${currentUrl}`;

  const encodedText = encodeURIComponent(textMessage);
  const encodedUrl = encodeURIComponent(currentUrl);

  return {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedText}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(`دعوت‌نامه جشن عروسی ${wedding.brideName} و ${wedding.groomName} 💍`)}`,
    eitaa: `https://eitaa.com/share/url?url=${encodedUrl}&text=${encodedText}`,
    bale: `https://ble.ir/share/url?url=${encodedUrl}&text=${encodedText}`,
    rubika: `https://rubika.ir`, // Rubika web share / clipboard fallback
    sms: `sms:?body=${encodedText}`,
    rawText: textMessage
  };
}

// Countdown timer calculations
export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export function calculateTimeLeft(targetDateStr: string): TimeLeft {
  const targetDate = new Date(targetDateStr).getTime();
  const now = new Date().getTime();
  const difference = targetDate - now;

  if (isNaN(difference) || difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isPast: false };
}

// Encode state into URL query parameter safely for full sharability
export function encodeWeddingToURL(wedding: WeddingDetails, isGuest: boolean = true): string {
  try {
    const json = JSON.stringify(wedding);
    const base64 = btoa(encodeURIComponent(json));
    const url = new URL(typeof window !== 'undefined' ? window.location.href : 'http://localhost:3000');
    url.searchParams.set('w', base64);
    if (isGuest) {
      url.searchParams.set('mode', 'guest');
      url.searchParams.delete('admin');
    } else {
      url.searchParams.set('mode', 'admin');
    }
    return url.toString();
  } catch (err) {
    console.error('Failed to encode wedding details into URL', err);
    return typeof window !== 'undefined' ? window.location.href : '';
  }
}

// Generate a locked Guest Link (no edit or theme switcher buttons)
export function getGuestInvitationUrl(wedding: WeddingDetails): string {
  return encodeWeddingToURL(wedding, true);
}

// Generate an Admin / Host Link (with full edit capabilities)
export function getAdminInvitationUrl(wedding: WeddingDetails): string {
  return encodeWeddingToURL(wedding, false);
}

export function isGuestModeFromURL(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    const admin = params.get('admin');
    const guest = params.get('guest');

    if (mode === 'admin' || admin === '1' || admin === 'true') {
      return false;
    }
    if (mode === 'guest' || guest === '1' || guest === 'true') {
      return true;
    }
    // If 'w' is present without explicit admin flag, default to locked guest view for security
    if (params.get('w')) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

export function decodeWeddingFromURL(): WeddingDetails | null {
  if (typeof window === 'undefined') return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('w');
    if (!encoded) return null;
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json) as WeddingDetails;
  } catch (err) {
    console.warn('Could not decode wedding from URL parameter', err);
    return null;
  }
}

