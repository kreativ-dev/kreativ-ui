import { useCallback, useState, type RefObject } from "react";

type ClearableFieldOptions = {
  onClear?: () => void;
  onUndo?: (value: string) => void;
  onRedo?: (value: string) => void;
};

export function useClearableField<
  T extends HTMLInputElement | HTMLTextAreaElement,
>(
  elementRef: RefObject<T | null>,
  initialValue: unknown,
  { onClear, onUndo, onRedo }: ClearableFieldOptions = {},
) {
  const initial = String(initialValue ?? "");

  const [hasValue, setHasValue] = useState(Boolean(initial));
  const [history, setHistory] = useState<string[]>(() =>
    initial ? [initial] : [],
  );
  const [historyIndex, setHistoryIndex] = useState(initial ? 0 : -1);

  const setElementValue = useCallback(
    (value: string) => {
      const element = elementRef.current;
      if (!element) return;

      const prototype =
        element instanceof HTMLTextAreaElement
          ? HTMLTextAreaElement.prototype
          : HTMLInputElement.prototype;

      const setter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;

      setter?.call(element, value);

      element.dispatchEvent(new Event("input", { bubbles: true }));

      setHasValue(Boolean(value));
    },
    [elementRef],
  );

  const clear = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    const currentValue = element.value;

    if (!currentValue) return;

    setHistory((current) => {
      const next = current.slice(0, historyIndex + 1);

      next.push(currentValue);

      return next;
    });

    setHistoryIndex((index) => index + 1);

    setElementValue("");
    element.focus();

    onClear?.();
  }, [elementRef, historyIndex, onClear, setElementValue]);

  const undo = useCallback(() => {
    if (historyIndex < 0) return;

    const previousValue = history[historyIndex];

    setElementValue(previousValue ?? "");

    setHistoryIndex((index) => index - 1);

    onUndo?.(previousValue ?? "");
  }, [history, historyIndex, onUndo, setElementValue]);

  const redo = useCallback(() => {
    const nextIndex = historyIndex + 1;

    if (nextIndex >= history.length) return;

    const nextValue = history[nextIndex];

    setElementValue(nextValue);

    setHistoryIndex(nextIndex);

    onRedo?.(nextValue);
  }, [history, historyIndex, onRedo, setElementValue]);

  return {
    hasValue,
    setHasValue,
    clear,
    undo,
    redo,
    canUndo: historyIndex >= 0,
    canRedo: historyIndex < history.length - 1,
  };
}
