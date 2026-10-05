import { cva } from "class-variance-authority";

export const multiSelectSizeVariants = cva("", {
  variants: {
    size: {
      sm: "min-h-[2.25rem] py-1 px-2 text-xs gap-1",
      md: "min-h-[2.75rem] py-1.5 px-3 text-sm gap-1.5",
      lg: "min-h-[3.25rem] py-2 px-4 text-base gap-2",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const chipSizeVariants = cva("inline-flex items-center rounded-full", {
  variants: {
    size: {
      sm: "text-[10px] px-1.5 py-0.5 gap-0.5",
      md: "text-xs px-2 py-0.5 gap-1",
      lg: "text-sm px-2.5 py-1 gap-1.5",
    },
  },
  defaultVariants: {
    size: "md",
  },
});