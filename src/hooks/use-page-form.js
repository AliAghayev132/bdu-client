'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

const INITIAL_FORM_DATA = {
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
};

export function usePageForm(initialData = null) {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentLang, setCurrentLang] = useState('az');
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [keywordInput, setKeywordInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        path: initialData.path || { az: '', en: '' },
        title: initialData.title || { az: '', en: '' },
        description: initialData.description || { az: '', en: '' },
        content: initialData.content || { az: '', en: '' },
        pageType: initialData.pageType || 'static',
        seo: initialData.seo || INITIAL_FORM_DATA.seo,
      });
    }
  }, [initialData]);

  // --- Field updaters ---
  const updateLocalizedField = useCallback((field, lang, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }));
  }, []);

  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateSeoField = useCallback((field, lang, value) => {
    setFormData((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        [field]: { ...prev.seo[field], [lang]: value },
      },
    }));
  }, []);

  const updateSeoSimpleField = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      seo: { ...prev.seo, [field]: value },
    }));
  }, []);

  // --- Image upload (for tiptap editor) ---
  const handleImageUpload = useCallback(async (file) => {
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      const response = await fetch(`${API_URL}/admin/news/upload-image`, {
        method: 'POST',
        body: uploadFormData,
        credentials: 'include',
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      if (result.success) {
        const imageUrl = result.data.url.startsWith('http')
          ? result.data.url
          : `${BACKEND_URL}${result.data.url}`;
        return imageUrl;
      }
      throw new Error('Upload failed');
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Şəkil yüklənmədi');
      throw error;
    }
  }, []);

  // --- Keywords ---
  const addKeyword = useCallback(() => {
    const trimmed = keywordInput.trim();
    if (trimmed && !formData.seo.keywords.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        seo: { ...prev.seo, keywords: [...prev.seo.keywords, trimmed] },
      }));
      setKeywordInput('');
    }
  }, [keywordInput, formData.seo.keywords]);

  const removeKeyword = useCallback((keyword) => {
    setFormData((prev) => ({
      ...prev,
      seo: { ...prev.seo, keywords: prev.seo.keywords.filter((k) => k !== keyword) },
    }));
  }, []);

  // --- Validation ---
  const validateStep1 = useCallback(() => {
    if (!formData.path.az || !formData.path.en) {
      toast.error('Path hər iki dildə doldurulmalıdır');
      return false;
    }
    if (!formData.title.az || !formData.title.en) {
      toast.error('Başlıq hər iki dildə doldurulmalıdır');
      return false;
    }
    return true;
  }, [formData.path, formData.title]);

  const validateStep2 = useCallback(() => {
    return true;
  }, []);

  // --- Navigation ---
  const goNext = useCallback(() => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  }, [currentStep, validateStep1]);

  const goBack = useCallback(() => {
    if (currentStep === 2) setCurrentStep(1);
  }, [currentStep]);

  // --- Build data for submission ---
  const buildSubmitData = useCallback(() => {
    return {
      path: formData.path,
      title: formData.title,
      description: formData.description,
      content: formData.content,
      pageType: formData.pageType,
      seo: formData.seo,
    };
  }, [formData]);

  // --- Reset ---
  const resetForm = useCallback(() => {
    setCurrentStep(1);
    setCurrentLang('az');
    setFormData(INITIAL_FORM_DATA);
    setKeywordInput('');
  }, []);

  return {
    // State
    currentStep,
    currentLang,
    formData,
    keywordInput,

    // Setters
    setCurrentLang,
    setKeywordInput,

    // Field updaters
    updateLocalizedField,
    updateField,
    updateSeoField,
    updateSeoSimpleField,

    // Editor image upload
    handleImageUpload,

    // Keywords
    addKeyword,
    removeKeyword,

    // Navigation
    goNext,
    goBack,

    // Validation
    validateStep1,
    validateStep2,

    // Submit
    buildSubmitData,
    resetForm,
  };
}
