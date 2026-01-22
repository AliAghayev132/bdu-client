'use client';

import { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';
import { useAddPageColumnMutation, useUpdatePageColumnMutation, useDeletePageColumnMutation, useReorderPageColumnsMutation } from '@store/api/pagesApi';
import { useGetPersonsQuery } from '@store/api/personsApi';
import { Plus, Trash2, GripVertical, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function PageColumnsModal({ isOpen, onClose, page, onSuccess }) {
  const [columns, setColumns] = useState([]);
  const [editingColumn, setEditingColumn] = useState(null);

  const { data: personsData } = useGetPersonsQuery({ page: 1, limit: 100, category: 'all' });
  const [addColumn, { isLoading: isAdding }] = useAddPageColumnMutation();
  const [updateColumn, { isLoading: isUpdating }] = useUpdatePageColumnMutation();
  const [deleteColumn, { isLoading: isDeleting }] = useDeletePageColumnMutation();
  const [reorderColumns, { isLoading: isReordering }] = useReorderPageColumnsMutation();

  useEffect(() => {
    if (page?.columns) {
      setColumns(page.columns.map((col, index) => ({
        ...col,
        _id: col._id || `temp-${index}`,
        index,
      })));
    }
  }, [page]);

  // Guard clause - modal açılmadan əvvəl page._id yoxla
  if (!page?._id) {
    return null;
  }

  const handleAddColumn = () => {
    setEditingColumn({
      title: { az: '', en: '' },
      persons: [],
      order: columns.length,
      isNew: true,
    });
  };

  const handleSaveColumn = async () => {
    if (!editingColumn.title.az || !editingColumn.title.en) {
      toast.error('Başlıq hər iki dildə doldurulmalıdır');
      return;
    }

    try {
      if (editingColumn.isNew) {
        await addColumn({
          pageId: page._id,
          data: {
            title: editingColumn.title,
            persons: editingColumn.persons,
            order: editingColumn.order,
          },
        }).unwrap();
        toast.success('Sütun əlavə edildi');
      } else {
        await updateColumn({
          pageId: page._id,
          columnIndex: editingColumn.index,
          data: {
            title: editingColumn.title,
            persons: editingColumn.persons,
            order: editingColumn.order,
          },
        }).unwrap();
        toast.success('Sütun yeniləndi');
      }
      setEditingColumn(null);
      onSuccess();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const handleDeleteColumn = async (columnIndex) => {
    if (!confirm('Bu sütunu silmək istədiyinizdən əminsiniz?')) return;

    try {
      await deleteColumn({ pageId: page._id, columnIndex }).unwrap();
      toast.success('Sütun silindi');
      onSuccess();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(columns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setColumns(items);

    try {
      await reorderColumns({
        pageId: page._id,
        columns: items.map(col => col._id),
      }).unwrap();
      toast.success('Sütunlar yenidən sıralandı');
      onSuccess();
    } catch (error) {
      toast.error('Xəta baş verdi');
      setColumns(columns); // Revert on error
    }
  };

  const togglePersonInColumn = (personId) => {
    const persons = editingColumn.persons || [];
    const exists = persons.includes(personId);
    
    setEditingColumn({
      ...editingColumn,
      persons: exists 
        ? persons.filter(id => id !== personId)
        : [...persons, personId],
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Sütunları İdarə Et - ${page?.title?.az || ''}`}
      size="xl"
    >
      <div className="space-y-4">
        {/* Add Column Button */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Sütunlar</h3>
          <Button onClick={handleAddColumn} size="sm">
            <Plus size={16} className="mr-1" />
            Yeni Sütun
          </Button>
        </div>

        {/* Columns List with Drag & Drop */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="columns">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {columns.map((column, index) => (
                  <Draggable key={column._id} draggableId={column._id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-gray-50 p-4 rounded-lg border ${
                          snapshot.isDragging ? 'border-blue-500 shadow-lg' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div {...provided.dragHandleProps} className="cursor-move">
                              <GripVertical size={20} className="text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{column.title?.az}</h4>
                              <p className="text-sm text-gray-500">
                                {column.persons?.length || 0} şəxs
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingColumn({ ...column, index })}
                            >
                              Redaktə
                            </Button>
                            <button
                              onClick={() => handleDeleteColumn(index)}
                              className="text-red-500 hover:text-red-700 p-2"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Edit Column Modal */}
        {editingColumn && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">
                {editingColumn.isNew ? 'Yeni Sütun' : 'Sütunu Redaktə Et'}
              </h3>

              <div className="space-y-4">
                {/* Title */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Başlıq (AZ)"
                    required
                    value={editingColumn.title?.az || ''}
                    onChange={(e) => setEditingColumn({
                      ...editingColumn,
                      title: { ...editingColumn.title, az: e.target.value }
                    })}
                  />
                  <Input
                    label="Başlıq (EN)"
                    required
                    value={editingColumn.title?.en || ''}
                    onChange={(e) => setEditingColumn({
                      ...editingColumn,
                      title: { ...editingColumn.title, en: e.target.value }
                    })}
                  />
                </div>

                {/* Persons Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şəxslər
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
                    {personsData?.persons?.map((person) => (
                      <label
                        key={person._id}
                        className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={editingColumn.persons?.includes(person._id)}
                          onChange={() => togglePersonInColumn(person._id)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{person.name?.az}</p>
                          <p className="text-xs text-gray-500">{person.position?.az}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setEditingColumn(null)}
                  >
                    Ləğv et
                  </Button>
                  <Button
                    onClick={handleSaveColumn}
                    loading={isAdding || isUpdating}
                  >
                    <Save size={16} className="mr-1" />
                    Yadda saxla
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
