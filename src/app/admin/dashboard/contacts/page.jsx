'use client';

// React
import { useState } from 'react';

// API
import { useGetContactsQuery, useDeleteContactMutation, useRestoreContactMutation, usePermanentDeleteContactMutation, useUpdateContactStatusMutation, useGetContactStatsQuery } from '@store/api/contactApi';

// UI Components
import { Card, Button, Table, Modal, Input, Textarea, SearchInput, SelectFilter, FilterBar } from '@components/admin/ui';
import AdminPageHeader from '@components/admin/AdminPageHeader';

// Icons
import { Mail, MailOpen, CheckCircle, Archive, RotateCcw, Trash, Trash2 } from 'lucide-react';

// Utilities
import toast from 'react-hot-toast';
import { confirmDialog } from '@utils/confirmDialog';

export default function ContactsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [showDeleted, setShowDeleted] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });
  const [statusModal, setStatusModal] = useState({ isOpen: false, id: null, currentStatus: '', adminNotes: '' });

  const { data, isLoading, refetch } = useGetContactsQuery({ 
    page, 
    limit: 10, 
    search,
    status,
    showDeleted,
    startDate,
    endDate
  });
  
  const { data: stats } = useGetContactStatsQuery();
  const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();
  const [restoreContact] = useRestoreContactMutation();
  const [permanentDeleteContact, { isLoading: isPermanentDeleting }] = usePermanentDeleteContactMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateContactStatusMutation();

  const handleDelete = async (id, permanent = false) => {
    const confirmed = await confirmDialog({
      title: permanent ? 'Tamamilə silinsin?' : 'Müraciəti sil?',
      text: permanent
        ? 'Bu müraciət tamamilə silinəcək və bərpa edilə bilməyəcək.'
        : 'Bu müraciəti silmək istədiyinizdən əminsiniz?',
      confirmButtonText: permanent ? 'Tamamilə sil' : 'Bəli, sil',
      icon: permanent ? 'error' : 'warning',
    });
    if (!confirmed) return;
    try {
      if (permanent) {
        await permanentDeleteContact(id).unwrap();
        toast.success('Müraciət tamamilə silindi');
      } else {
        await deleteContact(id).unwrap();
        toast.success('Müraciət silindi');
      }
      refetch();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const handleRestore = async (id) => {
    try {
      await restoreContact(id).unwrap();
      toast.success('Müraciət bərpa edildi');
      refetch();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const handleUpdateStatus = async () => {
    try {
      await updateStatus({
        id: statusModal.id,
        status: statusModal.currentStatus,
        adminNotes: statusModal.adminNotes,
      }).unwrap();
      toast.success('Status yeniləndi');
      setStatusModal({ isOpen: false, id: null, currentStatus: '', adminNotes: '' });
      refetch();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new': return <Mail size={16} className="text-secondary" />;
      case 'read': return <MailOpen size={16} className="text-primary" />;
      case 'replied': return <CheckCircle size={16} className="text-green-600" />;
      case 'archived': return <Archive size={16} className="text-gray-400" />;
      default: return null;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      new: 'Yeni',
      read: 'Oxunub',
      replied: 'Cavablandı',
      archived: 'Arxivləşdirilib',
    };
    return labels[status] || status;
  };

  const columns = [
    {
      key: 'name',
      label: 'Ad Soyad',
      render: (row) => (
        <div>
          <p className="font-medium text-secondary">{`${row.firstName} ${row.lastName}`}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'contact',
      label: 'Əlaqə',
      render: (row) => (
        <div>
          <p className="text-sm text-gray-600">{row.phoneNumber}</p>
        </div>
      ),
    },
    {
      key: 'subject',
      label: 'Mövzu',
      render: (row) => (
        <p className="text-sm truncate max-w-xs text-secondary font-medium">{row.subject}</p>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(row.status)}
          <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
            row.status === 'new' ? 'bg-secondary/10 text-secondary border border-secondary/20' :
            row.status === 'read' ? 'bg-primary/10 text-primary border border-primary/20' :
            row.status === 'replied' ? 'bg-green-100 text-green-700 border border-green-200' :
            'bg-gray-100 text-gray-700 border border-gray-200'
          }`}>
            {getStatusLabel(row.status)}
          </span>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Tarix',
      render: (row) => (
        <p className="text-sm text-gray-600 font-medium">
          {new Date(row.createdAt).toLocaleDateString('az-AZ')}
        </p>
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
                  setDetailModal({ isOpen: true, data: row });
                }}
                className="p-1.5 text-gray-500 hover:text-secondary hover:bg-secondary/5 rounded-lg transition-colors"
                title="Ətraflı"
              >
                <MailOpen size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setStatusModal({ 
                    isOpen: true, 
                    id: row._id, 
                    currentStatus: row.status,
                    adminNotes: row.adminNotes || ''
                  });
                }}
                className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Status dəyiş"
              >
                <CheckCircle size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(row._id, false);
                }}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        title="Müraciətlər" 
        description="Bütün müraciətləri idarə edin"
      />

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="p-4 border-l-4 border-l-gray-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ümumi</p>
                <p className="text-2xl font-bold text-secondary mt-1">{stats.total}</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <Mail className="text-gray-400" size={24} />
              </div>
            </div>
          </Card>
          <Card className="p-4 border-l-4 border-l-secondary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Yeni</p>
                <p className="text-2xl font-bold text-secondary mt-1">{stats.new}</p>
              </div>
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Mail className="text-secondary" size={24} />
              </div>
            </div>
          </Card>
          <Card className="p-4 border-l-4 border-l-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Oxunub</p>
                <p className="text-2xl font-bold text-primary mt-1">{stats.read}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <MailOpen className="text-primary" size={24} />
              </div>
            </div>
          </Card>
          <Card className="p-4 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cavablandı</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.replied}</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="text-green-500" size={24} />
              </div>
            </div>
          </Card>
          <Card className="p-4 border-l-4 border-l-gray-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Arxiv</p>
                <p className="text-2xl font-bold text-gray-600 mt-1">{stats.archived}</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <Archive className="text-gray-500" size={24} />
              </div>
            </div>
          </Card>
        </div>
      )}

      <Card>
        <FilterBar
          showClear={!!(search || status !== 'all' || startDate || endDate || showDeleted)}
          onClear={() => {
            setSearch('');
            setStatus('all');
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
              <span className="text-sm font-medium text-secondary">Silinmiş müraciətləri göstər</span>
            </label>
          }
        >
          <SearchInput
            placeholder="Müraciət axtar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <SelectFilter
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: 'all', label: 'Bütün statuslar' },
              { value: 'new', label: '📧 Yeni' },
              { value: 'read', label: '📖 Oxunub' },
              { value: 'replied', label: '✅ Cavablandı' },
              { value: 'archived', label: '📦 Arxivləşdirilib' },
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
          data={data?.contacts || []}
          loading={isLoading}
          pagination={{
            currentPage: page,
            totalPages: data?.totalPages || 1,
            onPageChange: setPage,
          }}
        />
      </Card>

      <Modal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, data: null })}
        title="Müraciət Detalları"
        size="lg"
      >
        {detailModal.data && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Ad Soyad</p>
                <p className="text-base font-medium text-secondary">{`${detailModal.data.firstName} ${detailModal.data.lastName}`}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base text-secondary">{detailModal.data.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Telefon</p>
                <p className="text-base text-secondary">{detailModal.data.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(detailModal.data.status)}
                  <span className="font-medium">{getStatusLabel(detailModal.data.status)}</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Mövzu</p>
              <p className="text-base font-medium text-secondary">{detailModal.data.subject}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Mesaj</p>
              <p className="text-base whitespace-pre-wrap bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700">{detailModal.data.message}</p>
            </div>
            {detailModal.data.adminNotes && (
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Admin Qeydləri</p>
                <p className="text-base whitespace-pre-wrap bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-900">{detailModal.data.adminNotes}</p>
              </div>
            )}
            <div className="text-xs text-gray-400 pt-3 border-t border-gray-100 text-right">
              <p>Göndərilmə tarixi: {new Date(detailModal.data.createdAt).toLocaleString('az-AZ')}</p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ isOpen: false, id: null, currentStatus: '', adminNotes: '' })}
        title="Status Dəyiş"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Status</label>
            <select
              value={statusModal.currentStatus}
              onChange={(e) => setStatusModal({ ...statusModal, currentStatus: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white outline-none"
            >
              <option value="new">📧 Yeni</option>
              <option value="read">📖 Oxunub</option>
              <option value="replied">✅ Cavablandı</option>
              <option value="archived">📦 Arxivləşdirilib</option>
            </select>
          </div>
          <Textarea
            label="Admin Qeydləri"
            rows={4}
            value={statusModal.adminNotes}
            onChange={(e) => setStatusModal({ ...statusModal, adminNotes: e.target.value })}
            placeholder="Daxili qeydlər..."
          />
          <div className="flex items-center gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setStatusModal({ isOpen: false, id: null, currentStatus: '', adminNotes: '' })}
            >
              Ləğv et
            </Button>
            <Button
              onClick={handleUpdateStatus}
              loading={isUpdatingStatus}
            >
              Yadda saxla
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
