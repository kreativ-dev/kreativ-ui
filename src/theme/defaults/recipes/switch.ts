import { defineRecipe } from "@/theme/recipes";

export const switchRecipe = defineRecipe({
  base: [
    "relative inline-flex shrink-0 items-center",
    "rounded-full",
    "transition-[background-color,border-color,box-shadow]",
    "duration-[var(--kui-duration-fast)]",

    "peer-focus-visible:ring-2",
    "peer-focus-visible:ring-brand",
    "peer-focus-visible:ring-offset-1",
    "peer-focus-visible:ring-offset-surface",
  ].join(" "),

  variants: {
    checked: {
      true: "bg-brand",
      false: "bg-border",
    },

    state: {
      none: "",
      error: "bg-destructive",
      success: "bg-success",
      warning: "bg-warning",
    },

    disabled: {
      true: "cursor-not-allowed opacity-50",
      false: "",
    },
  },

  defaultVariants: {
    checked: false,
    state: "none",
    disabled: false,
  },
});
