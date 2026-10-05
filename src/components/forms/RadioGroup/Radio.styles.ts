import { cva } from "class-variance-authority";
import type { RadioSize } from "./Radio.types";

export const radioBubbleVariants = cva(
  "flex shrink-0 items-center justify-center rounded-full border transition-colors duration-[var(--kui-duration-fast)]",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
      },
      state: {
        none: "",
        error: "border-destructive",
        success: "border-success",
      },
      checked: {
        true: "border-brand",
        false: "border-border bg-transparent",
      },
      disabled: {
        true: "cursor-not-allowed",
        false: "cursor-pointer",
      },
    },
    defaultVariants: {
      size: "md",
      state: "none",
      checked: false,
      disabled: false,
    },
    compoundVariants: [
      { checked: false, state: "error", class: "border-destructive" },
      { checked: false, state: "success", class: "border-success" },
    ],
  },
);

export const radioDotSizes: Record<RadioSize, string> = {
  sm: "h-1.5 w-1.5",
  md: "h-2 w-2",
  lg: "h-2.5 w-2.5",
};
