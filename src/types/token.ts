/**
 * The primitive value type for any design token.
 * Can be a CSS value as a string (e.g., "16px", "#fff", "1.5rem")
 * or a unitless number (e.g., 0, 1.5, 4).
 *
 * @example
 * ```ts
 * const fontSize: TokenValue = "1.25rem";
 * const opacity: TokenValue = 0.8;
 * ```
 */
export type TokenValue = string | number;

/**
 * A wrapper around a single design value.
 * @template T - The specific TokenValue type (defaults to string | number).
 *
 * Every leaf in the token tree is a TokenDefinition.
 *
 * @example
 * ```ts
 * const blue500: TokenDefinition<string> = { value: "#3b82f6" };
 * const spacing4: TokenDefinition<number> = { value: 4 };
 * ```
 */
export interface TokenDefinition<T extends TokenValue = TokenValue> {
  value: T;
}

/**
 * A recursive structure that allows nested token collections.
 * Keys are arbitrary strings and values are either a leaf (TokenDefinition)
 * or another nested group.
 *
 * This enables hierarchical paths like:
 * - colors.blue.500
 * - spacing.4
 * - radii.md
 *
 * @example
 * ```ts
 * const tokens: TokenGroup = {
 *   colors: {
 *     blue: {
 *       50: { value: "#eff6ff" },
 *       500: { value: "#3b82f6" },
 *     },
 *     red: { value: "#ef4444" }, // direct leaf
 *   },
 *   spacing: {
 *     sm: { value: "8px" },
 *     md: { value: "16px" },
 *   },
 * };
 * ```
 */
export interface TokenGroup {
  [key: string]: TokenDefinition | TokenGroup;
}

/**
 * A flat collection of color values for a single color family.
 * Keys typically represent shades (e.g., "50", "100", "500", "900").
 * Each value is a TokenDefinition<string> representing a CSS color.
 *
 * @example
 * ```ts
 * const blueScale: ColorScale = {
 *   50: { value: "#eff6ff" },
 *   100: { value: "#dbeafe" },
 *   500: { value: "#3b82f6" },
 *   900: { value: "#1e3a8a" },
 * };
 * ```
 */
export interface ColorScale {
  [key: string]: TokenDefinition<string>;
}

/**
 * A collection of color scales and/or direct color tokens.
 * Keys are colour family names (e.g., "blue", "gray", "brand").
 * Values can be a full ColorScale or a single TokenDefinition<string>.
 *
 * @example
 * ```ts
 * const colors: ColorTokens = {
 *   blue: { 50: { value: "#eff6ff" }, 500: { value: "#3b82f6" } },
 *   gray: { 100: { value: "#f3f4f6" }, 900: { value: "#111827" } },
 *   brand: { value: "#2563eb" }, // flat single color
 * };
 * ```
 */
export interface ColorTokens {
  [key: string]: ColorScale | TokenDefinition<string>;
}

/**
 * A flat map of spacing tokens.
 * Keys describe the spacing size (e.g., "xs", "md", "lg", "4").
 * Values are TokenDefinition<string> containing a CSS length.
 *
 * @example
 * ```ts
 * const spacing: SpacingTokens = {
 *   xs: { value: "4px" },
 *   md: { value: "16px" },
 *   lg: { value: "24px" },
 * };
 * ```
 */
export interface SpacingTokens {
  [key: string]: TokenDefinition<string>;
}

/**
 * A flat map of border‑radius tokens.
 * Keys describe the radius size (e.g., "sm", "md", "full").
 * Values are TokenDefinition<string> containing a CSS length.
 */
export interface RadiusTokens {
  [key: string]: TokenDefinition<string>;
}

/**
 * A flat map of font‑family tokens.
 * Keys describe the font name (e.g., "body", "heading", "mono").
 * Values are TokenDefinition<string> containing a CSS font‑family value.
 */
export interface FontTokens {
  [key: string]: TokenDefinition<string>;
}

/**
 * A flat map of font‑size tokens.
 * Keys describe the size name (e.g., "xs", "sm", "base", "xl").
 * Values are TokenDefinition<string> containing a CSS font‑size.
 */
export interface FontSizeTokens {
  [key: string]: TokenDefinition<string>;
}

/**
 * A flat map of font‑weight tokens.
 * Keys describe the weight name (e.g., "normal", "medium", "bold").
 * Values are TokenDefinition<string> containing a CSS font‑weight (e.g., "400", "700").
 */
export interface FontWeightTokens {
  [key: string]: TokenDefinition<string>;
}

/**
 * A flat map of line‑height tokens.
 * Keys describe the line‑height name (e.g., "tight", "normal", "loose").
 * Values are TokenDefinition<string> containing a CSS line‑height.
 */
export interface LineHeightTokens {
  [key: string]: TokenDefinition<string>;
}

/**
 * A flat map of letter‑spacing tokens.
 * Keys describe the spacing name (e.g., "tight", "wide", "wider").
 * Values are TokenDefinition<string> containing a CSS letter‑spacing.
 */
export interface LetterSpacingTokens {
  [key: string]: TokenDefinition<string>;
}

/**
 * A flat map of shadow tokens.
 * Keys describe the shadow name (e.g., "sm", "md", "lg", "xl").
 * Values are TokenDefinition<string> containing a CSS box‑shadow value.
 */
export interface ShadowTokens {
  [key: string]: TokenDefinition<string>;
}

/**
 * A flat map of animation tokens.
 * Keys describe the animation name (e.g., "fade", "slide", "spin").
 * Values are TokenDefinition<string> containing a CSS animation shorthand or keyframes name.
 */
export interface AnimationTokens {
  [key: string]: TokenDefinition<string>;
}

/**
 * A flat map of responsive breakpoint tokens.
 *
 * Breakpoints define the minimum viewport width at which a responsive
 * style becomes active.
 *
 * Values are CSS lengths, typically expressed in px or rem.
 *
 * @example
 * ```ts
 * const breakpoints: BreakpointTokens = {
 *   sm: { value: "640px" },
 *   md: { value: "768px" },
 *   lg: { value: "1024px" },
 *   xl: { value: "1280px" },
 * };
 * ```
 */
export interface BreakpointTokens {
  [key: string]: TokenDefinition<string>;
}

/**
 * Primitive (raw) design tokens.
 * These are mode‑agnostic values that serve as the foundation for semantic tokens.
 * Each category is optional; you may define only the ones you need.
 *
 * The index signature allows custom token groups (e.g., "zIndices", "borders", "opacities")
 * to be added as the design system evolves.
 *
 * @example
 * ```ts
 * const tokens: DesignTokens = {
 *   colors: {
 *     blue: { 50: { value: "#eff6ff" }, 500: { value: "#3b82f6" } },
 *     gray: { 100: { value: "#f3f4f6" }, 900: { value: "#111827" } },
 *   },
 *   spacing: { sm: { value: "8px" }, md: { value: "16px" } },
 *   radii: { md: { value: "8px" } },
 * };
 * ```
 */
export interface DesignTokens {
  colors?: ColorTokens;
  spacing?: SpacingTokens;
  radii?: RadiusTokens;
  fonts?: FontTokens;
  fontSizes?: FontSizeTokens;
  fontWeights?: FontWeightTokens;
  lineHeights?: LineHeightTokens;
  letterSpacings?: LetterSpacingTokens;
  shadows?: ShadowTokens;
  animations?: AnimationTokens;
  breakpoints?:BreakpointTokens;

  [key: string]: unknown; 
}

/**
 * A value that can differ between light and dark color modes.
 * @template T - The type of the value (defaults to string).
 *
 * @example
 * ```ts
 * const brandColor: ColorModeValue = {
 *   light: "#3b82f6",
 *   dark: "#60a5fa",
 * };
 * ```
 */
export type ColorModeValue<T = string> =
  | { sameForBothModes: true; value: T }
  | { sameForBothModes?: false; light: T; dark: T };

/**
 * A semantic token that can be either a static value or a mode‑dependent value.
 * @template T - The TokenValue type (defaults to string).
 *
 * Semantic tokens represent a role (e.g., "background", "text", "border")
 * rather than a raw value. They are used to create themes that adapt to color mode.
 *
 * @example
 * ```ts
 * const surfaceToken: SemanticToken = {
 *   value: { light: "#ffffff", dark: "#1e293b" }
 * };
 * const dangerToken: SemanticToken = { value: "#ef4444" }; // static
 * ```
 */
export interface SemanticToken<T extends TokenValue = string> {
  value: ColorModeValue<T>;
}

/**
 * A flat record of semantic color tokens.
 * Keys describe the color role (e.g., "brand", "surface", "text", "danger").
 * Values are SemanticToken<string> that resolve to a CSS color.
 *
 * @example
 * ```ts
 * const semanticColors: SemanticColorTokens = {
 *   brand: { value: { light: "#3b82f6", dark: "#60a5fa" } },
 *   surface: { value: { light: "#ffffff", dark: "#1e293b" } },
 *   text: { value: { light: "#111827", dark: "#f1f5f9" } },
 *   danger: { value: "#ef4444" }, // static
 * };
 * ```
 */
export interface SemanticColorTokens {
  [key: string]: SemanticToken<string>;
}

/**
 * Container for all semantic tokens.
 * Currently only `colors` is defined, but the index signature allows
 * future categories like `shadows`, `borders`, or `opacities`.
 */
export interface SemanticTokens {
  colors?: SemanticColorTokens;
  [key: string]: unknown;
}
