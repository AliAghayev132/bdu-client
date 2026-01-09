'use client';

import { useState } from 'react';
import { useGetLogsQuery, useClearLogsMutation } from '@store/api/logsApi';
import Card from '@components/admin/ui/Card';
import Button from '@components/admin/ui/Button';
import Table from '@components/admin/ui/Table';
import Modal from '@components/admin/ui/Modal';
import Input from '@components/admin/ui/Input';
import AdminPageHeader from '@components/admin/AdminPageHeader';
import { Search, Trash2, AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
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
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Log axtar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-secondary outline-none transition-all"
            >
              <option value="all">Bütün növlər</option>
              <option value="MAIL_SENT">✉️ Mail göndərildi</option>
              <option value="MAIL_ERROR">❌ Mail xətası</option>
              <option value="AUTH_LOGIN">🔐 Giriş</option>
              <option value="AUTH_LOGOUT">🚪 Çıxış</option>
              <option value="CREATE">➕ Yaradılma</option>
              <option value="UPDATE">✏️ Yenilənmə</option>
              <option value="DELETE">🗑️ Silinmə</option>
              <option value="ERROR">⚠️ Xəta</option>
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

          {(search || type !== 'all' || startDate || endDate) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch('');
                setType('all');
                setStartDate('');
                setEndDate('');
                setPage(1);
              }}
            >
              Filterləri təmizlə
            </Button>
          )}
        </div>

        <Table
          columns={columns}
          data={data?.logs || []}
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
