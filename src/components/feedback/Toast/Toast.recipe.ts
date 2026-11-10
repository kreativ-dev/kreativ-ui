import { defineRecipe } from "@splenddev/kreativ-core";

export const toastViewportRecipe = defineRecipe({
  base: [
    "pointer-events-none fixed z-[9999]",
    "flex w-[calc(100%-2rem)] max-w-[24rem]",
    "gap-2",
  ].join(" "),

  variants: {
    placement: {
      "top-start": "top-0 start-0 flex-col-reverse",
      "top-center": "top-0 left-1/2 -translate-x-1/2 flex-col-reverse",
      "top-end": "top-0 end-0 flex-col-reverse",
      "bottom-start": "bottom-0 start-0 flex-col",
      "bottom-center": "bottom-0 left-1/2 -translate-x-1/2 flex-col",
      "bottom-end": "bottom-0 end-0 flex-col",
    },
  },

  defaultVariants: {
    placement: "bottom-end",
  },
});

export const toastRecipe = defineRecipe({
  base: [
    "pointer-events-auto relative isolate",
    "flex w-full items-start gap-3",
    "overflow-hidden",
    "rounded-xl border",
    "bg-kui-surface",
    "p-4",
    "text-kui-text",
    "shadow-[0_12px_32px_-12px_rgb(0_0_0_/_0.22),0_2px_8px_rgb(0_0_0_/_0.06)]",
    "ring-1 ring-inset ring-black/[0.03]",
    "transition-[max-height,translate,box-shadow,opacity,border-color]",
    "duration-200",
    "ease-out",
    "will-change-[translate]",
    "hover:shadow-[0_16px_36px_-12px_rgb(0_0_0_/_0.24),0_3px_10px_rgb(0_0_0_/_0.08)]",
    "animate-[kui-toast-enter_180ms_cubic-bezier(0.16,1,0.3,1)_both]",
    "data-[state=closed]:animate-[kui-toast-exit_160ms_ease-in_forwards]",
    "motion-reduce:animate-none",
    "motion-reduce:transition-none",
  ].join(" "),

  variants: {
    status: {
      neutral: "border-kui-border",
      success: "border-kui-success/30",
      error: "border-kui-destructive/30",
      warning: "border-kui-warning/30",
      info: "border-kui-info/30",
      brand: "border-kui-brand/30",
    },
  },

  defaultVariants: {
    status: "neutral",
  },
});

export const toastIconRecipe = defineRecipe({
  base: [
    "mt-0.5 flex size-9 shrink-0",
    "items-center justify-center",
    "rounded-lg",
  ].join(" "),

  variants: {
    status: {
      neutral: "bg-kui-surface-raised text-kui-text",
      success: "bg-kui-success/10 text-kui-success",
      error: "bg-kui-destructive/10 text-kui-destructive",
      warning: "bg-kui-warning/10 text-kui-warning",
      info: "bg-kui-info/10 text-kui-info",
      brand: "bg-kui-brand/10 text-kui-brand",
    },
  },

  defaultVariants: {
    status: "neutral",
  },
});

export const toastContentRecipe = defineRecipe({
  base: ["flex min-w-0 flex-1 flex-col", "gap-1", "py-0.5"].join(" "),
});

export const toastTitleRecipe = defineRecipe({
  base: [
    "text-sm font-semibold",
    "leading-5 tracking-[-0.01em]",
    "text-kui-text",
  ].join(" "),
});

export const toastDescriptionRecipe = defineRecipe({
  base: ["text-[13px] leading-5", "text-kui-text/70", "break-words"].join(" "),
});

export const toastActionRecipe = defineRecipe({
  base: [
    "shrink-0 self-center",
    "rounded-md",
    "px-2.5 py-1.5",
    "text-xs font-semibold",
    "text-kui-brand",
    "transition-colors duration-150",
    "hover:bg-kui-surface-raised",
    "active:opacity-70",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-kui-brand",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-kui-surface",
    "disabled:pointer-events-none disabled:opacity-50",
  ].join(" "),
});

export const toastCloseRecipe = defineRecipe({
  base: [
    "-me-1 -mt-1",
    "flex size-8 shrink-0",
    "items-center justify-center",
    "rounded-md",
    "text-kui-text/50",
    "transition-colors duration-150",
    "hover:bg-kui-surface-raised",
    "hover:text-kui-text",
    "active:opacity-70",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-kui-brand",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-kui-surface",
  ].join(" "),
});

export const toastRecipes = {
  Toast: toastRecipe,
  ToastViewport: toastViewportRecipe,
  ToastIcon: toastIconRecipe,
  ToastContent: toastContentRecipe,
  ToastTitle: toastTitleRecipe,
  ToastDescription: toastDescriptionRecipe,
  ToastAction: toastActionRecipe,
  ToastClose: toastCloseRecipe,
} as const;
