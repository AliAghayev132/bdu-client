'use client';

import { useState } from 'react';
import { useGetEventsQuery, useDeleteEventMutation, useTogglePublishMutation, useCreateEventMutation, useUpdateEventMutation, useRestoreEventMutation, usePermanentDeleteEventMutation } from '@store/api/eventsApi';
import Card from '@components/admin/ui/Card';
import Button from '@components/admin/ui/Button';
import Table from '@components/admin/ui/Table';
import Modal from '@components/admin/ui/Modal';
import EventsModal from '@components/admin/EventsModal';
import Input from '@components/admin/ui/Input';
import AdminPageHeader from '@components/admin/AdminPageHeader';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Calendar, ExternalLink, RotateCcw, Trash } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EventsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showDeleted, setShowDeleted] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, permanent: false });
  const [eventsModal, setEventsModal] = useState({ isOpen: false, data: null });

  const { data, isLoading, refetch } = useGetEventsQuery({ 
    page, 
    limit: 10, 
    search,
    category,
    showDeleted,
    startDate,
    endDate
  });
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();
  const [togglePublish] = useTogglePublishMutation();
  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const [restoreEvent] = useRestoreEventMutation();
  const [permanentDeleteEvent, { isLoading: isPermanentDeleting }] = usePermanentDeleteEventMutation();

  const handleDelete = async () => {
    try {
      if (deleteModal.permanent) {
        await permanentDeleteEvent(deleteModal.id).unwrap();
        toast.success('Tədbir tamamilə silindi');
      } else {
        await deleteEvent(deleteModal.id).unwrap();
        toast.success('Tədbir silindi');
      }
      setDeleteModal({ isOpen: false, id: null, permanent: false });
      refetch();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const handleRestore = async (id) => {
    try {
      await restoreEvent(id).unwrap();
      toast.success('Tədbir bərpa edildi');
      refetch();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const handlePreview = (row) => {
    const locale = 'az';
    const slug = row.slug?.[locale] || row._id;
    window.open(`http://localhost:3000/events/${slug}`, '_blank');
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

  const handleCreateEvent = async (formData) => {
    try {
      await createEvent(formData).unwrap();
      toast.success('Tədbir yaradıldı');
      setEventsModal({ isOpen: false, data: null });
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Xəta baş verdi');
    }
  };

  const handleUpdateEvent = async (formData) => {
    try {
      await updateEvent({ id: eventsModal.data._id, formData }).unwrap();
      toast.success('Tədbir yeniləndi');
      setEventsModal({ isOpen: false, data: null });
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
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <Calendar size={12} />
            {new Date(row.eventDate).toLocaleDateString('az-AZ')}
            {row.eventTime && ` • ${row.eventTime}`}
          </p>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Yer',
      render: (row) => (
        <span className="text-sm text-gray-600">{row.location?.az || row.location || '-'}</span>
      ),
    },
    {
      key: 'category',
      label: 'Kateqoriya',
      render: (row) => {
        const categoryMap = {
          conference: '🎤 Konfrans',
          seminar: '📚 Seminar',
          workshop: '🛠️ Workshop',
          ceremony: '🎓 Mərasim',
          competition: '🏆 Müsabiqə',
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
                  setEventsModal({ isOpen: true, data: row });
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
        title="Tədbirlər" 
        description="Bütün tədbirləri idarə edin"
      >
        <Button onClick={() => setEventsModal({ isOpen: true, data: null })}>
          <Plus size={20} className="mr-2" />
          Yeni Tədbir
        </Button>
      </AdminPageHeader>

      <Card>
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Tədbir axtar..."
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
              <option value="conference">🎤 Konfrans</option>
              <option value="seminar">📚 Seminar</option>
              <option value="workshop">🛠️ Workshop</option>
              <option value="ceremony">🎓 Mərasim</option>
              <option value="competition">🏆 Müsabiqə</option>
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
              <span className="text-sm font-medium text-secondary">Silinmiş tədbirləri göstər</span>
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
          data={data?.events || []}
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
        title={deleteModal.permanent ? "Tədbirı tamamilə sil" : "Tədbirı sil"}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            {deleteModal.permanent 
              ? "Bu tədbir tamamilə silinəcək və bərpa edilə bilməyəcək. Davam etmək istədiyinizdən əminsiniz?"
              : "Bu tədbirı silmək istədiyinizdən əminsiniz? Sonradan bərpa edə biləcəksiniz."}
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

      <EventsModal
        isOpen={eventsModal.isOpen}
        onClose={() => setEventsModal({ isOpen: false, data: null })}
        onSubmit={eventsModal.data ? handleUpdateEvent : handleCreateEvent}
        initialData={eventsModal.data}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
}
