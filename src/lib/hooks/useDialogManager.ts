import { useState } from "react";

/**
 * Hook for managing dialog state with associated data
 * Combines dialog open/close with data selection/editing
 *
 * @example
 * const dialog = useDialogManager<GroupType>(null);
 * dialog.open(group)   // Opens dialog with data
 * dialog.close()       // Closes dialog and clears data
 * dialog.reset()       // Clears without opening
 */
export function useDialogManager<T>(initialData: T | null = null) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(initialData);

  const open = (newData?: T) => {
    if (newData !== undefined) {
      setData(newData);
    }
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setData(initialData);
  };

  const reset = () => {
    setData(initialData);
  };

  const updateData = (newData: T) => {
    setData(newData);
  };

  return {
    isOpen,
    data,
    open,
    close,
    reset,
    updateData,
    setIsOpen, // For advanced cases like onOpenChange
  } as const;
}
