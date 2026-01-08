'use client';

import { useState } from 'react';
import Card from '@components/admin/ui/Card';
import Button from '@components/admin/ui/Button';
import Input from '@components/admin/ui/Input';
import AdminPageHeader from '@components/admin/AdminPageHeader';
import { Plus, Search, Edit, Trash2, Megaphone } from 'lucide-react';

export default function AnnouncementsPage() {
  const [search, setSearch] = useState('');

  const announcements = [
    { id: 1, title: 'Yeni tədris ili başlayır', date: '2024-09-01', priority: 'high' },
    { id: 2, title: 'Qış imtahan sessiyası', date: '2024-12-15', priority: 'medium' },
    { id: 3, title: 'Kitabxana saatları dəyişdi', date: '2024-11-20', priority: 'low' },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader 
        title="Elanlar" 
        description="Elanları idarə edin"
      >
        <Button>
          <Plus size={20} className="mr-2" />
          Yeni Elan
        </Button>
      </AdminPageHeader>

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
            <div key={announcement.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all group hover:border-gray-200 hover:shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${
                  announcement.priority === 'high' ? 'bg-red-50 text-red-500' :
                  announcement.priority === 'medium' ? 'bg-orange-50 text-orange-500' :
                  'bg-blue-50 text-blue-500'
                }`}>
                  <Megaphone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-secondary group-hover:text-primary transition-colors">{announcement.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 font-medium">
                    {new Date(announcement.date).toLocaleDateString('az-AZ')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit size={20} />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
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
