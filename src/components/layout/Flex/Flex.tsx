"use client";

import { createComponent, useTheme } from "@splenddev/kreativ-core";

import { useMergedResponsiveStyles, useResponsiveStyles } from "@/hooks";
import type { FlexProps } from "./Flex.types";
import { cn } from "@/utils/cn";
import { ResponsiveStyle } from "@/components/internal/ResponsiveStyle";
import { resolveSpace } from "@/utils/resolveSpace";
import { resolveRecipe } from "@/theme/recipes/resolveRecipe";

export const Flex = createComponent<FlexProps, HTMLDivElement>({
  displayName: "Flex",
  __kui: {
    role: "layout",
    skeleton: "preserve",
    video: {
      id: "flex",
      safe: true,
      acceptsChildren: true,
      interactionStates: [],
    },
  },
  render: (
    {
      inline = false,
      direction = "row",
      wrap = "nowrap",
      align,
      justify,
      gap,
      gapX,
      gapY,
      grow,
      shrink,
      basis,
      fullWidth,
      fullHeight,
      as: Tag = "div",
      className,
      style,
      unstyled,
      children,
      ...rest
    },
    ref,
  ) => {
    const {theme}=useTheme()
    const responsiveStyles = useMergedResponsiveStyles([
      [direction, (v) => ({ flexDirection: v })],
      [wrap, (v) => ({ flexWrap: v })],
      [align, (v) => ({ alignItems: v })],
      [justify, (v) => ({ justifyContent: v })],

      [gap, (v) => ({ gap: resolveSpace(v) })],
      [gapX, (v) => ({ columnGap: resolveSpace(v) })],
      [gapY, (v) => ({ rowGap: resolveSpace(v) })],

      [grow, (v) => ({ flexGrow: v === true ? 1 : v === false ? 0 : v })],
      [shrink, (v) => ({ flexShrink: v === true ? 1 : v === false ? 0 : v })],
      [basis, (v) => ({ flexBasis: v })],
    ]);

    const { attribute, style: responsiveCss } =
      useResponsiveStyles(responsiveStyles);

      const recipeClasses = resolveRecipe(theme.recipes.Flex, {
        inline,
        fullWidth: Boolean(fullWidth),
        fullHeight: Boolean(fullHeight),
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
