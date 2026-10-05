
/**
 * A set of CSS properties that define a typography style.
 * All properties are optional – you can compose styles incrementally.
 *
 * @example
 * ```ts
 * const headingStyle: TextStyle = {
 *   fontFamily: "Inter, sans-serif",
 *   fontSize: "2rem",
 *   fontWeight: 700,
 *   lineHeight: "1.2",
 *   letterSpacing: "-0.02em",
 * };
 * ```
 */
export interface TypographyStyle {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string | number;
  lineHeight?: string;
  letterSpacing?: string;
}

/**
 * A collection of named text styles.
 * Keys are style names (e.g., "heading", "body", "caption", "label").
 *
 * @example
 * ```ts
 * const typography: Typography = {
 *   heading: { fontSize: "2rem", fontWeight: 700 },
 *   body: { fontSize: "1rem", lineHeight: "1.5" },
 * };
 * ```
 */
export type Typography = Record<string, TypographyStyle>;

