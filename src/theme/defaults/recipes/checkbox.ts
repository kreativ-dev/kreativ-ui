import { defineRecipe } from "@/theme/recipes";

export const checkboxRecipe = defineRecipe({
  base:
    "relative inline-flex shrink-0 items-center justify-center " +
    "border transition-colors " +
    "duration-[var(--kui-duration-fast)] " +
    "peer-focus-visible:ring-2 " +
    "peer-focus-visible:ring-brand " +
    "peer-focus-visible:ring-offset-1",

  variants: {
    state: {
      none: "border-border",
      error: "border-destructive",
      success: "border-success",
      warning: "border-warning",
    },

    checked: {
      true: "border-brand bg-brand text-brand-fg",
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
      className: "border-destructive",
    },

    {
      conditions: {
        checked: false,
        state: "success",
      },
      className: "border-success",
    },
    {
      conditions: {
        checked: false,
        state: "warning",
      },
      className: "border-warning",
    },
  ],

  defaultVariants: {
    state: "none",
    checked: false,
    disabled: false,
    rounded: false,
  },
});
