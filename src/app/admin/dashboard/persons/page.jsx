'use client';

// React
import { useState } from 'react';

// API
import { useGetPersonsQuery, useDeletePersonMutation, useTogglePersonActiveMutation } from '@store/api/personsApi';

// UI Components
import { Card, Button, Table, SearchInput, SelectFilter, FilterBar } from '@components/admin/ui';
import AdminPageHeader from '@components/admin/AdminPageHeader';
import PersonModal from '@components/admin/PersonModal';

// Icons
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

// Utilities
import toast from 'react-hot-toast';
import { confirmDialog } from '@utils/confirmDialog';

export default function PersonsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [personModal, setPersonModal] = useState({ isOpen: false, data: null });

  const { data, isLoading, refetch } = useGetPersonsQuery({ 
    page, 
    limit: 10, 
    search,
    category
  });

  const [deletePerson, { isLoading: isDeleting }] = useDeletePersonMutation();
  const [toggleActive] = useTogglePersonActiveMutation();

  const handleDelete = async (id) => {
    const confirmed = await confirmDialog({
      title: 'Şəxsi sil?',
      text: 'Bu şəxsi silmək istədiyinizdən əminsiniz? Bu əməliyyat geri qaytarıla bilməz.',
      confirmButtonText: 'Bəli, sil',
    });
    if (!confirmed) return;
    try {
      await deletePerson(id).unwrap();
      toast.success('Şəxs silindi');
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
    const slug = row.slug?.az || row._id;
    window.open(`http://localhost:3000/rehberlik/${slug}`, '_blank');
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
      onClick: (row) => handleDelete(row._id),
      variant: 'danger',
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Şəxslər"
        description="Rəhbərlik və heyət üzvlərini idarə edin"
      >
        <Button onClick={() => setPersonModal({ isOpen: true, data: null })}>
          <Plus size={20} className="mr-2" />
          Yeni Şəxs
        </Button>
      </AdminPageHeader>

      <Card>
        <FilterBar
          showClear={!!(search || category !== 'all')}
          onClear={() => {
            setSearch('');
            setCategory('all');
            setPage(1);
          }}
        >
          <SearchInput
            placeholder="Ad, vəzifə və ya email ilə axtar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <SelectFilter
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: 'all', label: 'Bütün Kateqoriyalar' },
              { value: 'leadership', label: 'Rəhbərlik' },
              { value: 'faculty', label: 'Fakültə' },
              { value: 'staff', label: 'Heyət' },
            ]}
          />
        </FilterBar>

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
