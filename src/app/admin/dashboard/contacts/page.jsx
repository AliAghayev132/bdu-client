'use client';

import { useState } from 'react';
import { useGetContactsQuery, useDeleteContactMutation, useRestoreContactMutation, usePermanentDeleteContactMutation, useUpdateContactStatusMutation, useGetContactStatsQuery } from '@store/api/contactApi';
import Card from '@components/admin/ui/Card';
import Button from '@components/admin/ui/Button';
import Table from '@components/admin/ui/Table';
import Modal from '@components/admin/ui/Modal';
import Input from '@components/admin/ui/Input';
import Textarea from '@components/admin/ui/Textarea';
import { Search, Mail, MailOpen, CheckCircle, Archive, RotateCcw, Trash, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [showDeleted, setShowDeleted] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, permanent: false });
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

  const handleDelete = async () => {
    try {
      if (deleteModal.permanent) {
        await permanentDeleteContact(deleteModal.id).unwrap();
        toast.success('Müraciət tamamilə silindi');
      } else {
        await deleteContact(deleteModal.id).unwrap();
        toast.success('Müraciət silindi');
      }
      setDeleteModal({ isOpen: false, id: null, permanent: false });
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
      case 'new': return <Mail size={16} className="text-blue-600" />;
      case 'read': return <MailOpen size={16} className="text-yellow-600" />;
      case 'replied': return <CheckCircle size={16} className="text-green-600" />;
      case 'archived': return <Archive size={16} className="text-gray-600" />;
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
          <p className="font-medium">{`${row.firstName} ${row.lastName}`}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'contact',
      label: 'Əlaqə',
      render: (row) => (
        <div>
          <p className="text-sm">{row.phoneNumber}</p>
        </div>
      ),
    },
    {
      key: 'subject',
      label: 'Mövzu',
      render: (row) => (
        <p className="text-sm truncate max-w-xs">{row.subject}</p>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(row.status)}
          <span className={`px-2 py-1 rounded text-xs ${
            row.status === 'new' ? 'bg-blue-100 text-blue-700' :
            row.status === 'read' ? 'bg-yellow-100 text-yellow-700' :
            row.status === 'replied' ? 'bg-green-100 text-green-700' :
            'bg-gray-100 text-gray-700'
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
        <p className="text-sm text-gray-600">
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
                className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
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
                className="p-1 text-gray-600 hover:text-green-600 transition-colors"
                title="Status dəyiş"
              >
                <CheckCircle size={18} />
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
          <h1 className="text-3xl font-bold text-gray-900">Müraciətlər</h1>
          <p className="text-gray-600 mt-1">Bütün müraciətləri idarə edin</p>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ümumi</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Mail className="text-gray-400" size={32} />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Yeni</p>
                <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
              </div>
              <Mail className="text-blue-400" size={32} />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Oxunub</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.read}</p>
              </div>
              <MailOpen className="text-yellow-400" size={32} />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cavablandı</p>
                <p className="text-2xl font-bold text-green-600">{stats.replied}</p>
              </div>
              <CheckCircle className="text-green-400" size={32} />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Arxiv</p>
                <p className="text-2xl font-bold text-gray-600">{stats.archived}</p>
              </div>
              <Archive className="text-gray-400" size={32} />
            </div>
          </Card>
        </div>
      )}

      <Card>
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Müraciət axtar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">Bütün statuslar</option>
              <option value="new">📧 Yeni</option>
              <option value="read">📖 Oxunub</option>
              <option value="replied">✅ Cavablandı</option>
              <option value="archived">📦 Arxivləşdirilib</option>
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
              <span className="text-sm font-medium text-gray-700">Silinmiş müraciətləri göstər</span>
            </label>

            {(search || status !== 'all' || startDate || endDate || showDeleted) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setStatus('all');
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
          data={data?.contacts || []}
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
        title={deleteModal.permanent ? "Müraciəti tamamilə sil" : "Müraciəti sil"}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            {deleteModal.permanent 
              ? "Bu müraciət tamamilə silinəcək və bərpa edilə bilməyəcək. Davam etmək istədiyinizdən əminsiniz?"
              : "Bu müraciəti silmək istədiyinizdən əminsiniz? Sonradan bərpa edə biləcəksiniz."}
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
                <p className="text-sm font-medium text-gray-700">Ad Soyad</p>
                <p className="text-base">{`${detailModal.data.firstName} ${detailModal.data.lastName}`}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-base">{detailModal.data.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Telefon</p>
                <p className="text-base">{detailModal.data.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(detailModal.data.status)}
                  <span>{getStatusLabel(detailModal.data.status)}</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Mövzu</p>
              <p className="text-base">{detailModal.data.subject}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Mesaj</p>
              <p className="text-base whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">{detailModal.data.message}</p>
            </div>
            {detailModal.data.adminNotes && (
              <div>
                <p className="text-sm font-medium text-gray-700">Admin Qeydləri</p>
                <p className="text-base whitespace-pre-wrap bg-blue-50 p-4 rounded-lg">{detailModal.data.adminNotes}</p>
              </div>
            )}
            <div className="text-xs text-gray-500 pt-2 border-t">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusModal.currentStatus}
              onChange={(e) => setStatusModal({ ...statusModal, currentStatus: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
