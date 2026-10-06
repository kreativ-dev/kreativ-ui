import type {
  RecipeCollection,
  DeepPartial,
} from "@splenddev/kreativ-core/types";
import { defaultRecipes as defaultRecipesLiteral } from "../defaults/theme";

// defaultRecipesLiteral is `satisfies RecipeCollection`-typed (so its
// own literal keys are preserved for ValidateTheme's benefit), but
// extendRecipe/extendRecipes need to index it by an arbitrary
// `keyof RecipeCollection` (including custom string keys from
// CustomRecipes that the literal object has no index signature for)
// — so it's treated as the general RecipeCollection shape here.
const defaultRecipes: RecipeCollection = defaultRecipesLiteral;

/**
 * Overrides a single component's recipe against the built-in default
 * for that component. For overriding just one recipe inline, without
 * constructing a partial keyed-by-component-name object.
 */
export function extendRecipe<K extends keyof RecipeCollection>(
  name: K,
  override?: DeepPartial<RecipeCollection[K]>,
): RecipeCollection[K] {
  const base = defaultRecipes[name];

  if (!override) {
    return base as RecipeCollection[K];
  }

  return {
    ...base,
    ...override,

    ...(override?.compoundVariants
      ? { compoundVariants: override.compoundVariants }
      : {}),

    ...(base?.variants || override?.variants
      ? {
          variants: {
            ...base?.variants,
            ...override?.variants,
          },
        }
      : {}),
  } as RecipeCollection[K];
}

/**
 * Overrides the theme's full recipe collection against the built-in
 * defaults. Thin wrapper over extendRecipe — the actual merge logic
 * lives in exactly one place.
 */
export function extendRecipes(
  override?: DeepPartial<RecipeCollection>,
): RecipeCollection {
  if (!override) {
    return defaultRecipes;
  }

  const result: RecipeCollection = { ...defaultRecipes };

  for (const name of Object.keys(override) as (keyof RecipeCollection)[]) {
    result[name] = extendRecipe(name, override[name]);
  }

  return result;
}
