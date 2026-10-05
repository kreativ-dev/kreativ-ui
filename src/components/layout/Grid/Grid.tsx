"use client";

import { forwardRef } from "react";
import { useMergedResponsiveStyles } from "@/hooks/useMergedResponsiveStyles";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { ResponsiveStyle } from "@/components/internal/ResponsiveStyle";
import type { GridProps } from "./Grid.types";
import { cn } from "@/utils/cn";

function spaceVar(value: string) {
  return `var(--kui-spacing-${value})`;
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      columns,
      templateColumns,
      templateRows,
      templateAreas,
      gap,
      columnGap,
      rowGap,
      align,
      justify,
      as: Tag = "div",
      className,
      style,
      unstyled,
      children,
      ...rest
    },
    ref,
  ) => {
    const responsiveStyles = useMergedResponsiveStyles([
      [
        templateColumns ?? columns,
        (v) =>
          typeof v === "number"
            ? { gridTemplateColumns: `repeat(${v}, minmax(0, 1fr))` }
            : { gridTemplateColumns: v as string },
      ],
      [templateRows, (v) => ({ gridTemplateRows: v })],
      [gap, (v) => ({ gap: spaceVar(v as string) })],
      [columnGap, (v) => ({ columnGap: spaceVar(v as string) })],
      [rowGap, (v) => ({ rowGap: spaceVar(v as string) })],
      [align, (v) => ({ alignItems: v })],
      [justify, (v) => ({ justifyContent: v })],
    ]);

    const { attribute, style: responsiveCss } =
      useResponsiveStyles(responsiveStyles);

    return (
      <>
        <ResponsiveStyle css={responsiveCss} />
        <Tag
          ref={ref}
          data-kui-responsive={attribute}
          className={cn(!unstyled && "grid", className)}
          style={{ ...style, gridTemplateAreas: templateAreas }}
          {...rest}
        >
          {children}
        </Tag>
      </>
    );
  },
);

Grid.displayName = "Grid";
