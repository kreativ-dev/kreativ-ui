"use client";

import * as React from "react";
import { useCarouselContext } from "./Carousel.context";
import { useCarouselSnap } from "./carouselSnap";
import { ScrollArea, type ScrollAreaHandle } from "@/components/layout";
import { createComponent, useTheme } from "@splenddev/kreativ-core";
import { resolveRecipe } from "@/theme/recipes/resolveRecipe";

const SlideIndexContext = React.createContext<number | null>(null);

const toCss = (v: number | string) => (typeof v === "number" ? `${v}px` : v);

/** Offset (px) of slide `i`'s leading edge within the scroller's scrollable content. */
function slideOffset(viewport: HTMLElement, i: number): number | null {
  const slide = viewport.querySelector<HTMLElement>(
    `[data-part="slide"][data-index="${i}"]`,
  );
  if (!slide) return null;
  return (
    slide.getBoundingClientRect().left -
    viewport.getBoundingClientRect().left +
    viewport.scrollLeft
  );
}

function slideTarget(
  viewport: HTMLElement,
  i: number,
  padded: boolean,
): number | null {
  const off = slideOffset(viewport, i);
  if (off == null) return null;
  const base = padded ? slideOffset(viewport, 0) : 0;
  if (base == null) return null;
  return Math.max(
    0,
    Math.min(off - base, viewport.scrollWidth - viewport.clientWidth),
  );
}

export type CarouselSlideProps = React.HTMLAttributes<HTMLDivElement>;
export const CarouselSlide = createComponent<
  CarouselSlideProps,
  HTMLDivElement
>({
  displayName: "Carousel.Slide",
  __kui: { role: "layout", groupSlot: "Carousel", skeleton: "preserve" },
  render: ({ className, style, ...rest }, ref) => {
    const ctx = useCarouselContext("Carousel.Slide");
    const index = React.useContext(SlideIndexContext);
    if (index === null)
      throw new Error(
        "Carousel.Slide must be rendered inside <Carousel.Viewport>",
      );
    const { slideStyle } = useCarouselSnap();
    const { theme } = useTheme();

    const { lead, trail, padded } = ctx.window;
    const EPS = 1e-6;
    const startU = padded
      ? ctx.index - lead
      : Math.max(Math.min(ctx.index, ctx.count - ctx.slidesPerView), 0);
    const endU = padded
      ? ctx.index + ctx.slidesPerView + trail
      : startU + ctx.slidesPerView;
    const active = index + 1 > startU + EPS && index < endU - EPS;

    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        aria-label={`${index + 1} of ${ctx.count}`}
        data-part="slide"
        data-index={index}
        data-active={active ? "" : undefined}
        inert={!active}
        aria-hidden={!active ? true : undefined}
        className={resolveRecipe(theme.recipes.CarouselSlide, {}, className)}
        style={{
          flexBasis:
            "calc((100% - var(--kui-carousel-gaps) * var(--kui-carousel-gap)) / var(--kui-carousel-per-view))",
          ...slideStyle,
          ...style,
        }}
        {...rest}
      />
    );
  },
});

export interface CarouselViewportProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "onScroll" | "onScrollEnd"
> {
  /** Slides must be direct children (arrays are fine). */
  children?: React.ReactNode;
}

/**
 * Renders a single horizontal <ScrollArea> as the scroll container; Carousel adds index <-> scroll sync on top.
 * The forwarded ref points at the actual scrolling element (the ScrollArea's scrollport),
 * not at ScrollArea's imperative handle.
 */
export const CarouselViewport = createComponent<
  CarouselViewportProps,
  HTMLElement
>({
  displayName: "Carousel.Viewport",
  __kui: { role: "layout", groupSlot: "Carousel", skeleton: "preserve" },
  render: ({ children, className, style, ...rest }, ref) => {
    const ctx = useCarouselContext("Carousel.Viewport");
    const { viewportStyle } = useCarouselSnap();
    const { theme } = useTheme();

    const handleRef = React.useRef<ScrollAreaHandle>(null);

    const getScroller = React.useCallback(
      () => handleRef.current?.getElement() ?? null,
      [],
    );

    React.useImperativeHandle(ref, () => getScroller() as HTMLElement, [
      getScroller,
    ]);

    let n = -1;
    const slides = React.Children.map(children, (child) => {
      if (React.isValidElement(child) && child.type === CarouselSlide) {
        n += 1;
        return (
          <SlideIndexContext.Provider value={n}>
            {child}
          </SlideIndexContext.Provider>
        );
      }
      return child;
    });
    const count = n + 1;
    const { setCount } = ctx;
    React.useLayoutEffect(() => {
      setCount(count);
      return () => setCount(0);
    }, [count, setCount]);

    const mounted = React.useRef(false);
    React.useLayoutEffect(() => {
      const vp = getScroller();

      if (!vp || count === 0 || ctx.count !== count) return;
      const left = slideTarget(vp, ctx.index, ctx.window.padded);
      if (left == null) return;
      const first = !mounted.current;
      mounted.current = true;

      if (Math.abs(vp.scrollLeft - left) < 1) return;
      handleRef.current?.scrollTo({
        left,
        behavior: first || ctx.prefersReducedMotion ? "auto" : "smooth",
      });
    }, [
      ctx.index,
      ctx.count,
      count,
      ctx.slidesPerView,
      ctx.window,
      ctx.gap,
      ctx.prefersReducedMotion,
      getScroller,
    ]);

    const settleTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(
      undefined,
    );
    React.useEffect(() => () => clearTimeout(settleTimer.current), []);
    const onScroll = React.useCallback(() => {
      clearTimeout(settleTimer.current);
      settleTimer.current = setTimeout(() => {
        const vp = getScroller();
        if (!vp) return;
        let best = 0;
        let bestDist = Infinity;
        for (let i = 0; i <= ctx.maxIndexRef.current; i++) {
          const off = slideTarget(vp, i, ctx.window.padded);
          if (off == null) continue;
          const d = Math.abs(off - vp.scrollLeft);

          if (d <= bestDist) {
            bestDist = d;
            best = i;
          }
        }
        if (best !== ctx.indexRef.current) ctx.goTo(best);
      }, 100);
    }, [ctx, getScroller]);

    const SLIDE_W =
      "(100% - var(--kui-carousel-gaps) * var(--kui-carousel-gap)) / var(--kui-carousel-per-view)";
    const { lead, trail, span, gapCount, padded } = ctx.window;
    const g = toCss(ctx.gap);

    const snapPad: React.CSSProperties | null =
      padded && lead > 0
        ? {
            scrollPaddingLeft: `calc(${lead} * (100% - ${gapCount} * ${g}) / ${span} + ${g})`,
          }
        : null;

    return (
      <ScrollArea
        ref={handleRef}
        direction="horizontal"
        overscrollBehavior="auto"
        showScrollbar="never"
        onScroll={onScroll}
        id={ctx.viewportId}
        aria-live={ctx.autoplayRunning ? "off" : "polite"}
        className={className}
        style={{
          ...viewportStyle,
          ...snapPad,
          overscrollBehaviorX: "contain",
          overscrollBehaviorY: "auto",
          ...style,
        }}
        {...rest}
      >
        <div
          data-part="track"
          className={resolveRecipe(theme.recipes.CarouselTrack, {})}
          style={
            {
              gap: g,
              "--kui-carousel-gap": g,
              "--kui-carousel-per-view": span,
              "--kui-carousel-gaps": gapCount,
              "--kui-carousel-lead": lead,
              "--kui-carousel-trail": trail,
            } as React.CSSProperties
          }
        >
          {lead > 0 && (
            <div
              aria-hidden="true"
              data-part="spacer"
              className="shrink-0 grow-0"
              style={{
                flexBasis: `calc(var(--kui-carousel-lead) * (${SLIDE_W}))`,
              }}
            />
          )}
          {slides}
          {trail > 0 && (
            <div
              aria-hidden="true"
              data-part="spacer"
              className="shrink-0 grow-0"
              style={{
                flexBasis: `calc(var(--kui-carousel-trail) * (${SLIDE_W}))`,
              }}
            />
          )}
        </div>
      </ScrollArea>
    );
  },
});
