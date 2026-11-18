"use client";
import * as React from "react";
import { CarouselContext } from "./Carousel.context";
import { useControllableState } from "@/hooks";
import { createComponent, useTheme } from "@splenddev/kreativ-core";
import { resolveRecipe } from "@/theme/recipes/resolveRecipe";
import type { CarouselWindow, CarouselContextValue } from "./Carousel.context";

const MIN_VISIBLE = 0.05;
const EPS = 1e-6;

function resolveWindow(
  visibility: number[] | undefined,
  slidesPerViewProp: number,
): { slidesPerView: number; window: CarouselWindow } {
  if (visibility && visibility.length > 0) {
    const v = visibility.map((x) =>
      Number.isFinite(x) ? Math.min(Math.max(x, MIN_VISIBLE), 1) : 1,
    );
    const n = v.length;
    const lead = n > 1 && v[0] < 1 - EPS ? v[0] : 0;
    const trail = n > 1 && v[n - 1] < 1 - EPS ? v[n - 1] : 0;
    const interior = v.slice(lead > 0 ? 1 : 0, n - (trail > 0 ? 1 : 0));

    if (
      process.env.NODE_ENV !== "production" &&
      interior.some((x) => x < 1 - EPS)
    ) {
      console.warn(
        "<Carousel.Root slideVisibility>: only the first and last entries may be below 1. Interior entries are treated as 1.",
      );
    }
    if (interior.length >= 1) {
      return {
        slidesPerView: interior.length,
        window: {
          span: interior.length + lead + trail,
          gapCount: n - 1,
          lead,
          trail,
          padded: true,
        },
      };
    }
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "<Carousel.Root slideVisibility> needs at least one whole slide (a 1). Falling back to slidesPerView.",
      );
    }
  }

  const spv = Number.isFinite(slidesPerViewProp)
    ? Math.max(1, slidesPerViewProp)
    : 1;
  return {
    slidesPerView: spv,
    window: {
      span: spv,
      gapCount: Math.ceil(spv) - 1,
      lead: 0,
      trail: 0,
      padded: false,
    },
  };
}

export interface CarouselRootProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  /** Leading visible slide (0-based). Controlled. */
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;

  /** Wrap-around navigation (rewind): Next on the last position goes to the first, and vice versa. */
  loop?: boolean;
  /** Auto-advance. Never runs under prefers-reduced-motion. */
  autoplay?: boolean;
  /** User play/pause state (Carousel.PlayPause). Controlled. Default true. */
  playing?: boolean;
  defaultPlaying?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  /** ms between auto-advances. Default 5000. */
  autoplayInterval?: number;
  /** Pause while the pointer is over the carousel. Default true. */
  pauseOnHover?: boolean;
  /** Pause while focus is inside the carousel. Default true. */
  pauseOnFocus?: boolean;

  /** Slides visible at once. Fractions peek the next slide (1.5). Default 1. */ slidesPerView?: number;
  /** Space between slides (number = px, or any CSS length). Default 0. */
  gap?: number | string;

  /** Extra recipe variant groups (e.g. from extendRecipe). Typed props win on collision. */
  recipeProps?: Record<string, string>;

  /**
   * Shape of the visible window: the fraction of each slide that shows, in order.
   * `[0.3, 1, 0.3]` = one whole slide with 30% of each neighbour peeking in.
   * Values are 0–1; only the first and last may be below 1. `index` is the first whole slide.
   * Overrides `slidesPerView`.
   */
  slideVisibility?: number[];
}

function usePrefersReducedMotion(): boolean {
  const query = "(prefers-reduced-motion: reduce)";
  const [reduced, setReduced] = React.useState(
    () => typeof window !== "undefined" && !!window.matchMedia?.(query).matches,
  );
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia(query);
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

const isEditable = (t: EventTarget | null) => {
  const el = t as HTMLElement | null;
  if (!el || !el.tagName) return false;
  return el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
};

export const CarouselRoot = createComponent<CarouselRootProps, HTMLDivElement>({
  displayName: "Carousel.Root",
  __kui: { role: "layout", skeleton: "preserve" },
  render: (props, ref) => {
    const {
      index: indexProp,
      defaultIndex = 0,
      onIndexChange,
      loop = false,
      autoplay = false,
      playing: playingProp,
      defaultPlaying = true,
      onPlayingChange,
      autoplayInterval = 5000,
      pauseOnHover = true,
      pauseOnFocus = true,
      slidesPerView: spvProp = 1,
      gap = 0,
      className,
      children,
      onPointerEnter,
      onPointerLeave,
      onFocus,
      onBlur,
      onKeyDown,
      recipeProps,
      slideVisibility,
      ...rest
    } = props;

    const id = React.useId();
    const { theme } = useTheme();

    const visibilityKey = slideVisibility?.join(",");
    const { slidesPerView, window: slideWindow } = React.useMemo(
      () => resolveWindow(slideVisibility, spvProp),
      [visibilityKey, spvProp],
    );
    const [count, setCount] = React.useState(0);
    const maxIndex = slideWindow.padded
      ? Math.max(count - slidesPerView, 0)
      : Math.max(Math.ceil(count - slidesPerView - 1e-6), 0);

    const [rawIndex, setIndex] = useControllableState<number>({
      value: indexProp,
      defaultValue: defaultIndex,
      onChange: onIndexChange,
    });
    const index = Math.min(Math.max(rawIndex, 0), maxIndex);

    const indexRef = React.useRef(index);
    indexRef.current = index;
    const maxIndexRef = React.useRef(maxIndex);
    maxIndexRef.current = maxIndex;

    const goTo = React.useCallback(
      (i: number) => setIndex(Math.min(Math.max(i, 0), maxIndexRef.current)),
      [setIndex],
    );
    const next = React.useCallback(() => {
      const i = indexRef.current;
      const max = maxIndexRef.current;
      if (i < max) goTo(i + 1);
      else if (loop && max > 0) goTo(0);
    }, [goTo, loop]);
    const previous = React.useCallback(() => {
      const i = indexRef.current;
      const max = maxIndexRef.current;
      if (i > 0) goTo(i - 1);
      else if (loop && max > 0) goTo(max);
    }, [goTo, loop]);

    const canNext = loop ? maxIndex > 0 : index < maxIndex;
    const canPrevious = loop ? maxIndex > 0 : index > 0;

    const reduced = usePrefersReducedMotion();
    const [hovered, setHovered] = React.useState(false);
    const [focused, setFocused] = React.useState(false);
    const [hidden, setHidden] = React.useState(
      () =>
        typeof document !== "undefined" &&
        document.visibilityState === "hidden",
    );
    React.useEffect(() => {
      const on = () => setHidden(document.visibilityState === "hidden");
      document.addEventListener("visibilitychange", on);
      return () => document.removeEventListener("visibilitychange", on);
    }, []);

    const [playing, setPlaying] = useControllableState<boolean>({
      value: playingProp,
      defaultValue: defaultPlaying,
      onChange: onPlayingChange,
    });
    const [override, setOverride] = React.useState(false);
    React.useEffect(() => {
      if (override && !hovered && !focused) setOverride(false);
    }, [override, hovered, focused]);
    const resumeOverride = React.useCallback(() => setOverride(true), []);

    const armed =
      autoplay &&
      playing &&
      !reduced &&
      maxIndex > 0 &&
      !(pauseOnHover && hovered && !override) &&
      !(pauseOnFocus && focused && !override) &&
      !hidden &&
      (loop || index < maxIndex);

    React.useEffect(() => {
      if (!armed) return;
      const t = setTimeout(next, autoplayInterval);
      return () => clearTimeout(t);
    }, [armed, index, autoplayInterval, next]);

    React.useEffect(() => {
      if (process.env.NODE_ENV === "production") return;
      if (!rest["aria-label"] && !rest["aria-labelledby"]) {
        console.warn(
          "<Carousel.Root> needs an aria-label or aria-labelledby so the carousel region has an accessible name.",
        );
      }
    }, []);

    const value = React.useMemo<CarouselContextValue>(
      () => ({
        id,
        viewportId: `${id}-viewport`,
        index,
        count,
        maxIndex,
        slidesPerView,
        gap,
        loop,
        autoplay,
        playing,
        setPlaying,
        resumeOverride,
        autoplayRunning: armed,
        prefersReducedMotion: reduced,
        setCount,
        goTo,
        next,
        previous,
        canNext,
        canPrevious,
        indexRef,
        maxIndexRef,
        window: slideWindow,
      }),
      [
        id,
        index,
        count,
        maxIndex,
        slidesPerView,
        gap,
        loop,
        autoplay,
        playing,
        setPlaying,
        resumeOverride,
        armed,
        reduced,
        goTo,
        next,
        previous,
        canNext,
        canPrevious,
        slideWindow,
      ],
    );

    return (
      <CarouselContext.Provider value={value}>
        <div
          ref={ref}
          role="region"
          aria-roledescription="carousel"
          data-autoplay={autoplay ? "" : undefined}
          className={resolveRecipe(
            theme.recipes.Carousel,
            { ...recipeProps },
            className,
          )}
          {...rest}
          onPointerEnter={(e) => {
            onPointerEnter?.(e);
            setHovered(true);
          }}
          onPointerLeave={(e) => {
            onPointerLeave?.(e);
            setHovered(false);
          }}
          onFocus={(e) => {
            onFocus?.(e);
            setFocused(true);
          }}
          onBlur={(e) => {
            onBlur?.(e);
            if (!e.currentTarget.contains(e.relatedTarget as Node | null))
              setFocused(false);
          }}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            if (e.defaultPrevented || isEditable(e.target)) return;
            if (e.key === "ArrowRight") {
              e.preventDefault();
              next();
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              previous();
            }
          }}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
});
