"use client";

import { type CSSProperties, useId, useMemo } from "react";

import type { ResponsiveStyles } from "@/types";
import { useTheme } from "./useTheme";

const cssPropertyToKebab = (property: string) =>
  property.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

const cssValue = (value: CSSProperties[keyof CSSProperties]) => {
  if (typeof value === "number") {
    return String(value);
  }

  return value;
};

export function useResponsiveStyles(responsiveStyles?: ResponsiveStyles) {
  const { theme } = useTheme();
  const id = useId();

  return useMemo(() => {
    if (!responsiveStyles || Object.keys(responsiveStyles).length === 0) {
      return {
        attribute: undefined,
        style: undefined,
      };
    }

    const breakpoints = theme.tokens.breakpoints;

    if (!breakpoints) {
      return {
        attribute: undefined,
        style: undefined,
      };
    }

    const attribute = id.replace(/:/g, "");

    const selector = `[data-kui-responsive="${attribute}"]`;

    const rules: string[] = [];

    for (const [breakpoint, styles] of Object.entries(responsiveStyles)) {
      const declarations = Object.entries(styles)
        .filter(([, value]) => value !== undefined)
        .map(
          ([property, value]) =>
            `${cssPropertyToKebab(property)}:${cssValue(value)};`,
        )
        .join("");

      if (!declarations) continue;

      if (breakpoint === "base") {
        rules.push(`
          ${selector} {
            ${declarations}
          }
        `);

        continue;
      }

      const breakpointToken = breakpoints[breakpoint];

      if (!breakpointToken) continue;

      rules.push(`
        @media (min-width: ${breakpointToken.value}) {
          ${selector} {
            ${declarations}
          }
        }
      `);
    }

    if (rules.length === 0) {
      return {
        attribute: undefined,
        style: undefined,
      };
    }

    return {
      attribute,
      style: rules.join("\n"),
    };
  }, [responsiveStyles, theme.tokens.breakpoints, id]);
}
