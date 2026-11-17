"use client";
import * as React from "react";
import { CarouselContext, type CarouselContextValue } from "./Carousel.context";
import { useControllableState } from "@/hooks";
import { createComponent, useTheme } from "@splenddev/kreativ-core";
import { resolveRecipe } from "@/theme/recipes/resolveRecipe";

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

  /** Slides visible at once. Default 1. */
  slidesPerView?: number;
  /** Space between slides (number = px, or any CSS length). Default 0. */
  gap?: number | string;

  /** Extra recipe variant groups (e.g. from extendRecipe). Typed props win on collision. */
  recipeProps?: Record<string, string>;
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
      ...rest
    } = props;

    const id = React.useId();
    const { theme } = useTheme();

    const slidesPerView = Math.max(1, Math.floor(spvProp));
    const [count, setCount] = React.useState(0);
    const maxIndex = Math.max(count - slidesPerView, 0);

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
