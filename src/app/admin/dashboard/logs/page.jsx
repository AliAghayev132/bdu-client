'use client';

// React
import { useState } from 'react';

// API
import { useGetLogsQuery, useClearLogsMutation } from '@store/api/logsApi';

// UI Components
import { Card, Button, Table, Modal, Input, SearchInput, SelectFilter, FilterBar } from '@components/admin/ui';
import AdminPageHeader from '@components/admin/AdminPageHeader';

// Icons
import { Trash2, AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

// Utilities
import toast from 'react-hot-toast';

export default function LogsPage() {
  const [page, setPage] = useState(1);
  const [type, setType] = useState('all');
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [clearModal, setClearModal] = useState({ isOpen: false });

  const { data, isLoading, refetch } = useGetLogsQuery({ 
    page, 
    limit: 20, 
    type,
    search,
    startDate,
    endDate,
  });
  const [clearLogs, { isLoading: isClearing }] = useClearLogsMutation();

  const handleClearLogs = async () => {
    try {
      await clearLogs({ type: type !== 'all' ? type : undefined, beforeDate: endDate || undefined }).unwrap();
      toast.success('Loglar təmizləndi');
      setClearModal({ isOpen: false });
      refetch();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const getLogIcon = (logType) => {
    if (logType?.includes('ERROR') || logType?.includes('FAIL')) {
      return <XCircle size={16} className="text-red-500" />;
    }
    if (logType?.includes('SUCCESS') || logType?.includes('SENT')) {
      return <CheckCircle size={16} className="text-green-500" />;
    }
    if (logType?.includes('WARNING')) {
      return <AlertCircle size={16} className="text-yellow-500" />;
    }
    return <Info size={16} className="text-blue-500" />;
  };

  const columns = [
    {
      key: 'type',
      label: 'Növ',
      render: (row) => (
        <div className="flex items-center gap-2">
          {getLogIcon(row.type)}
          <span className="text-sm font-medium text-secondary">{row.type}</span>
        </div>
      ),
    },
    {
      key: 'message',
      label: 'Mesaj',
      render: (row) => (
        <div className="max-w-md">
          <p className="text-sm text-gray-700 truncate">{row.message}</p>
          {row.metadata && Object.keys(row.metadata).length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {Object.entries(row.metadata).slice(0, 2).map(([key, value]) => (
                <span key={key} className="mr-2">
                  <span className="font-medium">{key}:</span> {String(value).substring(0, 30)}
                </span>
              ))}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'actor',
      label: 'Actor',
      render: (row) => (
        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium border border-gray-200">
          {row.actor?.role || 'system'}
        </span>
      ),
    },
    {
      key: 'ip',
      label: 'IP',
      render: (row) => (
        <span className="text-xs text-gray-500 font-mono">{row.ip || '-'}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Tarix',
      render: (row) => (
        <div className="text-sm text-gray-600">
          <p>{new Date(row.createdAt).toLocaleDateString('az-AZ')}</p>
          <p className="text-xs text-gray-500">{new Date(row.createdAt).toLocaleTimeString('az-AZ')}</p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader 
        title="Sistem Logları" 
        description="Sistem fəaliyyət loglarını izləyin"
      >
        <Button 
          variant="danger" 
          onClick={() => setClearModal({ isOpen: true })}
        >
          <Trash2 size={20} className="mr-2" />
          Logları Təmizlə
        </Button>
      </AdminPageHeader>

      <Card>
        <FilterBar
          showClear={!!(search || type !== 'all' || startDate || endDate)}
          onClear={() => {
            setSearch('');
            setType('all');
            setStartDate('');
            setEndDate('');
            setPage(1);
          }}
        >
          <SearchInput
            placeholder="Log axtar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <SelectFilter
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={[
              { value: 'all', label: 'Bütün növlər' },
              { value: 'MAIL_SENT', label: '✉️ Mail göndərildi' },
              { value: 'MAIL_ERROR', label: '❌ Mail xətası' },
              { value: 'AUTH_LOGIN', label: '🔐 Giriş' },
              { value: 'AUTH_LOGOUT', label: '🚪 Çıxış' },
              { value: 'CREATE', label: '➕ Yaradılma' },
              { value: 'UPDATE', label: '✏️ Yenilənmə' },
              { value: 'DELETE', label: '🗑️ Silinmə' },
              { value: 'ERROR', label: '⚠️ Xəta' },
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
          data={data?.logs || []}
          loading={isLoading}
          pagination={{
            currentPage: page,
            totalPages: data?.totalPages || 1,
            onPageChange: setPage,
          }}
        />
      </Card>

      <Modal
        isOpen={clearModal.isOpen}
        onClose={() => setClearModal({ isOpen: false })}
        title="Logları təmizlə"
        size="sm"
      >
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm font-medium text-yellow-800">Diqqət!</p>
                <p className="text-sm text-yellow-700 mt-1">
                  {type !== 'all' 
                    ? `Seçilmiş növdəki (${type}) bütün loglar silinəcək.`
                    : 'Bütün sistem logları silinəcək.'}
                  {endDate && ` ${endDate} tarixindən əvvəlki loglar silinəcək.`}
                </p>
              </div>
            </div>
          </div>
          <p className="text-gray-600">
            Bu əməliyyat geri qaytarıla bilməz. Davam etmək istədiyinizdən əminsiniz?
          </p>
          <div className="flex items-center gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setClearModal({ isOpen: false })}
            >
              Ləğv et
            </Button>
            <Button
              variant="danger"
              onClick={handleClearLogs}
              loading={isClearing}
            >
              Təmizlə
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
