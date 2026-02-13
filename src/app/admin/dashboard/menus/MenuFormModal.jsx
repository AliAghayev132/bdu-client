'use client';

import { useState, useEffect } from 'react';
import { Modal, Input, Button } from '@components/admin/ui';

export default function MenuFormModal({ isOpen, onClose, onSubmit, initialData, isLoading }) {
  const [formData, setFormData] = useState({
    id: '',
    label: { az: '', en: '' },
    type: 'mega',
    order: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || '',
        label: initialData.label || { az: '', en: '' },
        type: initialData.type || 'mega',
        order: initialData.order || 0,
      });
    } else {
      setFormData({ id: '', label: { az: '', en: '' }, type: 'mega', order: 0 });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Menunu Redaktə Et' : 'Yeni Menu Yarat'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Menu ID"
          required
          value={formData.id}
          onChange={(e) => setFormData({ ...formData, id: e.target.value })}
          placeholder="university"
          disabled={!!initialData}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Başlıq (AZ)"
            required
            value={formData.label.az}
            onChange={(e) => setFormData({ ...formData, label: { ...formData.label, az: e.target.value } })}
            placeholder="UNİVERSİTET"
          />
          <Input
            label="Başlıq (EN)"
            required
            value={formData.label.en}
            onChange={(e) => setFormData({ ...formData, label: { ...formData.label, en: e.target.value } })}
            placeholder="UNIVERSITY"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tip</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="mega">Mega Menu</option>
            <option value="dropdown">Dropdown</option>
            <option value="link">Link</option>
          </select>
        </div>

        <Input
          label="Sıra"
          type="number"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
          placeholder="0"
        />

        <div className="flex items-center gap-3 justify-end pt-4">
          <Button variant="outline" onClick={onClose} type="button">
            Ləğv et
          </Button>
          <Button type="submit" loading={isLoading}>
            {initialData ? 'Yenilə' : 'Yarat'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
