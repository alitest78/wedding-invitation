import { ThemeVariant } from '../types';

export interface ThemePreset {
  id: ThemeVariant;
  nameFa: string;
  nameEn: string;
  isDark: boolean;
  bgGradient: string;
  cardBg: string;
  envelopeBg: string;
  envelopeBorder: string;
  accentGradient: string;
  glowColor: string;
  borderColor: string;
  textColor: string;
  subtextColor: string;
  pageHeadingColor: string;
  pageSubheadingColor: string;
  coupleNamesColor: string;
  ampersandColor: string;
  instructionTextColor: string;
  navBtnBg: string;
  navBtnText: string;
  navBtnBorder: string;
  badgeBg: string;
  badgeBorder: string;
  waxSealGradient: string;
  waxSealInner: string;
  waxSealText: string;
  previewColor: string;
}

export const THEME_PRESETS: Record<ThemeVariant, ThemePreset> = {
  'sage-gold': {
    id: 'sage-gold',
    nameFa: 'سبز مریم‌گلی و عاجی',
    nameEn: 'Sage Green & Champagne Gold (Luxury)',
    isDark: false,
    bgGradient: 'theme-sage',
    cardBg: 'bg-[#3F473D]',
    envelopeBg: 'bg-[#3F473D]',
    envelopeBorder: 'border-[#C5A46D]/60',
    accentGradient: 'from-[#F5F0E8] via-[#E8DEC8] to-[#C5A46D]',
    glowColor: 'rgba(197, 164, 109, 0.35)',
    borderColor: 'border-[#C5A46D]/40',
    textColor: 'text-[#F5F0E8]',
    subtextColor: 'text-[#E0D8CA]',
    pageHeadingColor: 'text-[#20231F]',
    pageSubheadingColor: 'text-[#8A744C]',
    coupleNamesColor: 'text-[#20231F]',
    ampersandColor: 'text-[#C5A46D]',
    instructionTextColor: 'text-[#3F473D]',
    navBtnBg: 'bg-[#20231F]/90 hover:bg-[#707563]',
    navBtnText: 'text-[#F5F0E8]',
    navBtnBorder: 'border-[#C5A46D]/40',
    badgeBg: 'bg-[#3F473D]',
    badgeBorder: 'border-[#C5A46D]/50',
    waxSealGradient: 'from-[#20231F] via-[#3F473D] to-[#C5A46D]',
    waxSealInner: 'bg-[#20231F]',
    waxSealText: 'text-[#C5A46D]',
    previewColor: '#3F473D'
  },
  'emerald-gold': {
    id: 'emerald-gold',
    nameFa: 'زمرد شاهانه و طلای ناب',
    nameEn: 'Royal Emerald & 24K Gold',
    isDark: true,
    bgGradient: 'theme-emerald',
    cardBg: 'bg-[#0a2019]/95',
    envelopeBg: 'bg-[#0a2019]',
    envelopeBorder: 'border-emerald-500/50',
    accentGradient: 'from-emerald-300 via-amber-300 to-yellow-500',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-50',
    subtextColor: 'text-emerald-200/70',
    pageHeadingColor: 'text-emerald-100',
    pageSubheadingColor: 'text-amber-300',
    coupleNamesColor: 'text-white',
    ampersandColor: 'text-amber-400',
    instructionTextColor: 'text-emerald-200/90',
    navBtnBg: 'bg-[#061812]/90 hover:bg-emerald-900/60',
    navBtnText: 'text-emerald-100',
    navBtnBorder: 'border-emerald-500/40',
    badgeBg: 'bg-emerald-950/80',
    badgeBorder: 'border-emerald-500/40',
    waxSealGradient: 'from-emerald-700 via-emerald-500 to-amber-300',
    waxSealInner: 'bg-[#06241b]',
    waxSealText: 'text-amber-300',
    previewColor: '#0c2b21'
  },
  'gold-ivory': {
    id: 'gold-ivory',
    nameFa: 'اونیکس و طلای ۲۴ عیار',
    nameEn: 'Midnight Onyx & 24K Liquid Gold',
    isDark: true,
    bgGradient: 'theme-onyx',
    cardBg: 'bg-[#15121e]/95',
    envelopeBg: 'bg-[#181524]',
    envelopeBorder: 'border-amber-500/50',
    accentGradient: 'from-amber-200 via-yellow-400 to-amber-600',
    glowColor: 'rgba(245, 158, 11, 0.3)',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-50',
    subtextColor: 'text-amber-200/70',
    pageHeadingColor: 'text-[#FFF6D5]',
    pageSubheadingColor: 'text-amber-300',
    coupleNamesColor: 'text-white',
    ampersandColor: 'text-amber-400',
    instructionTextColor: 'text-amber-100/90',
    navBtnBg: 'bg-[#12101a]/90 hover:bg-amber-950/60',
    navBtnText: 'text-amber-100',
    navBtnBorder: 'border-amber-500/40',
    badgeBg: 'bg-amber-950/80',
    badgeBorder: 'border-amber-500/40',
    waxSealGradient: 'from-amber-700 via-yellow-500 to-amber-200',
    waxSealInner: 'bg-[#3b1522]',
    waxSealText: 'text-yellow-300',
    previewColor: '#171422'
  },
  'velvet-ruby': {
    id: 'velvet-ruby',
    nameFa: 'زرشکی سلطنتی و مروارید',
    nameEn: 'Imperial Ruby & Rose Gold',
    isDark: true,
    bgGradient: 'theme-ruby',
    cardBg: 'bg-[#240a15]/95',
    envelopeBg: 'bg-[#240a15]',
    envelopeBorder: 'border-rose-500/50',
    accentGradient: 'from-rose-200 via-pink-400 to-amber-400',
    glowColor: 'rgba(244, 63, 94, 0.3)',
    borderColor: 'border-rose-500/30',
    textColor: 'text-rose-50',
    subtextColor: 'text-rose-200/70',
    pageHeadingColor: 'text-rose-100',
    pageSubheadingColor: 'text-amber-300',
    coupleNamesColor: 'text-white',
    ampersandColor: 'text-rose-300',
    instructionTextColor: 'text-rose-200/90',
    navBtnBg: 'bg-[#18050c]/90 hover:bg-rose-950/60',
    navBtnText: 'text-rose-100',
    navBtnBorder: 'border-rose-500/40',
    badgeBg: 'bg-rose-950/80',
    badgeBorder: 'border-rose-500/40',
    waxSealGradient: 'from-rose-800 via-red-600 to-amber-300',
    waxSealInner: 'bg-[#400516]',
    waxSealText: 'text-rose-200',
    previewColor: '#300c19'
  },
  'royal-navy': {
    id: 'royal-navy',
    nameFa: 'یاقوت کبود و پلاتین نقره‌ای',
    nameEn: 'Sapphire Navy & Platinum',
    isDark: true,
    bgGradient: 'theme-sapphire',
    cardBg: 'bg-[#0c1a36]/95',
    envelopeBg: 'bg-[#0c1a36]',
    envelopeBorder: 'border-blue-500/50',
    accentGradient: 'from-sky-200 via-blue-300 to-amber-300',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-50',
    subtextColor: 'text-blue-200/70',
    pageHeadingColor: 'text-sky-100',
    pageSubheadingColor: 'text-amber-300',
    coupleNamesColor: 'text-white',
    ampersandColor: 'text-amber-400',
    instructionTextColor: 'text-blue-200/90',
    navBtnBg: 'bg-[#060e20]/90 hover:bg-blue-950/60',
    navBtnText: 'text-blue-100',
    navBtnBorder: 'border-blue-500/40',
    badgeBg: 'bg-blue-950/80',
    badgeBorder: 'border-blue-500/40',
    waxSealGradient: 'from-blue-700 via-indigo-500 to-amber-200',
    waxSealInner: 'bg-[#091b3e]',
    waxSealText: 'text-sky-200',
    previewColor: '#0e2246'
  },
  'blush-rose': {
    id: 'blush-rose',
    nameFa: 'عاجی ابریشمی و رزگلد (روشن)',
    nameEn: 'Silk Cashmere & Dusty Rose',
    isDark: false,
    bgGradient: 'theme-cashmere',
    cardBg: 'bg-[#faf6ee]/95',
    envelopeBg: 'bg-[#f4ede0]',
    envelopeBorder: 'border-amber-700/35',
    accentGradient: 'from-amber-600 via-rose-700 to-yellow-800',
    glowColor: 'rgba(180, 83, 9, 0.15)',
    borderColor: 'border-amber-700/25',
    textColor: 'text-[#2a1a12]',
    subtextColor: 'text-[#614736]',
    pageHeadingColor: 'text-[#2a1a12]',
    pageSubheadingColor: 'text-[#8A4A32]',
    coupleNamesColor: 'text-[#2a1a12]',
    ampersandColor: 'text-[#BE123C]',
    instructionTextColor: 'text-[#614736]',
    navBtnBg: 'bg-[#2a1a12]/90 hover:bg-[#4a2e20]',
    navBtnText: 'text-[#faf6ee]',
    navBtnBorder: 'border-amber-700/40',
    badgeBg: 'bg-[#efe6d5]',
    badgeBorder: 'border-amber-700/30',
    waxSealGradient: 'from-rose-700 via-amber-600 to-amber-400',
    waxSealInner: 'bg-[#4a1523]',
    waxSealText: 'text-amber-100',
    previewColor: '#f4ede0'
  }
};
