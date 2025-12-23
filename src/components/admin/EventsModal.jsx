'use client';

import { useState, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight, Save } from 'lucide-react';
import dynamic from 'next/dynamic';
import Button from '@components/admin/ui/Button';
import Input from '@components/admin/ui/Input';
import Textarea from '@components/admin/ui/Textarea';
import toast from 'react-hot-toast';

const TiptapEditor = dynamic(() => import('@components/admin/editor/TiptapEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
    </div>
  ),
});

export default function EventsModal({ isOpen, onClose, onSubmit, initialData = null, isLoading = false }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentLang, setCurrentLang] = useState('az');
  const [formData, setFormData] = useState({
    title: { az: '', en: '' },
    excerpt: { az: '', en: '' },
    content: { az: '', en: '' },
    location: { az: '', en: '' },
    organizer: { az: '', en: '' },
    coverImage: '',
    eventDate: '',
    eventTime: '',
    category: 'conference',
    tags: [],
    registrationRequired: false,
    registrationLink: '',
    capacity: '',
    seo: {
      metaTitle: { az: '', en: '' },
      metaDescription: { az: '', en: '' },
      keywords: [],
    },
  });
  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.coverImage) {
        const imageUrl = initialData.coverImage.startsWith('http') 
          ? initialData.coverImage 
          : `http://localhost:3001${initialData.coverImage}`;
        setCoverImagePreview(imageUrl);
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (file) => {
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      const response = await fetch('http://localhost:3001/api/admin/events/upload-image', {
        method: 'POST',
        body: uploadFormData,
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        const imageUrl = result.data.url.startsWith('http') 
          ? result.data.url 
          : `http://localhost:3001${result.data.url}`;
        return imageUrl;
      }
      throw new Error('Upload failed');
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Şəkil yüklənmədi');
      throw error;
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.seo.keywords.includes(keywordInput.trim())) {
      setFormData({
        ...formData,
        seo: {
          ...formData.seo,
          keywords: [...formData.seo.keywords, keywordInput.trim()],
        },
      });
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword) => {
    setFormData({
      ...formData,
      seo: {
        ...formData.seo,
        keywords: formData.seo.keywords.filter((k) => k !== keyword),
      },
    });
  };

  const validateStep1 = () => {
    if (!formData.title.az || !formData.title.en) {
      toast.error('Başlıq hər iki dildə doldurulmalıdır');
      return false;
    }
    if (!formData.content.az || !formData.content.en) {
      toast.error('Məzmun hər iki dildə doldurulmalıdır');
      return false;
    }
    if (!formData.eventDate) {
      toast.error('Tədbir tarixi doldurulmalıdır');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!coverImageFile && !coverImagePreview) {
      toast.error('Əsas şəkil yüklənməlidir');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    const submitData = new FormData();
    
    submitData.append('title', JSON.stringify(formData.title));
    submitData.append('excerpt', JSON.stringify(formData.excerpt));
    submitData.append('content', JSON.stringify(formData.content));
    submitData.append('location', JSON.stringify(formData.location));
    submitData.append('organizer', JSON.stringify(formData.organizer));
    submitData.append('eventDate', formData.eventDate);
    submitData.append('eventTime', formData.eventTime);
    submitData.append('category', formData.category);
    submitData.append('tags', JSON.stringify(formData.tags));
    submitData.append('registrationRequired', formData.registrationRequired.toString());
    submitData.append('registrationLink', formData.registrationLink);
    submitData.append('capacity', formData.capacity);
    submitData.append('seo', JSON.stringify(formData.seo));
    
    if (coverImageFile) {
      submitData.append('coverImage', coverImageFile);
    } else if (formData.coverImage) {
      submitData.append('existingCoverImage', formData.coverImage);
    }

    await onSubmit(submitData);
  };

  const handleClose = () => {
    setCurrentStep(1);
    setCurrentLang('az');
    setFormData({
      title: { az: '', en: '' },
      excerpt: { az: '', en: '' },
      content: { az: '', en: '' },
      location: { az: '', en: '' },
      organizer: { az: '', en: '' },
      coverImage: '',
      eventDate: '',
      eventTime: '',
      category: 'conference',
      tags: [],
      registrationRequired: false,
      registrationLink: '',
      capacity: '',
      seo: {
        metaTitle: { az: '', en: '' },
        metaDescription: { az: '', en: '' },
        keywords: [],
      },
    });
    setCoverImageFile(null);
    setCoverImagePreview('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-secondary/20 backdrop-blur-sm" onClick={handleClose}></div>
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white w-full h-full max-w-7xl max-h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-6">
              <h2 className="text-2xl font-bold text-secondary font-montserrat">
                {initialData ? 'Tədbiri Redaktə Et' : 'Yeni Tədbir Yarat'}
              </h2>
              <div className="flex items-center gap-3 text-sm font-medium">
                <span className={`px-4 py-1.5 rounded-full transition-colors ${currentStep === 1 ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-gray-100 text-gray-500'}`}>
                  1. Məzmun
                </span>
                <span className="text-gray-300">→</span>
                <span className={`px-4 py-1.5 rounded-full transition-colors ${currentStep === 2 ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-gray-100 text-gray-500'}`}>
                  2. Parametrlər
                </span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-secondary"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 px-8 py-4 border-b border-gray-100 bg-gray-50/50">
            <span className="text-sm font-semibold text-secondary">Dil seçimi:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentLang('az')}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm ${
                  currentLang === 'az'
                    ? 'bg-secondary text-white ring-2 ring-secondary ring-offset-2'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                🇦🇿 AZ
              </button>
              <button
                onClick={() => setCurrentLang('en')}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm ${
                  currentLang === 'en'
                    ? 'bg-secondary text-white ring-2 ring-secondary ring-offset-2'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                🇬🇧 EN
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {currentStep === 1 ? (
              <div className="space-y-8 max-w-5xl mx-auto">
                <Input
                  label={`Başlıq (${currentLang.toUpperCase()})`}
                  required
                  value={formData.title[currentLang]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: { ...formData.title, [currentLang]: e.target.value },
                    })
                  }
                  placeholder="Tədbir başlığı"
                  className="text-lg"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input
                    label="Tədbir Tarixi"
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  />
                  <Input
                    label="Tədbir Saatı"
                    type="time"
                    value={formData.eventTime}
                    onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input
                    label={`Yer (${currentLang.toUpperCase()})`}
                    value={formData.location[currentLang]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location, [currentLang]: e.target.value },
                      })
                    }
                    placeholder="Tədbir yeri"
                  />
                  <Input
                    label={`Təşkilatçı (${currentLang.toUpperCase()})`}
                    value={formData.organizer[currentLang]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        organizer: { ...formData.organizer, [currentLang]: e.target.value },
                      })
                    }
                    placeholder="Təşkilatçı adı"
                  />
                </div>

                <Textarea
                  label={`Qısa məzmun (${currentLang.toUpperCase()})`}
                  rows={3}
                  value={formData.excerpt[currentLang]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      excerpt: { ...formData.excerpt, [currentLang]: e.target.value },
                    })
                  }
                  placeholder="Tədbirın qısa təsviri"
                />

                <div>
                  <label className="block text-sm font-bold text-secondary mb-3">
                    Məzmun ({currentLang.toUpperCase()}) <span className="text-red-500">*</span>
                  </label>
                  <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                    <TiptapEditor
                      content={formData.content[currentLang]}
                      onChange={(html) =>
                        setFormData({
                          ...formData,
                          content: { ...formData.content, [currentLang]: html },
                        })
                      }
                      onImageUpload={handleImageUpload}
                      minHeight={500}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8 max-w-4xl mx-auto">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <label className="block text-sm font-bold text-secondary mb-4">
                    Əsas Şəkil <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-start gap-6">
                    <div className="flex-1">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-white hover:bg-gray-50 hover:border-primary transition-all">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <p className="text-sm text-gray-500"><span className="font-semibold text-primary">Yükləmək üçün toxunun</span></p>
                          <p className="text-xs text-gray-400">PNG, JPG (MAX. 5MB)</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {coverImagePreview && (
                      <div className="relative w-48 h-32 rounded-xl overflow-hidden shadow-md border border-gray-200 group">
                        <img
                          src={coverImagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setCoverImageFile(null);
                            setCoverImagePreview('');
                          }}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="text-white" size={24} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-secondary mb-2">
                    Kateqoriya <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-secondary transition-all outline-none"
                  >
                    <option value="conference">🎤 Konfrans</option>
                    <option value="seminar">📚 Seminar</option>
                    <option value="workshop">🛠️ Workshop</option>
                    <option value="ceremony">🎓 Mərasim</option>
                    <option value="competition">🏆 Müsabiqə</option>
                    <option value="other">📌 Digər</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-center h-full">
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-xl w-full hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.registrationRequired}
                        onChange={(e) => setFormData({ ...formData, registrationRequired: e.target.checked })}
                        className="w-5 h-5 text-primary rounded focus:ring-primary border-gray-300"
                      />
                      <span className="font-medium text-secondary">Qeydiyyat tələb olunur</span>
                    </label>
                  </div>
                  <Input
                    label="İştirakçı sayı"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="Maksimum iştirakçı sayı"
                  />
                </div>

                {formData.registrationRequired && (
                  <Input
                    label="Qeydiyyat linki"
                    type="url"
                    value={formData.registrationLink}
                    onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                    placeholder="https://..."
                  />
                )}

                <div>
                  <label className="block text-sm font-bold text-secondary mb-2">Teqlər</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-secondary"
                      placeholder="Teq əlavə et və Enter basın"
                    />
                    <Button onClick={addTag} variant="secondary">
                      Əlavə et
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-2 border border-primary/10"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-500 transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                  <h3 className="text-lg font-bold text-secondary mb-6">SEO Parametrləri</h3>
                  
                  <div className="space-y-6">
                    <Input
                      label={`Meta Başlıq (${currentLang.toUpperCase()})`}
                      value={formData.seo.metaTitle[currentLang]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seo: {
                            ...formData.seo,
                            metaTitle: { ...formData.seo.metaTitle, [currentLang]: e.target.value },
                          },
                        })
                      }
                      placeholder="SEO üçün meta başlıq"
                    />

                    <Textarea
                      label={`Meta Təsvir (${currentLang.toUpperCase()})`}
                      rows={2}
                      value={formData.seo.metaDescription[currentLang]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seo: {
                            ...formData.seo,
                            metaDescription: {
                              ...formData.seo.metaDescription,
                              [currentLang]: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder="SEO üçün meta təsvir"
                    />

                    <div>
                      <label className="block text-sm font-bold text-secondary mb-2">
                        Açar sözlər
                      </label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={keywordInput}
                          onChange={(e) => setKeywordInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-secondary"
                          placeholder="Açar söz əlavə et və Enter basın"
                        />
                        <Button onClick={addKeyword} variant="secondary">
                          Əlavə et
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.seo.keywords.map((keyword) => (
                          <span
                            key={keyword}
                            className="px-3 py-1 bg-secondary/5 text-secondary rounded-full text-sm font-medium flex items-center gap-2 border border-secondary/10"
                          >
                            {keyword}
                            <button
                              type="button"
                              onClick={() => removeKeyword(keyword)}
                              className="hover:text-red-500 transition-colors"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-8 py-5 border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm">
            <Button variant="outline" onClick={handleClose}>
              Ləğv et
            </Button>
            
            <div className="flex items-center gap-3">
              {currentStep === 2 && (
                <Button variant="secondary" onClick={handleBack}>
                  <ArrowLeft size={18} className="mr-2" />
                  Geri
                </Button>
              )}
              
              {currentStep === 1 ? (
                <Button onClick={handleNext}>
                  Növbəti
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} loading={isLoading}>
                  <Save size={18} className="mr-2" />
                  {initialData ? 'Yenilə' : 'Yarat'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
