"use client";

import { useMemo } from "react";
import type { CSSProperties } from "react";
import type { ResponsiveValue, ResponsiveStyles } from "@/types";
import { resolveResponsiveValue } from "@/utils/responsive";

/**
 * One entry: a responsive prop value plus a mapper from that value to a
 * partial CSSProperties object.
 *
 * Using `any` for the value type because different entries may have different
 * value types, and we only need to call the mapper with the resolved value.
 */
export type ResponsivePropEntry = [
  value: ResponsiveValue<any> | undefined,
  toCss: (value: any) => Partial<CSSProperties>,
];

function mergeResponsiveProps(
  entries: ResponsivePropEntry[],
): ResponsiveStyles {
  const result: ResponsiveStyles = {};

  for (const [value, toCss] of entries) {
    if (value === undefined) continue;

    const { base, responsive } = resolveResponsiveValue(value);

    if (base !== undefined) {
      result.base = { ...result.base, ...toCss(base) };
    }

    for (const [bp, v] of Object.entries(responsive)) {
      result[bp] = { ...result[bp], ...toCss(v) };
    }
  }

  return result;
}

/**
 * Merges multiple ResponsiveValue<T> props into one ResponsiveStyles map,
 * memoized on the entries' values.
 *
 * @example
 * const responsiveStyles = useMergedResponsiveStyles([
 *   [gap, (v) => ({ gap: spaceVar(v) })],
 *   [align, (v) => ({ alignItems: v })],
 * ]);
 */
export function useMergedResponsiveStyles(
  entries: ResponsivePropEntry[],
): ResponsiveStyles {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(
    () => mergeResponsiveProps(entries),
    entries.map(([value]) => value),
  );
}
