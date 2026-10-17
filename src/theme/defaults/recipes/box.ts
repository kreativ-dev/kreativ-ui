import { defineRecipe } from "@splenddev/kreativ-core";

export const boxRecipe = defineRecipe({
  base: "box-border",
  variants: {
    border: {
      true: "border border-solid border-kui-border",
      false: "",
    },
  },
  defaultVariants: {
    border: "false",
  },
}) ;

export type BoxRecipe = typeof boxRecipe;
