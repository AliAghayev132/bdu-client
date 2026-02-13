'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const INITIAL_FORM_DATA = {
  title: { az: '', en: '' },
  excerpt: { az: '', en: '' },
  content: { az: '', en: '' },
  coverImage: '',
  category: 'academic',
  tags: [],
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export function useBlogForm(initialData = null) {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentLang, setCurrentLang] = useState('az');
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [tagInput, setTagInput] = useState('');
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || { az: '', en: '' },
        excerpt: initialData.excerpt || { az: '', en: '' },
        content: initialData.content || { az: '', en: '' },
        coverImage: initialData.coverImage || '',
        category: initialData.category || 'academic',
        tags: initialData.tags || [],
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
      const response = await fetch(`${API_URL}/admin/blogs/upload-image`, {
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

  const validateStep1 = useCallback(() => {
    if (!formData.title.az || !formData.title.en) {
      toast.error('Başlıq hər iki dildə doldurulmalıdır');
      return false;
    }
    if (!formData.content.az || !formData.content.en) {
      toast.error('Məzmun hər iki dildə doldurulmalıdır');
      return false;
    }
    return true;
  }, [formData.title, formData.content]);

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
    submitData.append('category', formData.category);
    submitData.append('tags', JSON.stringify(formData.tags));

    if (coverImageFile) {
      submitData.append('coverImage', coverImageFile);
    } else if (formData.coverImage) {
      submitData.append('existingCoverImage', formData.coverImage);
    }

    return submitData;
  }, [formData, coverImageFile]);

  return {
    currentStep, currentLang, formData, tagInput,
    coverImageFile, coverImagePreview,
    setCurrentLang, setTagInput,
    updateLocalizedField, updateField,
    handleCoverImageChange, removeCoverImage, handleImageUpload,
    addTag, removeTag,
    goNext, goBack, validateStep1, validateStep2,
    buildSubmitData,
  };
}
