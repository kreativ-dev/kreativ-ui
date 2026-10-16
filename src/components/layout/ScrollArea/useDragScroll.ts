import { useEffect, useRef, type RefObject } from "react";
import type { ScrollDirection } from "./ScrollArea.types";

const THRESHOLD = 5; // px of movement before a press becomes a drag
const IGNORE =
  "input, textarea, select, [contenteditable=''], [contenteditable='true'], [data-no-drag]";

interface Options {
  enabled: boolean;
  direction: ScrollDirection;
  /** runs after the pointer is released and snapping is live again */
  onRelease?: (el: HTMLElement) => void;
}

export function useDragScroll(
  elRef: RefObject<HTMLElement | null>,
  { enabled, direction, onRelease }: Options
) {
  const releaseRef = useRef(onRelease);
  releaseRef.current = onRelease;

  useEffect(() => {
    const el = elRef.current;
    if (!el || !enabled) return;

    const allowX = direction !== "vertical";
    const allowY = direction !== "horizontal";

    let pointerId: number | null = null;
    let startX = 0,
      startY = 0,
      startLeft = 0,
      startTop = 0;
    let dragging = false;
    let suppressClick = false;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch" || e.button !== 0) return;
      if ((e.target as Element).closest(IGNORE)) return;
      pointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = el.scrollLeft;
      startTop = el.scrollTop;
      dragging = false;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (!dragging) {
        if (Math.hypot(dx, dy) < THRESHOLD) return;
        dragging = true;
        try {
          el.setPointerCapture(e.pointerId);
        } catch {
          /* pointer already gone */
        }
        el.setAttribute("data-dragging", ""); // CSS turns snap + smooth-scroll off
        window.getSelection()?.removeAllRanges();
      }
      if (allowX) el.scrollLeft = startLeft - dx;
      if (allowY) el.scrollTop = startTop - dy;
    };

    const onEnd = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      pointerId = null;
      if (!dragging) return;
      dragging = false;
      suppressClick = true;
      setTimeout(() => {
        suppressClick = false; // the click fires right after pointerup
      }, 0);
      el.removeAttribute("data-dragging"); // snap is live again
      releaseRef.current?.(el);
    };

    // swallow the click that follows a drag so cards don't open on release
    const onClickCapture = (e: MouseEvent) => {
      if (!suppressClick) return;
      e.preventDefault();
      e.stopPropagation();
    };

    // stop native image/link ghost-dragging, but leave consumers' own draggable rows alone
    const onDragStart = (e: DragEvent) => {
      if (!(e.target as Element).closest?.('[draggable="true"]')) e.preventDefault();
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onEnd);
    el.addEventListener("pointercancel", onEnd);
    el.addEventListener("click", onClickCapture, true);
    el.addEventListener("dragstart", onDragStart);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onEnd);
      el.removeEventListener("pointercancel", onEnd);
      el.removeEventListener("click", onClickCapture, true);
      el.removeEventListener("dragstart", onDragStart);
      el.removeAttribute("data-dragging");
    };
  }, [elRef, enabled, direction]);
}
