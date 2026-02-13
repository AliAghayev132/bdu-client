'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const INITIAL_FORM_DATA = {
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
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export function useEventForm(initialData = null) {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentLang, setCurrentLang] = useState('az');
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || { az: '', en: '' },
        excerpt: initialData.excerpt || { az: '', en: '' },
        content: initialData.content || { az: '', en: '' },
        location: initialData.location || { az: '', en: '' },
        organizer: initialData.organizer || { az: '', en: '' },
        coverImage: initialData.coverImage || '',
        eventDate: initialData.eventDate ? initialData.eventDate.split('T')[0] : '',
        eventTime: initialData.eventTime || '',
        category: initialData.category || 'conference',
        tags: initialData.tags || [],
        registrationRequired: initialData.registrationRequired || false,
        registrationLink: initialData.registrationLink || '',
        capacity: initialData.capacity || '',
        seo: initialData.seo || INITIAL_FORM_DATA.seo,
      });
      if (initialData.coverImage) {
        const imageUrl = initialData.coverImage.startsWith('http')
          ? initialData.coverImage
          : `${BACKEND_URL}${initialData.coverImage}`;
        setCoverImagePreview(imageUrl);
      }
    }
  }, [initialData]);

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
      seo: { ...prev.seo, [field]: { ...prev.seo[field], [lang]: value } },
    }));
  }, []);

  const handleCoverImageChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setCoverImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const removeCoverImage = useCallback(() => {
    setCoverImageFile(null);
    setCoverImagePreview('');
  }, []);

  const handleImageUpload = useCallback(async (file) => {
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      const response = await fetch(`${API_URL}/admin/events/upload-image`, {
        method: 'POST',
        body: uploadFormData,
        credentials: 'include',
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      if (result.success) {
        return result.data.url.startsWith('http')
          ? result.data.url
          : `${BACKEND_URL}${result.data.url}`;
      }
      throw new Error('Upload failed');
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Şəkil yüklənmədi');
      throw error;
    }
  }, []);

  const addTag = useCallback(() => {
    const trimmed = tagInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
      setTagInput('');
    }
  }, [tagInput, formData.tags]);

  const removeTag = useCallback((tag) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  }, []);

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

  const validateStep1 = useCallback(() => {
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
  }, [formData.title, formData.content, formData.eventDate]);

  const validateStep2 = useCallback(() => {
    if (!coverImageFile && !coverImagePreview) {
      toast.error('Əsas şəkil yüklənməlidir');
      return false;
    }
    return true;
  }, [coverImageFile, coverImagePreview]);

  const goNext = useCallback(() => {
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
  }, [currentStep, validateStep1]);

  const goBack = useCallback(() => {
    if (currentStep === 2) setCurrentStep(1);
  }, [currentStep]);

  const buildSubmitData = useCallback(() => {
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

    return submitData;
  }, [formData, coverImageFile]);

  return {
    currentStep, currentLang, formData, tagInput, keywordInput,
    coverImageFile, coverImagePreview,
    setCurrentLang, setTagInput, setKeywordInput,
    updateLocalizedField, updateField, updateSeoField,
    handleCoverImageChange, removeCoverImage, handleImageUpload,
    addTag, removeTag, addKeyword, removeKeyword,
    goNext, goBack, validateStep1, validateStep2,
    buildSubmitData,
  };
}
