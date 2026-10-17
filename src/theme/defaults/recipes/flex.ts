import { defineRecipe } from "@splenddev/kreativ-core";

export const flexRecipe = defineRecipe({
  base: "",
  variants: {
    inline: {
      true: "inline-flex",
      false: "flex",
    },
    fullWidth: {
      true: "w-full",
      false: "",
    },
    fullHeight: {
      true: "h-full",
      false: "",
    },
  },
  defaultVariants: {
    inline: "false",
    fullWidth: "false",
    fullHeight: "false",
  },
});

export type FlexRecipe = typeof flexRecipe;
