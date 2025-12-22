'use client';

import { useState } from 'react';
import Card from '@components/admin/ui/Card';
import Button from '@components/admin/ui/Button';
import Input from '@components/admin/ui/Input';
import Table from '@components/admin/ui/Table';
import { Plus, Search, Edit, Trash2, Shield, User } from 'lucide-react';

export default function UsersPage() {
  const [search, setSearch] = useState('');

  const users = [
    { _id: 1, name: 'Admin User', email: 'admin@bdu.edu.az', role: 'admin', createdAt: '2024-01-15' },
    { _id: 2, name: 'Editor User', email: 'editor@bdu.edu.az', role: 'editor', createdAt: '2024-02-20' },
    { _id: 3, name: 'Viewer User', email: 'viewer@bdu.edu.az', role: 'viewer', createdAt: '2024-03-10' },
  ];

  const columns = [
    {
      key: 'name',
      label: 'İstifadəçi',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            {row.name[0]}
          </div>
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Rol',
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs flex items-center gap-1 w-fit ${
          row.role === 'admin' ? 'bg-purple-100 text-purple-700' :
          row.role === 'editor' ? 'bg-blue-100 text-blue-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {row.role === 'admin' ? <Shield size={14} /> : <User size={14} />}
          {row.role === 'admin' ? 'Admin' : row.role === 'editor' ? 'Redaktor' : 'Baxıcı'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Qeydiyyat tarixi',
      render: (row) => new Date(row.createdAt).toLocaleDateString('az-AZ'),
    },
    {
      key: 'actions',
      label: 'Əməliyyatlar',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button className="p-1 text-gray-600 hover:text-blue-600 transition-colors">
            <Edit size={18} />
          </button>
          <button className="p-1 text-gray-600 hover:text-red-600 transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">İstifadəçilər</h1>
          <p className="text-gray-600 mt-1">İstifadəçiləri idarə edin</p>
        </div>
        <Button>
          <Plus size={20} className="mr-2" />
          Yeni İstifadəçi
        </Button>
      </div>

      <Card>
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="İstifadəçi axtar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table columns={columns} data={users} />
      </Card>
    </div>
  );
}
