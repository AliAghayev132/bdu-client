// DEPRECATED: This modal component has been replaced by full-screen page routes.
// Use /admin/dashboard/blogs/create and /admin/dashboard/blogs/[id]/edit instead.

export default function BlogModal() {
  return null;
}

function _OriginalBlogModal({ isOpen, onClose, onSubmit, initialData = null, isLoading = false }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentLang, setCurrentLang] = useState('az');
  const [formData, setFormData] = useState({
    title: { az: '', en: '' },
    excerpt: { az: '', en: '' },
    content: { az: '', en: '' },
    coverImage: '',
    category: 'academic',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
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
      const response = await fetch('http://localhost:3001/api/admin/blogs/upload-image', {
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

  const validateStep1 = () => {
    if (!formData.title.az || !formData.title.en) {
      toast.error('Başlıq hər iki dildə doldurulmalıdır');
      return false;
    }
    if (!formData.content.az || !formData.content.en) {
      toast.error('Məzmun hər iki dildə doldurulmalıdır');
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
    submitData.append('category', formData.category);
    submitData.append('tags', JSON.stringify(formData.tags));
    
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
      coverImage: '',
      category: 'academic',
      tags: [],
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
                {initialData ? 'Bloqu Redaktə Et' : 'Yeni Bloq Yarat'}
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
              <div className="space-y-8">
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
                  placeholder="Bloq başlığı"
                  className="text-lg"
                />

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
                  placeholder="Bloqün qısa təsviri"
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
                      <div className="w-48 h-32 rounded-xl overflow-hidden border-2 border-primary/20 shadow-md">
                        <img
                          src={coverImagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-secondary mb-3">Kateqoriya</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-secondary outline-none transition-all"
                  >
                    <option value="academic">📚 Akademik</option>
                    <option value="research">🔬 Tədqiqat</option>
                    <option value="student_life">🎓 Tələbə həyatı</option>
                    <option value="alumni">👥 Məzunlar</option>
                    <option value="other">📌 Digər</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-secondary mb-3">Teqlər</label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="Teq əlavə et və Enter basın"
                      className="flex-1"
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      Əlavə et
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium flex items-center gap-2 border border-primary/20"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
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
