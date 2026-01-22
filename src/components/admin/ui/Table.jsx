export default function Table({ columns, data, actions, loading, onRowClick }) {
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
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-[#2C4B62]/5 border-b border-gray-200">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-4 text-left text-xs font-bold text-[#2C4B62] uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
            {actions && actions.length > 0 && (
              <th className="px-6 py-4 text-right text-xs font-bold text-[#2C4B62] uppercase tracking-wider">
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
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-[#2C4B62]">
                  {column.render ? column.render(row) : row[column.key]}
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
  );
}
