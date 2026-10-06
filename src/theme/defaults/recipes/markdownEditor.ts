import { defineRecipe } from "@splenddev/kreativ-core";

export const markdownEditorRecipe = defineRecipe({
  base:
    "group relative w-full overflow-hidden " +
    "rounded-[var(--kui-radii-md)] " +
    "transition-[border-color,box-shadow] duration-[var(--kui-duration-fast)]",

  variants: {
    variant: {
      outline: "border border-kui-border bg-transparent",
      filled: "border border-transparent bg-kui-surface-raised",
      ghost: "border border-transparent bg-transparent",
    },

    state: {
      none: "hover:border-kui-brand focus-within:ring-2 focus-within:ring-kui-brand/20",

      error:
        "border-kui-destructive focus-within:ring-2 focus-within:ring-kui-destructive/20",

      success:
        "border-kui-success focus-within:ring-2 focus-within:ring-kui-success/20",

      warning:
        "border-kui-warning focus-within:ring-2 focus-within:ring-kui-warning/20",
    },

    disabled: {
      true:
        "cursor-not-allowed opacity-50 " +
        "border-kui-border hover:border-kui-border " +
        "focus-within:ring-0",
      false: "",
    },

    fullWidth: {
      true: "w-full",
      false: "",
    },
  },

  defaultVariants: {
    variant: "outline",
    state: "none",
    fullWidth: true,
  },
});
