import { defineRecipe } from "@splenddev/kreativ-core";

export const linkRecipe = defineRecipe({
  base: "kui-link",
  variants: {
    variant: {
      solid: "text-kui-brand hover:text-kui-brand-hover",
      outline: "text-kui-text-secondary hover:text-kui-brand",
      ghost: "text-kui-text-secondary hover:text-kui-text",
      soft: "text-kui-brand hover:text-kui-brand-hover",
    },
    underline: {
      always: "underline",
      hover: "no-underline hover:underline",
      none: "no-underline",
    },
    disabled: {
      true: "pointer-events-none opacity-50 cursor-not-allowed",
      false: "",
    },
  },
  defaultVariants: {
    variant: "solid",
    underline: "hover",
    disabled: false,
  },
});
