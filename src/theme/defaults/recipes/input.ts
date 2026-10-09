import { defineRecipe } from "@splenddev/kreativ-core";


export const inputRecipe = defineRecipe({
  base: "kui-input",

  variants: {
    variant: {
      outline: "",
      filled: "",
      ghost: "",
    },
  },

  defaultVariants: {
    variant: "outline",
  },
});
