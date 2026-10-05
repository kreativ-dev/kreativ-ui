import type { Theme, ThemeOverride } from "@/types";
import { extendSizes } from "./size";
import { extendRecipes } from "./recipes";
import { extendTypography } from "./typography";
import { defaultTheme } from "./defaults/theme";

export function extendTheme(override?: ThemeOverride): Theme {
  if (!override) {
    return defaultTheme;
  }

  return {
    ...defaultTheme,

    ...override,

    sizes: extendSizes(override.sizes),

    typography: extendTypography(override.typography),

    recipes: extendRecipes(override.recipes),
  };
}
