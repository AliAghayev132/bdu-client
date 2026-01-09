'use client';

import { useState } from 'react';
import { useGetPersonsQuery, useDeletePersonMutation, useToggleActivePersonMutation, useCreatePersonMutation, useUpdatePersonMutation } from '@store/api/personsApi';
import Card from '@components/admin/ui/Card';
import Button from '@components/admin/ui/Button';
import Table from '@components/admin/ui/Table';
import Modal from '@components/admin/ui/Modal';
import PersonModal from '@components/admin/PersonModal';
import Input from '@components/admin/ui/Input';
import AdminPageHeader from '@components/admin/AdminPageHeader';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PersonsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showInactive, setShowInactive] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [personModal, setPersonModal] = useState({ isOpen: false, data: null });

  const { data, isLoading, refetch } = useGetPersonsQuery({ 
    page, 
    limit: 10, 
    search,
    category,
    showInactive,
  });
  const [deletePerson, { isLoading: isDeleting }] = useDeletePersonMutation();
  const [toggleActive] = useToggleActivePersonMutation();
  const [createPerson, { isLoading: isCreating }] = useCreatePersonMutation();
  const [updatePerson, { isLoading: isUpdating }] = useUpdatePersonMutation();

  const handleDelete = async () => {
    try {
      await deletePerson(deleteModal.id).unwrap();
      toast.success('Şəxs silindi');
      setDeleteModal({ isOpen: false, id: null });
      refetch();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await toggleActive(id).unwrap();
      toast.success('Status dəyişdirildi');
      refetch();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const handleCreatePerson = async (formData) => {
    try {
      await createPerson(formData).unwrap();
      toast.success('Şəxs əlavə edildi');
      setPersonModal({ isOpen: false, data: null });
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Xəta baş verdi');
    }
  };

  const handleUpdatePerson = async (formData) => {
    try {
      await updatePerson({ id: personModal.data._id, formData }).unwrap();
      toast.success('Şəxs yeniləndi');
      setPersonModal({ isOpen: false, data: null });
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Xəta baş verdi');
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Ad Soyad',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.image ? (
            <img
              src={row.image.startsWith('http') ? row.image : `http://localhost:3001${row.image}`}
              alt={row.name?.az}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User size={20} className="text-primary" />
            </div>
          )}
          <div>
            <p className="font-medium text-secondary">{row.name?.az || row.name}</p>
            <p className="text-xs text-gray-500">{row.position?.az || row.position}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      label: 'Əlaqə',
      render: (row) => (
        <div className="text-sm">
          {row.email && <p className="text-gray-600">{row.email}</p>}
          {row.phone && <p className="text-gray-500 text-xs">{row.phone}</p>}
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Kateqoriya',
      render: (row) => {
        const categoryMap = {
          leadership: '👔 Rəhbərlik',
          faculty: '👨‍🏫 Müəllimlər',
          staff: '👥 Əməkdaşlar',
          other: '📌 Digər',
        };
        return (
          <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium border border-primary/10">
            {categoryMap[row.category] || row.category}
          </span>
        );
      },
    },
    {
      key: 'department',
      label: 'Departament',
      render: (row) => (
        <span className="text-sm text-gray-600">{row.department || '-'}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
          row.isActive 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-gray-100 text-gray-700 border border-gray-200'
        }`}>
          {row.isActive ? 'Aktiv' : 'Deaktiv'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Əməliyyatlar',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleActive(row._id);
            }}
            className="p-1.5 text-gray-500 hover:text-secondary hover:bg-secondary/5 rounded-lg transition-colors"
            title={row.isActive ? 'Deaktiv et' : 'Aktiv et'}
          >
            {row.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPersonModal({ isOpen: true, data: row });
            }}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Redaktə et"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModal({ isOpen: true, id: row._id });
            }}
            className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Sil"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader 
        title="Kadr" 
        description="Müəllim və əməkdaşları idarə edin"
      >
        <Button onClick={() => setPersonModal({ isOpen: true, data: null })}>
          <Plus size={20} className="mr-2" />
          Yeni Şəxs
        </Button>
      </AdminPageHeader>

      <Card>
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Şəxs axtar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-secondary outline-none transition-all"
            >
              <option value="all">Bütün kateqoriyalar</option>
              <option value="leadership">👔 Rəhbərlik</option>
              <option value="faculty">👨‍🏫 Müəllimlər</option>
              <option value="staff">👥 Əməkdaşlar</option>
              <option value="other">📌 Digər</option>
            </select>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                  className="w-4 h-4 text-primary rounded focus:ring-primary border-gray-300"
                />
                <span className="text-sm font-medium text-secondary">Deaktivləri göstər</span>
              </label>
            </div>
          </div>

          {(search || category !== 'all' || showInactive) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch('');
                setCategory('all');
                setShowInactive(false);
                setPage(1);
              }}
            >
              Filterləri təmizlə
            </Button>
          )}
        </div>

        <Table
          columns={columns}
          data={data?.persons || []}
          loading={isLoading}
        />

        {data?.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Əvvəlki
            </Button>
            <span className="text-sm text-gray-600">
              Səhifə {page} / {data.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === data.totalPages}
            >
              Növbəti
            </Button>
          </div>
        )}
      </Card>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        title="Şəxsi sil"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Bu şəxsi silmək istədiyinizdən əminsiniz?
          </p>
          <div className="flex items-center gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, id: null })}
            >
              Ləğv et
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={isDeleting}
            >
              Sil
            </Button>
          </div>
        </div>
      </Modal>

      <PersonModal
        isOpen={personModal.isOpen}
        onClose={() => setPersonModal({ isOpen: false, data: null })}
        onSubmit={personModal.data ? handleUpdatePerson : handleCreatePerson}
        initialData={personModal.data}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
}
