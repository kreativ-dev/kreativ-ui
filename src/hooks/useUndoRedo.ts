import { useCallback, useRef, useState } from "react";

interface UseUndoRedoOptions {
  /**
   * Maximum number of history entries to keep.
   * Only applies when `undoable` is `true` and the component manages its own history.
   * @default 30
   */
  maxHistory?: number;
}

/**
 * Manages a history stack for a value, providing undo/redo capabilities.
 * The hook stores the current value in its own state, but you can also
 * sync it with external state by calling `push` when the external value changes.
 *
 * @param initialValue - The starting value.
 * @param options - Configuration (maxHistory).
 * @returns An object with the current value, setters, and undo/redo controls.
 */
export function useUndoRedo<T>(
  initialValue: T,
  options: UseUndoRedoOptions & { onValueChange?: (value: T) => void } = {},
) {
  const { maxHistory = 30, onValueChange } = options;

  const [value, setValue] = useState<T>(initialValue);
  const historyRef = useRef<T[]>([initialValue]);
  const indexRef = useRef(0);

  const push = useCallback(
    (newValue: T) => {
      if (newValue === historyRef.current[indexRef.current]) return;

      historyRef.current = historyRef.current.slice(0, indexRef.current + 1);

      historyRef.current.push(newValue);
      if (historyRef.current.length > maxHistory) {
        historyRef.current = historyRef.current.slice(-maxHistory);
        indexRef.current = historyRef.current.length - 1;
      } else {
        indexRef.current = historyRef.current.length - 1;
      }

      setValue(newValue);
      onValueChange?.(newValue);
    },
    [maxHistory, onValueChange],
  );

  const undo = useCallback(() => {
    if (indexRef.current <= 0) return;
    indexRef.current -= 1;
    const newValue = historyRef.current[indexRef.current];
    setValue(newValue);
    onValueChange?.(newValue);
  }, [onValueChange]);

  const redo = useCallback(() => {
    if (indexRef.current >= historyRef.current.length - 1) return;
    indexRef.current += 1;
    const newVal = historyRef.current[indexRef.current];
    setValue(newVal);
  }, []);

  const reset = useCallback(
    (newValue: T) => {
      historyRef.current = [newValue];
      indexRef.current = 0;
      setValue(newValue);
      onValueChange?.(newValue);
    },
    [onValueChange],
  );

  const canUndo = indexRef.current > 0;
  const canRedo = indexRef.current < historyRef.current.length - 1;

  return {
    value,
    setValue,
    push,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    history: historyRef.current,
    currentIndex: indexRef.current,
  };
}
