import type { ElementType, HTMLAttributes, UIEvent } from "react";
import type { ResponsiveValue, BaseProps } from "@/types";

export type ScrollDirection = "vertical" | "horizontal" | "both";
export type ScrollbarVisibility = "auto" | "always" | "hover" | "never";
export type ScrollbarVariant = "thin" | "default";
export type ScrollEdge = "top" | "bottom" | "left" | "right";
export type ScrollSnap = "none" | "proximity" | "mandatory";
export type ScrollSnapAlign = "start" | "center" | "end";
export type SceneRange = "through" | "pinned";

export interface FadeEdgesConfig {
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
}

/** 0 → 1 on each axis, 0 when the axis doesn't overflow */
export type ScrollProgress = { x: number; y: number };

export interface ProgressStore<T> {
  /** live layout read: use in effects/handlers, not during render */
  get(): T;
  subscribe(fn: (value: T) => void): () => void;
}

export interface ScrollAreaProps extends BaseProps {
  maxHeight?: ResponsiveValue<string | number>;
  maxWidth?: ResponsiveValue<string | number>;
  direction?: ScrollDirection;

  showScrollbar?: ScrollbarVisibility;
  scrollbarVariant?: ScrollbarVariant;

  fadeEdges?: boolean | FadeEdgesConfig;
  fadeSize?: string | number;

  overscrollBehavior?: "auto" | "contain" | "none";
  snap?: ScrollSnap;
  snapAlign?: ScrollSnapAlign;
  dragToScroll?: boolean;

  onScroll?: (e: UIEvent<HTMLElement>) => void;
  onScrollEnd?: (edge: ScrollEdge) => void;
  endThreshold?: number;

  trackProgress?: boolean;

  /** default: 0 only while content overflows */
  tabIndex?: number;

  as?: ElementType;
}

export interface ScrollStepOptions {
  axis?: "x" | "y";
  step?: "page" | "item";
  behavior?: ScrollBehavior;
}

export interface ScrollAreaHandle {
  getElement: () => HTMLElement | null;
  measure: () => void;
  scrollTo: (opts: ScrollToOptions) => void;
  scrollToTop: (behavior?: ScrollBehavior) => void;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
  scrollToEdge: (edge: ScrollEdge, behavior?: ScrollBehavior) => void;
  scrollNext: (opts?: ScrollStepOptions) => void;
  scrollPrev: (opts?: ScrollStepOptions) => void;
  /** nth direct child */
  scrollToIndex: (
    index: number,
    opts?: Omit<ScrollStepOptions, "step">,
  ) => void;
}

export interface ScrollAreaSceneProps extends HTMLAttributes<HTMLElement> {
  range?: SceneRange;
  axis?: "x" | "y";
  as?: ElementType;
}

export interface ScrollAreaStickyProps extends HTMLAttributes<HTMLElement> {
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
  zIndex?: number;
  onStuckChange?: (stuck: boolean) => void;
  as?: ElementType;
}
