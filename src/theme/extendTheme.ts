import type { Theme, ThemeOverride } from "@splenddev/kreativ-core/types";
import { extendSizes } from "./size";
import { extendRecipes } from "./recipes";
import { extendTypography } from "./typography";
import { extendTokens, extendSemanticTokens } from "./token";
import { defaultTheme } from "./defaults/theme";

export function extendTheme(override?: ThemeOverride): Theme {
  if (!override) {
    return defaultTheme;
  }

  return {
    ...defaultTheme,
    ...override,

    tokens: extendTokens(override.tokens),

    semanticTokens: extendSemanticTokens(override.semanticTokens),

    sizes: extendSizes(override.sizes),

    typography: extendTypography(override.typography),

    recipes: extendRecipes(override.recipes),
  };
}
