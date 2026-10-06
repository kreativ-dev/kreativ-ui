import { RecipeDefinition, RecipeStyle, RecipeVariantValue } from "@splenddev/kreativ-core";
import { cn } from "../../utils/cn";

export interface RecipeProps {
  [key: string]: RecipeVariantValue | undefined;
}

function matchesConditions(
  conditions: Record<string, RecipeVariantValue>,
  props: RecipeProps,
) {
  return Object.entries(conditions).every(
    ([key, expected]) => props[key] === expected,
  );
}

export function resolveRecipe(
  recipe: RecipeDefinition | undefined,
  props: RecipeProps = {},
): string {
  if (!recipe) return "";

  const resolvedProps: RecipeProps = {
    ...recipe.defaultVariants,
    ...props,
  };

  const classes: RecipeStyle[] = [];

  if (recipe.base) {
    classes.push(recipe.base);
  }

  if (recipe.variants) {
    for (const [variantName, variantValues] of Object.entries(
      recipe.variants,
    )) {
      const value = resolvedProps[variantName];

      if (value === undefined) continue;

      const variantClass = variantValues[String(value)];

      if (variantClass) {
        classes.push(variantClass);
      }
    }
  }

  if (recipe.compoundVariants) {
    for (const compound of recipe.compoundVariants) {
      if (matchesConditions(compound.conditions, resolvedProps)) {
        classes.push(compound.className);
      }
    }
  }

  return cn(...classes);
}
