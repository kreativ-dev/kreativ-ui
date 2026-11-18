import * as React from "react";
import type { ScrollAreaHandle } from "@/components/layout/ScrollArea/ScrollArea.types";

export interface CarouselWindow {
  /** Visible slide-widths across the viewport. The divisor for slide width. */
  span: number;
  /** Gaps that fit in the viewport. */
  gapCount: number;
  /** Visible fraction of the slide peeking in at the start. 0 = none. */
  lead: number;
  /** Visible fraction of the slide peeking in at the end. 0 = none. */
  trail: number;
  /** True when built from `slideVisibility`: slide-aligned positions, ends padded with spacers. */
  padded: boolean;
}

export interface CarouselContextValue {
  window: CarouselWindow;
  id: string;
  viewportId: string;

  /** Leading visible slide index, clamped to [0, maxIndex]. */
  index: number;
  count: number;
  /** Highest reachable leading index = max(count - slidesPerView, 0). */
  maxIndex: number;
  slidesPerView: number;
  gap: number | string;
  loop: boolean;

  /** The `autoplay` prop (is there anything to play/pause at all). */
  autoplay: boolean;
  /** User-controlled play state (PlayPause). Independent of hover/focus/visibility pauses. */
  playing: boolean;
  setPlaying: (playing: boolean) => void;
  /** Called by PlayPause when the user presses Play: resume even if hover/focus would still pause. */
  resumeOverride: () => void;

  /** True while autoplay is actually armed (not paused / reduced-motion / at the end). */
  autoplayRunning: boolean;
  prefersReducedMotion: boolean;

  setCount: (n: number) => void;
  goTo: (index: number) => void;
  next: () => void;
  previous: () => void;
  canNext: boolean;
  canPrevious: boolean;

  /** Latest index, readable from async callbacks without stale closures. */
  indexRef: React.MutableRefObject<number>;
  maxIndexRef: React.MutableRefObject<number>;
}

export const CarouselContext = React.createContext<CarouselContextValue | null>(
  null,
);

export function useCarouselContext(part: string): CarouselContextValue {
  const ctx = React.useContext(CarouselContext);
  if (!ctx) throw new Error(`${part} must be rendered inside <Carousel.Root>`);
  return ctx;
}

export type { ScrollAreaHandle };
