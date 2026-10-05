import { useEffect, useRef } from "react";

type ShortcutHandler = (event: KeyboardEvent) => void;

export function useKeyboardShortcuts(
  enabled: boolean,
  shortcuts: Record<string, ShortcutHandler>,
  deps: any[] = [],
) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrMeta = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      let keyStr = "";
      if (isCtrlOrMeta) keyStr += "ctrl+";
      if (e.shiftKey) keyStr += "shift+";
      keyStr += key;

      const handler = shortcuts[keyStr];
      if (handler) {
        e.preventDefault();
        handler(e);
      }
    };

    const input = ref.current;
    if (input) {
      input.addEventListener("keydown", handleKeyDown);
      return () => input.removeEventListener("keydown", handleKeyDown);
    }
  }, [enabled, ...deps]);

  return ref;
}
