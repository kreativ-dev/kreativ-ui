import { defineRecipe } from "@splenddev/kreativ-core";

const repeaterButtonBase = [
  "inline-flex items-center justify-center",

  "size-7 shrink-0",
  "rounded-[var(--kui-radii-md)]",

  "text-kui-text-muted",
  "transition-colors duration-fast ease-kui",

  "hover:bg-kui-surface-sunken hover:text-kui-text",

  "focus-visible:outline-none",
  "focus-visible:ring-2 focus-visible:ring-kui-brand/30",

  "disabled:pointer-events-none disabled:opacity-40",
].join(" ");

export const repeaterRemoveRecipe = defineRecipe({
  base: [
    repeaterButtonBase,

    "hover:bg-kui-destructive/10",
    "hover:text-kui-destructive",

    "focus-visible:ring-kui-destructive/30",
  ].join(" "),
});

export const repeaterMoveUpRecipe = defineRecipe({
  base: repeaterButtonBase,
});

export const repeaterMoveDownRecipe = defineRecipe({
  base: repeaterButtonBase,
});

export const repeaterAddRecipe = defineRecipe({
  base: [
    "inline-flex items-center justify-center gap-1.5",

    "min-h-8 px-3",
    "rounded-[var(--kui-radii-md)]",

    "text-sm font-medium",
    "text-kui-brand",

    "border border-dashed border-kui-border",
    "bg-transparent",

    "transition-colors duration-fast ease-kui",

    "hover:bg-kui-brand/5",
    "hover:border-kui-brand/40",

    "focus-visible:outline-none",
    "focus-visible:ring-2 focus-visible:ring-kui-brand/30",

    "disabled:pointer-events-none disabled:opacity-40",
  ].join(" "),
});

export const repeaterItemRecipe = defineRecipe({
  base: [
    "overflow-hidden",

    "rounded-[var(--kui-radii-md)]",
    "border border-kui-border",

    "bg-kui-surface",

    "transition-colors duration-fast animate-kui-scale-in",
  ].join(" "),
});

export const repeaterItemHeaderRecipe = defineRecipe({
  base: [
    "flex items-center justify-between gap-3",

    "min-h-10 px-3 py-1.5",

    "border-b border-kui-border",

    "bg-kui-surface-sunken/40",
  ].join(" "),
});

export const repeaterItemLabelRecipe = defineRecipe({
  base: ["min-w-0", "text-sm font-medium", "text-kui-text", "truncate"].join(
    " ",
  ),
});

export const repeaterItemContentRecipe = defineRecipe({
  base: ["min-w-0", "p-3"].join(" "),
});

export const repeaterItemsRecipe = defineRecipe({
  base: ["flex flex-col gap-2"].join(" "),
});

export const repeaterActionsRecipe = defineRecipe({
  base: ["flex items-center gap-0.5", "shrink-0"].join(" "),
});
