'use client';

import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import Button from '@components/admin/ui/Button';
import Input from '@components/admin/ui/Input';
import Textarea from '@components/admin/ui/Textarea';
import toast from 'react-hot-toast';

export default function AnnouncementModal({ isOpen, onClose, onSubmit, initialData = null, isLoading = false }) {
  const [currentLang, setCurrentLang] = useState('az');
  const [formData, setFormData] = useState({
    title: { az: '', en: '' },
    content: { az: '', en: '' },
    type: 'info',
    priority: 'medium',
    startDate: '',
    endDate: '',
    targetAudience: ['all'],
    isPinned: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
      });
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

  const validateForm = () => {
    if (!formData.title.az || !formData.title.en) {
      toast.error('Başlıq hər iki dildə doldurulmalıdır');
      return false;
    }
    if (!formData.content.az || !formData.content.en) {
      toast.error('Məzmun hər iki dildə doldurulmalıdır');
      return false;
    }
    if (!formData.startDate || !formData.endDate) {
      toast.error('Başlanğıc və bitmə tarixləri doldurulmalıdır');
      return false;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error('Bitmə tarixi başlanğıc tarixindən sonra olmalıdır');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const submitData = new FormData();
    
    submitData.append('title', JSON.stringify(formData.title));
    submitData.append('content', JSON.stringify(formData.content));
    submitData.append('type', formData.type);
    submitData.append('priority', formData.priority);
    submitData.append('startDate', formData.startDate);
    submitData.append('endDate', formData.endDate);
    submitData.append('targetAudience', JSON.stringify(formData.targetAudience));
    submitData.append('isPinned', formData.isPinned);

    await onSubmit(submitData);
  };

  const handleClose = () => {
    setCurrentLang('az');
    setFormData({
      title: { az: '', en: '' },
      content: { az: '', en: '' },
      type: 'info',
      priority: 'medium',
      startDate: '',
      endDate: '',
      targetAudience: ['all'],
      isPinned: false,
    });
    onClose();
  };

  const toggleAudience = (audience) => {
    if (audience === 'all') {
      setFormData({ ...formData, targetAudience: ['all'] });
    } else {
      const newAudience = formData.targetAudience.includes('all')
        ? [audience]
        : formData.targetAudience.includes(audience)
        ? formData.targetAudience.filter(a => a !== audience)
        : [...formData.targetAudience, audience];
      
      setFormData({ ...formData, targetAudience: newAudience.length ? newAudience : ['all'] });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-secondary/20 backdrop-blur-sm" onClick={handleClose}></div>
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white">
            <h2 className="text-2xl font-bold text-secondary font-montserrat">
              {initialData ? 'Elanı Redaktə Et' : 'Yeni Elan Yarat'}
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
                placeholder="Elan başlığı"
              />

              <Textarea
                label={`Məzmun (${currentLang.toUpperCase()})`}
                required
                rows={6}
                value={formData.content[currentLang]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content: { ...formData.content, [currentLang]: e.target.value },
                  })
                }
                placeholder="Elan məzmunu"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-secondary mb-3">Növ</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-secondary outline-none transition-all"
                  >
                    <option value="info">ℹ️ Məlumat</option>
                    <option value="warning">⚠️ Xəbərdarlıq</option>
                    <option value="urgent">🚨 Təcili</option>
                    <option value="event">📅 Tədbir</option>
                    <option value="academic">🎓 Akademik</option>
                    <option value="other">📌 Digər</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-secondary mb-3">Prioritet</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-secondary outline-none transition-all"
                  >
                    <option value="low">🟢 Aşağı</option>
                    <option value="medium">🟡 Orta</option>
                    <option value="high">🟠 Yüksək</option>
                    <option value="critical">🔴 Kritik</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Başlanğıc Tarixi"
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />

                <Input
                  label="Bitmə Tarixi"
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-secondary mb-3">Hədəf Auditoriya</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: '👥 Hamı' },
                    { value: 'students', label: '🎓 Tələbələr' },
                    { value: 'faculty', label: '👨‍🏫 Müəllimlər' },
                    { value: 'staff', label: '👔 Əməkdaşlar' },
                    { value: 'alumni', label: '🎖️ Məzunlar' },
                  ].map((audience) => (
                    <button
                      key={audience.value}
                      type="button"
                      onClick={() => toggleAudience(audience.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        formData.targetAudience.includes(audience.value)
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {audience.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer px-4 py-3 bg-yellow-50 rounded-xl border border-yellow-200 hover:bg-yellow-100 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                  className="w-5 h-5 text-yellow-600 rounded focus:ring-yellow-500 border-gray-300"
                />
                <div>
                  <span className="text-sm font-bold text-yellow-900">📌 Sancaqla (Pin)</span>
                  <p className="text-xs text-yellow-700">Elan siyahının yuxarısında görünəcək</p>
                </div>
              </label>
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
