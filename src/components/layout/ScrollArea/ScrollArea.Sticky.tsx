"use client";

import { useRef, useState } from "react";

import { composeRefs, createComponent } from "@splenddev/kreativ-core";

import { StickyHandle, STICKY_EDGES, type StickyEdge } from "./ScrollEngine";
import { useScrollEngine, useIsoLayoutEffect } from "./useScrollProgress";
import type { ScrollAreaStickyProps } from "./ScrollArea.types";

/** sticky silently does nothing under an overflow:hidden/auto/scroll ancestor */
function warnIfClipped(el: HTMLElement, container: HTMLElement | null) {
  for (let p = el.parentElement; p && p !== container; p = p.parentElement) {
    if (/hidden|auto|scroll/.test(getComputedStyle(p).overflow)) {
      console.warn(
        "[kreativ-ui/ScrollArea.Sticky]: will not stick: an ancestor has overflow other than visible/clip.",
        p,
      );
      return;
    }
  }
}

export const ScrollAreaSticky = createComponent<
  ScrollAreaStickyProps,
  HTMLElement
>({
  displayName: "ScrollArea.Sticky",
  __kui: {
    role: "layout",
    skeleton: "preserve",
    groupSlot: "ScrollArea",
    video: {
      id: "scroll-area-sticky",
      safe: true,
      acceptsChildren: true,
      needsParentContext: true,
      interactionStates: [],
    },
  },
  render: (
    {
      top,
      bottom,
      left,
      right,
      zIndex = 1,
      onStuckChange,
      as: Tag = "div",
      style,
      ...rest
    },
    forwardedRef,
  ) => {
    const engine = useScrollEngine("ScrollArea.Sticky");
    const ref = useRef<HTMLElement>(null);
    const [handle] = useState(() => new StickyHandle());

    // a sticky with no offset does nothing, so default to top: 0
    const none =
      top === undefined &&
      bottom === undefined &&
      left === undefined &&
      right === undefined;
    const offsets: Record<StickyEdge, number | string | undefined> = {
      top: none ? 0 : top,
      bottom,
      left,
      right,
    };

    useIsoLayoutEffect(() => {
      handle.onStuckChange = onStuckChange;
    });

    useIsoLayoutEffect(() => {
      const el = ref.current;
      if (!el) return;
      handle.el = el;
      handle.edges = STICKY_EDGES.filter((e) => offsets[e] !== undefined);
      handle.dirty = true;

      if (process.env.NODE_ENV !== "production") warnIfClipped(el, engine.el);

      return engine.registerSticky(handle);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      engine,
      handle,
      offsets.top,
      offsets.bottom,
      offsets.left,
      offsets.right,
    ]);

    return (
      <Tag
        ref={composeRefs(ref, forwardedRef)}
        data-kui-scroll-sticky
        style={{
          position: "sticky",
          top: offsets.top,
          bottom: offsets.bottom,
          left: offsets.left,
          right: offsets.right,
          zIndex,
          ...style,
        }}
        {...rest}
      />
    );
  },
});
