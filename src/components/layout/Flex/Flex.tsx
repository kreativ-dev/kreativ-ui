"use client";

import { forwardRef } from "react";
import { useMergedResponsiveStyles } from "@/hooks/useMergedResponsiveStyles";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import type { FlexProps } from "./Flex.types";
import { cn } from "@/utils/cn";
import { ResponsiveStyle } from "@/components/internal/ResponsiveStyle";

function spaceVar(value: string) {
  return `var(--kui-spacing-${value})`;
}

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      direction = "row",
      wrap = "nowrap",
      align,
      justify,
      gap,
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
      [direction, (v) => ({ flexDirection: v })],
      [wrap, (v) => ({ flexWrap: v })],
      [align, (v) => ({ alignItems: v })],
      [justify, (v) => ({ justifyContent: v })],
      [gap, (v) => ({ gap: spaceVar(v as string) })],
    ]);

    const { attribute, style: responsiveCss } =
      useResponsiveStyles(responsiveStyles);

    return (
      <>
        <ResponsiveStyle css={responsiveCss} />
        <Tag
          ref={ref}
          data-kui-responsive={attribute}
          className={cn(!unstyled && "flex", className)}
          style={style}
          {...rest}
        >
          {children}
        </Tag>
      </>
    );
  },
);

Flex.displayName = "Flex";
