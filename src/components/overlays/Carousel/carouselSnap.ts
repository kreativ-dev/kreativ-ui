/**
 * SEAM for ScrollArea's PLANNED scroll-snap extension (container `snap` / `snapAlign` / `snapStop`
 * + a `ScrollArea.Item` part). The uploaded ScrollArea does not have it yet, so Carousel applies the
 * equivalent CSS itself, through this one file. When ScrollArea ships snap, replace the bodies below
 * with `<ScrollArea.Root snap snapAlign snapStop>` / `<ScrollArea.Item>` and nothing else changes.
 */
import type * as React from "react";

export interface CarouselSnapOptions {
  snapAlign?: "start" | "center" | "end";
  snapStop?: "normal" | "always";
}

export function useCarouselSnap({ snapAlign = "start", snapStop = "always" }: CarouselSnapOptions = {}) {
  const viewportStyle: React.CSSProperties = { scrollSnapType: "x mandatory", scrollbarWidth: "none" };
  const slideStyle: React.CSSProperties = { scrollSnapAlign: snapAlign, scrollSnapStop: snapStop };
  return { viewportStyle, slideStyle };
}
