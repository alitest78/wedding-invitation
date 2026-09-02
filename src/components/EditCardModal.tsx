import React, { useState } from 'react';
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
  Info
} from 'lucide-react';
import { WeddingDetails, ThemeVariant } from '../types';
import { MUSIC_TRACKS, POEM_PRESETS, CITY_COORDINATES, INITIAL_WEDDING } from '../data/defaultWedding';

interface EditCardModalProps {
  isOpen: boolean;
  wedding: WeddingDetails;
  onSave: (updated: WeddingDetails) => void;
  onClose: () => void;
}

export const EditCardModal: React.FC<EditCardModalProps> = ({
  isOpen,
  wedding,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<WeddingDetails>({ ...wedding });
  const [activeTab, setActiveTab] = useState<'couple' | 'event' | 'venue' | 'poem' | 'music' | 'theme'>('couple');

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        musicUrl: url,
        musicTitle: file.name.replace(/\.[^/.]+$/, ''),
        musicArtist: 'فایل صوتی اختصاصی شما'
      }));
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-vazir">
      <div 
        className="relative w-full max-w-2xl bg-[#20231F] border border-[#C5A46D]/40 rounded-3xl p-5 sm:p-7 text-[#F5F0E8] shadow-2xl overflow-y-auto max-h-[92vh]"
        id="edit-wedding-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#C5A46D]/20 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#3F473D] border border-[#C5A46D]/40 flex items-center justify-center text-[#C5A46D]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-cinzel text-[10px] text-[#C5A46D] tracking-[0.2em] uppercase font-bold">
                CUSTOMIZE INVITATION
              </div>
              <h3 className="font-amiri text-2xl font-bold text-[#F5F0E8]">
                ویرایش و شخصی‌سازی کارت عروسی
              </h3>
              <p className="text-[11px] text-[#E0D8CA] font-vazir">
                مشخصات زوج، تالار، متن شعر، آهنگ و رنگ‌بندی کارت را تغییر دهید
              </p>
            </div>
          </div>

          <button
            id="close-edit-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#E0D8CA] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Omission Notice */}
        <div className="flex items-center gap-2 bg-[#3F473D]/70 border border-[#C5A46D]/30 rounded-xl px-3.5 py-2 text-xs text-[#F5F0E8] mb-5">
          <Info className="w-4 h-4 text-[#C5A46D] flex-shrink-0" />
          <span>هر بخشی که تمایل ندارید در کارت نمایش داده شود، کافیست فیلد آن را خالی بگذارید.</span>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-5 border-b border-[#C5A46D]/20 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('couple')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'couple' ? 'bg-[#C5A46D] text-[#1A1815] font-bold' : 'text-[#E0D8CA] hover:bg-white/5'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>نام عروس و داماد</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('event')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'event' ? 'bg-[#C5A46D] text-[#1A1815] font-bold' : 'text-[#E0D8CA] hover:bg-white/5'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>تاریخ و زمان</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('venue')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'venue' ? 'bg-[#C5A46D] text-[#1A1815] font-bold' : 'text-[#E0D8CA] hover:bg-white/5'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>تالار و لوکیشن</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('poem')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'poem' ? 'bg-[#C5A46D] text-[#1A1815] font-bold' : 'text-[#E0D8CA] hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>شعر و متن دعوت</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('music')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'music' ? 'bg-[#C5A46D] text-[#1A1815] font-bold' : 'text-[#E0D8CA] hover:bg-white/5'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>موسیقی پس‌زمینه</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('theme')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'theme' ? 'bg-[#C5A46D] text-[#1A1815] font-bold' : 'text-[#E0D8CA] hover:bg-white/5'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>تم و ظاهر</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tab 1: Couple Names & Families */}
          {activeTab === 'couple' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                    نام عروس خانم:
                  </label>
                  <input
                    type="text"
                    value={formData.brideName}
                    onChange={(e) => handleChange('brideName', e.target.value)}
                    placeholder="مثال: نیلوفر"
                    className="w-full bg-[#171A16] border border-[#C5A46D]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                    نام آقا داماد:
                  </label>
                  <input
                    type="text"
                    value={formData.groomName}
                    onChange={(e) => handleChange('groomName', e.target.value)}
                    placeholder="مثال: امیرحسین"
                    className="w-full bg-[#171A16] border border-[#C5A46D]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                    خانواده محترم عروس (اختیاری):
                  </label>
                  <input
                    type="text"
                    value={formData.brideParents || ''}
                    onChange={(e) => handleChange('brideParents', e.target.value)}
                    placeholder="مثال: رضایی (خالی بگذارید تا حذف شود)"
                    className="w-full bg-[#171A16] border border-[#C5A46D]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                    خانواده محترم داماد (اختیاری):
                  </label>
                  <input
                    type="text"
                    value={formData.groomParents || ''}
                    onChange={(e) => handleChange('groomParents', e.target.value)}
                    placeholder="مثال: بهرامی (خالی بگذارید تا حذف شود)"
                    className="w-full bg-[#171A16] border border-[#C5A46D]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Date & Times */}
          {activeTab === 'event' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                    تاریخ مراسم به حروف شمسی:
                  </label>
                  <input
                    type="text"
                    value={formData.ceremonyDateShamsi}
                    onChange={(e) => handleChange('ceremonyDateShamsi', e.target.value)}
                    placeholder="مثال: پنج‌شنبه، ۲۴ مهر ۱۴۰۵"
                    className="w-full bg-[#171A16] border border-[#C5A46D]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                    تاریخ میلادی (جهت تایمر معکوس و تقویم):
                  </label>
                  <input
                    type="date"
                    value={formData.ceremonyDateMiladi}
                    onChange={(e) => handleChange('ceremonyDateMiladi', e.target.value)}
                    className="w-full bg-[#171A16] border border-[#C5A46D]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                    ساعت برگزاری جشن:
                  </label>
                  <input
                    type="text"
                    value={formData.ceremonyTime || ''}
                    onChange={(e) => handleChange('ceremonyTime', e.target.value)}
                    placeholder="۱۹:۰۰ الی ۲۳:۳۰"
                    className="w-full bg-[#171A16] border border-[#C5A46D]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                    ساعت پذیرایی عصرانه (اختیاری):
                  </label>
                  <input
                    type="text"
                    value={formData.receptionTime || ''}
                    onChange={(e) => handleChange('receptionTime', e.target.value)}
                    placeholder="ساعت ۱۹:۳۰"
                    className="w-full bg-[#171A16] border border-[#C5A46D]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                    ساعت صرف شام (اختیاری):
                  </label>
                  <input
                    type="text"
                    value={formData.dinnerTime || ''}
                    onChange={(e) => handleChange('dinnerTime', e.target.value)}
                    placeholder="ساعت ۲۱:۴۵"
                    className="w-full bg-[#171A16] border border-[#C5A46D]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Venue & Routing Location */}
          {activeTab === 'venue' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                  نام تالار / باغ تالار:
                </label>
                <input
                  type="text"
                  value={formData.hallName || ''}
                  onChange={(e) => handleChange('hallName', e.target.value)}
                  placeholder="مثال: باغ تالار قصر نیلوفر شیراز"
                  className="w-full bg-[#171A16] border border-[#C5A46D]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                  آدرس دقیق تالار:
                </label>
                <input
                  type="text"
                  value={formData.hallAddress || ''}
                  onChange={(e) => handleChange('hallAddress', e.target.value)}
                  placeholder="شیراز، ابتدای جاده صدرا، کوچه بهارستان ۷"
                  className="w-full bg-[#171A16] border border-[#C5A46D]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
                />
              </div>

              {/* Quick City Presets for Coordinates */}
              <div>
                <label className="block text-xs font-medium text-[#C5A46D] mb-1.5">
                  انتخاب سریع موقعیت شهر تالار برای مسیریاب:
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(CITY_COORDINATES).map(([key, item]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleCitySelect(key as any)}
                      className="px-3 py-1.5 rounded-lg text-xs bg-[#3F473D] hover:bg-[#707563] text-[#F5F0E8] border border-[#C5A46D]/30 cursor-pointer transition-colors"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                    عرض جغرافیایی (Latitude):
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.hallLat}
                    onChange={(e) => handleChange('hallLat', parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#171A16] border border-[#C5A46D]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D] text-left font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                    طول جغرافیایی (Longitude):
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.hallLng}
                    onChange={(e) => handleChange('hallLng', parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#171A16] border border-[#C5A46D]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D] text-left font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Poem & Texts */}
          {activeTab === 'poem' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Poem Presets */}
              <div>
                <label className="block text-xs font-medium text-[#C5A46D] mb-1.5">
                  انتخاب از میان اشعار زیبای پیشنهادی:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {POEM_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleChange('poem', `${p.text}\n(${p.author})`)}
                      className="text-right p-2.5 rounded-xl text-xs bg-[#171A16] hover:bg-[#3F473D] border border-[#C5A46D]/20 text-[#E0D8CA] transition-colors"
                    >
                      <div className="font-bold text-[#C5A46D] mb-0.5">{p.title}</div>
                      <div className="text-[11px] text-[#E0D8CA]/80 line-clamp-2">{p.text}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                  متن شعر یا سرآغاز کارت (اختیاری):
                </label>
                <textarea
                  rows={3}
                  value={formData.poem || ''}
                  onChange={(e) => handleChange('poem', e.target.value)}
                  placeholder="اگر مایلید شعری نمایش داده نشود، این فیلد را پاک کنید"
                  className="w-full bg-[#171A16] border border-[#C5A46D]/30 rounded-xl p-3 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D] leading-relaxed resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                  متن دعوت و خوش‌آمدگویی:
                </label>
                <textarea
                  rows={3}
                  value={formData.invitationNote || ''}
                  onChange={(e) => handleChange('invitationNote', e.target.value)}
                  placeholder="متن دلخواه دعوت مهمانان"
                  className="w-full bg-[#171A16] border border-[#C5A46D]/30 rounded-xl p-3 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D] leading-relaxed resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                  یادداشت و نکات مهمانان (اختیاری):
                </label>
                <textarea
                  rows={2}
                  value={formData.guestNotes || ''}
                  onChange={(e) => handleChange('guestNotes', e.target.value)}
                  placeholder="مثال: پارکینگ اختصاصی در محوطه مهیا می‌باشد"
                  className="w-full bg-[#171A16] border border-[#C5A46D]/30 rounded-xl p-3 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D] leading-relaxed resize-none"
                />
              </div>
            </div>
          )}

          {/* Tab 5: Music selection */}
          {activeTab === 'music' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="text-xs text-[#C5A46D] font-medium">
                انتخاب یا تغییر ترانه پس‌زمینه کارت:
              </div>

              {/* Preloaded tracks list */}
              <div className="space-y-2">
                {MUSIC_TRACKS.map((track) => (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        musicUrl: track.src,
                        musicTitle: track.title,
                        musicArtist: track.artist,
                      }));
                    }}
                    className={`w-full text-right p-3 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                      formData.musicUrl === track.src
                        ? 'bg-[#3F473D] border-[#C5A46D] text-[#F5F0E8] font-bold shadow-md'
                        : 'bg-[#171A16] border-[#C5A46D]/20 text-[#E0D8CA] hover:bg-[#3F473D]/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Music className="w-4 h-4 text-[#C5A46D]" />
                      <div>
                        <div>{track.title}</div>
                        <div className="text-[10px] text-[#E0D8CA]/80 font-normal">{track.artist}</div>
                      </div>
                    </div>
                    {track.isPopular && (
                      <span className="text-[10px] bg-[#C5A46D]/20 text-[#C5A46D] px-2 py-0.5 rounded-full border border-[#C5A46D]/40">
                        منتخب
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Custom URL Input */}
              <div className="pt-2">
                <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                  یا درج لینک مستقیم فایل صوتی (MP3 URL):
                </label>
                <input
                  type="url"
                  value={formData.musicUrl}
                  onChange={(e) => handleChange('musicUrl', e.target.value)}
                  placeholder="https://example.com/song.mp3"
                  className="w-full bg-[#171A16] border border-[#C5A46D]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D] text-left font-mono"
                />
              </div>

              {/* File upload alternative */}
              <div>
                <label className="block text-xs font-medium text-[#C5A46D] mb-1.5">
                  یا بارگذاری فایل آهنگ از دستگاه شما:
                </label>
                <label className="flex items-center justify-center gap-2 bg-[#171A16] hover:bg-[#3F473D]/50 border border-dashed border-[#C5A46D]/40 p-3.5 rounded-xl text-xs text-[#F5F0E8] cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-[#C5A46D]" />
                  <span>انتخاب فایل صوتی MP3 از گوشی یا سیستم</span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Tab 6: Theme and Visuals */}
          {activeTab === 'theme' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-medium text-[#C5A46D] mb-2">
                  طرح و پالت رنگی کارت دعوت:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleChange('theme', 'sage-gold')}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                      formData.theme === 'sage-gold'
                        ? 'bg-[#3F473D] border-[#C5A46D] ring-2 ring-[#C5A46D]/50 text-[#F5F0E8]'
                        : 'bg-[#171A16] border-[#C5A46D]/20 text-[#E0D8CA]'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-[#F5F0E8] text-xs">سبز مریم‌گلی و عاجی (پیش‌فرض مدرن)</div>
                      <div className="text-[10px] text-[#E0D8CA]/80">پس‌زمینه عاجی، کارت سبز مریم‌گلی و خطوط طلایی</div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[#3F473D] border-2 border-[#C5A46D] shadow"></div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChange('theme', 'emerald-gold')}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                      formData.theme === 'emerald-gold'
                        ? 'bg-emerald-950 border-emerald-400 ring-2 ring-emerald-500/50 text-[#F5F0E8]'
                        : 'bg-[#171A16] border-[#C5A46D]/20 text-[#E0D8CA]'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-emerald-300 text-xs">زمرد شاهانه و طلای ناب</div>
                      <div className="text-[10px] text-[#E0D8CA]/80">شکوه زمرد و طلاکاری اصیل ایرانی</div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-800 to-amber-300 shadow"></div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChange('theme', 'gold-ivory')}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                      formData.theme === 'gold-ivory'
                        ? 'bg-stone-900 border-amber-400 ring-2 ring-amber-500/50 text-[#F5F0E8]'
                        : 'bg-[#171A16] border-[#C5A46D]/20 text-[#E0D8CA]'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-amber-300 text-xs">اونیکس و طلای ۲۴ عیار</div>
                      <div className="text-[10px] text-[#E0D8CA]/80">مجلل و چشم‌نواز با جلوه طلای مذاب</div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-300 shadow"></div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChange('theme', 'velvet-ruby')}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                      formData.theme === 'velvet-ruby'
                        ? 'bg-rose-950 border-rose-400 ring-2 ring-rose-500/50 text-[#F5F0E8]'
                        : 'bg-[#171A16] border-[#C5A46D]/20 text-[#E0D8CA]'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-rose-300 text-xs">زرشکی سلطنتی و مروارید</div>
                      <div className="text-[10px] text-[#E0D8CA]/80">مخمل عمیق درباری و گرمای شمع</div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-950 to-pink-400 shadow"></div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChange('theme', 'royal-navy')}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                      formData.theme === 'royal-navy'
                        ? 'bg-blue-950 border-blue-400 ring-2 ring-blue-500/50 text-[#F5F0E8]'
                        : 'bg-[#171A16] border-[#C5A46D]/20 text-[#E0D8CA]'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-blue-300 text-xs">یاقوت کبود و پلاتین نقره‌ای</div>
                      <div className="text-[10px] text-[#E0D8CA]/80">لاجوردی شاهانه و نقره شب</div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-900 to-sky-300 shadow"></div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChange('theme', 'blush-rose')}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                      formData.theme === 'blush-rose'
                        ? 'bg-[#403632] border-[#C5A46D] ring-2 ring-[#C5A46D]/50 text-[#F5F0E8]'
                        : 'bg-[#171A16] border-[#C5A46D]/20 text-[#E0D8CA]'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-amber-200 text-xs">عاجی ابریشمی و رزگلد (روشن)</div>
                      <div className="text-[10px] text-[#E0D8CA]/80">عاجی ملایم و لوکس پودری</div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#f3ebe0] to-[#fda4af] shadow border border-stone-600"></div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons footer */}
          <div className="flex items-center justify-between pt-5 border-t border-[#C5A46D]/20">
            <button
              type="button"
              id="reset-wedding-form-btn"
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-[#E0D8CA] hover:text-rose-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>بازنشانی پیش‌فرض</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-[#E0D8CA] hover:bg-white/5 transition-colors cursor-pointer"
              >
                انصراف
              </button>

              <button
                type="submit"
                id="save-wedding-form-btn"
                className="flex items-center gap-1.5 bg-gradient-to-r from-[#C5A46D] to-[#9E7B3B] text-[#1A1815] font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg transition-all active:scale-95 cursor-pointer hover:brightness-110"
              >
                <Save className="w-4 h-4 text-[#1A1815]" />
                <span>ذخیره تغییرات کارت</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
