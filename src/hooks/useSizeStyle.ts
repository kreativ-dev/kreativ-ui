"use client";

import { useMemo, type CSSProperties } from "react";

import { useTheme } from "./useTheme";
import type {
  CSSPropertiesWithVars,
  ResponsiveStyles,
  ResponsiveValue,
} from "@/types";
import { isResponsiveValue } from "@/utils/responsive";

export interface UseSizeStyleOptions {
  includeHeight?: boolean;
  includeWidth?: boolean;
  widthFromHeight?: boolean;
  sizeOffset?: string;
  fontSizeOffset?: string;
}

export interface ResolvedSize {
  /**
   * Inline styles for non-responsive sizing.
   *
   * For responsive values this is intentionally empty so that
   * breakpoint styles can override each other through CSS.
   */
  style: CSSProperties;

  /**
   * Styles generated for responsive sizing.
   */
  responsiveStyles?: ResponsiveStyles;

  iconSize?: CSSProperties["width"];
  fontSize?: CSSProperties["fontSize"];
  gap?: CSSProperties["gap"];
}

const applySizeOffset = (
  value: string | undefined,
  offset: string | undefined,
) => {
  if (!value || !offset) return value;

  return `calc(${value} - ${offset})`;
};

export function useSizeStyle(
  size: ResponsiveValue<string>,
  iconOnly = false,
  componentName = "component",
  options: UseSizeStyleOptions = {},
): ResolvedSize {
  const {
    widthFromHeight = false,
    includeHeight = true,
    includeWidth = false,
    sizeOffset,
    fontSizeOffset,
  } = options;

  const { theme, fallbackSize } = useTheme();

  return useMemo(() => {
    const scale = theme.sizes;

    const resolveToken = (sizeName: string) =>
      scale[sizeName] ?? scale[fallbackSize] ?? Object.values(scale)[0] ?? {};

    const buildStyle = (sizeName: string): CSSPropertiesWithVars => {
      const token = resolveToken(sizeName);
      const style: CSSPropertiesWithVars = {};

      if (includeHeight && token.height) {
        style.height = applySizeOffset(token.height, sizeOffset);
      }

      if (includeWidth) {
        if (iconOnly && token.width) {
          style.width = applySizeOffset(token.width, sizeOffset);
        } else if (
          (iconOnly || widthFromHeight) &&
          includeHeight &&
          token.height
        ) {
          style.width = applySizeOffset(token.height, sizeOffset);
        }
      }

      if (!iconOnly && token.paddingX) {
        style.paddingLeft = token.paddingX;
        style.paddingRight = token.paddingX;
      }

      if (token.paddingY) {
        style.paddingTop = token.paddingY;
        style.paddingBottom = token.paddingY;
      }

      if (token.fontSize) {
        style.fontSize = applySizeOffset(token.fontSize, fontSizeOffset);
      }

      if (token.gap) {
        style.gap = iconOnly ? 0 : token.gap;
      }

      if (token.radius) {
        const varName = `--kui-${componentName}-radius` as `--kui-${string}`;

        style[varName] = token.radius;
      }

      return style;
    };

    if (!isResponsiveValue(size)) {
      const style = buildStyle(size);
      const token = resolveToken(size);

      return {
        style,
        iconSize: token.iconSize,
        fontSize: applySizeOffset(token.fontSize, fontSizeOffset),
        gap: token.gap,
      };
    }

    const { base, ...breakpoints } = size;

    const baseSize = base ?? fallbackSize;

    const responsiveStyles: ResponsiveStyles = {
      base: buildStyle(baseSize),
    };

    for (const [breakpoint, breakpointSize] of Object.entries(breakpoints)) {
      if (breakpointSize === undefined) continue;

      responsiveStyles[breakpoint] = buildStyle(breakpointSize);
    }

    const token = resolveToken(baseSize);

    return {
      style: {},
      responsiveStyles,
      iconSize: token.iconSize,
      fontSize: applySizeOffset(token.fontSize, fontSizeOffset),
      gap: token.gap,
    };
  }, [
    theme.sizes,
    size,
    fallbackSize,
    iconOnly,
    includeHeight,
    includeWidth,
    widthFromHeight,
    componentName,
    sizeOffset,
    fontSizeOffset,
  ]);
}
