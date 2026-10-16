import { defineRecipe } from "@splenddev/kreativ-core";

export const cardRecipe = defineRecipe({
  base: "overflow-hidden rounded-(--kui-radii-lg)",
  variants: {
    variant: {
      solid: "bg-kui-surface",
      outline: "border border-kui-border bg-kui-surface",
      ghost: "bg-transparent",
      elevated: "bg-kui-surface shadow-md",
      compact: "bg-kui-surface",
    },
    fullWidth: {
      true: "w-full",
    },
  },
  defaultVariants: {
    variant: "outline",
  },
});

const sectionPaddingVariants = {
  size: {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  },
} as const;

const sectionPaddingCompoundVariants = [
  {
    conditions: { variant: "compact" },
    className: "p-3",
  },
  {
    conditions: { noPadding: true },
    className: "p-0",
  },
] as const;

export const cardHeaderRecipe = defineRecipe({
  base: "relative flex items-center justify-between gap-(--kui-spacing-md)",
  variants: sectionPaddingVariants,
  defaultVariants: {
    size: "md",
  },
  compoundVariants: [...sectionPaddingCompoundVariants],
});

export const cardBodyRecipe = defineRecipe({
  base: "relative min-w-0",
  variants: sectionPaddingVariants,
  defaultVariants: {
    size: "md",
  },
  compoundVariants: [...sectionPaddingCompoundVariants],
});

export const cardFooterRecipe = defineRecipe({
  base: "relative flex items-center gap-(--kui-spacing-md)",
  variants: sectionPaddingVariants,
  defaultVariants: {
    size: "md",
  },
  compoundVariants: [...sectionPaddingCompoundVariants],
});

export const cardMediaRecipe = defineRecipe({
  base: "relative overflow-hidden",
});

export const cardMediaImageRecipe = defineRecipe({
  base: "h-full w-full",
  variants: {
    fit: {
      cover: "object-cover",
      contain: "object-contain",
      fill: "object-fill",
      none: "object-none",
    },
    blend: {
      normal: "mix-blend-normal",
      multiply: "mix-blend-multiply",
      screen: "mix-blend-screen",
      overlay: "mix-blend-overlay",
      darken: "mix-blend-darken",
      lighten: "mix-blend-lighten",
    },
  },
  defaultVariants: {
    fit: "cover",
    blend: "normal",
  },
});

export const cardOverlayRecipe = defineRecipe({
  base: "absolute inset-0",
});
