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

export default function PageModal({ isOpen, onClose, onSubmit, initialData = null, isLoading = false }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentLang, setCurrentLang] = useState('az');
  const [formData, setFormData] = useState({
    path: { az: '', en: '' },
    title: { az: '', en: '' },
    description: { az: '', en: '' },
    content: { az: '', en: '' },
    pageType: 'static',
    seo: {
      metaTitle: { az: '', en: '' },
      metaDescription: { az: '', en: '' },
      keywords: [],
      ogImage: '',
    },
  });
  const [keywordInput, setKeywordInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
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
    if (!formData.path.az || !formData.path.en) {
      toast.error('Path hər iki dildə doldurulmalıdır');
      return false;
    }
    if (!formData.title.az || !formData.title.en) {
      toast.error('Başlıq hər iki dildə doldurulmalıdır');
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
    if (!validateStep1()) return;

    await onSubmit(formData);
  };

  const handleClose = () => {
    setCurrentStep(1);
    setCurrentLang('az');
    setFormData({
      path: { az: '', en: '' },
      title: { az: '', en: '' },
      description: { az: '', en: '' },
      content: { az: '', en: '' },
      pageType: 'static',
      seo: {
        metaTitle: { az: '', en: '' },
        metaDescription: { az: '', en: '' },
        keywords: [],
        ogImage: '',
      },
    });
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
                {initialData ? 'Səhifəni Redaktə Et' : 'Yeni Səhifə Yarat'}
              </h2>
              <div className="flex items-center gap-3 text-sm font-medium">
                <span className={`px-4 py-1.5 rounded-full transition-colors ${currentStep === 1 ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-gray-100 text-gray-500'}`}>
                  1. Məzmun
                </span>
                <span className="text-gray-300">→</span>
                <span className={`px-4 py-1.5 rounded-full transition-colors ${currentStep === 2 ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-gray-100 text-gray-500'}`}>
                  2. SEO
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
              <div className="space-y-8">
                <Input
                  label={`Path/URL (${currentLang.toUpperCase()})`}
                  required
                  value={formData.path[currentLang]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      path: { ...formData.path, [currentLang]: e.target.value },
                    })
                  }
                  placeholder="/haqqimizda"
                  className="font-mono"
                />

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
                  placeholder="Səhifə başlığı"
                  className="text-lg"
                />

                <Textarea
                  label={`Təsvir (${currentLang.toUpperCase()})`}
                  rows={3}
                  value={formData.description[currentLang]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: { ...formData.description, [currentLang]: e.target.value },
                    })
                  }
                  placeholder="Səhifənin qısa təsviri"
                />

                <div>
                  <label className="block text-sm font-bold text-secondary mb-3">
                    Səhifə Növü
                  </label>
                  <select
                    value={formData.pageType}
                    onChange={(e) => setFormData({ ...formData, pageType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-secondary outline-none transition-all"
                  >
                    <option value="static">📄 Statik</option>
                    <option value="card">🎴 Kart</option>
                    <option value="blog">📝 Bloq</option>
                    <option value="list">📋 Siyahı</option>
                    <option value="custom">⚙️ Xüsusi</option>
                    <option value="personPage">👥 Şəxslər</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-secondary mb-3">
                    Məzmun ({currentLang.toUpperCase()})
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
                      minHeight={400}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8 max-w-4xl mx-auto">
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
                  rows={3}
                  value={formData.seo.metaDescription[currentLang]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seo: {
                        ...formData.seo,
                        metaDescription: { ...formData.seo.metaDescription, [currentLang]: e.target.value },
                      },
                    })
                  }
                  placeholder="SEO üçün meta təsvir"
                />

                <div>
                  <label className="block text-sm font-bold text-secondary mb-3">Açar Sözlər</label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                      placeholder="Açar söz əlavə et və Enter basın"
                      className="flex-1"
                    />
                    <Button type="button" onClick={addKeyword} variant="outline">
                      Əlavə et
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.seo.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium flex items-center gap-2 border border-primary/20"
                      >
                        {keyword}
                        <button
                          onClick={() => removeKeyword(keyword)}
                          className="hover:text-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <Input
                  label="OG Image URL"
                  value={formData.seo.ogImage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seo: { ...formData.seo, ogImage: e.target.value },
                    })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-8 py-5 border-t border-gray-100 bg-gray-50/50">
            <div className="flex gap-3">
              {currentStep === 2 && (
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft size={20} className="mr-2" />
                  Geri
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose}>
                Ləğv et
              </Button>
              {currentStep === 1 ? (
                <Button onClick={handleNext}>
                  Növbəti
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} loading={isLoading}>
                  <Save size={20} className="mr-2" />
                  {initialData ? 'Yadda saxla' : 'Yarat'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
