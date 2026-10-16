import { defineRecipe } from "@splenddev/kreativ-core";

export const scrollAreaRecipe = defineRecipe({
  base: "kui-scroll-area",

  variants: {
    direction: {
      vertical: "overflow-y-auto overflow-x-hidden",
      horizontal: "overflow-x-auto overflow-y-hidden",
      both: "overflow-auto",
    },
    showScrollbar: {
      auto: "",
      always: "kui-scrollbar",
      hover: "kui-scrollbar kui-scrollbar-hover-only",
      never: "kui-scrollbar-hidden",
    },
    scrollbarVariant: {
      thin: "",
      default: "kui-scrollbar-default-width",
    },
  },

  defaultVariants: {
    direction: "vertical",
    showScrollbar: "auto",
    scrollbarVariant: "thin",
  },
});
