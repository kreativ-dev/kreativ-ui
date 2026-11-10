import { useMemo } from "react";
import { size } from "@floating-ui/react";

export function useMenuSize() {
  return useMemo(
    () =>
      size({
        padding: 8,
        apply({ availableHeight, elements }) {
          const configuredHeight = elements.floating.dataset.maxHeight;

          const available = `${Math.max(0, availableHeight)}px`;

          elements.floating.style.maxHeight = configuredHeight
            ? `min(${configuredHeight}, ${available})`
            : available;

          elements.floating.style.overflowY = "auto";
          elements.floating.style.overflowX = "hidden";
        },
      }),
    [],
  );
}
