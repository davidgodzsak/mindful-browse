import { useState } from "react";

/**
 * Hook for managing toggle selection state
 * Toggles between a selected value and null
 *
 * @example
 * const [selected, toggle, reset] = useToggleSelection<number>(null);
 * toggle(5)    // selected becomes 5
 * toggle(5)    // selected becomes null (toggle off)
 * toggle(10)   // selected becomes 10
 * reset()      // selected becomes null
 */
export function useToggleSelection<T>(initialValue: T | null = null) {
  const [selected, setSelected] = useState<T | null>(initialValue);

  const toggle = (value: T) => {
    setSelected((prev) => (prev === value ? null : value));
  };

  const reset = () => {
    setSelected(initialValue);
  };

  return [selected, toggle, reset] as const;
}
