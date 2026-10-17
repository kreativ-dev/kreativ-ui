"use client";

import { useMemo, type CSSProperties } from "react";

import type {
  CSSPropertiesWithVars,
  DesignTokens,
  ResponsiveStyles,
  ResponsiveValue,
  Typography,
} from "@/types";
import { isResponsiveValue } from "@/utils/responsive";
import { useTheme } from "@splenddev/kreativ-core";
import { resolveTokenReference } from "@/utils/resolveTokenReference";

/**
 * Options for {@link useSizeStyle}.
 */
export interface UseSizeStyleOptions {
  /**
   * Include `height` in the resolved style.
   * @default true
   */
  includeHeight?: boolean;

  /**
   * Include `width` in the resolved style.
   *
   * When enabled, width is derived from the token's own `width` if
   * `iconOnly` is set, otherwise from the token's `height`.
   * @default false
   */
  includeWidth?: boolean;

  /**
   * Force `width` to mirror `height`, even when not in icon-only mode.
   * @default false
   */
  widthFromHeight?: boolean;

  /**
   * CSS length subtracted from the resolved `height` / `width`
   * (e.g. `"2px"`). Applied via `calc(...)`.
   */
  sizeOffset?: string;

  /**
   * CSS length subtracted from the resolved `fontSize`.
   * Applied via `calc(...)`.
   */
  fontSizeOffset?: string;
}

/**
 * Result of {@link useSizeStyle}.
 */
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

  /** Resolved icon size, if defined on the token. */
  iconSize?: CSSProperties["width"];

  /** Resolved font size, after applying `fontSizeOffset`. */
  fontSize?: CSSProperties["fontSize"];

  /** Resolved gap between child elements. */
  gap?: CSSProperties["gap"];
}

const applySizeOffset = (
  value: string | undefined,
  offset: string | undefined,
) => {
  if (!value || !offset) return value;

  return `calc(${value} - ${offset})`;
};

/**
 * Builds size-related inline styles from a theme size token.
 *
 * Accepts either a plain size name (e.g. `"md"`) or a responsive value
 * (e.g. `{ base: "sm", lg: "md" }`). All token values are expanded through
 * `resolveTokenReference`, so aliases like `"{spacing.4}"` become concrete
 * values.
 *
 * Behavior notes:
 * - Padding is skipped when `iconOnly` is `true`.
 * - `gap` is forced to `0` when `iconOnly` is `true`.
 * - The token's `radius` is exposed as the CSS variable
 *   `--kui-<componentName>-radius` so consumers can reuse it in CSS.
 * - For responsive inputs, breakpoint styles are returned in
 *   `responsiveStyles` and `style` stays empty.
 *
 * @param size - Size name or responsive size object to resolve.
 * @param iconOnly - When `true`, applies icon-specific sizing (square,
 *   no horizontal padding, no gap).
 * @param componentName - Namespace used for generated CSS variables.
 * @param options - See {@link UseSizeStyleOptions}.
 * @returns A {@link ResolvedSize} containing inline and/or responsive styles.
 *
 * @example
 * ```ts
 * const { style } = useSizeStyle("md");
 * // <button style={style} />
 * ```
 *
 * @example
 * ```ts
 * const { responsiveStyles } = useSizeStyle(
 *   { base: "sm", lg: "md" },
 *   false,
 *   "button",
 *   { includeWidth: true, sizeOffset: "2px" },
 * );
 * ```
 */
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
    const tokens = theme.tokens as unknown as DesignTokens;
    const typography = theme.typography;

    const resolveValue = (value: unknown) =>
      String(resolveTokenReference(value, tokens));

    const resolveFont = (value: unknown) =>
      String(resolveFontSize(value, typography, tokens));

    const resolveToken = (sizeName: string) =>
      scale[sizeName] ?? scale[fallbackSize] ?? Object.values(scale)[0] ?? {};

    const buildStyle = (sizeName: string): CSSPropertiesWithVars => {
      const token = resolveToken(sizeName);
      const style: CSSPropertiesWithVars = {};

      console.log("[buildStyle]", sizeName, {
        tokenFontSize: token.fontSize,
        typographyKeys: typography && Object.keys(typography),
        typographyPreset: typography?.["sizeMd"],
        tokensFontSizes: tokens?.fontSizes,
      });

      const height = resolveValue(token.height);
      const width = resolveValue(token.width);
      const paddingX = resolveValue(token.paddingX);
      const paddingY = resolveValue(token.paddingY);
      const fontSize = resolveFont(token.fontSize);
      const gap = resolveValue(token.gap);
      const radius = resolveValue(token.radius);

      if (includeHeight && height) {
        style.height = applySizeOffset(height, sizeOffset);
      }

      if (includeWidth) {
        if (iconOnly && width) {
          style.width = applySizeOffset(width, sizeOffset);
        } else if ((iconOnly || widthFromHeight) && includeHeight && height) {
          style.width = applySizeOffset(height, sizeOffset);
        }
      }

      if (!iconOnly && paddingX) {
        style.paddingLeft = paddingX;
        style.paddingRight = paddingX;
      }

      if (paddingY) {
        style.paddingTop = paddingY;
        style.paddingBottom = paddingY;
      }

      if (fontSize) {
        style.fontSize = applySizeOffset(fontSize, fontSizeOffset);
      }

      if (gap) {
        style.gap = iconOnly ? 0 : gap;
      }

      if (radius) {
        const varName = `--kui-${componentName}-radius` as `--kui-${string}`;
        style[varName] = radius;
      }

      return style;
    };

    if (!isResponsiveValue(size)) {
      const style = buildStyle(size);
      const token = resolveToken(size);

      return {
        style,
        iconSize: resolveValue(token.iconSize),
        fontSize: applySizeOffset(resolveFont(token.fontSize), fontSizeOffset),
        gap: resolveValue(token.gap),
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
      iconSize: resolveValue(token.iconSize),
      fontSize: applySizeOffset(resolveFont(token.fontSize), fontSizeOffset),
      gap: resolveValue(token.gap),
    };
  }, [
    theme,
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

/**
 * Resolves a SizeToken.fontSize value, which is a two-level reference:
 *
 *   SizeToken.fontSize -> "{typography.sizeXs}"  (typography preset name)
 *   TypographyStyle.fontSize -> "{fontSizes.xs}" (primitive token)
 *
 * resolveTokenReference alone can't do this in one call: it terminates
 * at a `{value}`-wrapped leaf or a raw primitive, and a typography
 * preset is neither (it's a plain object with fontFamily/fontSize/
 * fontWeight/lineHeight fields). So the first hop — typography preset
 * name -> preset object -> its own fontSize field — is done manually
 * here, and only the second hop (preset.fontSize -> primitive) goes
 * through resolveTokenReference, against `tokens` as usual.
 *
 * If `value` isn't a "{typography.X}" reference (unexpected, but
 * possible via a misconfigured theme), it falls back to resolving
 * directly against `tokens`, matching the old single-step behavior.
 */
function resolveFontSize(
  value: unknown,
  typography: Typography,
  tokens: DesignTokens,
): string | number {
  console.log("[resolveFontSize] input:", {
    value,
    typographyDefined: !!typography,
  });

  if (typeof value !== "string") {
    console.log("[resolveFontSize] not a string, fallback");
    return resolveTokenReference(value, tokens);
  }

  const match = value.match(/^\{typography\.(.+)\}$/);
  console.log("[resolveFontSize] match:", match);

  if (!match || match[1] === undefined) {
    console.log("[resolveFontSize] no match, fallback resolving:", value);
    return resolveTokenReference(value, tokens);
  }

  const preset = (typography as Record<string, { fontSize?: unknown }>)[
    match[1]
  ];
  console.log("[resolveFontSize] preset:", preset);

  const result = resolveTokenReference(preset?.fontSize, tokens);
  console.log("[resolveFontSize] result:", result);

  return result;
}
