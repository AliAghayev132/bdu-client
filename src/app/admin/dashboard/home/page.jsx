'use client';

// React
import { useState } from 'react';

// API
import {
  useGetHomePageQuery,
  useAddSlideMutation,
  useUpdateSlideMutation,
  useDeleteSlideMutation,
  useReorderSlidesMutation,
  useAddPrideMutation,
  useUpdatePrideMutation,
  useDeletePrideMutation,
} from '@store/api/homePageApi';

// UI Components
import { Card, Button, Modal, Input } from '@components/admin/ui';
import AdminPageHeader from '@components/admin/AdminPageHeader';

// Icons
import {
  Plus, Edit, Trash2, Image, Video, GripVertical, Eye, EyeOff, Award, Layers,
  ChevronUp, ChevronDown,
} from 'lucide-react';

// Utilities
import toast from 'react-hot-toast';
import { confirmDialog } from '@utils/confirmDialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function HomeManagementPage() {
  const [activeTab, setActiveTab] = useState('slides');
  const [slideModal, setSlideModal] = useState({ isOpen: false, data: null, index: null });
  const [prideModal, setPrideModal] = useState({ isOpen: false, data: null, index: null });
  const [lang, setLang] = useState('az');

  const { data: homePage, isLoading } = useGetHomePageQuery();
  const [addSlide, { isLoading: addingSlide }] = useAddSlideMutation();
  const [updateSlide, { isLoading: updatingSlide }] = useUpdateSlideMutation();
  const [deleteSlide] = useDeleteSlideMutation();
  const [addPride, { isLoading: addingPride }] = useAddPrideMutation();
  const [updatePride, { isLoading: updatingPride }] = useUpdatePrideMutation();
  const [deletePride] = useDeletePrideMutation();
  const [reorderSlides] = useReorderSlidesMutation();

  // ============ Slide Handlers ============
  const handleSlideSubmit = async (formData) => {
    try {
      if (slideModal.index !== null) {
        await updateSlide({ slideIndex: slideModal.index, formData }).unwrap();
        toast.success('Slayd yeniləndi');
      } else {
        await addSlide(formData).unwrap();
        toast.success('Slayd əlavə edildi');
      }
      setSlideModal({ isOpen: false, data: null, index: null });
    } catch (error) {
      toast.error(error?.data?.message?.message || 'Xəta baş verdi');
    }
  };

  const handleMoveSlide = async (fromIndex, direction) => {
    const toIndex = fromIndex + direction;
    if (toIndex < 0 || toIndex >= slides.length) return;

    const reordered = [...slides];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    try {
      await reorderSlides(reordered.map(s => s._id)).unwrap();
      toast.success('Slayd mövqeyi dəyişdirildi');
    } catch {
      toast.error('Mövqe dəyişdirmə xətası');
    }
  };

  const handleDeleteSlide = async (index) => {
    const result = await confirmDialog({
      title: 'Slaydı sil?',
      text: 'Bu slayd birdəfəlik silinəcək.',
    });
    if (result.isConfirmed) {
      try {
        await deleteSlide(index).unwrap();
        toast.success('Slayd silindi');
      } catch {
        toast.error('Xəta baş verdi');
      }
    }
  };

  // ============ Pride Handlers ============
  const handlePrideSubmit = async (formData) => {
    try {
      if (prideModal.index !== null) {
        await updatePride({ prideIndex: prideModal.index, formData }).unwrap();
        toast.success('Fəxr yeniləndi');
      } else {
        await addPride(formData).unwrap();
        toast.success('Fəxr əlavə edildi');
      }
      setPrideModal({ isOpen: false, data: null, index: null });
    } catch (error) {
      toast.error(error?.data?.message?.message || 'Xəta baş verdi');
    }
  };

  const handleDeletePride = async (index) => {
    const result = await confirmDialog({
      title: 'Fəxri sil?',
      text: 'Bu fəxr birdəfəlik silinəcək.',
    });
    if (result.isConfirmed) {
      try {
        await deletePride(index).unwrap();
        toast.success('Fəxr silindi');
      } catch {
        toast.error('Xəta baş verdi');
      }
    }
  };

  const slides = homePage?.slides || [];
  const prides = homePage?.prides || [];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-10 bg-gray-200 rounded animate-pulse w-1/3" />
        <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Ana Səhifə İdarəsi"
        description="Ana səhifə slaydlarını və fəxrlərimiz bölməsini idarə edin"
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('slides')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'slides'
              ? 'border-secondary text-secondary'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Layers size={18} />
          Slaydlar ({slides.length})
        </button>
        <button
          onClick={() => setActiveTab('prides')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'prides'
              ? 'border-secondary text-secondary'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Award size={18} />
          Fəxrlərimiz ({prides.length})
        </button>
      </div>

      {/* Slides Tab */}
      {activeTab === 'slides' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-secondary">Slaydlar</h2>
            <Button onClick={() => setSlideModal({ isOpen: true, data: null, index: null })}>
              <Plus size={18} className="mr-2" />
              Yeni Slayd
            </Button>
          </div>

          {slides.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Layers size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Hələ slayd yoxdur</p>
              <p className="text-sm mt-1">Yeni slayd əlavə edin</p>
            </div>
          ) : (
            <div className="space-y-3">
              {slides.map((slide, index) => (
                <div
                  key={slide._id || index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  {/* Position + Up/Down */}
                  <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                    <button
                      onClick={() => handleMoveSlide(index, -1)}
                      disabled={index === 0}
                      className={`p-1 rounded transition-colors ${index === 0 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-secondary hover:bg-secondary/10'}`}
                      title="Yuxarı"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <span className="text-xs font-bold text-gray-500 w-6 text-center">{index + 1}</span>
                    <button
                      onClick={() => handleMoveSlide(index, 1)}
                      disabled={index === slides.length - 1}
                      className={`p-1 rounded transition-colors ${index === slides.length - 1 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-secondary hover:bg-secondary/10'}`}
                      title="Aşağı"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>

                  {/* Thumbnail */}
                  <div className="w-32 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    {slide.type === 'image' && slide.image ? (
                      <img
                        src={`${API_URL}${slide.image}`}
                        alt={slide.alt?.az || ''}
                        className="w-full h-full object-cover"
                      />
                    ) : slide.poster ? (
                      <img
                        src={`${API_URL}${slide.poster}`}
                        alt="Video poster"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video size={24} className="text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Info — title + subtitle birlikdə */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        slide.type === 'image'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {slide.type === 'image' ? 'Şəkil' : 'Video'}
                      </span>
                      {slide.year && (
                        <span className="text-xs text-gray-500">{slide.year}</span>
                      )}
                    </div>
                    <h3 className="font-medium text-secondary truncate">
                      {slide.title?.az || 'Başlıqsız'}
                    </h3>
                    {slide.subtitle?.az && (
                      <p className="text-sm text-gray-500 truncate">
                        {slide.subtitle.az}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setSlideModal({ isOpen: true, data: slide, index })}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Redaktə et"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteSlide(index)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Prides Tab */}
      {activeTab === 'prides' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-secondary">Fəxrlərimiz</h2>
            <Button onClick={() => setPrideModal({ isOpen: true, data: null, index: null })}>
              <Plus size={18} className="mr-2" />
              Yeni Fəxr
            </Button>
          </div>

          {prides.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Award size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Hələ fəxr yoxdur</p>
              <p className="text-sm mt-1">Yeni fəxr əlavə edin</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {prides.map((pride, index) => (
                <div
                  key={pride._id || index}
                  className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all"
                >
                  {/* Image */}
                  <div className="aspect-square bg-gray-200 relative">
                    {pride.image ? (
                      <img
                        src={`${API_URL}${pride.image}`}
                        alt={pride.fullName?.az || ''}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image size={32} className="text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-secondary text-sm truncate">
                      {pride.fullName?.az || 'Adsız'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {pride.title?.az || ''}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => setPrideModal({ isOpen: true, data: pride, index })}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Redaktə et"
                      >
                        <Edit size={14} />
                        Redaktə
                      </button>
                      <button
                        onClick={() => handleDeletePride(index)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 size={14} />
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Slide Modal */}
      <SlideFormModal
        isOpen={slideModal.isOpen}
        onClose={() => setSlideModal({ isOpen: false, data: null, index: null })}
        slide={slideModal.data}
        slideIndex={slideModal.index}
        totalSlides={slides.length}
        onSubmit={handleSlideSubmit}
        isLoading={addingSlide || updatingSlide}
        lang={lang}
        setLang={setLang}
      />

      {/* Pride Modal */}
      <PrideFormModal
        isOpen={prideModal.isOpen}
        onClose={() => setPrideModal({ isOpen: false, data: null, index: null })}
        pride={prideModal.data}
        onSubmit={handlePrideSubmit}
        isLoading={addingPride || updatingPride}
        lang={lang}
        setLang={setLang}
      />
    </div>
  );
}

// ============ Slide Form Modal ============
function SlideFormModal({ isOpen, onClose, slide, slideIndex, totalSlides, onSubmit, isLoading, lang, setLang }) {
  const [type, setType] = useState(slide?.type || 'image');
  const [titleAz, setTitleAz] = useState(slide?.title?.az || '');
  const [titleEn, setTitleEn] = useState(slide?.title?.en || '');
  const [subtitleAz, setSubtitleAz] = useState(slide?.subtitle?.az || '');
  const [subtitleEn, setSubtitleEn] = useState(slide?.subtitle?.en || '');
  const [altAz, setAltAz] = useState(slide?.alt?.az || '');
  const [altEn, setAltEn] = useState(slide?.alt?.en || '');
  const [linkAz, setLinkAz] = useState(slide?.link?.az || '');
  const [linkEn, setLinkEn] = useState(slide?.link?.en || '');
  const [year, setYear] = useState(slide?.year || '');
  const [order, setOrder] = useState(slide?.order ?? (slideIndex ?? totalSlides ?? 0));
  const [textPosition, setTextPosition] = useState(slide?.textPosition || 'bottom-left');
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [posterFile, setPosterFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  // Reset form when modal opens/closes
  const resetForm = () => {
    setType(slide?.type || 'image');
    setTitleAz(slide?.title?.az || '');
    setTitleEn(slide?.title?.en || '');
    setSubtitleAz(slide?.subtitle?.az || '');
    setSubtitleEn(slide?.subtitle?.en || '');
    setAltAz(slide?.alt?.az || '');
    setAltEn(slide?.alt?.en || '');
    setLinkAz(slide?.link?.az || '');
    setLinkEn(slide?.link?.en || '');
    setYear(slide?.year || '');
    setOrder(slide?.order ?? (slideIndex ?? totalSlides ?? 0));
    setTextPosition(slide?.textPosition || 'bottom-left');
    setImageFile(null);
    setVideoFile(null);
    setPosterFile(null);
    setShowPreview(false);
    setImagePreviewUrl(null);
  };

  // Image preview URL — fayl seçildikdə local preview yarat
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
    } else {
      setImagePreviewUrl(null);
    }
  };

  // Preview üçün şəkil URL
  const previewImageSrc = imagePreviewUrl
    || (slide?.image ? `${API_URL}${slide.image}` : null);

  const previewTitle = lang === 'az' ? titleAz : titleEn;
  const previewSubtitle = lang === 'az' ? subtitleAz : subtitleEn;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Required field validation
    const missing = [];
    if (!titleAz.trim()) missing.push('Başlıq (AZ)');
    if (!titleEn.trim()) missing.push('Title (EN)');
    if (!slide && type === 'image' && !imageFile) missing.push('Şəkil');
    if (!slide && type === 'video' && !videoFile) missing.push('Video');

    if (missing.length > 0) {
      toast.error(`Zəhmət olmasa doldurun: ${missing.join(', ')}`);
      return;
    }

    const formData = new FormData();
    formData.append('type', type);
    formData.append('title', JSON.stringify({ az: titleAz, en: titleEn }));
    formData.append('subtitle', JSON.stringify({ az: subtitleAz, en: subtitleEn }));
    formData.append('alt', JSON.stringify({ az: altAz, en: altEn }));
    formData.append('link', JSON.stringify({ az: linkAz, en: linkEn }));
    formData.append('year', year);
    formData.append('order', order);
    formData.append('textPosition', textPosition);

    if (imageFile) formData.append('image', imageFile);
    if (videoFile) formData.append('video', videoFile);
    if (posterFile) formData.append('poster', posterFile);

    onSubmit(formData);
  };

  // Mövqe seçimləri
  const positionCount = slide ? totalSlides : totalSlides + 1;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => { resetForm(); onClose(); }}
      title={slide ? 'Slaydı Redaktə Et' : 'Yeni Slayd'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Language Toggle + Preview Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setLang('az')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                lang === 'az' ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🇦🇿 AZ
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                lang === 'en' ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🇬🇧 EN
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              showPreview ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            <Eye size={16} />
            {showPreview ? 'Önizləməni gizlə' : 'Önizləmə'}
          </button>
        </div>

        {/* Live Preview */}
        {showPreview && (
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-900 relative aspect-[16/7]">
            {previewImageSrc ? (
              <img src={previewImageSrc} alt="" className="w-full h-full object-cover opacity-80" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <Image size={48} className="text-gray-600" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className={`absolute p-6 text-white ${
              textPosition === 'bottom-left' ? 'bottom-0 left-0' :
              textPosition === 'bottom-center' ? 'bottom-0 left-0 right-0 text-center' :
              textPosition === 'bottom-right' ? 'bottom-0 right-0 text-right' :
              textPosition === 'center-left' ? 'top-1/2 left-0 -translate-y-1/2' :
              textPosition === 'center' ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center' :
              textPosition === 'center-right' ? 'top-1/2 right-0 -translate-y-1/2 text-right' :
              'bottom-0 left-0'
            }`}>
              {year && (
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium mb-3">
                  {year}
                </span>
              )}
              <h3 className="text-xl font-bold leading-tight mb-1">
                {previewTitle || 'Slayd başlığı...'}
              </h3>
              {previewSubtitle && (
                <p className="text-sm text-white/80">{previewSubtitle}</p>
              )}
            </div>
          </div>
        )}

        {/* Type Select + Position in one row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Növ</label>
            <div className="flex gap-3">
              <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                type === 'image' ? 'border-secondary bg-secondary/5' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input type="radio" name="type" value="image" checked={type === 'image'} onChange={() => setType('image')} className="hidden" />
                <Image size={20} />
                <span className="text-sm font-medium">Şəkil</span>
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                type === 'video' ? 'border-secondary bg-secondary/5' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input type="radio" name="type" value="video" checked={type === 'video'} onChange={() => setType('video')} className="hidden" />
                <Video size={20} />
                <span className="text-sm font-medium">Video</span>
              </label>
            </div>
          </div>

          {/* Position / Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mövqe</label>
            <select
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value))}
              className="w-full p-3 rounded-xl border-2 border-gray-200 text-sm font-medium focus:border-secondary focus:outline-none"
            >
              {Array.from({ length: positionCount }, (_, i) => (
                <option key={i} value={i}>
                  {i + 1}{i === 0 ? '-ci (ilk)' : i === positionCount - 1 ? `-ci (son)` : `-ci`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Title */}
        {lang === 'az' ? (
          <Input label="Başlıq (AZ)" value={titleAz} onChange={(e) => setTitleAz(e.target.value)} required />
        ) : (
          <Input label="Title (EN)" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required />
        )}

        {/* Subtitle */}
        {lang === 'az' ? (
          <Input label="Alt başlıq (AZ)" value={subtitleAz} onChange={(e) => setSubtitleAz(e.target.value)} />
        ) : (
          <Input label="Subtitle (EN)" value={subtitleEn} onChange={(e) => setSubtitleEn(e.target.value)} />
        )}

        {/* Year + Link in one row */}
        <div className="grid grid-cols-2 gap-4">
          <Input label="İl" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" />
          {lang === 'az' ? (
            <Input label="Keçid linki (AZ)" value={linkAz} onChange={(e) => setLinkAz(e.target.value)} placeholder="/xeberler/..." />
          ) : (
            <Input label="Link (EN)" value={linkEn} onChange={(e) => setLinkEn(e.target.value)} placeholder="/en/news/..." />
          )}
        </div>

        {/* Text Position */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Yazının mövqeyi</label>
          <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
            {[
              { value: 'center-left', label: 'Sol ortada' },
              { value: 'center', label: 'Ortada' },
              { value: 'center-right', label: 'Sağ ortada' },
              { value: 'bottom-left', label: 'Sol aşağı' },
              { value: 'bottom-center', label: 'Orta aşağı' },
              { value: 'bottom-right', label: 'Sağ aşağı' },
            ].map((pos) => (
              <button
                key={pos.value}
                type="button"
                onClick={() => setTextPosition(pos.value)}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                  textPosition === pos.value
                    ? 'bg-secondary text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {pos.label}
              </button>
            ))}
          </div>
        </div>

        {/* Alt text */}
        {lang === 'az' ? (
          <Input label="Alt mətn (AZ)" value={altAz} onChange={(e) => setAltAz(e.target.value)} />
        ) : (
          <Input label="Alt text (EN)" value={altEn} onChange={(e) => setAltEn(e.target.value)} />
        )}

        {/* File Uploads */}
        {type === 'image' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Şəkil {!slide && '*'}</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-secondary/10 file:text-secondary hover:file:bg-secondary/20 cursor-pointer"
            />
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Video {!slide && '*'}</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-secondary/10 file:text-secondary hover:file:bg-secondary/20 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Poster (önizləmə şəkli)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPosterFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-secondary/10 file:text-secondary hover:file:bg-secondary/20 cursor-pointer"
              />
            </div>
          </>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" type="button" onClick={() => { resetForm(); onClose(); }}>
            Ləğv et
          </Button>
          <Button type="submit" loading={isLoading}>
            {slide ? 'Yenilə' : 'Əlavə et'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ============ Pride Form Modal ============
function PrideFormModal({ isOpen, onClose, pride, onSubmit, isLoading, lang, setLang }) {
  const [fullNameAz, setFullNameAz] = useState(pride?.fullName?.az || '');
  const [fullNameEn, setFullNameEn] = useState(pride?.fullName?.en || '');
  const [titleAz, setTitleAz] = useState(pride?.title?.az || '');
  const [titleEn, setTitleEn] = useState(pride?.title?.en || '');
  const [imageFile, setImageFile] = useState(null);

  const resetForm = () => {
    setFullNameAz(pride?.fullName?.az || '');
    setFullNameEn(pride?.fullName?.en || '');
    setTitleAz(pride?.title?.az || '');
    setTitleEn(pride?.title?.en || '');
    setImageFile(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('fullName', JSON.stringify({ az: fullNameAz, en: fullNameEn }));
    formData.append('title', JSON.stringify({ az: titleAz, en: titleEn }));

    if (imageFile) formData.append('image', imageFile);

    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => { resetForm(); onClose(); }}
      title={pride ? 'Fəxri Redaktə Et' : 'Yeni Fəxr'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Language Toggle */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setLang('az')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              lang === 'az' ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🇦🇿 Azərbaycanca
          </button>
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              lang === 'en' ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🇬🇧 English
          </button>
        </div>

        {/* Full Name */}
        {lang === 'az' ? (
          <Input label="Ad Soyad (AZ)" value={fullNameAz} onChange={(e) => setFullNameAz(e.target.value)} required />
        ) : (
          <Input label="Full Name (EN)" value={fullNameEn} onChange={(e) => setFullNameEn(e.target.value)} required />
        )}

        {/* Title */}
        {lang === 'az' ? (
          <Input label="Titul / Vəzifə (AZ)" value={titleAz} onChange={(e) => setTitleAz(e.target.value)} required />
        ) : (
          <Input label="Title / Position (EN)" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required />
        )}

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Şəkil {!pride && '*'}</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-secondary/10 file:text-secondary hover:file:bg-secondary/20 cursor-pointer"
          />
          {pride?.image && !imageFile && (
            <div className="mt-2">
              <img
                src={`${API_URL}${pride.image}`}
                alt={pride.fullName?.az || ''}
                className="w-20 h-20 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" type="button" onClick={() => { resetForm(); onClose(); }}>
            Ləğv et
          </Button>
          <Button type="submit" loading={isLoading}>
            {pride ? 'Yenilə' : 'Əlavə et'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
