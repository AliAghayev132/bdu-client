'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Edit, Trash2, Plus } from 'lucide-react';

export default function MenuItemTree({ 
  item, 
  itemIndex, 
  columnIndex, 
  menuId, 
  level = 0,
  onEdit, 
  onDelete,
  onAddSubitem 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubitems = item.subitems && item.subitems.length > 0;

  return (
    <div className={`${level > 0 ? 'ml-6 mt-2' : ''}`}>
      <div className="bg-white rounded p-2 border border-gray-100 hover:border-gray-200 transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2 flex-1">
            {hasSubitems && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-gray-100 rounded transition-colors mt-0.5"
              >
                {isExpanded ? (
                  <ChevronDown size={14} className="text-gray-600" />
                ) : (
                  <ChevronRight size={14} className="text-gray-600" />
                )}
              </button>
            )}
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">{item.label?.az}</div>
              <div className="text-xs text-gray-400 mt-0.5">{item.href?.az || item.page || '-'}</div>
              {hasSubitems && (
                <div className="text-xs text-blue-500 mt-1">
                  {item.subitems.length} alt element
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onAddSubitem(menuId, columnIndex, itemIndex, level)}
              className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Alt element əlavə et"
            >
              <Plus size={12} />
            </button>
            <button
              onClick={() => onEdit(menuId, columnIndex, itemIndex, item, level)}
              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Redaktə et"
            >
              <Edit size={12} />
            </button>
            <button
              onClick={() => onDelete(menuId, columnIndex, itemIndex, level)}
              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Sil"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>

      {isExpanded && hasSubitems && (
        <div className="mt-1 border-l-2 border-gray-200 pl-2">
          {item.subitems.map((subitem, subIndex) => (
            <MenuItemTree
              key={subIndex}
              item={subitem}
              itemIndex={Array.isArray(itemIndex) ? [...itemIndex, subIndex] : itemIndex}
              columnIndex={columnIndex}
              menuId={menuId}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddSubitem={onAddSubitem}
            />
          ))}
        </div>
      )}
    </div>
  );
}
