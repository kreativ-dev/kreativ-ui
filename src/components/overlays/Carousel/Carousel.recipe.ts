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

export const carouselIndicatorsRecipe = defineRecipe({
  base: "kui-carousel-indicators flex items-center justify-center gap-2",
  variants: {
    placement: {
      below: "mt-3",
      overlay: "absolute inset-x-0 bottom-3 z-10",
    },
  },
  defaultVariants: { placement: "below" },
});

export const carouselIndicatorRecipe = defineRecipe({
  base: [
    "size-2 rounded-full bg-kui-border transition-colors",
    "hover:bg-kui-text-muted data-[state=active]:bg-kui-brand",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kui-brand",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
  ].join(" "),
});

export const carouselRecipes = {
  Carousel: carouselRecipe,
  CarouselTrack: carouselTrackRecipe,
  CarouselSlide: carouselSlideRecipe,
  CarouselControl: carouselControlRecipe,
  CarouselIndicators: carouselIndicatorsRecipe,
  CarouselIndicator: carouselIndicatorRecipe,
};