'use client';

import { useState } from 'react';
import Card from '@components/admin/ui/Card';
import Button from '@components/admin/ui/Button';
import Input from '@components/admin/ui/Input';
import AdminPageHeader from '@components/admin/AdminPageHeader';
import { Save, Globe, Bell, Lock, Palette } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Bakı Dövlət Universiteti',
    siteUrl: 'https://bdu.edu.az',
    adminEmail: 'admin@bdu.edu.az',
    language: 'az',
    notifications: true,
  });

  const handleSave = () => {
    toast.success('Parametrlər yadda saxlanıldı');
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader 
        title="Parametrlər" 
        description="Sistem parametrlərini idarə edin"
      >
        <Button onClick={handleSave}>
          <Save size={20} className="mr-2" />
          Dəyişiklikləri yadda saxla
        </Button>
      </AdminPageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Ümumi Parametrlər" action={<Globe size={20} className="text-gray-400" />}>
          <div className="space-y-4">
            <Input
              label="Sayt adı"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            />
            <Input
              label="Sayt URL"
              value={settings.siteUrl}
              onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
            />
            <Input
              label="Admin email"
              type="email"
              value={settings.adminEmail}
              onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dil</label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-secondary transition-all"
              >
                <option value="az">Azərbaycan</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </Card>

        <Card title="Bildirişlər" action={<Bell size={20} className="text-gray-400" />}>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                className="w-5 h-5 text-secondary rounded focus:ring-2 focus:ring-secondary/20 border-gray-300"
              />
              <div>
                <p className="font-medium text-secondary">Email bildirişləri</p>
                <p className="text-sm text-gray-500">Yeni məzmun əlavə edildikdə bildiriş al</p>
              </div>
            </label>
          </div>
        </Card>

        <Card title="Təhlükəsizlik" action={<Lock size={20} className="text-gray-400" />}>
          <div className="space-y-4">
            <Input
              label="Cari şifrə"
              type="password"
              placeholder="••••••••"
            />
            <Input
              label="Yeni şifrə"
              type="password"
              placeholder="••••••••"
            />
            <Input
              label="Yeni şifrəni təsdiqlə"
              type="password"
              placeholder="••••••••"
            />
            <Button variant="secondary" className="w-full">
              Şifrəni dəyiş
            </Button>
          </div>
        </Card>

        <Card title="Görünüş" action={<Palette size={20} className="text-gray-400" />}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Tema</label>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-4 border-2 border-secondary rounded-xl bg-white relative overflow-hidden group">
                  <div className="w-full h-20 bg-gradient-to-br from-gray-50 to-white rounded mb-2 border border-gray-100"></div>
                  <p className="text-sm font-bold text-secondary">İşıq</p>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full"></div>
                </button>
                <button className="p-4 border-2 border-gray-200 rounded-xl bg-white hover:border-secondary/50 transition-colors group">
                  <div className="w-full h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded mb-2 shadow-inner"></div>
                  <p className="text-sm font-medium text-gray-600 group-hover:text-secondary">Qaranlıq</p>
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
