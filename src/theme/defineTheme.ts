import type { Theme } from "@/types";

/**
 * Defines a Kreativ UI theme.
 *
 * This function provides a type-safe boundary for creating themes while
 * preserving the exact structure and types of the supplied theme.
 *
 * It does not merge with the default theme or mutate the provided object.
 * Theme extension and resolution are handled separately.
 *
 * @example
 * ```ts
 * export const myTheme = defineTheme({
 *   tokens: {
 *     // ...
 *   },
 *   semanticTokens: {
 *     // ...
 *   },
 *   typography: {
 *     // ...
 *   },
 *   recipes: {
 *     // ...
 *   },
 *   intensity: 50,
 *   sizes: {
 *     // ...
 *   },
 * });
 * ```
 */
export function defineTheme<T extends Theme>(theme: T): T {
  return theme;
}
