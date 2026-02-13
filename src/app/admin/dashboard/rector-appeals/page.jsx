'use client';

// React
import { useState } from 'react';

// API
import { useGetRectorAppealsQuery, useDeleteRectorAppealMutation, useRestoreRectorAppealMutation, useUpdateRectorAppealMutation, useGetRectorAppealStatsQuery } from '@store/api/rectorAppealsApi';

// UI Components
import { Card, Button, Table, Modal, Input, Textarea, SearchInput, SelectFilter, FilterBar } from '@components/admin/ui';
import AdminPageHeader from '@components/admin/AdminPageHeader';

// Icons
import { Mail, MailOpen, CheckCircle, Archive, RotateCcw, Trash, AlertCircle, Clock, MessageSquare } from 'lucide-react';

// Utilities
import toast from 'react-hot-toast';
import { confirmDialog } from '@utils/confirmDialog';

export default function RectorAppealsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [category, setCategory] = useState('all');
  const [priority, setPriority] = useState('all');
  const [showDeleted, setShowDeleted] = useState(false);
  const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });
  const [responseModal, setResponseModal] = useState({ 
    isOpen: false, 
    id: null, 
    status: '', 
    priority: '', 
    adminNotes: '', 
    adminResponse: '' 
  });

  const { data, isLoading, refetch } = useGetRectorAppealsQuery({ 
    page, 
    limit: 20, 
    status: status !== 'all' ? status : undefined,
    category: category !== 'all' ? category : undefined,
    priority: priority !== 'all' ? priority : undefined,
    showDeleted,
  });
  
  const { data: stats } = useGetRectorAppealStatsQuery();
  const [deleteAppeal, { isLoading: isDeleting }] = useDeleteRectorAppealMutation();
  const [restoreAppeal] = useRestoreRectorAppealMutation();
  const [updateAppeal, { isLoading: isUpdating }] = useUpdateRectorAppealMutation();

  const handleDelete = async (id) => {
    const confirmed = await confirmDialog({
      title: 'Müraciəti sil?',
      text: 'Bu müraciəti silmək istədiyinizdən əminsiniz?',
      confirmButtonText: 'Bəli, sil',
    });
    if (!confirmed) return;
    try {
      await deleteAppeal(id).unwrap();
      toast.success('Müraciət silindi');
      refetch();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const handleRestore = async (id) => {
    try {
      await restoreAppeal(id).unwrap();
      toast.success('Müraciət bərpa edildi');
      refetch();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const handleUpdateAppeal = async () => {
    try {
      const updateData = {
        id: responseModal.id,
      };
      
      if (responseModal.status) updateData.status = responseModal.status;
      if (responseModal.priority) updateData.priority = responseModal.priority;
      if (responseModal.adminNotes) updateData.adminNotes = responseModal.adminNotes;
      if (responseModal.adminResponse) updateData.adminResponse = responseModal.adminResponse;

      await updateAppeal(updateData).unwrap();
      toast.success('Müraciət yeniləndi');
      setResponseModal({ isOpen: false, id: null, status: '', priority: '', adminNotes: '', adminResponse: '' });
      refetch();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new': return <Mail size={16} className="text-secondary" />;
      case 'read': return <MailOpen size={16} className="text-primary" />;
      case 'in_progress': return <Clock size={16} className="text-orange-500" />;
      case 'replied': return <CheckCircle size={16} className="text-green-600" />;
      case 'archived': return <Archive size={16} className="text-gray-400" />;
      default: return null;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      new: 'Yeni',
      read: 'Oxunub',
      in_progress: 'İcrada',
      replied: 'Cavablandı',
      archived: 'Arxivləşdirilib',
    };
    return labels[status] || status;
  };

  const getCategoryLabel = (category) => {
    const labels = {
      academic: 'Akademik',
      administrative: 'İnzibati',
      complaint: 'Şikayət',
      suggestion: 'Təklif',
      other: 'Digər',
    };
    return labels[category] || category;
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      low: 'bg-gray-100 text-gray-700',
      medium: 'bg-blue-100 text-blue-700',
      high: 'bg-orange-100 text-orange-700',
      urgent: 'bg-red-100 text-red-700',
    };
    const labels = {
      low: 'Aşağı',
      medium: 'Orta',
      high: 'Yüksək',
      urgent: 'Təcili',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[priority] || styles.medium}`}>
        {labels[priority] || priority}
      </span>
    );
  };

  const columns = [
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(row.status)}
          <span className="text-sm">{getStatusLabel(row.status)}</span>
        </div>
      ),
    },
    {
      header: 'Prioritet',
      accessor: 'priority',
      render: (row) => getPriorityBadge(row.priority),
    },
    {
      header: 'Ad Soyad',
      accessor: 'firstName',
      render: (row) => `${row.firstName} ${row.lastName}`,
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Telefon',
      accessor: 'phoneNumber',
    },
    {
      header: 'Kateqoriya',
      accessor: 'category',
      render: (row) => getCategoryLabel(row.category),
    },
    {
      header: 'Mövzu',
      accessor: 'subject',
      render: (row) => (
        <div className="max-w-xs truncate" title={row.subject}>
          {row.subject}
        </div>
      ),
    },
    {
      header: 'Tarix',
      accessor: 'createdAt',
      render: (row) => new Date(row.createdAt).toLocaleDateString('az-AZ'),
    },
    {
      header: 'Əməliyyatlar',
      accessor: 'actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDetailModal({ isOpen: true, data: row })}
          >
            <MessageSquare size={16} />
          </Button>
          {!row.isDeleted ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setResponseModal({ 
                  isOpen: true, 
                  id: row._id,
                  status: row.status,
                  priority: row.priority,
                  adminNotes: row.adminNotes || '',
                  adminResponse: row.adminResponse || '',
                })}
              >
                <MailOpen size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(row._id)}
              >
                <Trash size={16} className="text-red-500" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRestore(row._id)}
            >
              <RotateCcw size={16} className="text-green-500" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const statsCards = [
    { label: 'Yeni', value: stats?.data?.byStatus?.find(s => s._id === 'new')?.count || 0, color: 'text-secondary' },
    { label: 'Oxunub', value: stats?.data?.byStatus?.find(s => s._id === 'read')?.count || 0, color: 'text-primary' },
    { label: 'İcrada', value: stats?.data?.byStatus?.find(s => s._id === 'in_progress')?.count || 0, color: 'text-orange-500' },
    { label: 'Cavablandı', value: stats?.data?.byStatus?.find(s => s._id === 'replied')?.count || 0, color: 'text-green-600' },
  ];

  return (
    <div className="admin-wrapper">
      <AdminPageHeader
        title="Rektora Müraciətlər"
        description="Rektora göndərilmiş müraciətləri idarə edin"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <FilterBar
          showClear={!!(search || status !== 'all' || category !== 'all' || priority !== 'all' || showDeleted)}
          onClear={() => {
            setSearch('');
            setStatus('all');
            setCategory('all');
            setPriority('all');
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
              <span className="text-sm font-medium text-secondary">Silinmişləri göstər</span>
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
              { value: 'new', label: 'Yeni' },
              { value: 'read', label: 'Oxunub' },
              { value: 'in_progress', label: 'İcrada' },
              { value: 'replied', label: 'Cavablandı' },
              { value: 'archived', label: 'Arxivləşdirilib' },
            ]}
          />

          <SelectFilter
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: 'all', label: 'Bütün kateqoriyalar' },
              { value: 'academic', label: 'Akademik' },
              { value: 'administrative', label: 'İnzibati' },
              { value: 'complaint', label: 'Şikayət' },
              { value: 'suggestion', label: 'Təklif' },
              { value: 'other', label: 'Digər' },
            ]}
          />

          <SelectFilter
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            options={[
              { value: 'all', label: 'Bütün prioritetlər' },
              { value: 'low', label: 'Aşağı' },
              { value: 'medium', label: 'Orta' },
              { value: 'high', label: 'Yüksək' },
              { value: 'urgent', label: 'Təcili' },
            ]}
          />
        </FilterBar>

        <Table
          columns={columns}
          data={data?.data || []}
          isLoading={isLoading}
          pagination={{
            currentPage: data?.pagination?.page || 1,
            totalPages: data?.pagination?.pages || 1,
            onPageChange: setPage,
          }}
        />
      </Card>

      {/* Detail Modal */}
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
                <p className="text-sm text-gray-600">Ad Soyad</p>
                <p className="font-medium">{detailModal.data.firstName} {detailModal.data.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{detailModal.data.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Telefon</p>
                <p className="font-medium">{detailModal.data.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Kateqoriya</p>
                <p className="font-medium">{getCategoryLabel(detailModal.data.category)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(detailModal.data.status)}
                  <span>{getStatusLabel(detailModal.data.status)}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Prioritet</p>
                <div className="mt-1">{getPriorityBadge(detailModal.data.priority)}</div>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Mövzu</p>
              <p className="font-medium">{detailModal.data.subject}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Mesaj</p>
              <p className="mt-1 whitespace-pre-wrap">{detailModal.data.message}</p>
            </div>
            {detailModal.data.adminNotes && (
              <div>
                <p className="text-sm text-gray-600">Admin Qeydləri</p>
                <p className="mt-1 whitespace-pre-wrap bg-gray-50 p-3 rounded">{detailModal.data.adminNotes}</p>
              </div>
            )}
            {detailModal.data.adminResponse && (
              <div>
                <p className="text-sm text-gray-600">Admin Cavabı</p>
                <p className="mt-1 whitespace-pre-wrap bg-green-50 p-3 rounded">{detailModal.data.adminResponse}</p>
              </div>
            )}
            <div className="text-sm text-gray-500">
              Göndərilmə tarixi: {new Date(detailModal.data.createdAt).toLocaleString('az-AZ')}
            </div>
          </div>
        )}
      </Modal>

      {/* Response Modal */}
      <Modal
        isOpen={responseModal.isOpen}
        onClose={() => setResponseModal({ isOpen: false, id: null, status: '', priority: '', adminNotes: '', adminResponse: '' })}
        title="Müraciətə Cavab"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={responseModal.status}
                onChange={(e) => setResponseModal({ ...responseModal, status: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="new">Yeni</option>
                <option value="read">Oxunub</option>
                <option value="in_progress">İcrada</option>
                <option value="replied">Cavablandı</option>
                <option value="archived">Arxivləşdirilib</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Prioritet</label>
              <select
                value={responseModal.priority}
                onChange={(e) => setResponseModal({ ...responseModal, priority: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="low">Aşağı</option>
                <option value="medium">Orta</option>
                <option value="high">Yüksək</option>
                <option value="urgent">Təcili</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Admin Qeydləri</label>
            <Textarea
              value={responseModal.adminNotes}
              onChange={(e) => setResponseModal({ ...responseModal, adminNotes: e.target.value })}
              rows={3}
              placeholder="Daxili qeydlər..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Admin Cavabı</label>
            <Textarea
              value={responseModal.adminResponse}
              onChange={(e) => setResponseModal({ ...responseModal, adminResponse: e.target.value })}
              rows={5}
              placeholder="İstifadəçiyə göndəriləcək cavab..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setResponseModal({ isOpen: false, id: null, status: '', priority: '', adminNotes: '', adminResponse: '' })}
            >
              Ləğv et
            </Button>
            <Button onClick={handleUpdateAppeal} disabled={isUpdating}>
              {isUpdating ? 'Yenilənir...' : 'Yadda saxla'}
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
