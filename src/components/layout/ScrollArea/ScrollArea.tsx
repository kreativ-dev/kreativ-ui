"use client";

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
  type CSSProperties,
  type UIEvent,
} from "react";
import { resolveRecipe } from "@/theme/recipes/resolveRecipe";
import { cn } from "@/utils/cn";
import { isResponsiveValue, resolveResponsiveValue } from "@/utils/responsive";
import { ResponsiveStyle } from "@/components/internal/ResponsiveStyle";

import { useScrollPosition } from "./useScrollPosition";
import { useDragScroll } from "./useDragScroll";
import { ScrollEngine } from "./ScrollEngine";
import { ScrollEngineContext, useIsoLayoutEffect } from "./useScrollProgress";
import {
  childTarget,
  resolveBehavior,
  snapItems,
  snapToNearest,
  type Axis,
} from "./scrollTargets";
import { ScrollAreaScene } from "./ScrollArea.Scene";
import { ScrollAreaSticky } from "./ScrollArea.Sticky";
import type {
  ScrollAreaHandle,
  ScrollAreaProps,
  ScrollEdge,
  ScrollStepOptions,
} from "./ScrollArea.types";
import { useTheme } from "@splenddev/kreativ-core";
import { useResponsiveStyles } from "@/hooks";

function shouldFade(fadeEdges: ScrollAreaProps["fadeEdges"], edge: ScrollEdge): boolean {
  if (fadeEdges === true) return true;
  if (!fadeEdges) return false;
  return !!fadeEdges[edge];
}

const ScrollAreaRoot = forwardRef<ScrollAreaHandle, ScrollAreaProps>(function ScrollArea(
  {
    maxHeight,
    maxWidth,
    direction = "vertical",
    showScrollbar = "auto",
    scrollbarVariant = "thin",
    fadeEdges = false,
    fadeSize = "24px",
    overscrollBehavior = "contain",
    snap = "none",
    snapAlign = "start",
    dragToScroll = false,
    onScroll,
    onScrollEnd,
    endThreshold = 0,
    trackProgress = false,
    tabIndex,
    as: Tag = "div",
    className,
    style,
    children,
    ...rest
  },
  forwardedRef
) {
  const { theme } = useTheme();
  const [engine] = useState(() => new ScrollEngine());

  const { elRef, state, handleScroll, measure } = useScrollPosition({
    direction,
    threshold: endThreshold,
    onScrollEnd,
    onMeasure: engine.schedule, // engine piggybacks on scroll / resize / mutation triggers
  });

  useIsoLayoutEffect(() => {
    const el = elRef.current;
    if (!el) return;
    engine.attach(el);
    return () => engine.detach();
  }, [engine, elRef]);

  useIsoLayoutEffect(() => {
    engine.setTrackProgress(trackProgress);
  }, [engine, trackProgress]);

  useDragScroll(elRef, {
    enabled: dragToScroll,
    direction,
    // mandatory: settle on the nearest item ourselves (don't rely on the browser re-snapping)
    onRelease: snap === "mandatory" ? (el) => snapToNearest(el, direction, snapAlign) : undefined,
  });

  useImperativeHandle(
    forwardedRef,
    () => {
      const getEl = () => elRef.current;
      const defaultAxis = (): Axis => (direction === "horizontal" ? "x" : "y");

      const stepScroll = (dir: 1 | -1, o?: ScrollStepOptions) => {
        const el = getEl();
        if (!el) return;
        const axis = o?.axis ?? defaultAxis();
        const h = axis === "x";
        const cur = h ? el.scrollLeft : el.scrollTop;
        let target: number;

        if ((o?.step ?? "page") === "page") {
          target = cur + dir * (h ? el.clientWidth : el.clientHeight);
        } else {
          // "item": first target past the current position, no index state to keep
          const targets = snapItems(el).map((c) => childTarget(el, c, axis, snapAlign));
          const found =
            dir === 1
              ? targets.find((t) => t > cur + 1)
              : [...targets].reverse().find((t) => t < cur - 1);
          if (found === undefined) return;
          target = found;
        }
        el.scrollTo({ [h ? "left" : "top"]: target, behavior: resolveBehavior(o?.behavior) });
      };

      return {
        getElement: getEl,
        measure,
        scrollTo: (opts) => getEl()?.scrollTo(opts),
        scrollToTop: (behavior) =>
          getEl()?.scrollTo({ top: 0, behavior: resolveBehavior(behavior) }),
        scrollToBottom: (behavior) => {
          const el = getEl();
          if (el) el.scrollTo({ top: el.scrollHeight, behavior: resolveBehavior(behavior) });
        },
        scrollToEdge: (edge, behavior) => {
          const el = getEl();
          if (!el) return;
          const opts: ScrollToOptions = { behavior: resolveBehavior(behavior) };
          if (edge === "top") opts.top = 0;
          if (edge === "bottom") opts.top = el.scrollHeight;
          if (edge === "left") opts.left = 0;
          if (edge === "right") opts.left = el.scrollWidth;
          el.scrollTo(opts);
        },
        scrollNext: (o) => stepScroll(1, o),
        scrollPrev: (o) => stepScroll(-1, o),
        scrollToIndex: (index, o) => {
          const el = getEl();
          const child = el?.children[index] as HTMLElement | undefined;
          if (!el || !child) return;
          const axis = o?.axis ?? defaultAxis();
          el.scrollTo({
            [axis === "x" ? "left" : "top"]: childTarget(el, child, axis, snapAlign),
            behavior: resolveBehavior(o?.behavior),
          });
        },
      };
    },
    [elRef, measure, direction, snapAlign]
  );

  const handleScrollEvent = useCallback(
    (e: UIEvent<HTMLElement>) => {
      onScroll?.(e);
      handleScroll();
    },
    [onScroll, handleScroll]
  );

  const responsiveDims = useMemo(() => {
    const styles: Record<string, CSSProperties> = {};
    const inlineStyle: CSSProperties = {};

    if (isResponsiveValue(maxHeight)) {
      const { base, responsive } = resolveResponsiveValue(maxHeight);
      if (base !== undefined) inlineStyle.maxHeight = base;
      Object.entries(responsive).forEach(([bp, val]) => {
        styles[bp] = { ...(styles[bp] ?? {}), maxHeight: val as string | number };
      });
    } else if (maxHeight !== undefined) {
      inlineStyle.maxHeight = maxHeight;
    }

    if (isResponsiveValue(maxWidth)) {
      const { base, responsive } = resolveResponsiveValue(maxWidth);
      if (base !== undefined) inlineStyle.maxWidth = base;
      Object.entries(responsive).forEach(([bp, val]) => {
        styles[bp] = { ...(styles[bp] ?? {}), maxWidth: val as string | number };
      });
    } else if (maxWidth !== undefined) {
      inlineStyle.maxWidth = maxWidth;
    }

    return { inlineStyle, breakpointStyles: styles };
  }, [maxHeight, maxWidth]);

  const { attribute, style: responsiveCss } = useResponsiveStyles(
    responsiveDims.breakpointStyles
  );

  const fadeTop = shouldFade(fadeEdges, "top") && state.hasVerticalOverflow && !state.atTop;
  const fadeBottom =
    shouldFade(fadeEdges, "bottom") && state.hasVerticalOverflow && !state.atBottom;
  const fadeLeft = shouldFade(fadeEdges, "left") && state.hasHorizontalOverflow && !state.atLeft;
  const fadeRight =
    shouldFade(fadeEdges, "right") && state.hasHorizontalOverflow && !state.atRight;

  const maskImage = useMemo(() => {
    if (direction !== "both") return undefined;
    if (!fadeTop && !fadeBottom && !fadeLeft && !fadeRight) return undefined;

    const v = `linear-gradient(to bottom, ${
      fadeTop ? "transparent 0, black var(--kui-scroll-fade-size)" : "black 0"
    }, ${
      fadeBottom
        ? "black calc(100% - var(--kui-scroll-fade-size)), transparent 100%"
        : "black 100%"
    })`;
    const h = `linear-gradient(to right, ${
      fadeLeft ? "transparent 0, black var(--kui-scroll-fade-size)" : "black 0"
    }, ${
      fadeRight
        ? "black calc(100% - var(--kui-scroll-fade-size)), transparent 100%"
        : "black 100%"
    })`;
    return `${v}, ${h}`;
  }, [direction, fadeTop, fadeBottom, fadeLeft, fadeRight]);

  const recipeClasses = resolveRecipe(theme.recipes.ScrollArea, {
    direction,
    showScrollbar,
    scrollbarVariant,
  });

  const resolvedTabIndex =
    tabIndex ?? (state.hasVerticalOverflow || state.hasHorizontalOverflow ? 0 : undefined);

  const snapAxis = direction === "both" ? "both" : direction === "horizontal" ? "x" : "y";

  const fadeSizeValue = typeof fadeSize === "number" ? `${fadeSize}px` : fadeSize;

  return (
    <ScrollEngineContext.Provider value={engine}>
      <ResponsiveStyle css={responsiveCss} />
      <Tag
        ref={elRef}
        data-kui-scroll-area
        data-direction={direction}
        data-fade-top={fadeTop || undefined}
        data-fade-bottom={fadeBottom || undefined}
        data-fade-left={fadeLeft || undefined}
        data-fade-right={fadeRight || undefined}
        data-snap-align={snap !== "none" ? snapAlign : undefined}
        data-drag-scroll={dragToScroll || undefined}
        data-kui-responsive={attribute}
        onScroll={handleScrollEvent}
        tabIndex={resolvedTabIndex}
        className={cn(recipeClasses, className)}
        style={
          {
            ...responsiveDims.inlineStyle,
            overscrollBehavior,
            scrollSnapType: snap !== "none" ? `${snapAxis} ${snap}` : undefined,
            "--kui-scroll-fade-size": fadeSizeValue,
            ...(maskImage
              ? {
                  maskImage,
                  WebkitMaskImage: maskImage,
                  maskComposite: "intersect",
                  WebkitMaskComposite: "source-in",
                }
              : {}),
            ...style,
          } as CSSProperties
        }
        {...rest}
      >
        {children}
      </Tag>
    </ScrollEngineContext.Provider>
  );
});

ScrollAreaRoot.displayName = "ScrollArea";

export const ScrollArea = Object.assign(ScrollAreaRoot, {
  Scene: ScrollAreaScene,
  Sticky: ScrollAreaSticky,
});
