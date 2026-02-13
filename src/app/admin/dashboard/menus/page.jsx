'use client';

import { useState } from 'react';

// API Hooks
import { 
  useGetMenusQuery, 
  useCreateMenuMutation, 
  useUpdateMenuMutation, 
  useDeleteMenuMutation, 
  useToggleMenuActiveMutation,
  useReorderMenusMutation,
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

// UI Components
import { Card, Button, Modal } from '@components/admin/ui';
import MenuCard from './MenuCard';
import MenuFormModal from './MenuFormModal';
import ColumnFormModal from './ColumnFormModal';
import ItemFormModal from './ItemFormModal';
import SubitemFormModal from './SubitemFormModal';

// Icons
import { Plus } from 'lucide-react';

// Utilities
import toast from 'react-hot-toast';
import { confirmDialog } from '@utils/confirmDialog';

export default function MenusPage() {
  const [menuModal, setMenuModal] = useState({ isOpen: false, data: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

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
  const [reorderMenus] = useReorderMenusMutation();
  
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

  // ========== Menu CRUD ==========
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

  // ========== Ordering (atomic batch reorder) ==========
  const handleMoveUp = async (index) => {
    if (index <= 0) return;
    await swapAndReorder(index, index - 1);
  };

  const handleMoveDown = async (index) => {
    if (index >= menus.length - 1) return;
    await swapAndReorder(index, index + 1);
  };

  const swapAndReorder = async (indexA, indexB) => {
    // Build a new order array: swap positions of A and B, assign sequential order values
    const reordered = [...menus];
    const temp = reordered[indexA];
    reordered[indexA] = reordered[indexB];
    reordered[indexB] = temp;

    const items = reordered.map((menu, i) => ({
      id: menu._id,
      order: i,
    }));

    try {
      await reorderMenus(items).unwrap();
      toast.success('Sıralama yeniləndi');
      refetch();
    } catch (error) {
      toast.error('Sıralama xətası baş verdi');
    }
  };

  // ========== Column handlers ==========
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

  // ========== Item handlers ==========
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

  // ========== Subitem handlers ==========
  const handleDeleteSubitemDirect = async (menuId, columnIndex, itemIndex, subitemIndex) => {
    const confirmed = await confirmDialog({
      title: 'Alt elementi sil?',
      text: 'Bu alt element silinəcək.',
      confirmButtonText: 'Bəli, sil',
    });
    if (!confirmed) return;
    try {
      await deleteSubitem({ menuId, columnIndex, itemIndex, subitemIndex }).unwrap();
      toast.success('Alt element silindi');
      refetch();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

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
              <MenuCard
                key={menu._id}
                menu={menu}
                index={index}
                totalMenus={menus.length}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onToggleActive={handleToggleActive}
                onEdit={(menu) => setMenuModal({ isOpen: true, data: menu })}
                onDelete={(id) => setDeleteModal({ isOpen: true, id })}
                onAddColumn={(menuId) => setColumnModal({ isOpen: true, menuId, columnIndex: null, data: null })}
                onEditColumn={(menuId, colIndex, column) => setColumnModal({ isOpen: true, menuId, columnIndex: colIndex, data: column })}
                onDeleteColumn={(menuId, colIndex) => setDeleteColumnModal({ isOpen: true, menuId, columnIndex: colIndex })}
                onAddItem={(menuId, colIndex) => setItemModal({ isOpen: true, menuId, columnIndex: colIndex, itemIndex: null, data: null })}
                onEditItem={(menuId, colIndex, itemIndex, item) => setItemModal({ isOpen: true, menuId, columnIndex: colIndex, itemIndex, data: item })}
                onDeleteItem={(menuId, colIndex, itemIndex) => setDeleteItemModal({ isOpen: true, menuId, columnIndex: colIndex, itemIndex })}
                onAddSubitem={(menuId, colIndex, itemIndex) => setSubitemModal({ isOpen: true, menuId, columnIndex: colIndex, itemIndex, subitemIndex: null, data: null })}
                onEditSubitem={(menuId, colIndex, itemIndex, subitemIndex, subitem) => setSubitemModal({ isOpen: true, menuId, columnIndex: colIndex, itemIndex, subitemIndex, data: subitem })}
                onDeleteSubitem={(menuId, colIndex, itemIndex, subitemIndex) => handleDeleteSubitemDirect(menuId, colIndex, itemIndex, subitemIndex)}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Delete Menu Modal */}
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
            <Button variant="outline" onClick={() => setDeleteModal({ isOpen: false, id: null })}>
              Ləğv et
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={isDeleting}>
              Sil
            </Button>
          </div>
        </div>
      </Modal>

      {/* Menu Form Modal */}
      <MenuFormModal
        isOpen={menuModal.isOpen}
        onClose={() => setMenuModal({ isOpen: false, data: null })}
        onSubmit={menuModal.data ? handleUpdateMenu : handleCreateMenu}
        initialData={menuModal.data}
        isLoading={isCreating || isUpdating}
      />

      {/* Column Form Modal */}
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

      {/* Item Form Modal */}
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

      {/* Subitem Form Modal */}
      <SubitemFormModal
        isOpen={subitemModal.isOpen}
        onClose={() => setSubitemModal({ isOpen: false, menuId: null, columnIndex: null, itemIndex: null, subitemIndex: null, data: null })}
        onSubmit={subitemModal.data ? handleUpdateSubitem : handleAddSubitem}
        initialData={subitemModal.data}
      />
    </div>
  );
}

