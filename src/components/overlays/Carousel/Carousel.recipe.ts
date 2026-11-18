import { defineRecipe } from "@splenddev/kreativ-core";

export const carouselRecipe = defineRecipe({
  base: "kui-carousel relative",
});

export const carouselTrackRecipe = defineRecipe({
  base: "kui-carousel-track flex",
});

export const carouselSlideRecipe = defineRecipe({
  base: "kui-carousel-slide min-w-0 shrink-0 grow-0",
});

export const carouselControlRecipe = defineRecipe({
  base: "kui-carousel-control",
  variants: {
    placement: { overlay: "", inline: "" },
    side: { previous: "", next: "", playPause: "" },
  },
  defaultVariants: { placement: "overlay" },
  compoundVariants: [
    {
      conditions: { placement: "overlay", side: "previous" },
      className: "absolute left-2 top-1/2 -translate-y-1/2 z-10",
    },
    {
      conditions: { placement: "overlay", side: "next" },
      className: "absolute right-2 top-1/2 -translate-y-1/2 z-10",
    },
    {
      conditions: { placement: "overlay", side: "playPause" },
      className: "absolute right-2 top-2 z-10",
    },
  ],
});

const indicatorTone =
  "bg-kui-border hover:bg-kui-text-muted data-[state=active]:bg-kui-brand";

const indicatorHit =
  "relative after:absolute after:-inset-2 after:content-['']";

export const carouselIndicatorsRecipe = defineRecipe({
  base: "kui-carousel-indicators flex items-center justify-center",
  variants: {
    variant: {
      dots: "gap-2",
      pill: "gap-2",
      bars: "gap-1.5",
      numbers: "gap-1",
      fraction: "text-sm tabular-nums text-kui-text-muted",
    },
    placement: {
      below: "mt-3",
      overlay: "absolute inset-x-0 bottom-3 z-10",
    },
  },
  defaultVariants: { variant: "dots", placement: "below" },
});

export const carouselIndicatorRecipe = defineRecipe({
  base: [
    "transition-all",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kui-brand",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
  ].join(" "),
  variants: {
    variant: {
      dots: `size-2 rounded-full ${indicatorTone} ${indicatorHit}`,
      pill: `h-2 w-2 rounded-full ${indicatorTone} ${indicatorHit} data-[state=active]:w-6`,
      bars: `h-1 w-6 rounded-full ${indicatorTone} ${indicatorHit}`,
      numbers: [
        "inline-flex size-7 items-center justify-center rounded-full text-xs tabular-nums",
        "text-kui-text-muted hover:bg-kui-surface-sunken",
        "data-[state=active]:bg-kui-brand data-[state=active]:text-kui-brand-fg",
      ].join(" "),
      fraction: "",
    },
  },
  defaultVariants: { variant: "dots" },
});

export const carouselRecipes = {
  Carousel: carouselRecipe,
  CarouselTrack: carouselTrackRecipe,
  CarouselSlide: carouselSlideRecipe,
  CarouselControl: carouselControlRecipe,
  CarouselIndicators: carouselIndicatorsRecipe,
  CarouselIndicator: carouselIndicatorRecipe,
};
