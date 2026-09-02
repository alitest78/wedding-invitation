import { WeddingDetails, MusicTrack, RSVPResponse } from '../types';

export const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'shirazi-jingo-jing',
    title: 'جینگو جینگ ساز میاد (شادباش شیرازی)',
    artist: 'موسیقی سنتی شاد پیوند (سنتور و تمبک ۶/۸)',
    src: 'synth://shirazi',
    isPopular: true,
  },
  {
    id: 'classic-persian-wedding',
    title: 'کوچه تنگی و مبارک‌باد عروسی',
    artist: 'شادباش اصیل پیوند و وصال ایرانی',
    src: 'synth://mobarakbad',
    isPopular: true,
  },
  {
    id: 'romantic-piano-waltz',
    title: 'والس رویایی و کلاسیک وصال',
    artist: 'پیانو و ارکسترال رمانتیک عروسی',
    src: 'synth://waltz',
    isPopular: true,
  },
  {
    id: 'romantic-piano-tar',
    title: 'نغمه‌های دل‌انگیز تار و سنتور ماهور',
    artist: 'همنوازی زنده دستگاه ماهور و اصفهان',
    src: 'synth://santur',
    isPopular: true,
  },
  {
    id: 'gole-sangam-soft',
    title: 'نغمه بی‌کلام گل سنگم (عاشقانه و آرامش‌بخش)',
    artist: 'سنتور و پیانو احساسی',
    src: 'synth://golesangam',
  },
  {
    id: 'persian-setar-live',
    title: 'تکنوازی سه‌تار و نوای اصیل ایرانی',
    artist: 'موسیقی فاخر و سنتی',
    src: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Persian_Classical_Music_Setar.ogg',
  }
];

export const POEM_PRESETS = [
  {
    title: 'در پیوند مهر و ماه',
    text: 'از صدای سخن عشق ندیدم خوشتر\nیادگاری که در این گنبد دوار بماند',
    author: 'حافظ شیرازی'
  },
  {
    title: 'آغاز همسفری',
    text: 'دست در دست هم نهاده‌ایم به مهر\nتا بنا سازیم آشیانه‌ای پر از نور و لبخند\nحضور گرم شما، شکوه این پیوند را دوچندان خواهد کرد.',
    author: 'شعر پیوند'
  },
  {
    title: 'بهاران پیوند',
    text: 'عشق را در پرنیان نگاه تو دیدم\nو زیباترین غزل هستی را با نام تو سرودم\nدر خجسته‌ترین روز زندگیمان چشم‌انتظار قدوم پرمهرتان هستیم.',
    author: 'شعر عاشقانه'
  },
  {
    title: 'شور شیراز و ترنم عشق',
    text: 'جینگو جینگ ساز میاد، از بالای شیراز میاد...\nشادی این بزم خجسته را با حضور پرمهر شما جشن می‌گیریم.',
    author: 'ترانه دل‌انگیز'
  }
];

export const CITY_COORDINATES = {
  shiraz: { name: 'شیراز', lat: 29.625, lng: 52.530 },
  tehran: { name: 'تهران', lat: 35.7219, lng: 51.3347 },
  isfahan: { name: 'اصفهان', lat: 32.6546, lng: 51.6680 },
  mashhad: { name: 'مشهد', lat: 36.2972, lng: 59.6067 },
  tabriz: { name: 'تبریز', lat: 38.0800, lng: 46.2919 },
  shomal: { name: 'شمال / متل قو', lat: 36.7118, lng: 51.2062 }
};

export const INITIAL_WEDDING: WeddingDetails = {
  brideName: 'نیلوفر',
  groomName: 'امیرحسین',
  brideTitle: 'دوشیزه گرامی',
  groomTitle: 'شاه‌داماد عزیز',
  brideParents: 'خانواده محترم بهرامی',
  groomParents: 'خانواده محترم رضایی',
  ceremonyDateShamsi: 'پنج‌شنبه، ۲۴ مهر ۱۴۰۵',
  ceremonyDateMiladi: '2026-10-15',
  ceremonyTime: 'ساعت ۱۹:۰۰ الی ۲۳:۳۰',
  receptionTime: 'پذیرایی عصرانه: ساعت ۱۹:۳۰',
  dinnerTime: 'صرف شام: ساعت ۲۱:۴۵',
  hallName: 'باغ تالار قصر نیلوفر شیراز',
  hallAddress: 'شیراز، ابتدای جاده صدرا، بعد از پل راه‌آهن، کوچه بهارستان ۷',
  hallLat: 29.6914,
  hallLng: 52.4812,
  poem: 'از صدای سخن عشق ندیدم خوشتر\nیادگاری که در این گنبد دوار بماند\n(حافظ شیرازی)',
  invitationNote: 'با کمال مسرت و افتخار، شما را به جشن پیوند آسمانی فرزندانمان دعوت می‌نماییم. حضور سبز و گرمابخش شما، محفل ما را پر از شادی و خاطره‌های ماندگار خواهد ساخت.',
  dressCode: '',
  guestNotes: '• پارکینگ اختصاصی در محوطه باغ تالار مهیا می‌باشد.\n• به همراه داشتن لبخند و آرزوی خیر، بهترین هدیه شماست.',
  theme: 'sage-gold',
  envelopeColor: '#3F473D',
  musicUrl: 'synth://shirazi',
  musicTitle: 'جینگو جینگ ساز میاد (شادباش شیرازی)',
  musicArtist: 'موسیقی سنتی شاد پیوند (سنتور و تمبک ۶/۸)',
  autoPlayOnOpen: true,
  autoPlayOnEnter: true,
  musicVolume: 0.85,
  musicLoop: true,
  contactPhone: '09120000000'
};

export const INITIAL_RSVPS: RSVPResponse[] = [];
