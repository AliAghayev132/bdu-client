'use client';

import { useState } from 'react';
import Card from '@components/admin/ui/Card';
import Button from '@components/admin/ui/Button';
import Input from '@components/admin/ui/Input';
import AdminPageHeader from '@components/admin/AdminPageHeader';
import { Plus, Search, Trash2, Image as ImageIcon } from 'lucide-react';

export default function GalleryPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-8">
      <AdminPageHeader 
        title="Qalereya" 
        description="Şəkilləri idarə edin"
      >
        <Button>
          <Plus size={20} className="mr-2" />
          Şəkil Əlavə Et
        </Button>
      </AdminPageHeader>

      <Card>
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Şəkil axtar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="group relative aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon size={48} className="text-gray-300" />
              </div>
              <div className="absolute inset-0 bg-secondary/80 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[2px]">
                <button className="p-3 bg-white text-red-500 rounded-xl hover:bg-red-50 transition-colors shadow-lg">
                  <Trash2 size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
