import { defineRecipe } from "@/theme/recipes";

export const buttonGroupRecipe = defineRecipe({
  base: ["inline-flex items-center relative isolate", "kui-button-group"].join(
    " ",
  ),

  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col items-stretch",
    },

    attached: {
      true: "gap-0",
      false: "",
    },

    spacing: {
      none: "gap-0",
      sm: "gap-1",
      md: "gap-2",
      lg: "gap-3",
    },
  },

  defaultVariants: {
    orientation: "horizontal",
    attached: false,
    spacing: "md",
  },
  
  compoundVariants: [
    {
      conditions: {
        orientation: "horizontal",
        attached: true,
      },
      className: [
        "[&>[data-kui-button-group-item]]:rounded-none",
        "[&>[data-kui-button-group-item]:first-child]:rounded-l-md",
        "[&>[data-kui-button-group-item]:last-child]:rounded-r-md",
        "[&>[data-kui-button-group-item]+[data-kui-button-group-item]]:-ml-px",

        "[&>[data-kui-button-group-separator]]:h-[var(--kui-button-group-separator-size)]",
        "[&>[data-kui-button-group-separator]]:w-px",
        "[&>[data-kui-button-group-separator]]:mx-1",
        "[&>[data-kui-button-group-separator]]:shrink-0",
      ].join(" "),
    },

    {
      conditions: {
        orientation: "vertical",
      },
      className: [
        "[&>[data-kui-button-group-item]]:w-full",

        "[&>[data-kui-button-group-separator]]:h-px",
        "[&>[data-kui-button-group-separator]]:w-[var(--kui-button-group-separator-size)]",
        "[&>[data-kui-button-group-separator]]:shrink-0",
      ].join(" "),
    },

    {
      conditions: {
        orientation: "vertical",
        attached: true,
      },
      className: [
        "[&>[data-kui-button-group-item]]:rounded-none",
        "[&>[data-kui-button-group-item]:first-child]:rounded-t-md",
        "[&>[data-kui-button-group-item]:last-child]:rounded-b-md",
        "[&>[data-kui-button-group-item]+[data-kui-button-group-item]]:-mt-px",
      ].join(" "),
    },
  ],
});
