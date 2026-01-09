'use client';

import { useState } from 'react';
import { useGetPagesQuery, useDeletePageMutation, useTogglePublishPageMutation, useCreatePageMutation, useUpdatePageMutation } from '@store/api/pagesApi';
import Card from '@components/admin/ui/Card';
import Button from '@components/admin/ui/Button';
import Table from '@components/admin/ui/Table';
import Modal from '@components/admin/ui/Modal';
import PageModal from '@components/admin/PageModal';
import Input from '@components/admin/ui/Input';
import AdminPageHeader from '@components/admin/AdminPageHeader';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, ExternalLink, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PagesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [pageType, setPageType] = useState('all');
  const [showDeleted, setShowDeleted] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [pageModal, setPageModal] = useState({ isOpen: false, data: null });

  const { data, isLoading, refetch } = useGetPagesQuery({ 
    page, 
    limit: 10, 
    search,
    pageType,
    showDeleted,
  });
  const [deletePage, { isLoading: isDeleting }] = useDeletePageMutation();
  const [togglePublish] = useTogglePublishPageMutation();
  const [createPage, { isLoading: isCreating }] = useCreatePageMutation();
  const [updatePage, { isLoading: isUpdating }] = useUpdatePageMutation();

  const handleDelete = async () => {
    try {
      await deletePage(deleteModal.id).unwrap();
      toast.success('Səhifə silindi');
      setDeleteModal({ isOpen: false, id: null });
      refetch();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const handlePreview = (row) => {
    const locale = 'az';
    const path = row.path?.[locale] || row._id;
    window.open(`http://localhost:3000${path}`, '_blank');
  };

  const handleTogglePublish = async (id) => {
    try {
      await togglePublish(id).unwrap();
      toast.success('Status dəyişdirildi');
      refetch();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const handleCreatePage = async (formData) => {
    try {
      await createPage(formData).unwrap();
      toast.success('Səhifə yaradıldı');
      setPageModal({ isOpen: false, data: null });
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Xəta baş verdi');
    }
  };

  const handleUpdatePage = async (formData) => {
    try {
      await updatePage({ id: pageModal.data._id, formData }).unwrap();
      toast.success('Səhifə yeniləndi');
      setPageModal({ isOpen: false, data: null });
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Xəta baş verdi');
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Başlıq',
      render: (row) => (
        <div>
          <p className="font-medium text-secondary">{row.title?.az || row.title}</p>
          <p className="text-xs text-gray-500 mt-1 font-mono">
            {row.path?.az || row.path}
          </p>
        </div>
      ),
    },
    {
      key: 'pageType',
      label: 'Növ',
      render: (row) => {
        const typeMap = {
          static: '📄 Statik',
          card: '🎴 Kart',
          blog: '📝 Bloq',
          list: '📋 Siyahı',
          custom: '⚙️ Xüsusi',
        };
        return (
          <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium border border-primary/10">
            {typeMap[row.pageType] || row.pageType}
          </span>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
          row.isPublished 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-gray-100 text-gray-700 border border-gray-200'
        }`}>
          {row.isPublished ? 'Dərc edilib' : 'Qaralama'}
        </span>
      ),
    },
    {
      key: 'updatedAt',
      label: 'Yenilənmə',
      render: (row) => (
        <span className="text-sm text-gray-600">
          {new Date(row.updatedAt).toLocaleDateString('az-AZ')}
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
              handleTogglePublish(row._id);
            }}
            className="p-1.5 text-gray-500 hover:text-secondary hover:bg-secondary/5 rounded-lg transition-colors"
            title={row.isPublished ? 'Gizlət' : 'Dərc et'}
          >
            {row.isPublished ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPageModal({ isOpen: true, data: row });
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
        title="Səhifələr" 
        description="Bütün səhifələri idarə edin"
      >
        <Button onClick={() => setPageModal({ isOpen: true, data: null })}>
          <Plus size={20} className="mr-2" />
          Yeni Səhifə
        </Button>
      </AdminPageHeader>

      <Card>
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Səhifə axtar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={pageType}
              onChange={(e) => setPageType(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-secondary outline-none transition-all"
            >
              <option value="all">Bütün növlər</option>
              <option value="static">📄 Statik</option>
              <option value="card">🎴 Kart</option>
              <option value="blog">📝 Bloq</option>
              <option value="list">📋 Siyahı</option>
              <option value="custom">⚙️ Xüsusi</option>
            </select>

            <div className="flex items-center gap-4">
              {(search || pageType !== 'all') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearch('');
                    setPageType('all');
                    setPage(1);
                  }}
                >
                  Filterləri təmizlə
                </Button>
              )}
            </div>
          </div>
        </div>

        <Table
          columns={columns}
          data={data?.pages || []}
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
        title="Səhifəni sil"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Bu səhifəni silmək istədiyinizdən əminsiniz?
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

      <PageModal
        isOpen={pageModal.isOpen}
        onClose={() => setPageModal({ isOpen: false, data: null })}
        onSubmit={pageModal.data ? handleUpdatePage : handleCreatePage}
        initialData={pageModal.data}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
}
