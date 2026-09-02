export type ThemeVariant = 'sage-gold' | 'gold-ivory' | 'emerald-gold' | 'velvet-ruby' | 'royal-navy' | 'blush-rose';

export interface WeddingDetails {
  id?: string;
  brideName: string;
  groomName: string;
  brideTitle?: string;
  groomTitle?: string;
  brideParents: string;
  groomParents: string;
  ceremonyDateShamsi: string; // e.g. "پنج‌شنبه ۲۴ مهر ۱۴۰۵"
  ceremonyDateMiladi: string; // e.g. "2026-10-15"
  ceremonyTime: string; // e.g. "۱۹:۰۰ الی ۲۳:۳۰"
  receptionTime?: string; // e.g. "ساعت ۲۱:۰۰"
  dinnerTime?: string; // e.g. "ساعت ۲۲:۰۰"
  hallName: string;
  hallAddress: string;
  hallLat: number;
  hallLng: number;
  poem: string;
  poemAuthor?: string;
  invitationNote: string;
  dressCode?: string;
  guestNotes?: string;
  theme: ThemeVariant;
  envelopeColor: string;
  musicUrl: string;
  musicTitle: string;
  musicArtist: string;
  autoPlayOnOpen: boolean;
  contactPhone?: string;
}

export interface RSVPResponse {
  id: string;
  guestName: string;
  attending: 'yes' | 'no';
  guestCount: number;
  congratulationMessage: string;
  createdAt: string;
  likes?: number;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  src: string;
  isPopular?: boolean;
}
