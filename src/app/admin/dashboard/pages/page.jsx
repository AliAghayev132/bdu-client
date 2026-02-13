'use client';

// React & Next.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// API
import { useGetPagesQuery, useDeletePageMutation, useTogglePublishPageMutation } from '@store/api/pagesApi';

// UI Components
import { Card, Button, Table, SearchInput, SelectFilter, FilterBar } from '@components/admin/ui';
import AdminPageHeader from '@components/admin/AdminPageHeader';
import PageColumnsModal from '@components/admin/PageColumnsModal';

// Icons
import { Plus, Edit, Trash2, Eye, EyeOff, ExternalLink, FileText, Columns } from 'lucide-react';

// Utilities
import toast from 'react-hot-toast';
import { confirmDialog } from '@utils/confirmDialog';

export default function PagesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [pageType, setPageType] = useState('all');
  const [showDeleted, setShowDeleted] = useState(false);
  const [columnsModal, setColumnsModal] = useState({ isOpen: false, data: null });

  const { data, isLoading, refetch } = useGetPagesQuery({ 
    page, 
    limit: 10, 
    search,
    pageType,
    showDeleted,
  });
  const [deletePage, { isLoading: isDeleting }] = useDeletePageMutation();
  const [togglePublish] = useTogglePublishPageMutation();

  const handleDelete = async (id) => {
    const confirmed = await confirmDialog({
      title: 'Səhifəni sil?',
      text: 'Bu səhifəni silmək istədiyinizdən əminsiniz?',
      confirmButtonText: 'Bəli, sil',
    });
    if (!confirmed) return;
    try {
      await deletePage(id).unwrap();
      toast.success('Səhifə silindi');
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
          personPage: '👥 Şəxslər',
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
          {row.pageType === 'personPage' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setColumnsModal({ isOpen: true, data: row });
              }}
              className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              title="Sütunları İdarə Et"
            >
              <Columns size={18} />
            </button>
          )}
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
              router.push(`/admin/dashboard/pages/${row._id}/edit`);
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
        title="Səhifələr" 
        description="Bütün səhifələri idarə edin"
      >
        <Button onClick={() => router.push('/admin/dashboard/pages/create')}>
          <Plus size={20} className="mr-2" />
          Yeni Səhifə
        </Button>
      </AdminPageHeader>

      <Card>
        <FilterBar
          showClear={!!(search || pageType !== 'all')}
          onClear={() => {
            setSearch('');
            setPageType('all');
            setPage(1);
          }}
        >
          <SearchInput
            placeholder="Səhifə axtar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <SelectFilter
            value={pageType}
            onChange={(e) => setPageType(e.target.value)}
            options={[
              { value: 'all', label: 'Bütün növlər' },
              { value: 'static', label: '📄 Statik' },
              { value: 'card', label: '� Kart' },
              { value: 'blog', label: '📝 Bloq' },
              { value: 'list', label: '📋 Siyahı' },
              { value: 'custom', label: '⚙️ Xüsusi' },
              { value: 'personPage', label: '👥 Şəxslər' },
            ]}
          />
        </FilterBar>

        <Table
          columns={columns}
          data={data?.pages || []}
          loading={isLoading}
          pagination={{
            currentPage: page,
            totalPages: data?.totalPages || 1,
            onPageChange: setPage,
          }}
        />
      </Card>

      <PageColumnsModal
        isOpen={columnsModal.isOpen}
        onClose={() => setColumnsModal({ isOpen: false, data: null })}
        page={columnsModal.data}
        onSuccess={() => {
          setColumnsModal({ isOpen: false, data: null });
          refetch();
        }}
      />
    </div>
  );
}
