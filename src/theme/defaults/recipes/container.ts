import { defineRecipe } from "@/theme";

export const containerReccipe = defineRecipe({
  base: "w-full",
  variants: {
    maxWidth: {
      xs: "max-w-screen-xs",
      sm: "max-w-screen-sm",
      md: "max-w-screen-md",
      lg: "max-w-screen-lg",
      xl: "max-w-screen-xl",
      full: "max-w-full",
    },
  },
  defaultVariants: {
    maxWidth: "lg",
  },
});
