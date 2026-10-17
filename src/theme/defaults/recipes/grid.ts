import { defineRecipe } from "@splenddev/kreativ-core";

export const gridRecipe = defineRecipe({
  base: "",
  variants: {
    inline: {
      true: "inline-grid",
      false: "grid",
    },
  },
  defaultVariants: {
    inline: "false",
  },
});

export type GridRecipe = typeof gridRecipe;
