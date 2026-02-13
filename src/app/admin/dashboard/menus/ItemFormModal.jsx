'use client';

import { useState, useEffect } from 'react';
import { useGetPagesQuery } from '@store/api/pagesApi';
import { Modal, Input, Button } from '@components/admin/ui';

export default function ItemFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const { data: pagesData } = useGetPagesQuery({ page: 1, limit: 100, pageType: 'all', showDeleted: false });
  const pages = pagesData?.pages || [];

  const [linkType, setLinkType] = useState('url');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    label: { az: '', en: '' },
    href: { az: '', en: '' },
    description: { az: '', en: '' },
    page: '',
    hasDetail: false,
  });

  const filteredPages = pages.filter(page => {
    const searchLower = searchTerm.toLowerCase();
    const titleAz = page.title?.az?.toLowerCase() || '';
    const titleEn = page.title?.en?.toLowerCase() || '';
    const pathAz = page.path?.az?.toLowerCase() || '';
    const pathEn = page.path?.en?.toLowerCase() || '';
    return titleAz.includes(searchLower) || titleEn.includes(searchLower) || 
           pathAz.includes(searchLower) || pathEn.includes(searchLower);
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || '',
        label: initialData.label || { az: '', en: '' },
        href: initialData.href || { az: '', en: '' },
        description: initialData.description || { az: '', en: '' },
        page: initialData.page || '',
        hasDetail: initialData.hasDetail || false,
      });
      setLinkType(initialData.page ? 'page' : 'url');
    } else {
      setFormData({
        id: '',
        label: { az: '', en: '' },
        href: { az: '', en: '' },
        description: { az: '', en: '' },
        page: '',
        hasDetail: false,
      });
      setLinkType('url');
    }
    setSearchTerm('');
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = { ...formData };
    if (linkType === 'url') {
      submitData.page = '';
    } else {
      submitData.href = { az: '', en: '' };
    }
    onSubmit(submitData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Elementi Redaktə Et' : 'Yeni Element'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Element ID"
          required
          value={formData.id}
          onChange={(e) => setFormData({ ...formData, id: e.target.value })}
          placeholder="history"
          disabled={!!initialData}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Ad (AZ)"
            required
            value={formData.label.az}
            onChange={(e) => setFormData({ ...formData, label: { ...formData.label, az: e.target.value } })}
            placeholder="Universitetin tarixi"
          />
          <Input
            label="Ad (EN)"
            required
            value={formData.label.en}
            onChange={(e) => setFormData({ ...formData, label: { ...formData.label, en: e.target.value } })}
            placeholder="University History"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Link Növü</label>
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="url"
                checked={linkType === 'url'}
                onChange={(e) => setLinkType(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">URL</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="page"
                checked={linkType === 'page'}
                onChange={(e) => setLinkType(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">Səhifə</span>
            </label>
          </div>
        </div>

        {linkType === 'url' ? (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Link (AZ)"
              value={formData.href.az}
              onChange={(e) => setFormData({ ...formData, href: { ...formData.href, az: e.target.value } })}
              placeholder="/universitet/tarix"
            />
            <Input
              label="Link (EN)"
              value={formData.href.en}
              onChange={(e) => setFormData({ ...formData, href: { ...formData.href, en: e.target.value } })}
              placeholder="/university/history"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Səhifə Seçin</label>
            <Input
              placeholder="Səhifə axtar (AZ/EN)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-2"
            />
            <select
              value={formData.page}
              onChange={(e) => setFormData({ ...formData, page: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white max-h-48 overflow-y-auto"
              size="5"
            >
              <option value="">Səhifə seçin</option>
              {filteredPages.map((page) => (
                <option key={page._id} value={page._id}>
                  {page.title?.az || page.title} | {page.title?.en} ({page.path?.az || page.path})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {filteredPages.length} səhifə tapıldı
            </p>
          </div>
        )}

        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.hasDetail}
              onChange={(e) => setFormData({ ...formData, hasDetail: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Detail səhifəsi var</span>
          </label>
        </div>

        <div className="flex items-center gap-3 justify-end pt-4">
          <Button variant="outline" onClick={onClose} type="button">Ləğv et</Button>
          <Button type="submit">{initialData ? 'Yenilə' : 'Əlavə et'}</Button>
        </div>
      </form>
    </Modal>
  );
}
