/**
 * A set of CSS properties that define the dimensions and spacing
 * for a component at a specific size.
 *
 * Used to build size‑variant scales for components (e.g., "sm", "md", "lg").
 *
 * @example
 * ```ts
 * const buttonSize: SizeToken = {
 *   height: "40px",
 *   paddingX: "16px",
 *   fontSize: "1rem",
 *   iconSize: "20px",
 *   radius: "8px",
 * };
 * ```
 */

export interface SizeToken {
  height?: string;
  width?: string;
  paddingX?: string;
  paddingY?: string;
  fontSize?: string;
  gap?: string;
  iconSize?: string;
  radius?: string;

  separatorSize?: string;
}

/**
 * A collection of named size tokens.
 * Keys are size names (e.g., "sm", "md", "lg", "xl").
 *
 * @example
 * ```ts
 * const sizes: SizeScale = {
 *   sm: { height: "32px", paddingX: "12px", fontSize: "0.875rem" },
 *   md: { height: "40px", paddingX: "16px", fontSize: "1rem" },
 *   lg: { height: "48px", paddingX: "24px", fontSize: "1.125rem" },
 * };
 * ```
 */
export type SizeScale = Record<string, SizeToken>;
