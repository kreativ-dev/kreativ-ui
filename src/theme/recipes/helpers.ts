import { DefaultRecipeCollection } from "@splenddev/kreativ-core/types";
import { defaultRecipes } from "../defaults/theme";

export function getRecipeNames(): (keyof DefaultRecipeCollection)[] {
  return Object.keys(defaultRecipes) as (keyof DefaultRecipeCollection)[];
}
