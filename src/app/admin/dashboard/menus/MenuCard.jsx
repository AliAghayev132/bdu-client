'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, ChevronDown, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@components/admin/ui';
import MenuItemTree from '@components/admin/MenuItemTree';

export default function MenuCard({
  menu,
  index,
  totalMenus,
  onMoveUp,
  onMoveDown,
  onToggleActive,
  onEdit,
  onDelete,
  onAddColumn,
  onEditColumn,
  onDeleteColumn,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onAddSubitem,
  onEditSubitem,
  onDeleteSubitem,
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border-2 rounded-lg border-gray-200">
      <div className="p-4 flex items-center gap-4">
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onMoveUp(index)}
            disabled={index === 0}
            className="p-1 text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Yuxarı"
          >
            <ArrowUp size={16} />
          </button>
          <button
            onClick={() => onMoveDown(index)}
            disabled={index === totalMenus - 1}
            className="p-1 text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Aşağı"
          >
            <ArrowDown size={16} />
          </button>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          {expanded ? (
            <ChevronDown size={20} className="text-gray-600" />
          ) : (
            <ChevronRight size={20} className="text-gray-600" />
          )}
        </button>

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-gray-900">{menu.label.az}</h3>
            <span className="text-sm text-gray-500">({menu.label.en})</span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
              {menu.id}
            </span>
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
              #{menu.order}
            </span>
            {menu.isActive ? (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                Aktiv
              </span>
            ) : (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                Deaktiv
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {menu.columns?.length || 0} sütun, {menu.columns?.reduce((acc, col) => acc + (col.items?.length || 0), 0) || 0} element
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleActive(menu._id)}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            title={menu.isActive ? 'Deaktiv et' : 'Aktiv et'}
          >
            {menu.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
          <button
            onClick={() => onEdit(menu)}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            title="Redaktə et"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(menu._id)}
            className="p-2 text-gray-600 hover:text-red-600 transition-colors"
            title="Sil"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-200 mt-2 pt-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-700">Sütunlar və Elementlər</h4>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddColumn(menu._id)}
            >
              <Plus size={16} className="mr-1" />
              Sütun əlavə et
            </Button>
          </div>
          
          {menu.columns?.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">Heç bir sütun yoxdur</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menu.columns?.map((column, colIndex) => (
                <div key={colIndex} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-sm text-gray-800">
                      {column.title?.az || 'Başlıqsız'}
                      <span className="text-gray-400 ml-1">({column.title?.en})</span>
                    </h5>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditColumn(menu._id, colIndex, column)}
                        className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                        title="Redaktə et"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => onDeleteColumn(menu._id, colIndex)}
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                        title="Sil"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    {column.items?.map((item, itemIndex) => (
                      <MenuItemTree
                        key={itemIndex}
                        item={item}
                        itemIndex={itemIndex}
                        columnIndex={colIndex}
                        menuId={menu._id}
                        level={0}
                        onEdit={(menuId, columnIndex, itemIndex, item) => {
                          onEditItem(menuId, columnIndex, itemIndex, item);
                        }}
                        onDelete={(menuId, columnIndex, itemIndex) => {
                          onDeleteItem(menuId, columnIndex, itemIndex);
                        }}
                        onAddSubitem={(menuId, columnIndex, itemIndex) => {
                          onAddSubitem(menuId, columnIndex, itemIndex);
                        }}
                        onEditSubitem={(menuId, columnIndex, itemIndex, subitemIndex, subitem) => {
                          onEditSubitem(menuId, columnIndex, itemIndex, subitemIndex, subitem);
                        }}
                        onDeleteSubitem={(menuId, columnIndex, itemIndex, subitemIndex) => {
                          onDeleteSubitem(menuId, columnIndex, itemIndex, subitemIndex);
                        }}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={() => onAddItem(menu._id, colIndex)}
                    className="w-full py-2 text-sm text-blue-600 hover:bg-blue-50 rounded border border-dashed border-blue-300 transition-colors"
                  >
                    <Plus size={14} className="inline mr-1" />
                    Element əlavə et
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
