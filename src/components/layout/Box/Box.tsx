"use client";

import { createComponent, useTheme } from "@splenddev/kreativ-core";

import { ResponsiveStyle } from "@/components/internal/ResponsiveStyle";
import { resolveRecipe } from "@/theme/recipes/resolveRecipe";
import { cn } from "@/utils/cn";
import { resolveSpace } from "@/utils/resolveSpace";
import { resolveColor } from "@/utils/resolveColor";
import { resolveRadius } from "@/utils/resolveRadius";
import type { BoxProps } from "./Box.types";
import type { SpaceValue } from "@/types";
import { useMergedResponsiveStyles, useResponsiveStyles } from "@/hooks";

function resolveSize(value: SpaceValue | "auto" | "full" | "fit") {
  if (value === "full") return "100%";
  if (value === "fit") return "fit-content";
  if (value === "auto") return "auto";
  return resolveSpace(value);
}

export const Box = createComponent<BoxProps, HTMLDivElement>({
  displayName: "Box",
  __kui: {
    role: "layout",
    skeleton: "preserve",
    video: {
      id: "box",
      safe: true,
      acceptsChildren: true,
      interactionStates: [],
    },
  },
  render: (
    {
      as: Tag = "div",
      p,
      px,
      py,
      m,
      mx,
      my,
      bg,
      color,
      border = false,
      rounded,
      w,
      h,
      className,
      style,
      unstyled,
      children,
      ...rest
    },
    ref,
  ) => {
    const { theme } = useTheme();
    const borderColor = typeof border === "boolean" ? undefined : border;

    const responsiveStyles = useMergedResponsiveStyles([
      [p, (v) => ({ padding: resolveSpace(v) })],
      [px, (v) => ({ paddingInline: resolveSpace(v) })],
      [py, (v) => ({ paddingBlock: resolveSpace(v) })],
      [m, (v) => ({ margin: v === "auto" ? "auto" : resolveSpace(v) })],
      [mx, (v) => ({ marginInline: v === "auto" ? "auto" : resolveSpace(v) })],
      [my, (v) => ({ marginBlock: v === "auto" ? "auto" : resolveSpace(v) })],
      [bg, (v) => ({ background: resolveColor(v) })],
      [color, (v) => ({ color: resolveColor(v) })],
      [borderColor, (v) => ({ borderColor: resolveColor(v) })],
      [rounded, (v) => ({ borderRadius: resolveRadius(v) })],
      [w, (v) => ({ width: resolveSize(v) })],
      [h, (v) => ({ height: resolveSize(v) })],
    ]);

    const { attribute, style: responsiveCss } =
      useResponsiveStyles(responsiveStyles);

    const recipeClasses = resolveRecipe(theme.recipes.Box, {
      border: Boolean(border),
    });

    return (
      <>
        <ResponsiveStyle css={responsiveCss} />
        <Tag
          ref={ref}
          data-kui-responsive={attribute}
          className={cn(!unstyled && recipeClasses, className)}
          style={style}
          {...rest}
        >
          {children}
        </Tag>
      </>
    );
  },
});
