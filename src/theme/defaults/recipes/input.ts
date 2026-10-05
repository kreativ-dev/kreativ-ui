import { defineRecipe } from "@/theme/recipes";

export const inputBase =
  "flex min-w-0 flex-1 " +
  "font-sans " +
  "bg-transparent border-0 outline-none " +
  "transition-colors duration-[var(--kui-duration-fast)] " +
  "placeholder:text-text-muted " +
  "disabled:cursor-not-allowed";

export const inputRecipe = defineRecipe({
  base: inputBase,

  variants: {
    variant: {
      outline: "",
      filled: "",
      ghost: "",
    },
  },

  defaultVariants: {
    variant: "outline",
  },
});
