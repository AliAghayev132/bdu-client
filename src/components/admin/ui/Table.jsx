import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Table({ columns, data, actions, loading, onRowClick, pagination }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C4B62]"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Məlumat tapılmadı</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full table-fixed">
          <thead className="bg-[#2C4B62]/5 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key || column.accessor}
                  className="px-6 py-4 text-left text-xs font-bold text-[#2C4B62] uppercase tracking-wider whitespace-nowrap"
                  style={column.width ? { width: column.width, minWidth: column.width } : { minWidth: column.minWidth || 'auto' }}
                >
                  {column.label || column.header}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-6 py-4 text-right text-xs font-bold text-[#2C4B62] uppercase tracking-wider" style={{ width: '160px' }}>
                  Əməliyyatlar
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr
                key={row._id || index}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? 'cursor-pointer hover:bg-[#AA9674]/5 transition-colors' : ''}
              >
                {columns.map((column) => (
                  <td
                    key={column.key || column.accessor}
                    className={`px-6 py-4 text-sm text-[#2C4B62] ${column.nowrap ? 'whitespace-nowrap' : 'break-words'}`}
                  >
                    {column.render ? column.render(row) : row[column.key || column.accessor]}
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end gap-2">
                      {actions.map((action, actionIndex) => {
                        const Icon = typeof action.icon === 'function' ? action.icon(row) : action.icon;
                        const label = typeof action.label === 'function' ? action.label(row) : action.label;
                        const variantClasses = {
                          primary: 'text-blue-600 hover:text-blue-800 hover:bg-blue-50',
                          danger: 'text-red-600 hover:text-red-800 hover:bg-red-50',
                          warning: 'text-amber-600 hover:text-amber-800 hover:bg-amber-50',
                          info: 'text-gray-600 hover:text-gray-800 hover:bg-gray-50',
                        };
                        return (
                          <button
                            key={actionIndex}
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick(row);
                            }}
                            className={`p-2 rounded-lg transition-colors ${variantClasses[action.variant] || variantClasses.info}`}
                            title={label}
                          >
                            {Icon && <Icon size={18} />}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <p className="text-sm text-gray-500">
            Səhifə <span className="font-semibold text-secondary">{pagination.currentPage}</span> / {pagination.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} /> Əvvəlki
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Növbəti <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
