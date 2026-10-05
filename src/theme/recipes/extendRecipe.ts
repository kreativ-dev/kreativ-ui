import type { RecipeCollection, ThemeOverride } from "@/types";
import { defaultRecipes } from "../defaults/theme";

export function extendRecipes(
  override?: ThemeOverride["recipes"],
): RecipeCollection {
  if (!override) {
    return defaultRecipes;
  }

  const result = { ...defaultRecipes };

  for (const [name, recipeOverride] of Object.entries(override)) {
    const key = name as keyof RecipeCollection;

    const base = defaultRecipes[key];

    result[key] = {
      ...base,
      ...recipeOverride,

      ...(recipeOverride?.compoundVariants
        ? {
            compoundVariants: recipeOverride.compoundVariants,
          }
        : {}),

      ...(base?.variants || recipeOverride?.variants
        ? {
            variants: {
              ...base?.variants,
              ...recipeOverride?.variants,
            },
          }
        : {}),
    };
  }

  return result;
}
