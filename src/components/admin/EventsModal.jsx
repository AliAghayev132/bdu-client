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
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
      <div className="absolute inset-0 bg-black/50" onClick={handleClose}></div>
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white w-full h-full max-w-7xl max-h-[95vh] rounded-xl shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-xl">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">
                {initialData ? 'Tədbirı Redaktə Et' : 'Yeni Tədbir Yarat'}
              </h2>
              <div className="flex items-center gap-2 text-sm">
                <span className={`px-3 py-1 rounded-full ${currentStep === 1 ? 'bg-white text-green-600' : 'bg-green-500'}`}>
                  1. Məzmun
                </span>
                <span className="text-green-200">→</span>
                <span className={`px-3 py-1 rounded-full ${currentStep === 2 ? 'bg-white text-green-600' : 'bg-green-500'}`}>
                  2. Parametrlər
                </span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-3 border-b border-gray-200 bg-gray-50">
            <span className="text-sm font-medium text-gray-700">Dil:</span>
            <button
              onClick={() => setCurrentLang('az')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentLang === 'az'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              🇦🇿 AZ
            </button>
            <button
              onClick={() => setCurrentLang('en')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentLang === 'en'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              🇬🇧 EN
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {currentStep === 1 ? (
              <div className="space-y-6 max-w-5xl mx-auto">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Məzmun ({currentLang.toUpperCase()}) <span className="text-red-500">*</span>
                  </label>
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
            ) : (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Əsas Şəkil <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700 file:cursor-pointer"
                  />
                  {coverImagePreview && (
                    <div className="mt-4 relative inline-block">
                      <img
                        src={coverImagePreview}
                        alt="Cover preview"
                        className="w-full max-w-2xl h-64 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCoverImageFile(null);
                          setCoverImagePreview('');
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kateqoriya <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                  >
                    <option value="conference">🎤 Konfrans</option>
                    <option value="seminar">📚 Seminar</option>
                    <option value="workshop">🛠️ Workshop</option>
                    <option value="ceremony">🎓 Mərasim</option>
                    <option value="competition">🏆 Müsabiqə</option>
                    <option value="other">📌 Digər</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.registrationRequired}
                        onChange={(e) => setFormData({ ...formData, registrationRequired: e.target.checked })}
                        className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Qeydiyyat tələb olunur</span>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teqlər</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-2"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">SEO Parametrləri</h3>
                  
                  <div className="space-y-4">
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Açar sözlər
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={keywordInput}
                          onChange={(e) => setKeywordInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                          >
                            {keyword}
                            <button
                              type="button"
                              onClick={() => removeKeyword(keyword)}
                              className="hover:text-red-600"
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

          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <Button variant="outline" onClick={handleClose}>
              Ləğv et
            </Button>
            
            <div className="flex items-center gap-3">
              {currentStep === 2 && (
                <Button variant="secondary" onClick={handleBack}>
                  <ArrowLeft size={20} className="mr-2" />
                  Geri
                </Button>
              )}
              
              {currentStep === 1 ? (
                <Button onClick={handleNext}>
                  Növbəti
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} loading={isLoading}>
                  <Save size={20} className="mr-2" />
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
