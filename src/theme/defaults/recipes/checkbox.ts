import { defineRecipe } from "@splenddev/kreativ-core";

export const checkboxRecipe = defineRecipe({
  base:
    "relative inline-flex shrink-0 items-center justify-center " +
    "border transition-colors " +
    "duration-[var(--kui-duration-fast)] " +
    "peer-focus-visible:ring-2 " +
    "peer-focus-visible:ring-kui-brand " +
    "peer-focus-visible:ring-offset-1",

  variants: {
    state: {
      none: "border-kui-border",
      error: "border-kui-destructive",
      success: "border-kui-success",
      warning: "border-kui-warning",
    },

    checked: {
      true: "border-kui-brand bg-kui-brand text-kui-brand-fg",
      false: "bg-transparent",
    },

    disabled: {
      true: "cursor-not-allowed",
      false: "cursor-pointer",
    },

    rounded: {
      true: "rounded-full",
      false: "rounded-[calc(var(--kui-checkbox-radius)-4px)]",
    },
  },

  compoundVariants: [
    {
      conditions: {
        checked: false,
        state: "error",
      },
      className: "border-kui-destructive",
    },

    {
      conditions: {
        checked: false,
        state: "success",
      },
      className: "border-kui-success",
    },
    {
      conditions: {
        checked: false,
        state: "warning",
      },
      className: "border-kui-warning",
    },
  ],

  defaultVariants: {
    state: "none",
    checked: false,
    disabled: false,
    rounded: false,
  },
});
