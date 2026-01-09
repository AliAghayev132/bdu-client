'use client';

import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import Button from '@components/admin/ui/Button';
import Input from '@components/admin/ui/Input';
import Textarea from '@components/admin/ui/Textarea';
import toast from 'react-hot-toast';

export default function PersonModal({ isOpen, onClose, onSubmit, initialData = null, isLoading = false }) {
  const [currentLang, setCurrentLang] = useState('az');
  const [formData, setFormData] = useState({
    name: { az: '', en: '' },
    position: { az: '', en: '' },
    bio: { az: '', en: '' },
    phone: '',
    email: '',
    image: '',
    category: 'faculty',
    department: '',
    order: 0,
    hasDetailPage: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.image) {
        const imageUrl = initialData.image.startsWith('http') 
          ? initialData.image 
          : `http://localhost:3001${initialData.image}`;
        setImagePreview(imageUrl);
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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.name.az || !formData.name.en) {
      toast.error('Ad hər iki dildə doldurulmalıdır');
      return false;
    }
    if (!formData.position.az || !formData.position.en) {
      toast.error('Vəzifə hər iki dildə doldurulmalıdır');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const submitData = new FormData();
    
    submitData.append('name', JSON.stringify(formData.name));
    submitData.append('position', JSON.stringify(formData.position));
    submitData.append('bio', JSON.stringify(formData.bio));
    submitData.append('phone', formData.phone);
    submitData.append('email', formData.email);
    submitData.append('category', formData.category);
    submitData.append('department', formData.department);
    submitData.append('order', formData.order);
    submitData.append('hasDetailPage', formData.hasDetailPage);
    
    if (imageFile) {
      submitData.append('image', imageFile);
    } else if (formData.image) {
      submitData.append('existingImage', formData.image);
    }

    await onSubmit(submitData);
  };

  const handleClose = () => {
    setCurrentLang('az');
    setFormData({
      name: { az: '', en: '' },
      position: { az: '', en: '' },
      bio: { az: '', en: '' },
      phone: '',
      email: '',
      image: '',
      category: 'faculty',
      department: '',
      order: 0,
      hasDetailPage: false,
    });
    setImageFile(null);
    setImagePreview('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-secondary/20 backdrop-blur-sm" onClick={handleClose}></div>
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white">
            <h2 className="text-2xl font-bold text-secondary font-montserrat">
              {initialData ? 'Şəxsi Redaktə Et' : 'Yeni Şəxs Əlavə Et'}
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
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <label className="block text-sm font-bold text-secondary mb-4">
                  Şəkil
                </label>
                <div className="flex items-start gap-6">
                  <div className="flex-1">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-white hover:bg-gray-50 hover:border-primary transition-all">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <p className="text-sm text-gray-500"><span className="font-semibold text-primary">Yükləmək üçün toxunun</span></p>
                        <p className="text-xs text-gray-400">PNG, JPG (MAX. 2MB)</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-primary/20 shadow-md">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <Input
                label={`Ad Soyad (${currentLang.toUpperCase()})`}
                required
                value={formData.name[currentLang]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: { ...formData.name, [currentLang]: e.target.value },
                  })
                }
                placeholder="Ad Soyad"
              />

              <Input
                label={`Vəzifə (${currentLang.toUpperCase()})`}
                required
                value={formData.position[currentLang]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    position: { ...formData.position, [currentLang]: e.target.value },
                  })
                }
                placeholder="Vəzifə"
              />

              <Textarea
                label={`Bioqrafiya (${currentLang.toUpperCase()})`}
                rows={4}
                value={formData.bio[currentLang]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bio: { ...formData.bio, [currentLang]: e.target.value },
                  })
                }
                placeholder="Qısa bioqrafiya"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                />

                <Input
                  label="Telefon"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+994 XX XXX XX XX"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-secondary mb-3">Kateqoriya</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-secondary outline-none transition-all"
                  >
                    <option value="leadership">👔 Rəhbərlik</option>
                    <option value="faculty">👨‍🏫 Müəllimlər</option>
                    <option value="staff">👥 Əməkdaşlar</option>
                    <option value="other">📌 Digər</option>
                  </select>
                </div>

                <Input
                  label="Departament"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Kafedra/Şöbə"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Sıra"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />

                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors w-full">
                    <input
                      type="checkbox"
                      checked={formData.hasDetailPage}
                      onChange={(e) => setFormData({ ...formData, hasDetailPage: e.target.checked })}
                      className="w-4 h-4 text-primary rounded focus:ring-primary border-gray-300"
                    />
                    <span className="text-sm font-medium text-secondary">Detallı səhifə var</span>
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
