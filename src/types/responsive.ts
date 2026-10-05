import type { CSSProperties } from "react";
import { BaseBreakpoint } from ".";

/**
 * Represents a value that adapts responsively to different screen sizes.
 * It can be provided as:
 * - A single value of type `T` (applies to all breakpoints), or
 * - An object mapping breakpoint names to values, where each key is optional.
 *
 * The object supports:
 * - `base`: the default value applied when no specific breakpoint matches.
 * - Any breakpoint defined by `BaseBreakpoint` (e.g., `"sm"`, `"md"`, `"lg"`, `"xl"`, `"2xl"`).
 *
 * When an object is provided, the component will resolve the most appropriate value
 * based on the current viewport width, falling back to `base` or the next larger breakpoint.
 *
 * @template T - The type of the value (e.g., `string`, `number`, `CSSProperties`).
 *
 * @example
 * // Single value for all screens
 * const padding: ResponsiveValue<number> = 16;
 *
 * @example
 * // Responsive object with breakpoint-specific values
 * const padding: ResponsiveValue<number> = {
 *   base: 8,
 *   sm: 12,
 *   md: 16,
 *   lg: 24,
 * };
 */
export type ResponsiveValue<T, B extends string = BaseBreakpoint> =
  | T
  | Partial<Record<"base" | B, T>>;

export type ResponsiveStyles = Record<string, CSSProperties>;
