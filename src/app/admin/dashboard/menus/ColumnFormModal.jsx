'use client';

import { useState, useEffect } from 'react';
import { Modal, Input, Button } from '@components/admin/ui';

export default function ColumnFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    title: { az: '', en: '' },
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ title: initialData.title || { az: '', en: '' } });
    } else {
      setFormData({ title: { az: '', en: '' } });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Sütunu Redaktə Et' : 'Yeni Sütun'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Başlıq (AZ)"
            required
            value={formData.title.az}
            onChange={(e) => setFormData({ ...formData, title: { ...formData.title, az: e.target.value } })}
            placeholder="Ümumi"
          />
          <Input
            label="Başlıq (EN)"
            required
            value={formData.title.en}
            onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })}
            placeholder="General"
          />
        </div>
        <div className="flex items-center gap-3 justify-end pt-4">
          <Button variant="outline" onClick={onClose} type="button">Ləğv et</Button>
          <Button type="submit">{initialData ? 'Yenilə' : 'Əlavə et'}</Button>
        </div>
      </form>
    </Modal>
  );
}
