import { defineRecipe } from "@splenddev/kreativ-core";

export const textareaRecipe = defineRecipe({
  base:
    "flex w-full min-w-0 " +
    "px-[var(--kui-textarea-padding-x)] " +
    "py-[var(--kui-textarea-padding-y)] " +
    "text-[length:var(--kui-textarea-font-size)] " +
    "bg-transparent outline-none border-0 " +
    "text-kui-text placeholder:text-kui-text-muted " +
    "transition-colors duration-[var(--kui-duration-fast)] " +
    "disabled:pointer-events-none " +
    "disabled:cursor-not-allowed " +
    "disabled:opacity-50 " +
    "kui-scrollbar",

  variants: {
    variant: {
      outline: "",
      filled: "",
      ghost: "",
    },

    resize: {
      none: "resize-none",
      both: "resize",
      horizontal: "resize-x",
      vertical: "resize-y",
    },

    autoResize: {
      true: "resize-none overflow-hidden",
      false: "",
    },
  },

  defaultVariants: {
    variant: "outline",
    resize: "vertical",
    autoResize: false,
  },
});
