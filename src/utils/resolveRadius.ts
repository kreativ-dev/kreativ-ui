import type { Size } from "@splenddev/kreativ-core/types";

const RAW_LENGTH = /px|rem|em|%|vw|vh|ch|var\(/i;

/**
 * Size token → `var(--kui-radii-<token>)`.
 * `none` is `0`. `full` is a pill. A number is pixels.
 * A raw length (`"8px"`, `"0.5rem"`, `"50%"`) is returned as-is.
 */
export function resolveRadius(value: Size | number | string): string {
  if (typeof value === "number") return `${value}px`;
  if (value === "none" || value === "0") return "0";
  if (value === "full") return "9999px";
  if (RAW_LENGTH.test(value)) return value;
  return `var(--kui-radii-${value})`;
}
