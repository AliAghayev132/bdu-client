'use client';

import { useState } from 'react';
import Card from '@components/admin/ui/Card';
import Button from '@components/admin/ui/Button';
import Input from '@components/admin/ui/Input';
import { Plus, Search, Edit, Trash2, Megaphone } from 'lucide-react';

export default function AnnouncementsPage() {
  const [search, setSearch] = useState('');

  const announcements = [
    { id: 1, title: 'Yeni tədris ili başlayır', date: '2024-09-01', priority: 'high' },
    { id: 2, title: 'Qış imtahan sessiyası', date: '2024-12-15', priority: 'medium' },
    { id: 3, title: 'Kitabxana saatları dəyişdi', date: '2024-11-20', priority: 'low' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Elanlar</h1>
          <p className="text-gray-600 mt-1">Elanları idarə edin</p>
        </div>
        <Button>
          <Plus size={20} className="mr-2" />
          Yeni Elan
        </Button>
      </div>

      <Card>
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Elan axtar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${
                  announcement.priority === 'high' ? 'bg-red-100 text-red-600' :
                  announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <Megaphone size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(announcement.date).toLocaleDateString('az-AZ')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <Edit size={18} />
                </button>
                <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
