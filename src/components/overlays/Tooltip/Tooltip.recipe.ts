import { defineRecipe } from "@splenddev/kreativ-core";

export const tooltipContentRecipe = defineRecipe({
  base:
    "z-50 max-w-xs rounded-md px-2.5 py-1.5 text-xs shadow-md " +
    "bg-[var(--kui-tooltip-bg,#111)] text-[var(--kui-tooltip-fg,#fff)]",
});

export const tooltipArrowRecipe = defineRecipe({
  base:
    "absolute size-2 rotate-45 bg-inherit " +
    "left-[var(--kui-tooltip-arrow-x,auto)] top-[var(--kui-tooltip-arrow-y,auto)]",
  variants: {
    side: {
      top: "bottom-[-4px]",
      bottom: "top-[-4px]",
      left: "right-[-4px]",
      right: "left-[-4px]",
    },
  },
  defaultVariants: { side: "top" },
});

export const tooltipRecipes = {
  TooltipContent: tooltipContentRecipe,
  TooltipArrow: tooltipArrowRecipe,
};
