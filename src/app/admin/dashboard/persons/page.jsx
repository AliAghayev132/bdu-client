'use client';

import { useState } from 'react';
import { useGetPersonsQuery, useDeletePersonMutation, useTogglePersonActiveMutation } from '@store/api/personsApi';
import Card from '@components/admin/ui/Card';
import Button from '@components/admin/ui/Button';
import Table from '@components/admin/ui/Table';
import Modal from '@components/admin/ui/Modal';
import Input from '@components/admin/ui/Input';
import AdminPageHeader from '@components/admin/AdminPageHeader';
import PersonModal from '@components/admin/PersonModal';
import { Plus, Edit, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PersonsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [personModal, setPersonModal] = useState({ isOpen: false, data: null });

  const { data, isLoading, refetch } = useGetPersonsQuery({ 
    page, 
    limit: 10, 
    search,
    category
  });

  const [deletePerson, { isLoading: isDeleting }] = useDeletePersonMutation();
  const [toggleActive] = useTogglePersonActiveMutation();

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

  const handlePreview = (row) => {
    const locale = 'az';
    const slug = row.slug?.[locale] || row._id;
    window.open(`http://localhost:3000/university/leadership/${slug}`, '_blank');
  };

  const columns = [
    {
      key: 'name',
      label: 'Ad Soyad',
      render: (row) => (
        <div>
          <p className="font-medium text-secondary">{row.name?.az || row.name}</p>
          <p className="text-xs text-gray-500">{row.position?.az || row.position}</p>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Kateqoriya',
      render: (row) => {
        const categoryLabels = {
          leadership: 'Rəhbərlik',
          faculty: 'Fakültə',
          staff: 'Heyət'
        };
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
            {categoryLabels[row.category] || row.category}
          </span>
        );
      },
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
      key: 'isActive',
      label: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          row.isActive 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          {row.isActive ? 'Aktiv' : 'Deaktiv'}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: 'Baxış',
      icon: Eye,
      onClick: handlePreview,
      variant: 'info',
    },
    {
      label: 'Redaktə',
      icon: Edit,
      onClick: (row) => setPersonModal({ isOpen: true, data: row }),
      variant: 'primary',
    },
    {
      label: (row) => row.isActive ? 'Deaktiv et' : 'Aktiv et',
      icon: (row) => row.isActive ? EyeOff : Eye,
      onClick: (row) => handleToggleActive(row._id),
      variant: 'warning',
    },
    {
      label: 'Sil',
      icon: Trash2,
      onClick: (row) => setDeleteModal({ isOpen: true, id: row._id }),
      variant: 'danger',
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Şəxslər"
        description="Rəhbərlik və heyət üzvlərini idarə edin"
      />

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Ad, vəzifə və ya email ilə axtar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Bütün Kateqoriyalar</option>
            <option value="leadership">Rəhbərlik</option>
            <option value="faculty">Fakültə</option>
            <option value="staff">Heyət</option>
          </select>
          <Button onClick={() => setPersonModal({ isOpen: true, data: null })}>
            <Plus size={18} className="mr-2" />
            Yeni Şəxs
          </Button>
        </div>

        <Table
          columns={columns}
          data={data?.persons || []}
          actions={actions}
          isLoading={isLoading}
          pagination={{
            currentPage: page,
            totalPages: data?.totalPages || 1,
            onPageChange: setPage,
          }}
        />
      </Card>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        title="Şəxsi sil"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Bu şəxsi silmək istədiyinizdən əminsiniz? Bu əməliyyat geri qaytarıla bilməz.
          </p>
          <div className="flex items-center gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, id: null })}
            >
              Ləğv et
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={isDeleting}>
              Sil
            </Button>
          </div>
        </div>
      </Modal>

      {/* Person Modal */}
      <PersonModal
        isOpen={personModal.isOpen}
        onClose={() => setPersonModal({ isOpen: false, data: null })}
        person={personModal.data}
        onSuccess={() => {
          setPersonModal({ isOpen: false, data: null });
          refetch();
        }}
      />
    </div>
  );
}
