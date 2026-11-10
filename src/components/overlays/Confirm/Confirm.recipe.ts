import { defineRecipe } from "@splenddev/kreativ-core";

export const confirmOverlayRecipe = defineRecipe({
  base: "absolute inset-0 bg-kui-black/40 backdrop-blur-[2px]",
});

export const confirmLayerRecipe = defineRecipe({
  base: [
    "fixed inset-0 z-50",
    "flex items-center justify-center",
    "overflow-y-auto p-4 sm:p-6",
  ].join(" "),
});

export const confirmContentRecipe = defineRecipe({
  base: [
    "relative z-10 w-full max-w-[400px]",
    "max-h-[calc(100dvh-2rem)] overflow-y-auto",
    "rounded-xl border border-kui-border",
    "bg-kui-surface p-6 text-kui-text",
    "shadow-2xl outline-none",
  ].join(" "),
});

export const confirmHeaderRecipe = defineRecipe({
  base: "flex flex-col items-center",
});

export const confirmIconRecipe = defineRecipe({
  base: [
    "mb-5 flex size-12 shrink-0 items-center justify-center",
    "rounded-xl border",
  ].join(" "),
  variants: {
    status: {
      neutral: "border-kui-border bg-kui-surface-raised text-kui-text",
      info: "border-kui-info/20 bg-kui-info/10 text-kui-info",
      success: "border-kui-success/20 bg-kui-success/10 text-kui-success",
      warning: "border-kui-warning/20 bg-kui-warning/10 text-kui-warning",
      error:
        "border-kui-destructive/20 bg-kui-destructive/10 text-kui-destructive",
    },
  },
  defaultVariants: {
    status: "neutral",
  },
});

export const confirmTitleRecipe = defineRecipe({
  base: "text-kui-lg font-kui-semibold tracking-tight",
});

export const confirmMessageRecipe = defineRecipe({
  base: "mt-2 text-kui-sm leading-relaxed text-kui-text-muted text-center",
});

export const confirmActionsRecipe = defineRecipe({
  base: "mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
});

export const confirmButtonRecipe = defineRecipe({
  base: [
    "inline-flex h-10 w-full items-center justify-center",
    "rounded-kui-md border px-4 sm:w-auto",
    "text-kui-sm font-kui-medium",
    "transition-colors",
    "focus-visible:outline-none",
    "focus-visible:ring-2 focus-visible:ring-kui-focus",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-kui-surface",
    "disabled:pointer-events-none disabled:opacity-50",
  ].join(" "),

  variants: {
    intent: {
      confirm: "border-transparent text-kui-white",
      cancel: [
        "border-kui-border bg-kui-surface",
        "text-kui-text hover:bg-kui-surface-raised",
      ].join(" "),
    },
    status: {
      neutral: "",
      info: "",
      success: "",
      warning: "",
      error: "",
    },
  },

  defaultVariants: {
    intent: "confirm",
    status: "neutral",
  },

  compoundVariants: [
    {
      conditions: { intent: "confirm", status: "neutral" },
      className:
        "bg-kui-surface-sunken text-kui-text hover:bg-kui-surface-raised",
    },
    {
      conditions: { intent: "confirm", status: "info" },
      className: "bg-kui-info hover:bg-kui-info-hover",
    },
    {
      conditions: { intent: "confirm", status: "success" },
      className: "bg-kui-success hover:bg-kui-success-hover",
    },
    {
      conditions: { intent: "confirm", status: "warning" },
      className: "bg-kui-warning text-kui-black hover:bg-kui-warning-hover",
    },
    {
      conditions: { intent: "confirm", status: "error" },
      className: "bg-kui-destructive hover:bg-kui-destructive-hover",
    },
  ],
});

export const confirmRecipes = {
  ConfirmOverlay: confirmOverlayRecipe,
  ConfirmLayer: confirmLayerRecipe,
  ConfirmContent: confirmContentRecipe,
  ConfirmHeader: confirmHeaderRecipe,
  ConfirmIcon: confirmIconRecipe,
  ConfirmTitle: confirmTitleRecipe,
  ConfirmMessage: confirmMessageRecipe,
  ConfirmActions: confirmActionsRecipe,
  ConfirmButton: confirmButtonRecipe,
};
