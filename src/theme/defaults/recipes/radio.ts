import { defineRecipe } from "@splenddev/kreativ-core";

export const radioBubbleRecipe = defineRecipe({
  base: "rounded-full border border-solid peer-focus-visible:ring-2 peer-focus-visible:ring-kui-brand peer-focus-visible:ring-offset-1",
  variants: {
    size: { sm: "size-4", md: "size-5", lg: "size-6" },
    state: {
      none: "border-kui-border",
      error: "border-kui-destructive",
      success: "border-kui-success",
      warning: "border-kui-warning",
    },
    checked: { true: "border-kui-brand", false: "" },
    disabled: { true: "", false: "" },
  },
  defaultVariants: {
    size: "md",
    state: "none",
    checked: "false",
    disabled: "false",
  },
});

export const radioDotRecipe = defineRecipe({
  base: "rounded-full bg-kui-brand",
  variants: {
    size: { sm: "size-1.5", md: "size-2", lg: "size-2.5" },
  },
  defaultVariants: { size: "md" },
});
