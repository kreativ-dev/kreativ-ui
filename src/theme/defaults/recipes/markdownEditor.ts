import { defineRecipe } from "@/theme/recipes";

export const markdownEditorRecipe = defineRecipe({
  base:
    "group relative w-full overflow-hidden " +
    "rounded-[var(--kui-radii-md)] " +
    "transition-[border-color,box-shadow] duration-[var(--kui-duration-fast)]",

  variants: {
    variant: {
      outline: "border border-border bg-transparent",
      filled: "border border-transparent bg-surface-raised",
      ghost: "border border-transparent bg-transparent",
    },

    state: {
      none: "hover:border-brand focus-within:ring-2 focus-within:ring-brand/20",

      error:
        "border-destructive focus-within:ring-2 focus-within:ring-destructive/20",

      success:
        "border-success focus-within:ring-2 focus-within:ring-success/20",

      warning:
        "border-warning focus-within:ring-2 focus-within:ring-warning/20",
    },
    
    disabled: {
      true:
        "cursor-not-allowed opacity-50 " +
        "border-border hover:border-border " +
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
