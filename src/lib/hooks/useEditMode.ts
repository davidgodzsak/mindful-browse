import { useState } from "react";

/**
 * Hook for managing edit mode with associated data
 * Combines editing state with data being edited
 *
 * @example
 * const edit = useEditMode<MessageType>(null);
 * edit.startEdit(message)     // Enters edit mode with data
 * edit.updateData(updatedMsg) // Updates the data being edited
 * edit.finishEdit()           // Exits edit mode, clears data
 * edit.cancelEdit()           // Exits edit mode, clears data
 */
export function useEditMode<T>(
  initialData: T | null = null,
  getItemId?: (item: T) => string | number
) {
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editingData, setEditingData] = useState<T | null>(initialData);

  const startEdit = (data: T) => {
    const id = getItemId ? getItemId(data) : null;
    setEditingId(id);
    setEditingData(data);
  };

  const updateData = (data: T) => {
    setEditingData(data);
  };

  const finishEdit = () => {
    setEditingId(null);
    setEditingData(initialData);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingData(initialData);
  };

  const isEditing = editingId !== null || editingData !== initialData;

  return {
    isEditing,
    editingId,
    editingData,
    startEdit,
    updateData,
    finishEdit,
    cancelEdit,
  } as const;
}
