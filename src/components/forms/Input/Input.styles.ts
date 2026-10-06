import { cva } from "class-variance-authority";
import type { InputSize } from "./Input.types";

export const inputBase = [
  "flex",
  "items-center",
  "font-sans",
  "transition-colors",
  "duration-[var(--kui-duration-fast)]",
  "outline-none",

  "placeholder:text-kui-text-muted",

  "disabled:opacity-50",
  "disabled:pointer-events-none",
  "disabled:cursor-not-allowed",
].join(" ");

export const inputWrapperVariants = cva(
  "group relative inline-flex items-center gap-2 transition-colors",
  {
    variants: {
      variant: {
        outline:
          "border border-kui-border bg-transparent text-kui-text hover:border-kui-brand",
        filled:
          "border border-transparent bg-kui-surface-raised text-kui-text hover:bg-kui-surface",
        ghost:
          "border border-transparent bg-transparent text-kui-text hover:bg-kui-surface-raised",
      },
      state: {
        none: "focus-within:ring-2 focus-within:ring-kui-brand/20",
        error:
          "border-kui-destructive focus-within:ring-2 focus-within:ring-kui-destructive/20",
        success:
          "border-kui-success focus-within:ring-2 focus-within:ring-kui-success/20",
      },
      rounded: {
        true: "rounded-full",
        false: "rounded-[var(--kui-radii-md)]",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      hasIcon: {
        true: "px-2",
        false: "",
      },
      disabled: {
        true: "pointer-events-none cursor-not-allowed opacity-50",
        false: "",
      },
    },
    defaultVariants: {
      variant: "outline",
      state: "none",
      rounded: false,
      fullWidth: true,
      hasIcon: false,
      disabled: false,
    },
  },
);

export const inputSizeVariants: Record<InputSize, string> = {
  xs: "h-8 px-2 text-xs",
  sm: "h-8 px-2 text-xs",
  md: "h-10 px-3 text-sm",
  lg: "h-12 px-4 text-base",
};
