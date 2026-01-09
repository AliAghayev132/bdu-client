'use client';

import { useState, useEffect } from 'react';
import { useGetPagesQuery } from '@store/api/pagesApi';
import Modal from '@components/admin/ui/Modal';
import Input from '@components/admin/ui/Input';
import Button from '@components/admin/ui/Button';

export default function SubitemFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const { data: pagesData } = useGetPagesQuery({ page: 1, limit: 100, pageType: 'all', showDeleted: false });
  const pages = pagesData?.pages || [];

  const [formData, setFormData] = useState({
    id: '',
    label: { az: '', en: '' },
    href: { az: '', en: '' },
    description: { az: '', en: '' },
    page: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || '',
        label: initialData.label || { az: '', en: '' },
        href: initialData.href || { az: '', en: '' },
        description: initialData.description || { az: '', en: '' },
        page: initialData.page || '',
      });
    } else {
      setFormData({
        id: '',
        label: { az: '', en: '' },
        href: { az: '', en: '' },
        description: { az: '', en: '' },
        page: '',
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Alt Elementi Redaktə Et' : 'Yeni Alt Element'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Element ID"
          required
          value={formData.id}
          onChange={(e) => setFormData({ ...formData, id: e.target.value })}
          placeholder="sub-item-1"
          disabled={!!initialData}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Ad (AZ)"
            required
            value={formData.label.az}
            onChange={(e) => setFormData({ ...formData, label: { ...formData.label, az: e.target.value } })}
            placeholder="Alt element adı"
          />
          <Input
            label="Ad (EN)"
            required
            value={formData.label.en}
            onChange={(e) => setFormData({ ...formData, label: { ...formData.label, en: e.target.value } })}
            placeholder="Sub-item name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Link (AZ)"
            value={formData.href.az}
            onChange={(e) => setFormData({ ...formData, href: { ...formData.href, az: e.target.value } })}
            placeholder="/link"
          />
          <Input
            label="Link (EN)"
            value={formData.href.en}
            onChange={(e) => setFormData({ ...formData, href: { ...formData.href, en: e.target.value } })}
            placeholder="/link"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Təsvir (AZ)"
            value={formData.description.az}
            onChange={(e) => setFormData({ ...formData, description: { ...formData.description, az: e.target.value } })}
            placeholder="Qısa təsvir"
          />
          <Input
            label="Təsvir (EN)"
            value={formData.description.en}
            onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
            placeholder="Short description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Səhifə</label>
          <select
            value={formData.page}
            onChange={(e) => setFormData({ ...formData, page: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">Səhifə seçin (opsional)</option>
            {pages.map((page) => (
              <option key={page._id} value={page._id}>
                {page.title?.az || page.title} ({page.path?.az || page.path})
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Səhifə seçilməsə, href istifadə ediləcək</p>
        </div>

        <div className="flex items-center gap-3 justify-end pt-4">
          <Button variant="outline" onClick={onClose} type="button">Ləğv et</Button>
          <Button type="submit">{initialData ? 'Yenilə' : 'Əlavə et'}</Button>
        </div>
      </form>
    </Modal>
  );
}
