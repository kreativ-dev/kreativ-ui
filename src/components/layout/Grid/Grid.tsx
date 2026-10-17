"use client";

import { createComponent, useTheme } from "@splenddev/kreativ-core";
import type { Size } from "@splenddev/kreativ-core/types";

import { useMergedResponsiveStyles, useResponsiveStyles } from "@/hooks";
import { ResponsiveStyle } from "@/components/internal/ResponsiveStyle";
import { resolveRecipe } from "@/theme/recipes/resolveRecipe";
import { cn } from "@/utils/cn";
import { resolveSpace } from "@/utils/resolveSpace";
import { isDev } from "@/utils/env";
import type { GridProps } from "./Grid.types";
import type { SpaceValue } from "@/types";
import { GridItem } from "./Grid.Item";

const RAW_LENGTH = /px|rem|em|%|vw|vh|ch|var\(/i;

function resolveTrackSize(value: Size | string) {
  if (typeof value === "number") return `${value}px`;
  if (RAW_LENGTH.test(value)) return value;
  return resolveSpace(value as SpaceValue);
}

const GridRoot = createComponent<GridProps, HTMLDivElement>({
  displayName: "Grid",
  __kui: {
    role: "layout",
    skeleton: "preserve",
    video: {
      id: "grid",
      safe: true,
      acceptsChildren: true,
      interactionStates: [],
    },
  },
  render: (
    {
      columns,
      minChildWidth,
      templateColumns,
      templateRows,
      templateAreas,
      autoFlow,
      gap,
      gapX,
      gapY,
      align,
      justifyItems,
      inline = false,
      as: Tag = "div",
      className,
      style,
      unstyled,
      children,
      ...rest
    },
    ref,
  ) => {
    const { theme } = useTheme();

    if (
      isDev() &&
      [columns, minChildWidth, templateColumns].filter((v) => v != null)
        .length > 1
    ) {
      console.warn(
        "[kreativ-ui/Grid]: columns, minChildWidth, and templateColumns are mutually exclusive. templateColumns wins, then columns, then minChildWidth.",
      );
    }

    const responsiveStyles = useMergedResponsiveStyles([
      [
        columns,
        (v) => ({ gridTemplateColumns: `repeat(${v}, minmax(0, 1fr))` }),
      ],
      [
        minChildWidth,
        (v) => ({
          gridTemplateColumns: `repeat(auto-fit, minmax(${resolveTrackSize(v)}, 1fr))`,
        }),
      ],
      [templateColumns, (v) => ({ gridTemplateColumns: v })],
      [templateRows, (v) => ({ gridTemplateRows: v })],
      [autoFlow, (v) => ({ gridAutoFlow: v })],
      [gap, (v) => ({ gap: resolveSpace(v) })],
      [gapX, (v) => ({ columnGap: resolveSpace(v) })],
      [gapY, (v) => ({ rowGap: resolveSpace(v) })],
      [align, (v) => ({ alignItems: v })],
      [justifyItems, (v) => ({ justifyItems: v })],
    ]);

    const { attribute, style: responsiveCss } =
      useResponsiveStyles(responsiveStyles);

    const recipeClasses = resolveRecipe(theme.recipes.Grid, { inline });

    return (
      <>
        <ResponsiveStyle css={responsiveCss} />
        <Tag
          ref={ref}
          data-kui-responsive={attribute}
          className={cn(!unstyled && recipeClasses, className)}
          style={{ ...style, gridTemplateAreas: templateAreas }}
          {...rest}
        >
          {children}
        </Tag>
      </>
    );
  },
});

export const Grid = Object.assign(GridRoot, { Item: GridItem });
