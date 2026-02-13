'use client';

// React
import { useState } from 'react';

// API
import { useGetFacultiesQuery, useDeleteFacultyMutation, useToggleActiveFacultyMutation, useCreateFacultyMutation, useUpdateFacultyMutation } from '@store/api/facultiesApi';

// UI Components
import { Card, Button, Table, SearchInput, FilterBar } from '@components/admin/ui';
import AdminPageHeader from '@components/admin/AdminPageHeader';
import FacultyModal from '@components/admin/FacultyModal';

// Icons
import { Plus, Edit, Trash2, Eye, EyeOff, Building2, ExternalLink } from 'lucide-react';

// Utilities
import toast from 'react-hot-toast';
import { confirmDialog } from '@utils/confirmDialog';

export default function FacultiesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [facultyModal, setFacultyModal] = useState({ isOpen: false, data: null });

  const { data, isLoading, refetch } = useGetFacultiesQuery({ 
    page, 
    limit: 10, 
    search,
    showInactive,
  });
  const [deleteFaculty, { isLoading: isDeleting }] = useDeleteFacultyMutation();
  const [toggleActive] = useToggleActiveFacultyMutation();
  const [createFaculty, { isLoading: isCreating }] = useCreateFacultyMutation();
  const [updateFaculty, { isLoading: isUpdating }] = useUpdateFacultyMutation();

  const handleDelete = async (id) => {
    const confirmed = await confirmDialog({
      title: 'Fakültəni sil?',
      text: 'Bu fakültəni silmək istədiyinizdən əminsiniz? Bu əməliyyat fakültəyə aid bütün məlumatları silə bilər.',
      confirmButtonText: 'Bəli, sil',
      icon: 'error',
    });
    if (!confirmed) return;
    try {
      await deleteFaculty(id).unwrap();
      toast.success('Fakültə silindi');
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

  const handleCreateFaculty = async (formData) => {
    try {
      await createFaculty(formData).unwrap();
      toast.success('Fakültə yaradıldı');
      setFacultyModal({ isOpen: false, data: null });
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Xəta baş verdi');
    }
  };

  const handleUpdateFaculty = async (formData) => {
    try {
      await updateFaculty({ id: facultyModal.data._id, formData }).unwrap();
      toast.success('Fakültə yeniləndi');
      setFacultyModal({ isOpen: false, data: null });
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Xəta baş verdi');
    }
  };

  const handlePreview = (row) => {
    window.open(`http://${row.subdomain}.localhost:3000`, '_blank');
  };

  const columns = [
    {
      key: 'name',
      label: 'Fakültə',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.logo ? (
            <img
              src={row.logo.startsWith('http') ? row.logo : `http://localhost:3001${row.logo}`}
              alt={row.name?.az}
              className="w-12 h-12 rounded-lg object-contain border border-gray-100"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 size={24} className="text-primary" />
            </div>
          )}
          <div>
            <p className="font-medium text-secondary">{row.name?.az || row.name}</p>
            <p className="text-xs text-gray-500 font-mono">{row.subdomain}.bdu.edu.az</p>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      label: 'Əlaqə',
      render: (row) => (
        <div className="text-sm">
          {row.contactInfo?.email && <p className="text-gray-600">{row.contactInfo.email}</p>}
          {row.contactInfo?.phone && <p className="text-gray-500 text-xs">{row.contactInfo.phone}</p>}
        </div>
      ),
    },
    {
      key: 'modules',
      label: 'Modullar',
      render: (row) => (
        <div className="flex gap-1">
          {row.settings?.allowNews && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Xəbər</span>}
          {row.settings?.allowBlogs && <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Bloq</span>}
          {row.settings?.allowEvents && <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Tədbir</span>}
        </div>
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
              handlePreview(row);
            }}
            className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
            title="Önizləmə"
          >
            <ExternalLink size={18} />
          </button>
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
              setFacultyModal({ isOpen: true, data: row });
            }}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Redaktə et"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row._id);
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
        title="Fakültələr" 
        description="Universitet fakültələrini idarə edin (Super Admin)"
      >
        <Button onClick={() => setFacultyModal({ isOpen: true, data: null })}>
          <Plus size={20} className="mr-2" />
          Yeni Fakültə
        </Button>
      </AdminPageHeader>

      <Card>
        <FilterBar
          showClear={!!(search || showInactive)}
          onClear={() => {
            setSearch('');
            setShowInactive(false);
            setPage(1);
          }}
          checkboxes={
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="w-4 h-4 text-primary rounded focus:ring-primary border-gray-300"
              />
              <span className="text-sm font-medium text-secondary">Deaktivləri göstər</span>
            </label>
          }
        >
          <SearchInput
            placeholder="Fakültə axtar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </FilterBar>

        <Table
          columns={columns}
          data={data?.faculties || []}
          loading={isLoading}
          pagination={{
            currentPage: page,
            totalPages: data?.totalPages || 1,
            onPageChange: setPage,
          }}
        />
      </Card>

      <FacultyModal
        isOpen={facultyModal.isOpen}
        onClose={() => setFacultyModal({ isOpen: false, data: null })}
        onSubmit={facultyModal.data ? handleUpdateFaculty : handleCreateFaculty}
        initialData={facultyModal.data}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
}
