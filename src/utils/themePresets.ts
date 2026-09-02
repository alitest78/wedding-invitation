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
  envelopeTopFlap?: string;
  envelopeBottomFlap?: string;
  envelopeSideFlap?: string;
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
    nameFa: 'سبز مریم‌گلی و عاجی (روشن)',
    nameEn: 'Ivory Sage & Champagne Gold (Light)',
    isDark: false,
    bgGradient: 'theme-sage',
    cardBg: 'bg-[#FCFAF6]/95',
    envelopeBg: 'bg-[#EAE5D9]',
    envelopeBorder: 'border-[#B89355]/45',
    envelopeTopFlap: 'linear-gradient(to bottom, rgba(244, 239, 230, 0.99) 0%, rgba(228, 221, 209, 0.98) 100%)',
    envelopeBottomFlap: 'linear-gradient(to top, rgba(234, 227, 215, 0.99) 0%, rgba(246, 241, 233, 0.96) 100%)',
    envelopeSideFlap: 'linear-gradient(to right, rgba(230, 222, 210, 0.98) 0%, rgba(240, 234, 224, 0.95) 100%)',
    accentGradient: 'from-[#1C221A] via-[#946F29] to-[#C59B3F]',
    glowColor: 'rgba(184, 147, 85, 0.28)',
    borderColor: 'border-[#B89355]/35',
    textColor: 'text-[#1C221A]',
    subtextColor: 'text-[#475243]',
    pageHeadingColor: 'text-[#182016]',
    pageSubheadingColor: 'text-[#946F29]',
    coupleNamesColor: 'text-[#151D14]',
    ampersandColor: 'text-[#B88728]',
    instructionTextColor: 'text-[#3E4A3A]',
    navBtnBg: 'bg-[#FFFFFF]/90 hover:bg-[#F2ECE1]',
    navBtnText: 'text-[#1C221A]',
    navBtnBorder: 'border-[#B89355]/40',
    badgeBg: 'bg-[#F2ECE0]',
    badgeBorder: 'border-[#B89355]/35',
    waxSealGradient: 'from-[#8C232E] via-[#B22234] to-[#F5C042]',
    waxSealInner: 'bg-[#61141C]',
    waxSealText: 'text-[#FFE8A3]',
    previewColor: '#DCE4D6'
  },
  'gold-ivory': {
    id: 'gold-ivory',
    nameFa: 'عاجی و طلای ۲۴ عیار (روشن)',
    nameEn: 'Royal Pearl Ivory & 24K Gold (Light)',
    isDark: false,
    bgGradient: 'theme-ivory',
    cardBg: 'bg-[#FDFAF4]/95',
    envelopeBg: 'bg-[#F3EDE0]',
    envelopeBorder: 'border-[#C2984A]/45',
    envelopeTopFlap: 'linear-gradient(to bottom, rgba(250, 245, 235, 0.99) 0%, rgba(236, 228, 214, 0.98) 100%)',
    envelopeBottomFlap: 'linear-gradient(to top, rgba(240, 232, 218, 0.99) 0%, rgba(252, 248, 240, 0.96) 100%)',
    envelopeSideFlap: 'linear-gradient(to right, rgba(238, 229, 215, 0.98) 0%, rgba(248, 242, 232, 0.95) 100%)',
    accentGradient: 'from-[#221C12] via-[#9A7024] to-[#C2984A]',
    glowColor: 'rgba(212, 160, 50, 0.3)',
    borderColor: 'border-[#C2984A]/35',
    textColor: 'text-[#241F16]',
    subtextColor: 'text-[#584C38]',
    pageHeadingColor: 'text-[#201A11]',
    pageSubheadingColor: 'text-[#9A7024]',
    coupleNamesColor: 'text-[#1D170E]',
    ampersandColor: 'text-[#C2984A]',
    instructionTextColor: 'text-[#4D412F]',
    navBtnBg: 'bg-[#FFFFFF]/90 hover:bg-[#F5EFE3]',
    navBtnText: 'text-[#241F16]',
    navBtnBorder: 'border-[#C2984A]/40',
    badgeBg: 'bg-[#F5EFE3]',
    badgeBorder: 'border-[#C2984A]/35',
    waxSealGradient: 'from-[#8A5A1A] via-[#BA8A2E] to-[#F7DE8A]',
    waxSealInner: 'bg-[#4A2F0B]',
    waxSealText: 'text-[#FFF0B8]',
    previewColor: '#F5EDE0'
  },
  'blush-rose': {
    id: 'blush-rose',
    nameFa: 'ابریشم پودری و رزگلد (روشن)',
    nameEn: 'Silk Cashmere & Dusty Rose (Light)',
    isDark: false,
    bgGradient: 'theme-cashmere',
    cardBg: 'bg-[#FFF9F6]/95',
    envelopeBg: 'bg-[#F6EBE6]',
    envelopeBorder: 'border-[#C88A8F]/45',
    envelopeTopFlap: 'linear-gradient(to bottom, rgba(254, 246, 243, 0.99) 0%, rgba(242, 228, 224, 0.98) 100%)',
    envelopeBottomFlap: 'linear-gradient(to top, rgba(244, 230, 226, 0.99) 0%, rgba(254, 248, 245, 0.96) 100%)',
    envelopeSideFlap: 'linear-gradient(to right, rgba(242, 227, 222, 0.98) 0%, rgba(252, 244, 240, 0.95) 100%)',
    accentGradient: 'from-[#251918] via-[#A64B56] to-[#BE123C]',
    glowColor: 'rgba(219, 130, 140, 0.28)',
    borderColor: 'border-[#C88A8F]/35',
    textColor: 'text-[#251918]',
    subtextColor: 'text-[#5E4240]',
    pageHeadingColor: 'text-[#221514]',
    pageSubheadingColor: 'text-[#A64B56]',
    coupleNamesColor: 'text-[#1E1110]',
    ampersandColor: 'text-[#BE123C]',
    instructionTextColor: 'text-[#5E4240]',
    navBtnBg: 'bg-[#FFFFFF]/90 hover:bg-[#F9ECE8]',
    navBtnText: 'text-[#251918]',
    navBtnBorder: 'border-[#C88A8F]/40',
    badgeBg: 'bg-[#F8ECE8]',
    badgeBorder: 'border-[#C88A8F]/35',
    waxSealGradient: 'from-[#8E1F30] via-[#B83248] to-[#F9A8B7]',
    waxSealInner: 'bg-[#500E19]',
    waxSealText: 'text-[#FFE8EC]',
    previewColor: '#F6E5E8'
  },
  'emerald-gold': {
    id: 'emerald-gold',
    nameFa: 'عاجی زمردین و طلای ناب (روشن)',
    nameEn: 'Mint Porcelain & Imperial Emerald (Light)',
    isDark: false,
    bgGradient: 'theme-emerald-light',
    cardBg: 'bg-[#F7FCFA]/95',
    envelopeBg: 'bg-[#E3EFEA]',
    envelopeBorder: 'border-[#2D8A68]/40',
    envelopeTopFlap: 'linear-gradient(to bottom, rgba(242, 250, 246, 0.99) 0%, rgba(222, 236, 230, 0.98) 100%)',
    envelopeBottomFlap: 'linear-gradient(to top, rgba(224, 238, 232, 0.99) 0%, rgba(244, 252, 248, 0.96) 100%)',
    envelopeSideFlap: 'linear-gradient(to right, rgba(220, 234, 228, 0.98) 0%, rgba(238, 248, 243, 0.95) 100%)',
    accentGradient: 'from-[#12241C] via-[#1F7A58] to-[#9A7024]',
    glowColor: 'rgba(45, 138, 104, 0.25)',
    borderColor: 'border-[#2D8A68]/30',
    textColor: 'text-[#12241C]',
    subtextColor: 'text-[#325243]',
    pageHeadingColor: 'text-[#0E2018]',
    pageSubheadingColor: 'text-[#1F7A58]',
    coupleNamesColor: 'text-[#0A1A13]',
    ampersandColor: 'text-[#1F7A58]',
    instructionTextColor: 'text-[#2D4D3D]',
    navBtnBg: 'bg-[#FFFFFF]/90 hover:bg-[#EAF4EF]',
    navBtnText: 'text-[#12241C]',
    navBtnBorder: 'border-[#2D8A68]/35',
    badgeBg: 'bg-[#E8F3EE]',
    badgeBorder: 'border-[#2D8A68]/30',
    waxSealGradient: 'from-[#14533D] via-[#1F7A58] to-[#E5C158]',
    waxSealInner: 'bg-[#0B3526]',
    waxSealText: 'text-[#E8F8F0]',
    previewColor: '#D8ECE4'
  },
  'velvet-ruby': {
    id: 'velvet-ruby',
    nameFa: 'مروارید یاقوتی و زرشکی (روشن)',
    nameEn: 'Porcelain Ruby & Rose Quartz (Light)',
    isDark: false,
    bgGradient: 'theme-ruby-light',
    cardBg: 'bg-[#FCF6F8]/95',
    envelopeBg: 'bg-[#F4E3E8]',
    envelopeBorder: 'border-[#B44B68]/40',
    envelopeTopFlap: 'linear-gradient(to bottom, rgba(252, 242, 245, 0.99) 0%, rgba(240, 222, 228, 0.98) 100%)',
    envelopeBottomFlap: 'linear-gradient(to top, rgba(242, 224, 230, 0.99) 0%, rgba(253, 244, 247, 0.96) 100%)',
    envelopeSideFlap: 'linear-gradient(to right, rgba(238, 220, 226, 0.98) 0%, rgba(250, 238, 242, 0.95) 100%)',
    accentGradient: 'from-[#26121A] via-[#9C284D] to-[#BE185D]',
    glowColor: 'rgba(180, 75, 104, 0.25)',
    borderColor: 'border-[#B44B68]/30',
    textColor: 'text-[#26121A]',
    subtextColor: 'text-[#5C3443]',
    pageHeadingColor: 'text-[#220E16]',
    pageSubheadingColor: 'text-[#9C284D]',
    coupleNamesColor: 'text-[#1D0A12]',
    ampersandColor: 'text-[#BE185D]',
    instructionTextColor: 'text-[#542B3A]',
    navBtnBg: 'bg-[#FFFFFF]/90 hover:bg-[#F7E9EE]',
    navBtnText: 'text-[#26121A]',
    navBtnBorder: 'border-[#B44B68]/35',
    badgeBg: 'bg-[#F6E6EC]',
    badgeBorder: 'border-[#B44B68]/30',
    waxSealGradient: 'from-[#78182E] via-[#A82542] to-[#F59E0B]',
    waxSealInner: 'bg-[#480A18]',
    waxSealText: 'text-[#FCE7F3]',
    previewColor: '#F0DCE3'
  },
  'royal-navy': {
    id: 'royal-navy',
    nameFa: 'چینی نقره‌ای و یاقوت کبود (روشن)',
    nameEn: 'Porcelain Sapphire & Platinum (Light)',
    isDark: false,
    bgGradient: 'theme-sapphire-light',
    cardBg: 'bg-[#F7FAFD]/95',
    envelopeBg: 'bg-[#E3ECF6]',
    envelopeBorder: 'border-[#4274A5]/40',
    envelopeTopFlap: 'linear-gradient(to bottom, rgba(244, 248, 253, 0.99) 0%, rgba(222, 233, 245, 0.98) 100%)',
    envelopeBottomFlap: 'linear-gradient(to top, rgba(224, 234, 246, 0.99) 0%, rgba(246, 250, 254, 0.96) 100%)',
    envelopeSideFlap: 'linear-gradient(to right, rgba(220, 232, 244, 0.98) 0%, rgba(240, 247, 253, 0.95) 100%)',
    accentGradient: 'from-[#111C28] via-[#23588C] to-[#2563EB]',
    glowColor: 'rgba(66, 116, 165, 0.25)',
    borderColor: 'border-[#4274A5]/30',
    textColor: 'text-[#111C28]',
    subtextColor: 'text-[#354B62]',
    pageHeadingColor: 'text-[#0E1722]',
    pageSubheadingColor: 'text-[#23588C]',
    coupleNamesColor: 'text-[#0B131D]',
    ampersandColor: 'text-[#2563EB]',
    instructionTextColor: 'text-[#2C4158]',
    navBtnBg: 'bg-[#FFFFFF]/90 hover:bg-[#E9F1F9]',
    navBtnText: 'text-[#111C28]',
    navBtnBorder: 'border-[#4274A5]/35',
    badgeBg: 'bg-[#E7F0F8]',
    badgeBorder: 'border-[#4274A5]/30',
    waxSealGradient: 'from-[#1E3A8A] via-[#2563EB] to-[#F59E0B]',
    waxSealInner: 'bg-[#0F1E4A]',
    waxSealText: 'text-[#DBEAFE]',
    previewColor: '#DCE6F2'
  }
};

