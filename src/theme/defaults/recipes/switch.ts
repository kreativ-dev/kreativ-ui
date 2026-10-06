import { defineRecipe } from "@splenddev/kreativ-core";

export const switchRecipe = defineRecipe({
  base: [
    "relative inline-flex shrink-0 items-center",
    "rounded-full",
    "transition-[background-color,border-color,box-shadow]",
    "duration-[var(--kui-duration-fast)]",

    "peer-focus-visible:ring-2",
    "peer-focus-visible:ring-kui-brand",
    "peer-focus-visible:ring-offset-1",
    "peer-focus-visible:ring-offset-surface",
  ].join(" "),

  variants: {
    checked: {
      true: "bg-kui-brand",
      false: "bg-kui-border",
    },

    state: {
      none: "",
      error: "bg-kui-destructive",
      success: "bg-kui-success",
      warning: "bg-kui-warning",
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
