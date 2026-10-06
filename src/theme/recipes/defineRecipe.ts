import type { RecipeDefinition } from "@splenddev/kreativ-core/types";

export function defineRecipe<T extends RecipeDefinition>(recipe: T): T {
  return recipe;
}
