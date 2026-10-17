"use client";

import { createComponent } from "@splenddev/kreativ-core";

import { useMergedResponsiveStyles, useResponsiveStyles } from "@/hooks";
import { ResponsiveStyle } from "@/components/internal/ResponsiveStyle";
import { cn } from "@/utils/cn";
import type { GridItemProps } from "./Grid.types";

function spanValue(value: number | "full") {
  return value === "full" ? "1 / -1" : `span ${value}`;
}

export const GridItem = createComponent<GridItemProps, HTMLDivElement>({
  displayName: "Grid.Item",
  __kui: {
    role: "layout",
    skeleton: "preserve",
    groupSlot: "Grid",
    video: {
      id: "grid-item",
      safe: true,
      acceptsChildren: true,
      interactionStates: [],
    },
  },
  render: (
    {
      span,
      rowSpan,
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
      [span, (v) => ({ gridColumn: spanValue(v) })],
      [rowSpan, (v) => ({ gridRow: spanValue(v) })],
    ]);

    const { attribute, style: responsiveCss } =
      useResponsiveStyles(responsiveStyles);

    return (
      <>
        <ResponsiveStyle css={responsiveCss} />
        <Tag
          ref={ref}
          data-kui-responsive={attribute}
          className={cn(!unstyled && className)}
          style={style}
          {...rest}
        >
          {children}
        </Tag>
      </>
    );
  },
});
