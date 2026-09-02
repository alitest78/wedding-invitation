import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Save, 
  RotateCcw, 
  Music, 
  MapPin, 
  BookOpen, 
  Heart, 
  Sparkles, 
  Upload,
  Calendar,
  Clock,
  Palette,
  Info,
  Play,
  Pause,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  Repeat,
  Zap,
  Check,
  Link as LinkIcon,
  MessageSquareHeart,
  Trash2,
  Users,
  CheckCircle2,
  XCircle,
  Search,
  Copy,
  Loader2
} from 'lucide-react';
import { WeddingDetails, ThemeVariant, MusicTrack, RSVPResponse } from '../types';
import { MUSIC_TRACKS, POEM_PRESETS, CITY_COORDINATES, INITIAL_WEDDING } from '../data/defaultWedding';
import { THEME_PRESETS } from '../utils/themePresets';
import { persianAudioEngine } from '../utils/persianAudioEngine';
import { uploadAudioFile, toPersianDigits } from '../utils/cardUtils';

interface EditCardModalProps {
  isOpen: boolean;
  wedding: WeddingDetails;
  rsvps?: RSVPResponse[];
  onDeleteRSVP?: (id: string) => void;
  onSave: (updated: WeddingDetails) => void;
  onClose: () => void;
}

export const EditCardModal: React.FC<EditCardModalProps> = ({
  isOpen,
  wedding,
  rsvps = [],
  onDeleteRSVP,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<WeddingDetails>({ ...wedding });
  const [activeTab, setActiveTab] = useState<'couple' | 'event' | 'venue' | 'poem' | 'music' | 'wishes' | 'theme'>('couple');
  const [previewTrackId, setPreviewTrackId] = useState<string | null>(null);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const [wishSearchQuery, setWishSearchQuery] = useState('');
  const [copiedWishes, setCopiedWishes] = useState(false);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Sync formData when wedding prop updates
  useEffect(() => {
    if (isOpen) {
      setFormData({ ...wedding });
    }
  }, [isOpen, wedding]);

  // Stop preview playback when closing modal or switching away
  useEffect(() => {
    return () => {
      stopPreview();
    };
  }, []);

  const stopPreview = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
    }
    persianAudioEngine.stop();
    setPreviewTrackId(null);
  };

  const handleTogglePreview = (e: React.MouseEvent, track: MusicTrack) => {
    e.stopPropagation();
    if (previewTrackId === track.id) {
      stopPreview();
      return;
    }

    stopPreview();
    setPreviewTrackId(track.id);

    if (track.src.startsWith('synth://')) {
      persianAudioEngine.start(track.title);
    } else if (previewAudioRef.current) {
      previewAudioRef.current.src = track.src;
      previewAudioRef.current.volume = formData.musicVolume ?? 0.85;
      previewAudioRef.current.play().catch(() => {
        persianAudioEngine.start(track.title);
      });
    }
  };

  if (!isOpen) return null;

  const handleChange = (field: keyof WeddingDetails, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCitySelect = (cityKey: keyof typeof CITY_COORDINATES) => {
    const city = CITY_COORDINATES[cityKey];
    setFormData((prev) => ({
      ...prev,
      hallLat: city.lat,
      hallLng: city.lng,
      hallAddress: prev.hallAddress.includes('شیراز') && cityKey !== 'shiraz' 
        ? `${city.name}، ...` 
        : prev.hallAddress
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAudio(true);
    setUploadSuccessMessage(null);
    try {
      const res = await uploadAudioFile(file);
      if (res && res.url) {
        setFormData((prev) => ({
          ...prev,
          musicUrl: res.url,
          musicTitle: res.title || file.name.replace(/\.[^/.]+$/, ''),
          musicArtist: 'فایل صوتی بارگذاری شده شما'
        }));
        setUploadSuccessMessage(`آهنگ «${res.title}» با موفقیت ذخیره و برای کارت تنظیم شد.`);
        setTimeout(() => setUploadSuccessMessage(null), 6000);
      }
    } catch (err) {
      console.error('Failed to upload audio file', err);
    } finally {
      setIsUploadingAudio(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleReset = () => {
    if (window.confirm('آیا مایلید اطلاعات به حالت پیش‌فرض بازگردد؟')) {
      setFormData({ ...INITIAL_WEDDING });
    }
  };

  // RSVP statistics
  const attendingGuests = rsvps.filter(r => r.attending === 'yes');
  const notAttendingGuests = rsvps.filter(r => r.attending === 'no');
  const totalHeadcount = attendingGuests.reduce((sum, item) => sum + (item.guestCount || 1), 0);

  const filteredWishes = rsvps.filter(item => 
    !wishSearchQuery.trim() || 
    item.guestName.toLowerCase().includes(wishSearchQuery.trim().toLowerCase()) ||
    item.congratulationMessage.toLowerCase().includes(wishSearchQuery.trim().toLowerCase())
  );

  const handleCopyAllWishes = () => {
    if (rsvps.length === 0) return;
    const summary = `💌 لیست پیام‌های شادباش و مهمانان جشن عروسی ${formData.brideName} و ${formData.groomName}:
آمار کلی: ${toPersianDigits(attendingGuests.length)} مهمان اعلام حضور کرده‌اند (مجموعاً ${toPersianDigits(totalHeadcount)} نفر)

` + rsvps.map((r, i) => `${i + 1}. ${r.guestName} (${r.attending === 'yes' ? `حاضر - ${toPersianDigits(r.guestCount)} نفر` : 'عدم امکان حضور'}):
"${r.congratulationMessage}"`).join('\n\n');

    navigator.clipboard.writeText(summary);
    setCopiedWishes(true);
    setTimeout(() => setCopiedWishes(false), 2500);
  };

  const tabs = [
    { id: 'couple', label: 'عروس و داماد', icon: Heart },
    { id: 'event', label: 'زمان و تاریخ', icon: Calendar },
    { id: 'venue', label: 'تالار و نقشه', icon: MapPin },
    { id: 'poem', label: 'شعر و متن', icon: BookOpen },
    { id: 'music', label: 'موسیقی', icon: Music },
    { id: 'wishes', label: `پیام‌ها و مهمانان (${toPersianDigits(rsvps.length)})`, icon: MessageSquareHeart },
    { id: 'theme', label: 'تم و ظاهر', icon: Palette },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200 font-vazir">
      <motion.div 
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
        className="relative w-full max-w-2xl bg-[#FAF6EE] rounded-[32px] p-5 sm:p-7 text-[#1C221A] shadow-2xl overflow-y-auto max-h-[92vh] border border-[#B89355]/30"
        id="edit-wedding-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#B89355]/20 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#F0E6D2] p-0.5 flex items-center justify-center text-[#B88728] border border-[#B89355]/40 shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-cinzel text-[10px] text-[#946F29] tracking-[0.25em] uppercase font-bold">
                CUSTOMIZE INVITATION
              </div>
              <h3 className="font-amiri text-2xl font-bold text-[#1C221A]">
                ویرایش و شخصی‌سازی کارت عروسی
              </h3>
              <p className="text-[11px] text-[#556251]">
                مشخصات زوج، تالار، متن شعر، آهنگ و رنگ‌بندی کارت را تغییر دهید
              </p>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.88 }}
            id="close-edit-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#556251] hover:text-[#1C221A] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Dynamic Omission Notice (Apple Info Pill) */}
        <div className="flex items-center gap-2.5 bg-white/70 px-4 py-2.5 rounded-2xl text-xs text-[#1C221A] mb-5 border border-[#B89355]/25 shadow-sm">
          <Info className="w-4 h-4 text-[#B88728] flex-shrink-0" />
          <span>هر بخشی که تمایل ندارید در کارت نمایش داده شود، کافیست فیلد آن را خالی بگذارید.</span>
        </div>

        {/* Tab Navigation (Apple Segmented Bar with Spring Pill) */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-white/60 rounded-2xl border border-[#B89355]/25 mb-5 text-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap z-10 font-medium ${
                  isActive ? 'text-[#1C221A] font-bold' : 'text-[#556251] hover:text-[#1C221A]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="edit-modal-active-tab-pill"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    className="absolute inset-0 bg-gradient-to-r from-[#DFCDA7] to-[#C5A46D] rounded-xl -z-10 shadow-sm"
                  />
                )}
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tab 1: Couple Names & Families */}
          {activeTab === 'couple' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C221A] mb-1">
                    نام عروس خانم:
                  </label>
                  <input
                    type="text"
                    value={formData.brideName}
                    onChange={(e) => handleChange('brideName', e.target.value)}
                    className="w-full bg-white border border-[#B89355]/35 rounded-xl px-3.5 py-2.5 text-xs text-[#1C221A] focus:outline-none focus:border-[#B88728]"
                    placeholder="مثال: ریحانه"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C221A] mb-1">
                    نام آقا داماد:
                  </label>
                  <input
                    type="text"
                    value={formData.groomName}
                    onChange={(e) => handleChange('groomName', e.target.value)}
                    className="w-full bg-white border border-[#B89355]/35 rounded-xl px-3.5 py-2.5 text-xs text-[#1C221A] focus:outline-none focus:border-[#B88728]"
                    placeholder="مثال: پارسا"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C221A] mb-1">
                    خانواده عروس (اختیاری):
                  </label>
                  <input
                    type="text"
                    value={formData.brideParents}
                    onChange={(e) => handleChange('brideParents', e.target.value)}
                    className="w-full bg-white border border-[#B89355]/35 rounded-xl px-3.5 py-2.5 text-xs text-[#1C221A] focus:outline-none focus:border-[#B88728]"
                    placeholder="مثال: رضایی"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C221A] mb-1">
                    خانواده داماد (اختیاری):
                  </label>
                  <input
                    type="text"
                    value={formData.groomParents}
                    onChange={(e) => handleChange('groomParents', e.target.value)}
                    className="w-full bg-white border border-[#B89355]/35 rounded-xl px-3.5 py-2.5 text-xs text-[#1C221A] focus:outline-none focus:border-[#B88728]"
                    placeholder="مثال: تهرانی"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Date and Time */}
          {activeTab === 'event' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C221A] mb-1">
                    تاریخ شمسی مراسم:
                  </label>
                  <input
                    type="text"
                    value={formData.ceremonyDateShamsi}
                    onChange={(e) => handleChange('ceremonyDateShamsi', e.target.value)}
                    className="w-full bg-white border border-[#B89355]/35 rounded-xl px-3.5 py-2.5 text-xs text-[#1C221A] focus:outline-none focus:border-[#B88728]"
                    placeholder="مثال: جمعه ۲۴ مهر ماه ۱۴۰۵"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C221A] mb-1">
                    تاریخ میلادی (جهت شمارش معکوس):
                  </label>
                  <input
                    type="date"
                    value={formData.ceremonyDateMiladi}
                    onChange={(e) => handleChange('ceremonyDateMiladi', e.target.value)}
                    className="w-full bg-white border border-[#B89355]/35 rounded-xl px-3.5 py-2.5 text-xs text-[#1C221A] focus:outline-none focus:border-[#B88728]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1C221A] mb-1">
                    ساعت کلی جشن:
                  </label>
                  <input
                    type="text"
                    value={formData.ceremonyTime}
                    onChange={(e) => handleChange('ceremonyTime', e.target.value)}
                    className="w-full bg-white border border-[#B89355]/35 rounded-xl px-3.5 py-2.5 text-xs text-[#1C221A] focus:outline-none focus:border-[#B88728]"
                    placeholder="۱۹:۰۰ الی ۲۳:۳۰"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C221A] mb-1">
                    ساعت پذیرایی (اختیاری):
                  </label>
                  <input
                    type="text"
                    value={formData.receptionTime}
                    onChange={(e) => handleChange('receptionTime', e.target.value)}
                    className="w-full bg-white border border-[#B89355]/35 rounded-xl px-3.5 py-2.5 text-xs text-[#1C221A] focus:outline-none focus:border-[#B88728]"
                    placeholder="۱۹:۳۰"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C221A] mb-1">
                    ساعت ضیافت شام (اختیاری):
                  </label>
                  <input
                    type="text"
                    value={formData.dinnerTime}
                    onChange={(e) => handleChange('dinnerTime', e.target.value)}
                    className="w-full bg-white border border-[#B89355]/35 rounded-xl px-3.5 py-2.5 text-xs text-[#1C221A] focus:outline-none focus:border-[#B88728]"
                    placeholder="۲۱:۳۰"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Venue & Map */}
          {activeTab === 'venue' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                <span className="text-xs text-[#946F29] font-semibold ml-2">انتخاب سریع شهر:</span>
                {Object.entries(CITY_COORDINATES).map(([key, city]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleCitySelect(key as any)}
                    className="bg-white text-xs text-[#1C221A] hover:text-[#946F29] px-2.5 py-1 rounded-lg border border-[#B89355]/25 transition-colors shadow-sm"
                  >
                    {city.name}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C221A] mb-1">
                  نام تالار یا باغ تالار:
                </label>
                <input
                  type="text"
                  value={formData.hallName}
                  onChange={(e) => handleChange('hallName', e.target.value)}
                  className="w-full bg-white border border-[#B89355]/35 rounded-xl px-3.5 py-2.5 text-xs text-[#1C221A] focus:outline-none focus:border-[#B88728]"
                  placeholder="مثال: باغ تالار رویایی اردیبهشت"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C221A] mb-1">
                  آدرس دقیق تالار:
                </label>
                <input
                  type="text"
                  value={formData.hallAddress}
                  onChange={(e) => handleChange('hallAddress', e.target.value)}
                  className="w-full bg-white border border-[#B89355]/35 rounded-xl px-3.5 py-2.5 text-xs text-[#1C221A] focus:outline-none focus:border-[#B88728]"
                  placeholder="مثال: شیراز، کیلومتر ۵ جاده صدرا..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C221A] mb-1">
                    عرض جغرافیایی (Latitude):
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.hallLat}
                    onChange={(e) => handleChange('hallLat', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-[#B89355]/35 rounded-xl px-3.5 py-2.5 text-xs text-[#1C221A] font-mono text-left focus:outline-none focus:border-[#B88728]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1C221A] mb-1">
                    طول جغرافیایی (Longitude):
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.hallLng}
                    onChange={(e) => handleChange('hallLng', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-[#B89355]/35 rounded-xl px-3.5 py-2.5 text-xs text-[#1C221A] font-mono text-left focus:outline-none focus:border-[#B88728]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Poem & Notes */}
          {activeTab === 'poem' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#1C221A]">
                    شعر و بیت آغازین کارت:
                  </label>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-[#556251]">نمونه‌های آماده:</span>
                    {POEM_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleChange('poem', p.text)}
                        className="bg-white text-[11px] text-[#1C221A] hover:text-[#946F29] px-2 py-0.5 rounded-md border border-[#B89355]/25 shadow-sm"
                      >
                        {p.title}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  rows={3}
                  value={formData.poem}
                  onChange={(e) => handleChange('poem', e.target.value)}
                  className="w-full bg-white border border-[#B89355]/35 rounded-xl p-3 text-xs text-[#1C221A] focus:outline-none focus:border-[#B88728] leading-loose resize-none"
                  placeholder="متن شعر..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C221A] mb-1">
                  متن دعوت و خوش‌آمدگویی رسمی:
                </label>
                <textarea
                  rows={3}
                  value={formData.invitationNote}
                  onChange={(e) => handleChange('invitationNote', e.target.value)}
                  className="w-full bg-white border border-[#B89355]/35 rounded-xl p-3 text-xs text-[#1C221A] focus:outline-none focus:border-[#B88728] leading-relaxed resize-none"
                  placeholder="متن خوش‌آمدگویی..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C221A] mb-1">
                  یادداشت مهمانان (اختیاری):
                </label>
                <textarea
                  rows={2}
                  value={formData.guestNotes}
                  onChange={(e) => handleChange('guestNotes', e.target.value)}
                  className="w-full bg-white border border-[#B89355]/35 rounded-xl p-3 text-xs text-[#1C221A] focus:outline-none focus:border-[#B88728] leading-relaxed resize-none"
                  placeholder="یادداشت‌های اختصاصی مهمانان..."
                />
              </div>
            </div>
          )}

          {/* Tab 5: Music Selection & Auto-Play Settings */}
          {activeTab === 'music' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <audio ref={previewAudioRef} onEnded={() => setPreviewTrackId(null)} />

              {/* Autoplay & Playback Behavior Settings Section */}
              <div className="bg-white/80 rounded-2xl p-4 border border-[#B89355]/30 space-y-3.5 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-[#946F29] border-b border-[#B89355]/20 pb-2">
                  <Zap className="w-4 h-4 text-[#B88728]" />
                  <span>تنظیمات هوشمند پخش خودکار نوای جشن:</span>
                </div>

                {/* Switch 1: Auto-play on Site Entry */}
                <div className="flex items-start justify-between gap-3 pt-1">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold text-[#1C221A] flex items-center gap-1.5 cursor-pointer">
                      <span>پخش خودکار با ورود به سایت (اولین لمس)</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                        پیشنهادی
                      </span>
                    </label>
                    <p className="text-[11px] text-[#556251] leading-relaxed">
                      به محض ورود مهمان به صفحه دعوت یا با اولین لمس صفحه، نوای جشن به آرامی پخش شود.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        autoPlayOnEnter: !(prev.autoPlayOnEnter ?? true)
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      (formData.autoPlayOnEnter ?? true) ? 'bg-[#B88728]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        (formData.autoPlayOnEnter ?? true) ? 'translate-x-0' : '-translate-x-5'
                      }`}
                    />
                  </button>
                </div>

                {/* Switch 2: Auto-play on Envelope Open */}
                <div className="flex items-start justify-between gap-3 pt-2 border-t border-[#B89355]/15">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold text-[#1C221A] cursor-pointer">
                      پخش خودکار هنگام گشودن پاکت
                    </label>
                    <p className="text-[11px] text-[#556251] leading-relaxed">
                      با لمس مهر و موم موم و باز شدن انیمیشن پاکت، موسیقی شروع شود.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        autoPlayOnOpen: !prev.autoPlayOnOpen
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      formData.autoPlayOnOpen ? 'bg-[#B88728]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        formData.autoPlayOnOpen ? 'translate-x-0' : '-translate-x-5'
                      }`}
                    />
                  </button>
                </div>

                {/* Switch 3: Continuous Loop */}
                <div className="flex items-start justify-between gap-3 pt-2 border-t border-[#B89355]/15">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold text-[#1C221A] cursor-pointer">
                      تکرار مداوم موسیقی (پخش پیوسته)
                    </label>
                    <p className="text-[11px] text-[#556251] leading-relaxed">
                      پس از پایان قطعه موسیقی، مجدداً از ابتدا تکرار شود.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        musicLoop: !(prev.musicLoop ?? true)
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      (formData.musicLoop ?? true) ? 'bg-[#B88728]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        (formData.musicLoop ?? true) ? 'translate-x-0' : '-translate-x-5'
                      }`}
                    />
                  </button>
                </div>

                {/* Volume Level Control */}
                <div className="pt-2 border-t border-[#B89355]/15">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-[#1C221A] flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-[#B88728]" />
                      <span>میزان بلندی صدای پیش‌فرض:</span>
                    </span>
                    <span className="font-mono text-[11px] text-[#946F29] font-bold">
                      {Math.round((formData.musicVolume ?? 0.85) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={formData.musicVolume ?? 0.85}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setFormData((prev) => ({ ...prev, musicVolume: val }));
                        if (previewAudioRef.current) previewAudioRef.current.volume = val;
                        persianAudioEngine.setVolume(val);
                      }}
                      className="w-full h-1.5 bg-black/10 rounded-lg appearance-none cursor-pointer accent-[#B88728]"
                    />
                    <div className="flex gap-1">
                      {[
                        { label: 'ملایم', val: 0.5 },
                        { label: 'استاندارد', val: 0.85 },
                        { label: 'کامل', val: 1.0 },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, musicVolume: preset.val }));
                            if (previewAudioRef.current) previewAudioRef.current.volume = preset.val;
                            persianAudioEngine.setVolume(preset.val);
                          }}
                          className={`text-[10px] px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                            Math.abs((formData.musicVolume ?? 0.85) - preset.val) < 0.05
                              ? 'bg-[#B88728] text-white border-[#B88728] font-bold'
                              : 'bg-white text-[#556251] border-[#B89355]/30 hover:bg-amber-50'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Track Selection List with Live Preview */}
              <div>
                <label className="block text-xs font-bold text-[#1C221A] mb-2">
                  انتخاب قطعه موسیقی (برای شنیدن روی دکمه پخش لمس کنید):
                </label>
                <div className="space-y-2">
                  {MUSIC_TRACKS.map((track) => {
                    const isSelected = formData.musicUrl === track.src;
                    const isCurrentlyPreviewing = previewTrackId === track.id;

                    return (
                      <div
                        key={track.id}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            musicUrl: track.src,
                            musicTitle: track.title,
                            musicArtist: track.artist
                          }));
                        }}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                          isSelected
                            ? 'bg-[#B88728]/15 border-[#B88728] text-[#855E1C] shadow-sm'
                            : 'bg-white border-[#B89355]/20 text-[#1C221A] hover:bg-amber-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Live Preview Play/Pause button */}
                          <button
                            type="button"
                            title={isCurrentlyPreviewing ? 'توقف پیش‌شنوایی' : 'پیش‌شنوایی این آهنگ'}
                            onClick={(e) => handleTogglePreview(e, track)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform ${
                              isCurrentlyPreviewing
                                ? 'bg-[#946F29] text-white shadow-md scale-105'
                                : 'bg-black/5 hover:bg-[#B88728]/20 text-[#B88728]'
                            }`}
                          >
                            {isCurrentlyPreviewing ? (
                              <Pause className="w-3.5 h-3.5 fill-current" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            )}
                          </button>

                          <div className="min-w-0">
                            <div className="text-xs font-bold truncate">{track.title}</div>
                            <div className="text-[10px] text-[#556251] truncate">{track.artist}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {isCurrentlyPreviewing && (
                            <span className="text-[9px] bg-[#B88728] text-white font-bold px-2 py-0.5 rounded-full animate-pulse">
                              در حال پخش...
                            </span>
                          )}
                          {isSelected && (
                            <span className="text-[10px] bg-[#1C221A] text-white font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>انتخاب کارت</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom Audio Upload & Direct URL */}
              <div className="pt-3 border-t border-[#B89355]/20 space-y-3">
                <label className="block text-xs font-bold text-[#1C221A]">
                  یا قرار دادن فایل صوتی دلخواه (آپلود دائمی یا لینک مستقیم):
                </label>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  {/* File Upload Button */}
                  <label className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-colors border border-[#B89355]/30 shadow-sm flex-shrink-0 ${
                    isUploadingAudio ? 'bg-amber-100 text-[#855E1C] cursor-wait' : 'bg-white text-[#1C221A] hover:bg-amber-50'
                  }`}>
                    {isUploadingAudio ? (
                      <Loader2 className="w-4 h-4 text-[#B88728] animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 text-[#B88728]" />
                    )}
                    <span>{isUploadingAudio ? 'در حال ذخیره‌سازی دائمی آهنگ...' : 'آپلود فایل صوتی (MP3/M4A)'}</span>
                    <input
                      type="file"
                      accept="audio/*"
                      disabled={isUploadingAudio}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Direct MP3 URL Input */}
                  <div className="relative flex-1">
                    <LinkIcon className="w-3.5 h-3.5 text-[#B88728] absolute right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={formData.musicUrl.startsWith('synth://') || formData.musicUrl.startsWith('blob:') ? '' : formData.musicUrl}
                      onChange={(e) => {
                        const url = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          musicUrl: url || 'synth://shirazi',
                          musicTitle: url ? 'آهنگ اختصاصی اینترنتی' : 'جینگو جینگ ساز میاد',
                          musicArtist: 'موزیک انتخابی شما'
                        }));
                      }}
                      placeholder="یا آدرس مستقیم اینترنتی موزیک (https://...mp3)"
                      className="w-full bg-white border border-[#B89355]/30 rounded-xl pr-9 pl-3 py-2 text-xs text-[#1C221A] focus:outline-none focus:border-[#B88728]"
                      dir="ltr"
                    />
                  </div>
                </div>

                {uploadSuccessMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{uploadSuccessMessage}</span>
                  </motion.div>
                )}

                <div className="text-[11px] text-[#556251] bg-white/70 p-3 rounded-xl border border-[#B89355]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      type="button"
                      onClick={(e) => handleTogglePreview(e, {
                        id: 'custom_active_preview',
                        title: formData.musicTitle,
                        artist: formData.musicArtist,
                        src: formData.musicUrl
                      })}
                      className="w-7 h-7 rounded-full bg-[#B88728] text-white flex items-center justify-center flex-shrink-0 shadow-sm hover:scale-105 transition-transform"
                      title="تست شنیداری قطعه انتخابی فعلی"
                    >
                      {previewTrackId === 'custom_active_preview' ? (
                        <Pause className="w-3 h-3 fill-current" />
                      ) : (
                        <Play className="w-3 h-3 fill-current ml-0.5" />
                      )}
                    </button>
                    <div className="truncate">
                      <span className="font-medium">قطعه فعال کارت: </span>
                      <strong className="text-[#1C221A]">{formData.musicTitle}</strong>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#946F29] bg-[#B88728]/10 px-2 py-0.5 rounded-full self-start sm:self-auto">
                    {formData.musicArtist}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: Wishes & RSVPs Management */}
          {activeTab === 'wishes' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-white/80 p-3 rounded-2xl border border-[#B89355]/25 text-center shadow-sm">
                  <div className="text-[10px] text-[#556251] font-medium mb-0.5">کل پیام‌ها</div>
                  <div className="text-lg font-bold font-mono text-[#1C221A] tabular-nums">
                    {toPersianDigits(rsvps.length)}
                  </div>
                </div>

                <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 text-center shadow-sm">
                  <div className="text-[10px] text-emerald-700 font-medium mb-0.5">حاضرین قطعی</div>
                  <div className="text-lg font-bold font-mono text-emerald-800 tabular-nums">
                    {toPersianDigits(attendingGuests.length)} <span className="text-[10px] font-normal font-vazir">({toPersianDigits(totalHeadcount)} نفر)</span>
                  </div>
                </div>

                <div className="bg-rose-50/80 p-3 rounded-2xl border border-rose-200 text-center shadow-sm">
                  <div className="text-[10px] text-rose-700 font-medium mb-0.5">عذرخواهی</div>
                  <div className="text-lg font-bold font-mono text-rose-800 tabular-nums">
                    {toPersianDigits(notAttendingGuests.length)}
                  </div>
                </div>
              </div>

              {/* Search & Actions Header */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-[#B88728] absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={wishSearchQuery}
                    onChange={(e) => setWishSearchQuery(e.target.value)}
                    placeholder="جستجو در نام مهمان یا متن پیام..."
                    className="w-full bg-white border border-[#B89355]/30 rounded-xl pr-9 pl-3 py-2 text-xs text-[#1C221A] focus:outline-none focus:border-[#B88728]"
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleCopyAllWishes}
                  disabled={rsvps.length === 0}
                  className="flex items-center gap-1.5 bg-white hover:bg-amber-50 text-[#1C221A] border border-[#B89355]/30 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer shadow-sm flex-shrink-0 disabled:opacity-40"
                  title="کپی کردن متن تمام پیام‌ها برای چاپ یا ارسال"
                >
                  <Copy className="w-3.5 h-3.5 text-[#B88728]" />
                  <span>{copiedWishes ? 'کپی شد!' : 'کپی لیست'}</span>
                </motion.button>
              </div>

              {/* Wishes List */}
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {filteredWishes.length === 0 ? (
                  <div className="text-center py-8 bg-white/60 rounded-2xl border border-dashed border-[#B89355]/30 text-xs text-[#556251]">
                    {rsvps.length === 0 ? 'هنوز پیامی ثبت نشده است.' : 'پیامی با این عبارت یافت نشد.'}
                  </div>
                ) : (
                  filteredWishes.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-3.5 rounded-2xl border border-[#B89355]/20 shadow-sm flex items-start justify-between gap-3 hover:border-[#B89355]/40 transition-colors"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs text-[#1C221A]">{item.guestName}</span>
                          {item.attending === 'yes' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              <span>حضور دارند ({toPersianDigits(item.guestCount || 1)} نفر)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-medium">
                              <XCircle className="w-2.5 h-2.5" />
                              <span>امکان حضور ندارند</span>
                            </span>
                          )}
                          <span className="text-[10px] text-[#556251]/70">{item.createdAt}</span>
                        </div>
                        <p className="text-xs text-[#333E2F] leading-relaxed break-words">
                          {item.congratulationMessage}
                        </p>
                      </div>

                      {onDeleteRSVP && (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => {
                            if (window.confirm(`آیا از حذف پیام «${item.guestName}» اطمینان دارید؟`)) {
                              onDeleteRSVP(item.id);
                            }
                          }}
                          className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer"
                          title="حذف این پیام"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </motion.button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab 7: Themes */}
          {activeTab === 'theme' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <label className="block text-xs font-semibold text-[#1C221A] mb-2">
                پالت‌های رنگی و طراحی کارت:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.values(THEME_PRESETS).map((t) => (
                  <div
                    key={t.id}
                    onClick={() => handleChange('theme', t.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      formData.theme === t.id
                        ? 'bg-[#B88728]/15 border-[#B88728] text-[#855E1C] shadow-sm'
                        : 'bg-white border-[#B89355]/20 text-[#1C221A] hover:bg-amber-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-6 h-6 rounded-full border border-black/10 shadow-sm flex-shrink-0"
                        style={{ backgroundColor: t.previewColor }}
                      ></span>
                      <div>
                        <div className="text-xs font-bold text-[#1C221A]">{t.nameFa}</div>
                        <div className="text-[10px] text-[#556251]">{t.nameEn}</div>
                      </div>
                    </div>
                    {formData.theme === t.id && (
                      <span className="text-[10px] bg-[#B88728] text-white font-bold px-2 py-0.5 rounded-full">
                        فعال
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-5 border-t border-[#B89355]/20 flex items-center justify-between gap-3">
            <motion.button
              whileTap={{ scale: 0.94 }}
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-[#556251] hover:text-rose-600 transition-colors cursor-pointer font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>بازنشانی پیش‌فرض</span>
            </motion.button>

            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onClose}
                className="bg-white text-xs text-[#1C221A] font-medium px-4 py-2.5 rounded-xl hover:bg-amber-50 transition-colors cursor-pointer border border-[#B89355]/30 shadow-sm"
              >
                انصراف
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                id="save-edit-modal-btn"
                className="flex items-center gap-2 bg-gradient-to-r from-[#B88728] to-[#946F29] text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
              >
                <Save className="w-4 h-4 text-white" />
                <span>ذخیره تغییرات کارت</span>
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
