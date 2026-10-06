import { defineRecipe } from "@splenddev/kreativ-core";

export const buttonBase =
  "inline-flex items-center justify-center " +
  "rounded-[var(--kui-button-radius,var(--kui-radius))] " +
  "font-medium " +
  "transition-[background-color,border-color,color,transform,opacity] " +
  "duration-200 " +
  "will-change-transform " +
  "focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-kui-brand " +
  "focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-surface " +
  "disabled:opacity-60 disabled:pointer-events-none disabled:active:scale-100";

export const buttonVariants = {
  solid: "ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.97]",
  soft: "ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.97]",
  outline: "border bg-transparent ease-out active:scale-[0.98]",
  ghost: "bg-transparent ease-out active:scale-[0.98]",
  link: "bg-transparent p-0 h-auto hover:underline ease-out",
} as const;

export const buttonColors = {
  brand: {
    solid: "bg-kui-brand text-kui-brand-fg hover:bg-kui-brand-hover",
    outline: "border-kui-brand text-kui-brand hover:bg-kui-brand/10",
    ghost: "text-kui-brand hover:bg-kui-brand/10",
    soft: "bg-kui-brand/10 text-kui-brand hover:bg-kui-brand/20",
    link: "text-kui-brand",
  },
  destructive: {
    solid: "bg-kui-destructive text-kui-destructive-fg hover:bg-kui-destructive-hover",
    outline: "border-kui-destructive text-kui-destructive hover:bg-kui-destructive/10",
    ghost: "text-kui-destructive hover:bg-kui-destructive/10",
    soft: "bg-kui-destructive/10 text-kui-destructive hover:bg-kui-destructive/20",
    link: "text-kui-destructive",
  },
  success: {
    solid: "bg-kui-success text-kui-success-fg hover:bg-kui-success-hover",
    outline: "border-kui-success text-kui-success hover:bg-kui-success/10",
    ghost: "text-kui-success hover:bg-kui-success/10",
    soft: "bg-kui-success/10 text-kui-success hover:bg-kui-success/20",
    link: "text-kui-success",
  },
  warning: {
    solid: "bg-kui-warning text-kui-warning-fg hover:bg-kui-warning-hover",
    outline: "border-kui-warning text-kui-warning hover:bg-kui-warning/10",
    ghost: "text-kui-warning hover:bg-kui-warning/10",
    soft: "bg-kui-warning/10 text-kui-warning hover:bg-kui-warning/20",
    link: "text-kui-warning",
  },
  info: {
    solid: "bg-kui-info text-kui-info-fg hover:bg-kui-info-hover",
    outline: "border-kui-info text-kui-info hover:bg-kui-info/10",
    ghost: "text-kui-info hover:bg-kui-info/10",
    soft: "bg-kui-info/10 text-kui-info hover:bg-kui-info/20",
    link: "text-kui-info",
  },
  white: {
    solid: "bg-white text-black hover:bg-gray-50",
    outline: "border-white/30 text-white hover:bg-white/10",
    ghost: "text-white hover:bg-white/10",
    soft: "bg-white/10 text-white hover:bg-white/20",
    link: "text-white",
  },
  neutral: {
    solid: "bg-kui-surface-raised text-kui-text hover:bg-kui-surface-sunken",
    outline: "border-kui-border text-kui-text hover:bg-kui-surface-raised",
    ghost: "text-kui-text hover:bg-kui-surface-raised",
    soft: "bg-kui-surface-raised text-kui-text hover:bg-kui-surface-sunken",
    link: "text-kui-text",
  },
  inherit: {
    solid:
      "[background-color:var(--kui-inherit-bg)] " +
      "[color:var(--kui-inherit-fg)]",

    outline:
      "[border-color:var(--kui-inherit-border)] " +
      "[color:var(--kui-inherit-fg)] " +
      "bg-transparent",

    ghost: "[color:var(--kui-inherit-fg)] " + "bg-transparent",

    soft:
      "[background-color:var(--kui-inherit-soft-bg)] " +
      "[color:var(--kui-inherit-fg)]",

    link: "[color:var(--kui-inherit-fg)] " + "bg-transparent",
  },
} as const;

const buildCompoundVariants = () => {
  const compounds: Array<{
    conditions: Record<string, string>;
    className: string;
  }> = [];

  for (const [color, variantMap] of Object.entries(buttonColors)) {
    for (const [variant, className] of Object.entries(variantMap)) {
      compounds.push({
        conditions: { color, variant },
        className,
      });
    }
  }

  return compounds;
};

export const buttonRecipe = defineRecipe({
  base: buttonBase,

  variants: {
    variant: buttonVariants,

    color: Object.fromEntries(
      Object.keys(buttonColors).map((color) => [color, ""]),
    ) as Record<string, string>,
  },

  defaultVariants: {
    variant: "solid",
    color: "brand",
  },

  compoundVariants: buildCompoundVariants(),
});
