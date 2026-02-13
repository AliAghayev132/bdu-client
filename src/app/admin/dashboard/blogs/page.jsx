'use client';

// React & Next.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// API
import { useGetBlogsQuery, useDeleteBlogMutation, useTogglePublishBlogMutation, useRestoreBlogMutation, usePermanentDeleteBlogMutation } from '@store/api/blogsApi';

// UI Components
import { Card, Button, Table, Input, SearchInput, SelectFilter, FilterBar } from '@components/admin/ui';
import AdminPageHeader from '@components/admin/AdminPageHeader';

// Icons
import { Plus, Edit, Trash2, Eye, EyeOff, ExternalLink, RotateCcw, Trash } from 'lucide-react';

// Utilities
import toast from 'react-hot-toast';
import { confirmDialog } from '@utils/confirmDialog';

export default function BlogsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showDeleted, setShowDeleted] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { data, isLoading, refetch } = useGetBlogsQuery({ 
    page, 
    limit: 10, 
    search,
    category,
    showDeleted,
    startDate,
    endDate
  });
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();
  const [togglePublish] = useTogglePublishBlogMutation();
  const [restoreBlog] = useRestoreBlogMutation();
  const [permanentDeleteBlog, { isLoading: isPermanentDeleting }] = usePermanentDeleteBlogMutation();

  const handleDelete = async (id, permanent = false) => {
    const confirmed = await confirmDialog({
      title: permanent ? 'Tamamilə silinsin?' : 'Bloqu sil?',
      text: permanent
        ? 'Bu bloq tamamilə silinəcək və bərpa edilə bilməyəcək.'
        : 'Bu bloqu silmək istədiyinizdən əminsiniz?',
      confirmButtonText: permanent ? 'Tamamilə sil' : 'Bəli, sil',
      icon: permanent ? 'error' : 'warning',
    });
    if (!confirmed) return;
    try {
      if (permanent) {
        await permanentDeleteBlog(id).unwrap();
        toast.success('Bloq tamamilə silindi');
      } else {
        await deleteBlog(id).unwrap();
        toast.success('Bloq silindi');
      }
      refetch();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const handleRestore = async (id) => {
    try {
      await restoreBlog(id).unwrap();
      toast.success('Bloq bərpa edildi');
      refetch();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const handlePreview = (row) => {
    const slug = row.slug?.az || row._id;
    const previewQuery = row.isPublished ? '' : '?preview=true';
    window.open(`/az/bloqlar/${slug}${previewQuery}`, '_blank');
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
          <p className="text-xs text-gray-500 mt-1">
            {new Date(row.createdAt).toLocaleDateString('az-AZ')}
          </p>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Kateqoriya',
      render: (row) => {
        const categoryMap = {
          academic: '📚 Akademik',
          research: '🔬 Tədqiqat',
          student_life: '🎓 Tələbə həyatı',
          alumni: '👥 Məzunlar',
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
      key: 'views',
      label: 'Baxış',
      render: (row) => (
        <span className="text-sm font-medium text-gray-600">{row.views || 0}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Əməliyyatlar',
      render: (row) => (
        <div className="flex items-center gap-2">
          {!row.isDeleted ? (
            <>
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
                  router.push(`/admin/dashboard/blogs/${row._id}/edit`);
                }}
                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Redaktə et"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(row._id, false);
                }}
                className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Sil"
              >
                <Trash2 size={18} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRestore(row._id);
                }}
                className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Bərpa et"
              >
                <RotateCcw size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(row._id, true);
                }}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Tamamilə sil"
              >
                <Trash size={18} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader 
        title="Bloqlar" 
        description="Bütün bloqları idarə edin"
      >
        <Button onClick={() => router.push('/admin/dashboard/blogs/create')}>
          <Plus size={20} className="mr-2" />
          Yeni Bloq
        </Button>
      </AdminPageHeader>

      <Card>
        <FilterBar
          showClear={!!(search || category !== 'all' || startDate || endDate || showDeleted)}
          onClear={() => {
            setSearch('');
            setCategory('all');
            setStartDate('');
            setEndDate('');
            setShowDeleted(false);
            setPage(1);
          }}
          checkboxes={
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showDeleted}
                onChange={(e) => setShowDeleted(e.target.checked)}
                className="w-4 h-4 text-primary rounded focus:ring-primary border-gray-300"
              />
              <span className="text-sm font-medium text-secondary">Silinmiş bloqları göstər</span>
            </label>
          }
        >
          <SearchInput
            placeholder="Bloq axtar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <SelectFilter
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: 'all', label: 'Bütün kateqoriyalar' },
              { value: 'academic', label: '📚 Akademik' },
              { value: 'research', label: '🔬 Tədqiqat' },
              { value: 'student_life', label: '🎓 Tələbə həyatı' },
              { value: 'alumni', label: '👥 Məzunlar' },
              { value: 'other', label: '📌 Digər' },
            ]}
          />

          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Başlanğıc tarixi"
          />

          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="Son tarix"
          />
        </FilterBar>

        <Table
          columns={columns}
          data={data?.blogs || []}
          loading={isLoading}
          pagination={{
            currentPage: page,
            totalPages: data?.totalPages || 1,
            onPageChange: setPage,
          }}
        />
      </Card>


    </div>
  );
}
