'use client';

import { useState } from 'react';
import { useGetNewsQuery, useDeleteNewsMutation, useTogglePublishMutation, useCreateNewsMutation, useUpdateNewsMutation, useRestoreNewsMutation, usePermanentDeleteNewsMutation } from '@store/api/newsApi';
import Card from '@components/admin/ui/Card';
import Button from '@components/admin/ui/Button';
import Table from '@components/admin/ui/Table';
import Modal from '@components/admin/ui/Modal';
import NewsModal from '@components/admin/NewsModal';
import Input from '@components/admin/ui/Input';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, ExternalLink, RotateCcw, Trash } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showDeleted, setShowDeleted] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, permanent: false });
  const [newsModal, setNewsModal] = useState({ isOpen: false, data: null });

  const { data, isLoading, refetch } = useGetNewsQuery({ 
    page, 
    limit: 10, 
    search,
    category,
    showDeleted,
    startDate,
    endDate
  });
  const [deleteNews, { isLoading: isDeleting }] = useDeleteNewsMutation();
  const [togglePublish] = useTogglePublishMutation();
  const [createNews, { isLoading: isCreating }] = useCreateNewsMutation();
  const [updateNews, { isLoading: isUpdating }] = useUpdateNewsMutation();
  const [restoreNews] = useRestoreNewsMutation();
  const [permanentDeleteNews, { isLoading: isPermanentDeleting }] = usePermanentDeleteNewsMutation();

  const handleDelete = async () => {
    try {
      if (deleteModal.permanent) {
        await permanentDeleteNews(deleteModal.id).unwrap();
        toast.success('Xəbər tamamilə silindi');
      } else {
        await deleteNews(deleteModal.id).unwrap();
        toast.success('Xəbər silindi');
      }
      setDeleteModal({ isOpen: false, id: null, permanent: false });
      refetch();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const handleRestore = async (id) => {
    try {
      await restoreNews(id).unwrap();
      toast.success('Xəbər bərpa edildi');
      refetch();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const handlePreview = (row) => {
    const locale = 'az';
    const slug = row.slug?.[locale] || row._id;
    window.open(`http://localhost:3000/news/${slug}`, '_blank');
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

  const handleCreateNews = async (formData) => {
    try {
      await createNews(formData).unwrap();
      toast.success('Xəbər yaradıldı');
      setNewsModal({ isOpen: false, data: null });
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Xəta baş verdi');
    }
  };

  const handleUpdateNews = async (formData) => {
    try {
      await updateNews({ id: newsModal.data._id, formData }).unwrap();
      toast.success('Xəbər yeniləndi');
      setNewsModal({ isOpen: false, data: null });
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
          <p className="font-medium">{row.title?.az || row.title}</p>
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
          university: '🏛️ Universitet',
          education: '📚 Təhsil',
          science: '🔬 Elm',
          events: '🎉 Tədbirlər',
          other: '📌 Digər',
        };
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
            {categoryMap[row.category] || row.category}
          </span>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs ${
          row.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {row.isPublished ? 'Dərc edilib' : 'Qaralama'}
        </span>
      ),
    },
    {
      key: 'views',
      label: 'Baxış',
      render: (row) => row.views || 0,
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
                className="p-1 text-gray-600 hover:text-green-600 transition-colors"
                title="Önizləmə"
              >
                <ExternalLink size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTogglePublish(row._id);
                }}
                className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                title={row.isPublished ? 'Gizlət' : 'Dərc et'}
              >
                {row.isPublished ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNewsModal({ isOpen: true, data: row });
                }}
                className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                title="Redaktə et"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteModal({ isOpen: true, id: row._id, permanent: false });
                }}
                className="p-1 text-gray-600 hover:text-red-600 transition-colors"
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
                className="p-1 text-gray-600 hover:text-green-600 transition-colors"
                title="Bərpa et"
              >
                <RotateCcw size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteModal({ isOpen: true, id: row._id, permanent: true });
                }}
                className="p-1 text-gray-600 hover:text-red-600 transition-colors"
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Xəbərlər</h1>
          <p className="text-gray-600 mt-1">Bütün xəbərləri idarə edin</p>
        </div>
        <Button onClick={() => setNewsModal({ isOpen: true, data: null })}>
          <Plus size={20} className="mr-2" />
          Yeni Xəbər
        </Button>
      </div>

      <Card>
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Xəbər axtar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">Bütün kateqoriyalar</option>
              <option value="university">🏛️ Universitet</option>
              <option value="education">📚 Təhsil</option>
              <option value="science">🔬 Elm</option>
              <option value="events">🎉 Tədbirlər</option>
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
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Silinmiş xəbərləri göstər</span>
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
          data={data?.news || []}
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
        title={deleteModal.permanent ? "Xəbəri tamamilə sil" : "Xəbəri sil"}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            {deleteModal.permanent 
              ? "Bu xəbər tamamilə silinəcək və bərpa edilə bilməyəcək. Davam etmək istədiyinizdən əminsiniz?"
              : "Bu xəbəri silmək istədiyinizdən əminsiniz? Sonradan bərpa edə biləcəksiniz."}
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

      <NewsModal
        isOpen={newsModal.isOpen}
        onClose={() => setNewsModal({ isOpen: false, data: null })}
        onSubmit={newsModal.data ? handleUpdateNews : handleCreateNews}
        initialData={newsModal.data}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
}
