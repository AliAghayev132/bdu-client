'use client';

// React
import { useState } from 'react';

// API
import { useGetAnnouncementsQuery, useDeleteAnnouncementMutation, useTogglePublishAnnouncementMutation, useTogglePinAnnouncementMutation, useCreateAnnouncementMutation, useUpdateAnnouncementMutation, useRestoreAnnouncementMutation } from '@store/api/announcementsApi';

// UI Components
import { Card, Button, Table, Input, SearchInput, SelectFilter, FilterBar } from '@components/admin/ui';
import AdminPageHeader from '@components/admin/AdminPageHeader';
import AnnouncementModal from '@components/admin/AnnouncementModal';

// Icons
import { Plus, Edit, Trash2, Eye, EyeOff, Pin, PinOff, RotateCcw } from 'lucide-react';

// Utilities
import toast from 'react-hot-toast';
import { confirmDialog } from '@utils/confirmDialog';

export default function AnnouncementsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [priority, setPriority] = useState('all');
  const [showInactive, setShowInactive] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [announcementModal, setAnnouncementModal] = useState({ isOpen: false, data: null });

  const { data, isLoading, refetch } = useGetAnnouncementsQuery({ 
    page, 
    limit: 10, 
    search,
    type,
    priority,
    showInactive,
    startDate,
    endDate
  });
  const [deleteAnnouncement, { isLoading: isDeleting }] = useDeleteAnnouncementMutation();
  const [togglePublish] = useTogglePublishAnnouncementMutation();
  const [togglePin] = useTogglePinAnnouncementMutation();
  const [createAnnouncement, { isLoading: isCreating }] = useCreateAnnouncementMutation();
  const [updateAnnouncement, { isLoading: isUpdating }] = useUpdateAnnouncementMutation();
  const [restoreAnnouncement] = useRestoreAnnouncementMutation();

  const handleDelete = async (id) => {
    const confirmed = await confirmDialog({
      title: 'Elanı sil?',
      text: 'Bu elanı silmək istədiyinizdən əminsiniz?',
      confirmButtonText: 'Bəli, sil',
    });
    if (!confirmed) return;
    try {
      await deleteAnnouncement(id).unwrap();
      toast.success('Elan silindi');
      refetch();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const handleRestore = async (id) => {
    try {
      await restoreAnnouncement(id).unwrap();
      toast.success('Elan bərpa edildi');
      refetch();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
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

  const handleTogglePin = async (id) => {
    try {
      await togglePin(id).unwrap();
      toast.success('Pin statusu dəyişdirildi');
      refetch();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const handleCreateAnnouncement = async (formData) => {
    try {
      await createAnnouncement(formData).unwrap();
      toast.success('Elan yaradıldı');
      setAnnouncementModal({ isOpen: false, data: null });
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Xəta baş verdi');
    }
  };

  const handleUpdateAnnouncement = async (formData) => {
    try {
      await updateAnnouncement({ id: announcementModal.data._id, formData }).unwrap();
      toast.success('Elan yeniləndi');
      setAnnouncementModal({ isOpen: false, data: null });
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
          <div className="flex items-center gap-2">
            {row.isPinned && <Pin size={14} className="text-yellow-600" />}
            <p className="font-medium text-secondary">{row.title?.az || row.title}</p>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(row.startDate).toLocaleDateString('az-AZ')} - {new Date(row.endDate).toLocaleDateString('az-AZ')}
          </p>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Növ',
      render: (row) => {
        const typeMap = {
          info: 'ℹ️ Məlumat',
          warning: '⚠️ Xəbərdarlıq',
          urgent: '🚨 Təcili',
          event: '📅 Tədbir',
          academic: '🎓 Akademik',
          other: '📌 Digər',
        };
        return (
          <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium border border-primary/10">
            {typeMap[row.type] || row.type}
          </span>
        );
      },
    },
    {
      key: 'priority',
      label: 'Prioritet',
      render: (row) => {
        const priorityMap = {
          low: { label: '🟢 Aşağı', class: 'bg-green-100 text-green-700 border-green-200' },
          medium: { label: '🟡 Orta', class: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
          high: { label: '🟠 Yüksək', class: 'bg-orange-100 text-orange-700 border-orange-200' },
          critical: { label: '🔴 Kritik', class: 'bg-red-100 text-red-700 border-red-200' },
        };
        const p = priorityMap[row.priority] || priorityMap.medium;
        return (
          <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${p.class}`}>
            {p.label}
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
          {row.isActive ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTogglePin(row._id);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  row.isPinned 
                    ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100' 
                    : 'text-gray-500 hover:text-yellow-600 hover:bg-yellow-50'
                }`}
                title={row.isPinned ? 'Pin-i götür' : 'Sancaqla'}
              >
                {row.isPinned ? <PinOff size={18} /> : <Pin size={18} />}
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
                  setAnnouncementModal({ isOpen: true, data: row });
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
            </>
          ) : (
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
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader 
        title="Elanlar" 
        description="Bütün elanları idarə edin"
      >
        <Button onClick={() => setAnnouncementModal({ isOpen: true, data: null })}>
          <Plus size={20} className="mr-2" />
          Yeni Elan
        </Button>
      </AdminPageHeader>

      <Card>
        <FilterBar
          showClear={!!(search || type !== 'all' || priority !== 'all' || startDate || showInactive)}
          onClear={() => {
            setSearch('');
            setType('all');
            setPriority('all');
            setStartDate('');
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
              <span className="text-sm font-medium text-secondary">Silinmiş elanları göstər</span>
            </label>
          }
        >
          <SearchInput
            placeholder="Elan axtar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <SelectFilter
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={[
              { value: 'all', label: 'Bütün növlər' },
              { value: 'info', label: 'ℹ️ Məlumat' },
              { value: 'warning', label: '⚠️ Xəbərdarlıq' },
              { value: 'urgent', label: '� Təcili' },
              { value: 'event', label: '📅 Tədbir' },
              { value: 'academic', label: '🎓 Akademik' },
              { value: 'other', label: '📌 Digər' },
            ]}
          />

          <SelectFilter
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            options={[
              { value: 'all', label: 'Bütün prioritetlər' },
              { value: 'low', label: '🟢 Aşağı' },
              { value: 'medium', label: '🟡 Orta' },
              { value: 'high', label: '🟠 Yüksək' },
              { value: 'critical', label: '🔴 Kritik' },
            ]}
          />

          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Başlanğıc tarixi"
          />
        </FilterBar>

        <Table
          columns={columns}
          data={data?.announcements || []}
          loading={isLoading}
          pagination={{
            currentPage: page,
            totalPages: data?.totalPages || 1,
            onPageChange: setPage,
          }}
        />
      </Card>

      <AnnouncementModal
        isOpen={announcementModal.isOpen}
        onClose={() => setAnnouncementModal({ isOpen: false, data: null })}
        onSubmit={announcementModal.data ? handleUpdateAnnouncement : handleCreateAnnouncement}
        initialData={announcementModal.data}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
}
