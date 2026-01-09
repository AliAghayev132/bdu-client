'use client';

import { useState, useEffect } from 'react';
import { 
  useGetMenusQuery, 
  useCreateMenuMutation, 
  useUpdateMenuMutation, 
  useDeleteMenuMutation, 
  useToggleMenuActiveMutation,
  useAddColumnMutation,
  useUpdateColumnMutation,
  useDeleteColumnMutation,
  useAddItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  useAddSubitemMutation,
  useUpdateSubitemMutation,
  useDeleteSubitemMutation,
} from '@store/api/menuApi';
import { useGetPagesQuery } from '@store/api/pagesApi';
import Card from '@components/admin/ui/Card';
import Button from '@components/admin/ui/Button';
import Modal from '@components/admin/ui/Modal';
import MenuItemTree from '@components/admin/MenuItemTree';
import SubitemFormModal from './SubitemFormModal';
import Input from '@components/admin/ui/Input';
import { Plus, Edit, Trash2, Eye, EyeOff, ChevronDown, ChevronRight, ArrowUp, ArrowDown, Columns, List, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MenusPage() {
  const [menuModal, setMenuModal] = useState({ isOpen: false, data: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [expandedMenus, setExpandedMenus] = useState({});

  const [columnModal, setColumnModal] = useState({ isOpen: false, menuId: null, columnIndex: null, data: null });
  const [itemModal, setItemModal] = useState({ isOpen: false, menuId: null, columnIndex: null, itemIndex: null, data: null });
  const [subitemModal, setSubitemModal] = useState({ isOpen: false, menuId: null, columnIndex: null, itemIndex: null, subitemIndex: null, data: null });
  const [deleteColumnModal, setDeleteColumnModal] = useState({ isOpen: false, menuId: null, columnIndex: null });
  const [deleteItemModal, setDeleteItemModal] = useState({ isOpen: false, menuId: null, columnIndex: null, itemIndex: null });

  const { data: menus = [], isLoading, refetch } = useGetMenusQuery();
  const [createMenu, { isLoading: isCreating }] = useCreateMenuMutation();
  const [updateMenu, { isLoading: isUpdating }] = useUpdateMenuMutation();
  const [deleteMenu, { isLoading: isDeleting }] = useDeleteMenuMutation();
  const [toggleActive] = useToggleMenuActiveMutation();
  
  // Column mutations
  const [addColumn] = useAddColumnMutation();
  const [updateColumn] = useUpdateColumnMutation();
  const [deleteColumn] = useDeleteColumnMutation();
  
  // Item mutations
  const [addItem] = useAddItemMutation();
  const [updateItem] = useUpdateItemMutation();
  const [deleteItem] = useDeleteItemMutation();
  
  // Subitem mutations
  const [addSubitem] = useAddSubitemMutation();
  const [updateSubitem] = useUpdateSubitemMutation();
  const [deleteSubitem] = useDeleteSubitemMutation();

  const handleCreateMenu = async (data) => {
    try {
      await createMenu(data).unwrap();
      toast.success('Menu yaradıldı');
      setMenuModal({ isOpen: false, data: null });
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Xəta baş verdi');
    }
  };

  const handleUpdateMenu = async (data) => {
    try {
      await updateMenu({ id: menuModal.data._id, data }).unwrap();
      toast.success('Menu yeniləndi');
      setMenuModal({ isOpen: false, data: null });
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Xəta baş verdi');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMenu(deleteModal.id).unwrap();
      toast.success('Menu silindi');
      setDeleteModal({ isOpen: false, id: null });
      refetch();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await toggleActive(id).unwrap();
      toast.success('Status dəyişdirildi');
      refetch();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const handleMoveUp = async (index) => {
    if (index === 0) return;
    
    const newOrder = menus[index - 1].order;
    try {
      await updateMenu({ 
        id: menus[index]._id, 
        data: { ...menus[index], order: newOrder } 
      }).unwrap();
      toast.success('Sıralama yeniləndi');
      refetch();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const handleMoveDown = async (index) => {
    if (index === menus.length - 1) return;
    
    const newOrder = menus[index + 1].order;
    try {
      await updateMenu({ 
        id: menus[index]._id, 
        data: { ...menus[index], order: newOrder } 
      }).unwrap();
      toast.success('Sıralama yeniləndi');
      refetch();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const toggleExpand = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  // Column handlers
  const handleAddColumn = async (data) => {
    try {
      await addColumn({ menuId: columnModal.menuId, data }).unwrap();
      toast.success('Sütun əlavə edildi');
      setColumnModal({ isOpen: false, menuId: null, columnIndex: null, data: null });
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Xəta baş verdi');
    }
  };

  const handleUpdateColumn = async (data) => {
    try {
      await updateColumn({ menuId: columnModal.menuId, columnIndex: columnModal.columnIndex, data }).unwrap();
      toast.success('Sütun yeniləndi');
      setColumnModal({ isOpen: false, menuId: null, columnIndex: null, data: null });
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Xəta baş verdi');
    }
  };

  const handleDeleteColumn = async () => {
    try {
      await deleteColumn({ menuId: deleteColumnModal.menuId, columnIndex: deleteColumnModal.columnIndex }).unwrap();
      toast.success('Sütun silindi');
      setDeleteColumnModal({ isOpen: false, menuId: null, columnIndex: null });
      refetch();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  // Item handlers
  const handleAddItem = async (data) => {
    try {
      await addItem({ menuId: itemModal.menuId, columnIndex: itemModal.columnIndex, data }).unwrap();
      toast.success('Element əlavə edildi');
      setItemModal({ isOpen: false, menuId: null, columnIndex: null, itemIndex: null, data: null });
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Xəta baş verdi');
    }
  };

  const handleUpdateItem = async (data) => {
    try {
      await updateItem({ menuId: itemModal.menuId, columnIndex: itemModal.columnIndex, itemIndex: itemModal.itemIndex, data }).unwrap();
      toast.success('Element yeniləndi');
      setItemModal({ isOpen: false, menuId: null, columnIndex: null, itemIndex: null, data: null });
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Xəta baş verdi');
    }
  };

  const handleDeleteItem = async () => {
    try {
      await deleteItem({ menuId: deleteItemModal.menuId, columnIndex: deleteItemModal.columnIndex, itemIndex: deleteItemModal.itemIndex }).unwrap();
      toast.success('Element silindi');
      setDeleteItemModal({ isOpen: false, menuId: null, columnIndex: null, itemIndex: null });
      refetch();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  // Subitem handlers
  const handleAddSubitem = async (data) => {
    try {
      await addSubitem({ 
        menuId: subitemModal.menuId, 
        columnIndex: subitemModal.columnIndex, 
        itemIndex: subitemModal.itemIndex, 
        data 
      }).unwrap();
      toast.success('Alt element əlavə edildi');
      setSubitemModal({ isOpen: false, menuId: null, columnIndex: null, itemIndex: null, subitemIndex: null, data: null });
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Xəta baş verdi');
    }
  };

  const handleUpdateSubitem = async (data) => {
    try {
      await updateSubitem({ 
        menuId: subitemModal.menuId, 
        columnIndex: subitemModal.columnIndex, 
        itemIndex: subitemModal.itemIndex,
        subitemIndex: subitemModal.subitemIndex,
        data 
      }).unwrap();
      toast.success('Alt element yeniləndi');
      setSubitemModal({ isOpen: false, menuId: null, columnIndex: null, itemIndex: null, subitemIndex: null, data: null });
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Xəta baş verdi');
    }
  };

  const handleDeleteSubitem = async () => {
    try {
      await deleteSubitem({ 
        menuId: subitemModal.menuId, 
        columnIndex: subitemModal.columnIndex, 
        itemIndex: subitemModal.itemIndex,
        subitemIndex: subitemModal.subitemIndex
      }).unwrap();
      toast.success('Alt element silindi');
      setSubitemModal({ isOpen: false, menuId: null, columnIndex: null, itemIndex: null, subitemIndex: null, data: null });
      refetch();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menu İdarəetməsi</h1>
          <p className="text-gray-600 mt-1">Sayt menuları və naviqasiya</p>
        </div>
        <Button onClick={() => setMenuModal({ isOpen: true, data: null })}>
          <Plus size={20} className="mr-2" />
          Yeni Menu
        </Button>
      </div>

      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : menus.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Heç bir menu yoxdur</p>
          </div>
        ) : (
          <div className="space-y-2">
            {menus.map((menu, index) => (
              <div
                key={menu._id}
                className="bg-white border-2 rounded-lg border-gray-200"
              >
                <div className="p-4 flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1 text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Yuxarı"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === menus.length - 1}
                      className="p-1 text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Aşağı"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => toggleExpand(menu._id)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {expandedMenus[menu._id] ? (
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
                      onClick={() => handleToggleActive(menu._id)}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      title={menu.isActive ? 'Deaktiv et' : 'Aktiv et'}
                    >
                      {menu.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                    <button
                      onClick={() => setMenuModal({ isOpen: true, data: menu })}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      title="Redaktə et"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, id: menu._id })}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      title="Sil"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {expandedMenus[menu._id] && (
                  <div className="px-4 pb-4 border-t border-gray-200 mt-2 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-700">Sütunlar və Elementlər</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setColumnModal({ isOpen: true, menuId: menu._id, columnIndex: null, data: null })}
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
                                  onClick={() => setColumnModal({ isOpen: true, menuId: menu._id, columnIndex: colIndex, data: column })}
                                  className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                                  title="Redaktə et"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  onClick={() => setDeleteColumnModal({ isOpen: true, menuId: menu._id, columnIndex: colIndex })}
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
                                    setItemModal({ isOpen: true, menuId, columnIndex, itemIndex, data: item });
                                  }}
                                  onDelete={(menuId, columnIndex, itemIndex) => {
                                    setDeleteItemModal({ isOpen: true, menuId, columnIndex, itemIndex });
                                  }}
                                  onAddSubitem={(menuId, columnIndex, itemIndex) => {
                                    setSubitemModal({ isOpen: true, menuId, columnIndex, itemIndex, subitemIndex: null, data: null });
                                  }}
                                />
                              ))}
                            </div>
                            
                            <button
                              onClick={() => setItemModal({ isOpen: true, menuId: menu._id, columnIndex: colIndex, itemIndex: null, data: null })}
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
            ))}
          </div>
        )}
      </Card>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        title="Menunu sil"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Bu menunu silmək istədiyinizdən əminsiniz? Bu əməliyyat geri qaytarıla bilməz.
          </p>
          <div className="flex items-center gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, id: null })}
            >
              Ləğv et
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={isDeleting}
            >
              Sil
            </Button>
          </div>
        </div>
      </Modal>

      <MenuFormModal
        isOpen={menuModal.isOpen}
        onClose={() => setMenuModal({ isOpen: false, data: null })}
        onSubmit={menuModal.data ? handleUpdateMenu : handleCreateMenu}
        initialData={menuModal.data}
        isLoading={isCreating || isUpdating}
      />

      {/* Column Modal */}
      <ColumnFormModal
        isOpen={columnModal.isOpen}
        onClose={() => setColumnModal({ isOpen: false, menuId: null, columnIndex: null, data: null })}
        onSubmit={columnModal.data ? handleUpdateColumn : handleAddColumn}
        initialData={columnModal.data}
      />

      {/* Delete Column Modal */}
      <Modal
        isOpen={deleteColumnModal.isOpen}
        onClose={() => setDeleteColumnModal({ isOpen: false, menuId: null, columnIndex: null })}
        title="Sütunu sil"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Bu sütunu və içindəki bütün elementləri silmək istədiyinizdən əminsiniz?</p>
          <div className="flex items-center gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteColumnModal({ isOpen: false, menuId: null, columnIndex: null })}>
              Ləğv et
            </Button>
            <Button variant="danger" onClick={handleDeleteColumn}>
              Sil
            </Button>
          </div>
        </div>
      </Modal>

      {/* Item Modal */}
      <ItemFormModal
        isOpen={itemModal.isOpen}
        onClose={() => setItemModal({ isOpen: false, menuId: null, columnIndex: null, itemIndex: null, data: null })}
        onSubmit={itemModal.data ? handleUpdateItem : handleAddItem}
        initialData={itemModal.data}
      />

      {/* Delete Item Modal */}
      <Modal
        isOpen={deleteItemModal.isOpen}
        onClose={() => setDeleteItemModal({ isOpen: false, menuId: null, columnIndex: null, itemIndex: null })}
        title="Elementi sil"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Bu elementi silmək istədiyinizdən əminsiniz?</p>
          <div className="flex items-center gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteItemModal({ isOpen: false, menuId: null, columnIndex: null, itemIndex: null })}>
              Ləğv et
            </Button>
            <Button variant="danger" onClick={handleDeleteItem}>
              Sil
            </Button>
          </div>
        </div>
      </Modal>

      {/* Subitem Modal */}
      <SubitemFormModal
        isOpen={subitemModal.isOpen}
        onClose={() => setSubitemModal({ isOpen: false, menuId: null, columnIndex: null, itemIndex: null, subitemIndex: null, data: null })}
        onSubmit={subitemModal.data ? handleUpdateSubitem : handleAddSubitem}
        initialData={subitemModal.data}
      />
    </div>
  );
}

function MenuFormModal({ isOpen, onClose, onSubmit, initialData, isLoading }) {
  const [formData, setFormData] = useState({
    id: '',
    label: { az: '', en: '' },
    type: 'mega',
    order: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || '',
        label: initialData.label || { az: '', en: '' },
        type: initialData.type || 'mega',
        order: initialData.order || 0,
      });
    } else {
      setFormData({ id: '', label: { az: '', en: '' }, type: 'mega', order: 0 });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Menunu Redaktə Et' : 'Yeni Menu Yarat'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Menu ID"
          required
          value={formData.id}
          onChange={(e) => setFormData({ ...formData, id: e.target.value })}
          placeholder="university"
          disabled={!!initialData}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Başlıq (AZ)"
            required
            value={formData.label.az}
            onChange={(e) => setFormData({ ...formData, label: { ...formData.label, az: e.target.value } })}
            placeholder="UNİVERSİTET"
          />
          <Input
            label="Başlıq (EN)"
            required
            value={formData.label.en}
            onChange={(e) => setFormData({ ...formData, label: { ...formData.label, en: e.target.value } })}
            placeholder="UNIVERSITY"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tip</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="mega">Mega Menu</option>
            <option value="dropdown">Dropdown</option>
            <option value="link">Link</option>
          </select>
        </div>

        <Input
          label="Sıra"
          type="number"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
          placeholder="0"
        />

        <div className="flex items-center gap-3 justify-end pt-4">
          <Button variant="outline" onClick={onClose} type="button">
            Ləğv et
          </Button>
          <Button type="submit" loading={isLoading}>
            {initialData ? 'Yenilə' : 'Yarat'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// Column Form Modal
function ColumnFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    title: { az: '', en: '' },
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ title: initialData.title || { az: '', en: '' } });
    } else {
      setFormData({ title: { az: '', en: '' } });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Sütunu Redaktə Et' : 'Yeni Sütun'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Başlıq (AZ)"
            required
            value={formData.title.az}
            onChange={(e) => setFormData({ ...formData, title: { ...formData.title, az: e.target.value } })}
            placeholder="Ümumi"
          />
          <Input
            label="Başlıq (EN)"
            required
            value={formData.title.en}
            onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })}
            placeholder="General"
          />
        </div>
        <div className="flex items-center gap-3 justify-end pt-4">
          <Button variant="outline" onClick={onClose} type="button">Ləğv et</Button>
          <Button type="submit">{initialData ? 'Yenilə' : 'Əlavə et'}</Button>
        </div>
      </form>
    </Modal>
  );
}

// Item Form Modal
function ItemFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const { data: pagesData } = useGetPagesQuery({ page: 1, limit: 100, pageType: 'all', showDeleted: false });
  const pages = pagesData?.pages || [];

  const [formData, setFormData] = useState({
    id: '',
    label: { az: '', en: '' },
    href: { az: '', en: '' },
    description: { az: '', en: '' },
    page: '',
    hasDetail: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || '',
        label: initialData.label || { az: '', en: '' },
        href: initialData.href || { az: '', en: '' },
        description: initialData.description || { az: '', en: '' },
        page: initialData.page || '',
        hasDetail: initialData.hasDetail || false,
      });
    } else {
      setFormData({
        id: '',
        label: { az: '', en: '' },
        href: { az: '', en: '' },
        description: { az: '', en: '' },
        page: '',
        hasDetail: false,
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Elementi Redaktə Et' : 'Yeni Element'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Element ID"
          required
          value={formData.id}
          onChange={(e) => setFormData({ ...formData, id: e.target.value })}
          placeholder="history"
          disabled={!!initialData}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Ad (AZ)"
            required
            value={formData.label.az}
            onChange={(e) => setFormData({ ...formData, label: { ...formData.label, az: e.target.value } })}
            placeholder="Universitetin tarixi"
          />
          <Input
            label="Ad (EN)"
            required
            value={formData.label.en}
            onChange={(e) => setFormData({ ...formData, label: { ...formData.label, en: e.target.value } })}
            placeholder="University History"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Link (AZ)"
            value={formData.href.az}
            onChange={(e) => setFormData({ ...formData, href: { ...formData.href, az: e.target.value } })}
            placeholder="/universitet/tarix"
          />
          <Input
            label="Link (EN)"
            value={formData.href.en}
            onChange={(e) => setFormData({ ...formData, href: { ...formData.href, en: e.target.value } })}
            placeholder="/university/history"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Təsvir (AZ)"
            value={formData.description.az}
            onChange={(e) => setFormData({ ...formData, description: { ...formData.description, az: e.target.value } })}
            placeholder="Qısa təsvir"
          />
          <Input
            label="Təsvir (EN)"
            value={formData.description.en}
            onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
            placeholder="Short description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Səhifə</label>
            <select
              value={formData.page}
              onChange={(e) => setFormData({ ...formData, page: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Səhifə seçin (opsional)</option>
              {pages.map((page) => (
                <option key={page._id} value={page._id}>
                  {page.title?.az || page.title} ({page.path?.az || page.path})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Səhifə seçilməsə, href istifadə ediləcək</p>
          </div>
          <div className="flex items-center pt-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasDetail}
                onChange={(e) => setFormData({ ...formData, hasDetail: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Detail səhifəsi var</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end pt-4">
          <Button variant="outline" onClick={onClose} type="button">Ləğv et</Button>
          <Button type="submit">{initialData ? 'Yenilə' : 'Əlavə et'}</Button>
        </div>
      </form>
    </Modal>
  );
}
