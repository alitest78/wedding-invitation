import React, { useState } from 'react';
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
  Info
} from 'lucide-react';
import { WeddingDetails, ThemeVariant } from '../types';
import { MUSIC_TRACKS, POEM_PRESETS, CITY_COORDINATES, INITIAL_WEDDING } from '../data/defaultWedding';
import { THEME_PRESETS } from '../utils/themePresets';

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

  const tabs = [
    { id: 'couple', label: 'عروس و داماد', icon: Heart },
    { id: 'event', label: 'زمان و تاریخ', icon: Calendar },
    { id: 'venue', label: 'تالار و نقشه', icon: MapPin },
    { id: 'poem', label: 'شعر و متن', icon: BookOpen },
    { id: 'music', label: 'موسیقی', icon: Music },
    { id: 'theme', label: 'تم و ظاهر', icon: Palette },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200 font-vazir">
      <motion.div 
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
        className="relative w-full max-w-2xl apple-glass rounded-[32px] p-5 sm:p-7 text-[#F5F0E8] shadow-2xl overflow-y-auto max-h-[92vh] border border-white/10"
        id="edit-wedding-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#C5A46D]/20 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl apple-glass p-0.5 flex items-center justify-center text-[#F5C042] border border-[#C5A46D]/40 shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-cinzel text-[10px] text-[#C5A46D] tracking-[0.25em] uppercase font-bold">
                CUSTOMIZE INVITATION
              </div>
              <h3 className="font-amiri text-2xl font-bold text-[#F5F0E8]">
                ویرایش و شخصی‌سازی کارت عروسی
              </h3>
              <p className="text-[11px] text-[#E0D8CA]">
                مشخصات زوج، تالار، متن شعر، آهنگ و رنگ‌بندی کارت را تغییر دهید
              </p>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.88 }}
            id="close-edit-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#E0D8CA] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Dynamic Omission Notice (Apple Info Pill) */}
        <div className="flex items-center gap-2.5 apple-glass-pill px-4 py-2.5 rounded-2xl text-xs text-[#F5F0E8] mb-5 border border-white/10 shadow-sm">
          <Info className="w-4 h-4 text-[#F5C042] flex-shrink-0" />
          <span>هر بخشی که تمایل ندارید در کارت نمایش داده شود، کافیست فیلد آن را خالی بگذارید.</span>
        </div>

        {/* Tab Navigation (Apple Segmented Bar with Spring Pill) */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-black/40 rounded-2xl border border-white/10 mb-5 text-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap z-10 font-medium ${
                  isActive ? 'text-[#181B16] font-bold' : 'text-[#E0D8CA] hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="edit-modal-active-tab-pill"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    className="absolute inset-0 bg-gradient-to-r from-[#F5C042] to-[#C5A46D] rounded-xl -z-10 shadow-md"
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
                  <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                    نام عروس خانم:
                  </label>
                  <input
                    type="text"
                    value={formData.brideName}
                    onChange={(e) => handleChange('brideName', e.target.value)}
                    className="w-full bg-black/35 border border-[#C5A46D]/35 rounded-xl px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
                    placeholder="مثال: ریحانه"
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
                    className="w-full bg-black/35 border border-[#C5A46D]/35 rounded-xl px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
                    placeholder="مثال: پارسا"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                    خانواده عروس (اختیاری):
                  </label>
                  <input
                    type="text"
                    value={formData.brideParents}
                    onChange={(e) => handleChange('brideParents', e.target.value)}
                    className="w-full bg-black/35 border border-[#C5A46D]/35 rounded-xl px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
                    placeholder="مثال: رضایی"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                    خانواده داماد (اختیاری):
                  </label>
                  <input
                    type="text"
                    value={formData.groomParents}
                    onChange={(e) => handleChange('groomParents', e.target.value)}
                    className="w-full bg-black/35 border border-[#C5A46D]/35 rounded-xl px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
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
                  <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                    تاریخ شمسی مراسم:
                  </label>
                  <input
                    type="text"
                    value={formData.ceremonyDateShamsi}
                    onChange={(e) => handleChange('ceremonyDateShamsi', e.target.value)}
                    className="w-full bg-black/35 border border-[#C5A46D]/35 rounded-xl px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
                    placeholder="مثال: جمعه ۲۴ مهر ماه ۱۴۰۵"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                    تاریخ میلادی (جهت شمارش معکوس):
                  </label>
                  <input
                    type="date"
                    value={formData.ceremonyDateMiladi}
                    onChange={(e) => handleChange('ceremonyDateMiladi', e.target.value)}
                    className="w-full bg-black/35 border border-[#C5A46D]/35 rounded-xl px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                    ساعت کلی جشن:
                  </label>
                  <input
                    type="text"
                    value={formData.ceremonyTime}
                    onChange={(e) => handleChange('ceremonyTime', e.target.value)}
                    className="w-full bg-black/35 border border-[#C5A46D]/35 rounded-xl px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
                    placeholder="۱۹:۰۰ الی ۲۳:۳۰"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                    ساعت پذیرایی (اختیاری):
                  </label>
                  <input
                    type="text"
                    value={formData.receptionTime}
                    onChange={(e) => handleChange('receptionTime', e.target.value)}
                    className="w-full bg-black/35 border border-[#C5A46D]/35 rounded-xl px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
                    placeholder="۱۹:۳۰"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                    ساعت ضیافت شام (اختیاری):
                  </label>
                  <input
                    type="text"
                    value={formData.dinnerTime}
                    onChange={(e) => handleChange('dinnerTime', e.target.value)}
                    className="w-full bg-black/35 border border-[#C5A46D]/35 rounded-xl px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
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
                <span className="text-xs text-[#C5A46D] ml-2">انتخاب سریع شهر:</span>
                {Object.entries(CITY_COORDINATES).map(([key, city]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleCitySelect(key as any)}
                    className="apple-glass text-xs text-[#E0D8CA] hover:text-[#F5C042] px-2.5 py-1 rounded-lg border border-white/10 transition-colors"
                  >
                    {city.name}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                  نام تالار یا باغ تالار:
                </label>
                <input
                  type="text"
                  value={formData.hallName}
                  onChange={(e) => handleChange('hallName', e.target.value)}
                  className="w-full bg-black/35 border border-[#C5A46D]/35 rounded-xl px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
                  placeholder="مثال: باغ تالار رویایی اردیبهشت"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                  آدرس دقیق تالار:
                </label>
                <input
                  type="text"
                  value={formData.hallAddress}
                  onChange={(e) => handleChange('hallAddress', e.target.value)}
                  className="w-full bg-black/35 border border-[#C5A46D]/35 rounded-xl px-3.5 py-2.5 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D]"
                  placeholder="مثال: شیراز، کیلومتر ۵ جاده صدرا..."
                />
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
                    className="w-full bg-black/35 border border-[#C5A46D]/35 rounded-xl px-3.5 py-2.5 text-xs text-[#F5F0E8] font-mono text-left focus:outline-none focus:border-[#C5A46D]"
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
                    className="w-full bg-black/35 border border-[#C5A46D]/35 rounded-xl px-3.5 py-2.5 text-xs text-[#F5F0E8] font-mono text-left focus:outline-none focus:border-[#C5A46D]"
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
                  <label className="text-xs font-medium text-[#C5A46D]">
                    شعر و بیت آغازین کارت:
                  </label>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-[#8C9488]">نمونه‌های آماده:</span>
                    {POEM_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleChange('poem', p.text)}
                        className="apple-glass text-[11px] text-[#E0D8CA] hover:text-[#F5C042] px-2 py-0.5 rounded-md border border-white/10"
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
                  className="w-full bg-black/35 border border-[#C5A46D]/35 rounded-xl p-3 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D] leading-loose resize-none"
                  placeholder="متن شعر..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                  متن دعوت و خوش‌آمدگویی رسمی:
                </label>
                <textarea
                  rows={3}
                  value={formData.invitationNote}
                  onChange={(e) => handleChange('invitationNote', e.target.value)}
                  className="w-full bg-black/35 border border-[#C5A46D]/35 rounded-xl p-3 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D] leading-relaxed resize-none"
                  placeholder="متن خوش‌آمدگویی..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                  یادداشت مهمانان (اختیاری):
                </label>
                <textarea
                  rows={2}
                  value={formData.guestNotes}
                  onChange={(e) => handleChange('guestNotes', e.target.value)}
                  className="w-full bg-black/35 border border-[#C5A46D]/35 rounded-xl p-3 text-xs text-[#F5F0E8] focus:outline-none focus:border-[#C5A46D] leading-relaxed resize-none"
                  placeholder="یادداشت‌های اختصاصی مهمانان..."
                />
              </div>
            </div>
          )}

          {/* Tab 5: Music Selection */}
          {activeTab === 'music' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <label className="block text-xs font-medium text-[#C5A46D] mb-1">
                انتخاب از لیست آهنگ‌های بی‌کلام و رویایی:
              </label>
              <div className="space-y-2">
                {MUSIC_TRACKS.map((track) => (
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
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      formData.musicUrl === track.src
                        ? 'bg-[#C5A46D]/20 border-[#C5A46D] text-[#F5C042] shadow-md'
                        : 'apple-glass border-white/10 text-[#E0D8CA] hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Music className="w-4 h-4" />
                      <div>
                        <div className="text-xs font-bold">{track.title}</div>
                        <div className="text-[10px] opacity-70">{track.artist}</div>
                      </div>
                    </div>
                    {formData.musicUrl === track.src && (
                      <span className="text-[10px] bg-[#C5A46D] text-[#181B16] font-bold px-2 py-0.5 rounded-full">
                        انتخاب شده
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Custom Audio Upload */}
              <div className="pt-3 border-t border-[#C5A46D]/20">
                <label className="block text-xs font-medium text-[#C5A46D] mb-1.5">
                  یا آپلود آهنگ دلخواه (mp3 / m4a):
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 apple-glass-pill px-4 py-2.5 rounded-xl text-xs text-[#F5F0E8] cursor-pointer hover:bg-white/10 transition-colors border border-white/10">
                    <Upload className="w-4 h-4 text-[#F5C042]" />
                    <span>انتخاب فایل موسیقی از دستگاه</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-[#E0D8CA]/70 truncate max-w-xs">
                    {formData.musicTitle}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: Themes */}
          {activeTab === 'theme' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <label className="block text-xs font-medium text-[#C5A46D] mb-2">
                پالت‌های رنگی و طراحی کارت:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.values(THEME_PRESETS).map((t) => (
                  <div
                    key={t.id}
                    onClick={() => handleChange('theme', t.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      formData.theme === t.id
                        ? 'bg-[#C5A46D]/20 border-[#C5A46D] text-[#F5C042] shadow-md'
                        : 'apple-glass border-white/10 text-[#E0D8CA] hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-6 h-6 rounded-full border border-white/30 shadow-md flex-shrink-0"
                        style={{ backgroundColor: t.previewColor }}
                      ></span>
                      <div>
                        <div className="text-xs font-bold text-[#F5F0E8]">{t.nameFa}</div>
                        <div className="text-[10px] opacity-70">{t.nameEn}</div>
                      </div>
                    </div>
                    {formData.theme === t.id && (
                      <span className="text-[10px] bg-[#C5A46D] text-[#181B16] font-bold px-2 py-0.5 rounded-full">
                        فعال
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-5 border-t border-[#C5A46D]/20 flex items-center justify-between gap-3">
            <motion.button
              whileTap={{ scale: 0.94 }}
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-[#8C9488] hover:text-rose-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>بازنشانی پیش‌فرض</span>
            </motion.button>

            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onClose}
                className="apple-glass text-xs text-[#E0D8CA] px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
              >
                انصراف
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                id="save-edit-modal-btn"
                className="flex items-center gap-2 bg-gradient-to-r from-[#F5C042] to-[#C5A46D] text-[#181B16] font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg cursor-pointer"
              >
                <Save className="w-4 h-4 text-[#181B16]" />
                <span>ذخیره تغییرات کارت</span>
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
