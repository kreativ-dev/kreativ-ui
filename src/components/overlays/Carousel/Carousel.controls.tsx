import * as React from "react";
import { useCarouselContext } from "./Carousel.context";
import { createComponent, useTheme } from "@splenddev/kreativ-core";
import { renderSlot } from "@/components/internal/Slot";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { resolveRecipe } from "@/theme/recipes/resolveRecipe";
import { Button, type ButtonProps } from "@/components/action";

export interface CarouselNavButtonProps extends Omit<ButtonProps, "children"> {
  asChild?: boolean;
  children?: React.ReactNode;
  placement?: "overlay" | "inline";
  recipeProps?: Record<string, string>;
}

function makeNavButton(name: "Previous" | "Next", dir: -1 | 1) {
  const IconComponent = dir < 0 ? ChevronLeft : ChevronRight;

  return createComponent<CarouselNavButtonProps, HTMLButtonElement>({
    displayName: `Carousel.${name}`,
    __kui: { role: "action", groupSlot: "Carousel", skeleton: "rect" },
    render: (
      {
        asChild,
        children,
        onClick,
        disabled,
        className,
        recipeProps,
        variant,
        placement,
        ...rest
      },
      ref,
    ) => {
      const ctx = useCarouselContext(`Carousel.${name}`);
      const can = dir < 0 ? ctx.canPrevious : ctx.canNext;
      const isDisabled = disabled ?? !can;
      const { theme } = useTheme();

      const placementClass = resolveRecipe(
        theme.recipes.CarouselControl,
        {
          placement,
          side: dir < 0 ? "previous" : "next",
        },
        className,
        recipeProps,
      );

      const slotProps: Record<string, unknown> = {
        "aria-label": `${name} slide`,
        "aria-controls": ctx.viewportId,
        "data-edge": !can ? "" : undefined,
        className: placementClass,
        ...rest,
        disabled: isDisabled,
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
          onClick?.(e);
          if (e.defaultPrevented || isDisabled) return;
          if (dir < 0) ctx.previous();
          else ctx.next();
        },
      };

      if (asChild) {
        return renderSlot(children, slotProps, ref, `Carousel.${name} asChild`);
      }

      return (
        <Button ref={ref} variant="outline" size="sm" iconOnly {...slotProps}>
          {children ?? <IconComponent className="size-4" aria-hidden="true" />}
        </Button>
      );
    },
  });
}

export const CarouselPrevious = makeNavButton("Previous", -1);
export const CarouselNext = makeNavButton("Next", 1);

export interface CarouselIndicatorsInfo {
  index: number;
  /** Number of reachable positions (maxIndex + 1). */
  count: number;
  goTo: (index: number) => void;
}

export type CarouselIndicatorsVariant =
  | "dots"
  | "pill"
  | "bars"
  | "numbers"
  | "fraction";

export interface CarouselIndicatorsProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  children?:
    | React.ReactNode
    | ((info: CarouselIndicatorsInfo) => React.ReactNode);
  placement?: "below" | "overlay";
  recipeProps?: Record<string, string>;
  variant?: CarouselIndicatorsVariant;
}

/** Public compound part. Renders one dot per reachable position; renders nothing when there is only one. */
export const CarouselIndicators = createComponent<
  CarouselIndicatorsProps,
  HTMLDivElement
>({
  displayName: "Carousel.Indicators",
  __kui: { role: "navigation", groupSlot: "Carousel", skeleton: "rect" },
  render: (
    { children, variant, placement, recipeProps, className, ...rest },
    ref,
  ) => {
    const ctx = useCarouselContext("Carousel.Indicators");
    const { theme } = useTheme();
    const positions = ctx.maxIndex + 1;

    if (positions <= 1) return null;

    const wrapperClass = resolveRecipe(
      theme.recipes.CarouselIndicators,
      { variant, placement },
      className,
      recipeProps,
    );

    if (
      variant === "fraction" &&
      typeof children !== "function" &&
      children == null
    ) {
      return (
        <div ref={ref} className={wrapperClass} {...rest}>
          <span aria-hidden="true" data-part="indicator-fraction">
            {ctx.index + 1} / {positions}
          </span>
        </div>
      );
    }

    const info = { index: ctx.index, count: positions, goTo: ctx.goTo };
    const body =
      typeof children === "function"
        ? children(info)
        : (children ??
          Array.from({ length: positions }, (_, i) => (
            <button
              key={i}
              type="button"
              className={resolveRecipe(theme.recipes.CarouselIndicator, {
                variant,
              })}
              data-part="indicator"
              data-state={i === ctx.index ? "active" : "inactive"}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === ctx.index ? "true" : undefined}
              aria-controls={ctx.viewportId}
              onClick={() => ctx.goTo(i)}
            >
              {variant === "numbers" ? i + 1 : null}
            </button>
          )));

    return (
      <div
        ref={ref}
        role="group"
        aria-label="Choose slide"
        className={wrapperClass}
        {...rest}
      >
        {body}
      </div>
    );
  },
});

export interface CarouselPlayPauseProps extends Omit<ButtonProps, "children"> {
  asChild?: boolean;
  children?: React.ReactNode;
  placement?: "overlay" | "inline";
  recipeProps?: Record<string, string>;
}

/**
 * User control for auto-advance (WCAG 2.2.2 Pause, Stop, Hide). Renders nothing when there is
 * nothing to pause: `autoplay` is off, or the user prefers reduced motion.
 */
export const CarouselPlayPause = createComponent<
  CarouselPlayPauseProps,
  HTMLButtonElement
>({
  displayName: "Carousel.PlayPause",
  __kui: { role: "action", groupSlot: "Carousel", skeleton: "rect" },
  render: (
    { asChild, children, onClick, className, variant, recipeProps, ...rest },
    ref,
  ) => {
    const ctx = useCarouselContext("Carousel.PlayPause");
    const { theme } = useTheme();

    if (!ctx.autoplay || ctx.prefersReducedMotion) return null;

    const IconComponent = ctx.playing ? Pause : Play;

    const placementClass = resolveRecipe(
      theme.recipes.CarouselControl,
      {
        variant,
        side: "playPause",
        ...recipeProps,
      },
      className,
    );

    const slotProps: Record<string, unknown> = {
      "aria-label": ctx.playing ? "Pause autoplay" : "Start autoplay",
      "aria-controls": ctx.viewportId,
      "data-state": ctx.playing ? "playing" : "paused",
      className: placementClass,
      ...rest,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (ctx.playing) {
          ctx.setPlaying(false);
        } else {
          ctx.resumeOverride();
          ctx.setPlaying(true);
        }
      },
    };

    if (asChild) {
      return renderSlot(children, slotProps, ref, "Carousel.PlayPause asChild");
    }

    return (
      <Button ref={ref} size="sm" iconOnly variant="outline" {...slotProps}>
        {children ?? <IconComponent className="size-4" aria-hidden="true" />}
      </Button>
    );
  },
});
