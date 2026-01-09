'use client';

import { useState } from 'react';
import { useGetBlogsQuery, useDeleteBlogMutation, useTogglePublishBlogMutation, useCreateBlogMutation, useUpdateBlogMutation, useRestoreBlogMutation, usePermanentDeleteBlogMutation } from '@store/api/blogsApi';
import Card from '@components/admin/ui/Card';
import Button from '@components/admin/ui/Button';
import Table from '@components/admin/ui/Table';
import Modal from '@components/admin/ui/Modal';
import BlogModal from '@components/admin/BlogModal';
import Input from '@components/admin/ui/Input';
import AdminPageHeader from '@components/admin/AdminPageHeader';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, ExternalLink, RotateCcw, Trash } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BlogsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showDeleted, setShowDeleted] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, permanent: false });
  const [blogModal, setBlogModal] = useState({ isOpen: false, data: null });

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
  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const [restoreBlog] = useRestoreBlogMutation();
  const [permanentDeleteBlog, { isLoading: isPermanentDeleting }] = usePermanentDeleteBlogMutation();

  const handleDelete = async () => {
    try {
      if (deleteModal.permanent) {
        await permanentDeleteBlog(deleteModal.id).unwrap();
        toast.success('Bloq tamamilə silindi');
      } else {
        await deleteBlog(deleteModal.id).unwrap();
        toast.success('Bloq silindi');
      }
      setDeleteModal({ isOpen: false, id: null, permanent: false });
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
    const locale = 'az';
    const slug = row.slug?.[locale] || row._id;
    window.open(`http://localhost:3000/blogs/${slug}`, '_blank');
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

  const handleCreateBlog = async (formData) => {
    try {
      await createBlog(formData).unwrap();
      toast.success('Bloq yaradıldı');
      setBlogModal({ isOpen: false, data: null });
      refetch();
    } catch (error) {
      const errorMsg = error?.data?.message?.message || error?.data?.message || 'Xəta baş verdi';
      toast.error(errorMsg);
    }
  };

  const handleUpdateBlog = async (formData) => {
    try {
      await updateBlog({ id: blogModal.data._id, formData }).unwrap();
      toast.success('Bloq yeniləndi');
      setBlogModal({ isOpen: false, data: null });
      refetch();
    } catch (error) {
      const errorMsg = error?.data?.message?.message || error?.data?.message || 'Xəta baş verdi';
      toast.error(errorMsg);
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
                  setBlogModal({ isOpen: true, data: row });
                }}
                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Redaktə et"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteModal({ isOpen: true, id: row._id, permanent: false });
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
                  setDeleteModal({ isOpen: true, id: row._id, permanent: true });
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
        <Button onClick={() => setBlogModal({ isOpen: true, data: null })}>
          <Plus size={20} className="mr-2" />
          Yeni Bloq
        </Button>
      </AdminPageHeader>

      <Card>
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Bloq axtar..."
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
              <option value="academic">📚 Akademik</option>
              <option value="research">🔬 Tədqiqat</option>
              <option value="student_life">🎓 Tələbə həyatı</option>
              <option value="alumni">👥 Məzunlar</option>
              <option value="other">📌 Digər</option>
            </select>

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
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showDeleted}
                onChange={(e) => setShowDeleted(e.target.checked)}
                className="w-4 h-4 text-primary rounded focus:ring-primary border-gray-300"
              />
              <span className="text-sm font-medium text-secondary">Silinmiş bloqları göstər</span>
            </label>

            {(search || category !== 'all' || startDate || endDate || showDeleted) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setCategory('all');
                  setStartDate('');
                  setEndDate('');
                  setShowDeleted(false);
                  setPage(1);
                }}
              >
                Filterləri təmizlə
              </Button>
            )}
          </div>
        </div>

        <Table
          columns={columns}
          data={data?.blogs || []}
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
        onClose={() => setDeleteModal({ isOpen: false, id: null, permanent: false })}
        title={deleteModal.permanent ? "Bloqu tamamilə sil" : "Bloqu sil"}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            {deleteModal.permanent 
              ? "Bu bloq tamamilə silinəcək və bərpa edilə bilməyəcək. Davam etmək istədiyinizdən əminsiniz?"
              : "Bu bloqu silmək istədiyinizdən əminsiniz? Sonradan bərpa edə biləcəksiniz."}
          </p>
          <div className="flex items-center gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, id: null, permanent: false })}
            >
              Ləğv et
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={isDeleting || isPermanentDeleting}
            >
              {deleteModal.permanent ? 'Tamamilə sil' : 'Sil'}
            </Button>
          </div>
        </div>
      </Modal>

      <BlogModal
        isOpen={blogModal.isOpen}
        onClose={() => setBlogModal({ isOpen: false, data: null })}
        onSubmit={blogModal.data ? handleUpdateBlog : handleCreateBlog}
        initialData={blogModal.data}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
}
