'use client';

import { useState } from 'react';
import Card from '@components/admin/ui/Card';
import Button from '@components/admin/ui/Button';
import Input from '@components/admin/ui/Input';
import { Plus, Search, Trash2, Image as ImageIcon } from 'lucide-react';

export default function GalleryPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Qalereya</h1>
          <p className="text-gray-600 mt-1">Şəkilləri idarə edin</p>
        </div>
        <Button>
          <Plus size={20} className="mr-2" />
          Şəkil Əlavə Et
        </Button>
      </div>

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
            <div key={item} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon size={48} className="text-gray-400" />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
