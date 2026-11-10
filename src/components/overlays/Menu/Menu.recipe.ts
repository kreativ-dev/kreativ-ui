import { defineRecipe } from "@splenddev/kreativ-core";

export const menuContentRecipe = defineRecipe({
  base:
    "z-50 min-w-[11rem] " +
    "overflow-y-auto overflow-x-hidden overscroll-contain kui-scrollbar " +
    "rounded-lg border border-kui-border p-1.5 outline-none " +
    "bg-kui-surface text-kui-text " +
    "shadow-[0_12px_32px_-8px_rgb(var(--kui-colors-black)/0.16),0_2px_6px_rgb(var(--kui-colors-black)/0.06)]",
});

export const menuItemRecipe = defineRecipe({
  base:
    "relative flex w-full min-h-8 items-center gap-2 " +
    "rounded-md px-2.5 py-1.5 text-left text-sm font-normal " +
    "outline-none select-none cursor-default " +
    "transition-[background-color,color,opacity] duration-150 " +
    "focus-visible:ring-2 focus-visible:ring-kui-brand " +
    "focus-visible:ring-inset " +
    "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:pointer-events-none " +
    "data-[active]:bg-kui-surface-raised " +
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",

  variants: {
    kind: {
      item: "",
      checkbox: "pr-8 data-[state=checked]:font-medium",
      radio: "data-[state=checked]:font-medium",
      sub:
        "justify-between " +
        "data-[state=open]:bg-kui-surface-raised " +
        "data-[state=open]:text-kui-text " +
        "[&_svg]:size-4",
    },

    tone: {
      default: "",
      destructive:
        "text-kui-destructive " +
        "data-[active]:bg-kui-destructive/10 " +
        "data-[active]:text-kui-destructive",
    },

    inset: {
      true: "pl-8",
      false: "",
    },
  },

  defaultVariants: {
    kind: "item",
    tone: "default",
    inset: false,
  },
});

export const menuSeparatorRecipe = defineRecipe({
  base: "mx-[-0.375rem] my-1.5 h-px bg-kui-border",
});

export const menuLabelRecipe = defineRecipe({
  base:
    "px-2.5 py-1.5 text-xs font-medium " + "text-kui-text-muted select-none",
});

export const menuRecipes = {
  MenuContent: menuContentRecipe,
  MenuItem: menuItemRecipe,
  MenuSeparator: menuSeparatorRecipe,
  MenuLabel: menuLabelRecipe,
};
