import type { ElementType, HTMLAttributes, UIEvent } from "react";
import type { ResponsiveValue, BaseProps } from "@/types";

/** Scroll axis. `"both"` overflows on x and y. */
export type ScrollDirection = "vertical" | "horizontal" | "both";

/**
 * When the scrollbar is painted.
 * `"auto"` follows the platform. `"hover"` shows it only while the area is hovered.
 * `"always"` keeps it visible. `"never"` hides it; scrolling still works.
 */
export type ScrollbarVisibility = "auto" | "always" | "hover" | "never";

/** Scrollbar thickness. `"thin"` is the compact track. */
export type ScrollbarVariant = "thin" | "default";

/** An edge of the scrollport. */
export type ScrollEdge = "top" | "bottom" | "left" | "right";

/**
 * `scroll-snap-type` strictness.
 * `"proximity"` snaps when close. `"mandatory"` always settles on a snap point.
 */
export type ScrollSnap = "none" | "proximity" | "mandatory";

/** `scroll-snap-align` for snap targets. */
export type ScrollSnapAlign = "start" | "center" | "end";

/**
 * How a Scene measures its own progress.
 * `"through"` is 0 when the scene enters the scrollport and 1 when it leaves.
 * `"pinned"` holds at 1 while the scene covers the scrollport.
 */
export type SceneRange = "through" | "pinned";

/** Per-edge fade. A missing edge is off. */
export interface FadeEdgesConfig {
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
}

/** `0` → `1` on each axis. `0` when that axis does not overflow. */
export type ScrollProgress = { x: number; y: number };

/**
 * External store for a value that changes outside React render.
 * `get` is a live layout read: use it in effects and handlers, not during render.
 */
export interface ProgressStore<T> {
  get(): T;
  subscribe(fn: (value: T) => void): () => void;
}

export interface ScrollAreaProps extends BaseProps {
  /**
   * `max-height`. Caps the vertical scrollport.
   * Token, pixel number, or raw length. Responsive maps are resolved to breakpoint styles.
   */
  maxHeight?: ResponsiveValue<string | number>;

  /**
   * `max-width`. Caps the horizontal scrollport.
   * Token, pixel number, or raw length. Responsive maps are resolved to breakpoint styles.
   */
  maxWidth?: ResponsiveValue<string | number>;

  /**
   * Which axis overflows.
   * @default "vertical"
   */
  direction?: ScrollDirection;

  /**
   * When the scrollbar is shown. Scrolling is unaffected.
   * @default "auto"
   */
  showScrollbar?: ScrollbarVisibility;

  /**
   * Scrollbar thickness.
   * @default "thin"
   */
  scrollbarVariant?: ScrollbarVariant;

  /**
   * Edge fade on axes that still have room to scroll.
   * `true` fades every eligible edge. An object turns on specific edges.
   * A fade is omitted when that edge is already at the end, or the axis does not overflow.
   * @default false
   */
  fadeEdges?: boolean | FadeEdgesConfig;

  /**
   * Length of the edge fade. Number is pixels.
   * @default "24px"
   */
  fadeSize?: string | number;

  /**
   * `overscroll-behavior`. `"contain"` stops scroll chaining to the parent.
   * @default "contain"
   */
  overscrollBehavior?: "auto" | "contain" | "none";

  /**
   * `scroll-snap-type`. `"none"` disables snapping.
   * With `"mandatory"`, drag-to-scroll settles on the nearest item on release.
   * @default "none"
   */
  snap?: ScrollSnap;

  /**
   * `scroll-snap-align` used by snap targets and `scrollToIndex`.
   * @default "start"
   */
  snapAlign?: ScrollSnapAlign;

  /**
   * Pointer-drag scrolling. Off by default so text selection still works.
   * @default false
   */
  dragToScroll?: boolean;

  /** Native scroll event, after the area has recorded its position. */
  onScroll?: (e: UIEvent<HTMLElement>) => void;

  /**
   * Fires when a scroll gesture settles on an edge, within `endThreshold`.
   * The edge is the one that was reached (`"bottom"` for a vertical list at the end).
   */
  onScrollEnd?: (edge: ScrollEdge) => void;

  /**
   * Distance from an edge, in pixels, that still counts as "at the edge".
   * @default 0
   */
  endThreshold?: number;

  /**
   * Publish scroll progress for Scene and other consumers.
   * Off by default; progress reads are idle unless something subscribes.
   * @default false
   */
  trackProgress?: boolean;

  /**
   * Makes the scrollport focusable so it can be scrolled by keyboard.
   * Omit to use `0` while content overflows, and no tab stop when it does not.
   */
  tabIndex?: number;

  /**
   * Element to render.
   * @default "div"
   */
  as?: ElementType;
}

/** Options for `scrollNext` / `scrollPrev`. */
export interface ScrollStepOptions {
  /** Axis to step on. Defaults to the area's main axis (`"y"` unless `direction` is `"horizontal"`). */
  axis?: "x" | "y";
  /**
   * `"page"` moves by one client width/height.
   * `"item"` moves to the next snap target past the current offset.
   * @default "page"
   */
  step?: "page" | "item";
  /** Native scroll behavior. `"auto"` if omitted. */
  behavior?: ScrollBehavior;
}

/**
 * Imperative handle. The ref is this handle, not the DOM node.
 * Use `getElement()` for the scrollport.
 */
export interface ScrollAreaHandle {
  /** The scrollport element, or `null` before mount. */
  getElement: () => HTMLElement | null;
  /** Re-read overflow and edge state. */
  measure: () => void;
  /** Native `scrollTo`. */
  scrollTo: (opts: ScrollToOptions) => void;
  scrollToTop: (behavior?: ScrollBehavior) => void;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
  /** Scroll so the given edge of the content meets the scrollport. */
  scrollToEdge: (edge: ScrollEdge, behavior?: ScrollBehavior) => void;
  /** Step forward by a page or to the next item. */
  scrollNext: (opts?: ScrollStepOptions) => void;
  /** Step backward by a page or to the previous item. */
  scrollPrev: (opts?: ScrollStepOptions) => void;
  /**
   * Scroll so the nth direct child aligns to `snapAlign`.
   * No-op if the index is out of range.
   */
  scrollToIndex: (
    index: number,
    opts?: Omit<ScrollStepOptions, "step">,
  ) => void;
}

/**
 * Publishes its own travel through the scrollport as `--kui-scene-progress` (`0` → `1`),
 * inherited by every descendant.
 */
export interface ScrollAreaSceneProps extends HTMLAttributes<HTMLElement> {
  /**
   * How progress is measured.
   * `"through"` runs `0` → `1` as the scene crosses the scrollport.
   * `"pinned"` stays at `1` while the scene covers it.
   */
  range?: SceneRange;
  /** Axis to measure. Defaults to the ScrollArea's main axis. */
  axis?: "x" | "y";
  /**
   * Element to render.
   * @default "div"
   */
  as?: ElementType;
}

/**
 * `position: sticky` inside the ScrollArea.
 * With no offset, sticks to the start of the scroll axis: `top` when vertical,
 * `left` when horizontal, both when `direction` is `"both"`.
 * An explicit `top` / `right` / `bottom` / `left` wins.
 * Does nothing if an ancestor between this node and the ScrollArea has `overflow` other than `visible`.
 */
export interface ScrollAreaStickyProps extends HTMLAttributes<HTMLElement> {
  /** Inset from the top edge while stuck. Number is pixels. */
  top?: number | string;
  /** Inset from the bottom edge while stuck. Number is pixels. */
  bottom?: number | string;
  /** Inset from the left edge while stuck. Number is pixels. */
  left?: number | string;
  /** Inset from the right edge while stuck. Number is pixels. */
  right?: number | string;
  /**
   * `z-index` while in the scrollport.
   * @default 1
   */
  zIndex?: number;
  /** Called when the sticky node starts or stops being stuck. */
  onStuckChange?: (stuck: boolean) => void;
  /**
   * Element to render.
   * @default "div"
   */
  as?: ElementType;
}
