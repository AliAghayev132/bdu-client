'use client';

// React
import { useState } from 'react';

// UI Components
import { Card, Button, Input, Table, SearchInput } from '@components/admin/ui';
import AdminPageHeader from '@components/admin/AdminPageHeader';

// Icons
import { Plus, Edit, Trash2, Shield, User } from 'lucide-react';

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
          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-secondary/20">
            {row.name[0]}
          </div>
          <div>
            <p className="font-medium text-secondary">{row.name}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Rol',
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 w-fit ${
          row.role === 'admin' ? 'bg-primary/10 text-primary border border-primary/20' :
          row.role === 'editor' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
          'bg-gray-100 text-gray-700 border border-gray-200'
        }`}>
          {row.role === 'admin' ? <Shield size={14} /> : <User size={14} />}
          {row.role === 'admin' ? 'Admin' : row.role === 'editor' ? 'Redaktor' : 'Baxıcı'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Qeydiyyat tarixi',
      render: (row) => (
        <span className="text-sm text-gray-600 font-medium">
          {new Date(row.createdAt).toLocaleDateString('az-AZ')}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Əməliyyatlar',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Edit size={18} />
          </button>
          <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader 
        title="İstifadəçilər" 
        description="İstifadəçiləri idarə edin"
      >
        <Button>
          <Plus size={20} className="mr-2" />
          Yeni İstifadəçi
        </Button>
      </AdminPageHeader>

      <Card>
        <div className="mb-6 max-w-md">
          <SearchInput
            placeholder="İstifadəçi axtar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Table columns={columns} data={users} />
      </Card>
    </div>
  );
}
