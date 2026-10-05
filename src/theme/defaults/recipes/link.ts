import { defineRecipe } from "@/theme/recipes";

export const linkRecipe = defineRecipe({
  base: "kui-link",
  variants: {
    variant: {
      solid: "text-brand hover:text-brand-hover",
      outline: "text-text-secondary hover:text-brand",
      ghost: "text-text-secondary hover:text-text",
      soft: "text-brand hover:text-brand-hover",
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
