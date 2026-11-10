import { defineRecipe } from "@splenddev/kreativ-core";

export const inputRecipe = defineRecipe({
  base:
    "kui-input w-full h-full bg-transparent " +
    "text-[length:var(--kui-input-font-size)]",

  variants: {
    variant: {
      outline: "",
      filled: "",
      ghost: "",
    },
    hasRightAdornment: {
      true: "pr-2",
      false: "",
    },
    hasLeftAdornment: {
      true: "pl-2",
      false: "",
    },
  },

  defaultVariants: {
    variant: "outline",
  },
});
