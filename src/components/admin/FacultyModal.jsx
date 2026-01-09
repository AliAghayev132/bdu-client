'use client';

import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import Button from '@components/admin/ui/Button';
import Input from '@components/admin/ui/Input';
import Textarea from '@components/admin/ui/Textarea';
import toast from 'react-hot-toast';

export default function FacultyModal({ isOpen, onClose, onSubmit, initialData = null, isLoading = false }) {
  const [currentLang, setCurrentLang] = useState('az');
  const [formData, setFormData] = useState({
    name: { az: '', en: '' },
    subdomain: '',
    description: { az: '', en: '' },
    logo: '',
    coverImage: '',
    contactInfo: {
      email: '',
      phone: '',
      address: { az: '', en: '' },
    },
    dean: {
      name: { az: '', en: '' },
      bio: { az: '', en: '' },
      image: '',
      email: '',
      phone: '',
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
      youtube: '',
    },
    settings: {
      allowNews: true,
      allowBlogs: true,
      allowEvents: true,
      customColors: {
        primary: '',
        secondary: '',
      },
    },
    order: 0,
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.logo) {
        const logoUrl = initialData.logo.startsWith('http') 
          ? initialData.logo 
          : `http://localhost:3001${initialData.logo}`;
        setLogoPreview(logoUrl);
      }
      if (initialData.coverImage) {
        const coverUrl = initialData.coverImage.startsWith('http') 
          ? initialData.coverImage 
          : `http://localhost:3001${initialData.coverImage}`;
        setCoverPreview(coverUrl);
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

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.name.az || !formData.name.en) {
      toast.error('Ad hər iki dildə doldurulmalıdır');
      return false;
    }
    if (!formData.subdomain) {
      toast.error('Subdomain doldurulmalıdır');
      return false;
    }
    if (!/^[a-z0-9-]+$/.test(formData.subdomain)) {
      toast.error('Subdomain yalnız kiçik hərflər, rəqəmlər və tire (-) ola bilər');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const submitData = new FormData();
    
    submitData.append('name', JSON.stringify(formData.name));
    submitData.append('subdomain', formData.subdomain);
    submitData.append('description', JSON.stringify(formData.description));
    submitData.append('contactInfo', JSON.stringify(formData.contactInfo));
    submitData.append('dean', JSON.stringify(formData.dean));
    submitData.append('socialMedia', JSON.stringify(formData.socialMedia));
    submitData.append('settings', JSON.stringify(formData.settings));
    submitData.append('order', formData.order);
    
    if (logoFile) {
      submitData.append('logo', logoFile);
    } else if (formData.logo) {
      submitData.append('existingLogo', formData.logo);
    }

    if (coverFile) {
      submitData.append('coverImage', coverFile);
    } else if (formData.coverImage) {
      submitData.append('existingCoverImage', formData.coverImage);
    }

    await onSubmit(submitData);
  };

  const handleClose = () => {
    setCurrentLang('az');
    setFormData({
      name: { az: '', en: '' },
      subdomain: '',
      description: { az: '', en: '' },
      logo: '',
      coverImage: '',
      contactInfo: {
        email: '',
        phone: '',
        address: { az: '', en: '' },
      },
      dean: {
        name: { az: '', en: '' },
        bio: { az: '', en: '' },
        image: '',
        email: '',
        phone: '',
      },
      socialMedia: {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        youtube: '',
      },
      settings: {
        allowNews: true,
        allowBlogs: true,
        allowEvents: true,
        customColors: {
          primary: '',
          secondary: '',
        },
      },
      order: 0,
    });
    setLogoFile(null);
    setLogoPreview('');
    setCoverFile(null);
    setCoverPreview('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-secondary/20 backdrop-blur-sm" onClick={handleClose}></div>
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white">
            <h2 className="text-2xl font-bold text-secondary font-montserrat">
              {initialData ? 'Fakültəni Redaktə Et' : 'Yeni Fakültə Yarat'}
            </h2>
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
            <div className="space-y-8 max-w-4xl mx-auto">
              {/* Əsas məlumatlar */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h3 className="text-lg font-bold text-secondary mb-4">Əsas Məlumatlar</h3>
                <div className="space-y-4">
                  <Input
                    label={`Fakültə Adı (${currentLang.toUpperCase()})`}
                    required
                    value={formData.name[currentLang]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: { ...formData.name, [currentLang]: e.target.value },
                      })
                    }
                    placeholder="Fakültə adı"
                  />

                  <Input
                    label="Subdomain"
                    required
                    value={formData.subdomain}
                    onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.toLowerCase() })}
                    placeholder="cs (cs.bdu.edu.az)"
                    disabled={!!initialData}
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
                    placeholder="Fakültə haqqında qısa məlumat"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-secondary mb-2">Logo</label>
                      <input type="file" accept="image/*" onChange={handleLogoChange} className="text-sm" />
                      {logoPreview && <img src={logoPreview} alt="Logo" className="mt-2 h-20 object-contain" />}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-secondary mb-2">Cover Image</label>
                      <input type="file" accept="image/*" onChange={handleCoverChange} className="text-sm" />
                      {coverPreview && <img src={coverPreview} alt="Cover" className="mt-2 h-20 object-cover rounded" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Əlaqə məlumatları */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h3 className="text-lg font-bold text-secondary mb-4">Əlaqə Məlumatları</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Email"
                      type="email"
                      value={formData.contactInfo.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactInfo: { ...formData.contactInfo, email: e.target.value },
                        })
                      }
                    />
                    <Input
                      label="Telefon"
                      value={formData.contactInfo.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactInfo: { ...formData.contactInfo, phone: e.target.value },
                        })
                      }
                    />
                  </div>
                  <Input
                    label={`Ünvan (${currentLang.toUpperCase()})`}
                    value={formData.contactInfo.address[currentLang]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactInfo: {
                          ...formData.contactInfo,
                          address: { ...formData.contactInfo.address, [currentLang]: e.target.value },
                        },
                      })
                    }
                  />
                </div>
              </div>

              {/* Parametrlər */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h3 className="text-lg font-bold text-secondary mb-4">Parametrlər</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.settings.allowNews}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          settings: { ...formData.settings, allowNews: e.target.checked },
                        })
                      }
                      className="w-4 h-4 text-primary rounded"
                    />
                    <span className="text-sm font-medium">Xəbərlərə icazə ver</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.settings.allowBlogs}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          settings: { ...formData.settings, allowBlogs: e.target.checked },
                        })
                      }
                      className="w-4 h-4 text-primary rounded"
                    />
                    <span className="text-sm font-medium">Bloqlara icazə ver</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.settings.allowEvents}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          settings: { ...formData.settings, allowEvents: e.target.checked },
                        })
                      }
                      className="w-4 h-4 text-primary rounded"
                    />
                    <span className="text-sm font-medium">Tədbir icazə ver</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-gray-100 bg-gray-50/50">
            <Button variant="outline" onClick={handleClose}>
              Ləğv et
            </Button>
            <Button onClick={handleSubmit} loading={isLoading}>
              <Save size={20} className="mr-2" />
              {initialData ? 'Yadda saxla' : 'Yarat'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
