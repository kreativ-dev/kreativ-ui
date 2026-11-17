import * as React from "react";
import { CarouselRoot, type CarouselRootProps } from "./Carousel.Root";
import { CarouselSlide, CarouselViewport } from "./Carousel.Viewport";
import {
  CarouselIndicators,
  CarouselNext,
  CarouselPlayPause,
  CarouselPrevious,
} from "./Carousel.controls";

export interface CarouselProps extends CarouselRootProps {
  /** Render Previous/Next. Default true. */
  controls?: boolean;
  /** Render Indicators. Default true. */
  indicators?: boolean;
  /** Render the play/pause control (only appears when `autoplay` is on). Default true. */
  playPause?: boolean;
  /** Where Previous/Next/PlayPause sit. Default "overlay". */
  controlsPlacement?: "overlay" | "inline";
  /** Where the dots sit. Default "below". */
  indicatorsPlacement?: "below" | "overlay";
}

const CarouselFlat = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      controls = true,
      indicators = true,
      playPause = true,
      controlsPlacement,
      indicatorsPlacement,
      children,
      ...rootProps
    },
    ref,
  ) => {
    const slides = React.Children.map(children, (child) =>
      React.isValidElement(child) && child.type === CarouselSlide ? (
        child
      ) : (
        <CarouselSlide>{child}</CarouselSlide>
      ),
    );
    return (
      <CarouselRoot ref={ref} {...rootProps}>
        <CarouselViewport>{slides}</CarouselViewport>
        {controls && (
          <>
            <CarouselPrevious placement={controlsPlacement} />
            <CarouselNext placement={controlsPlacement} />
          </>
        )}
        {playPause && <CarouselPlayPause placement={controlsPlacement} />}
        {indicators && <CarouselIndicators placement={indicatorsPlacement} />}
      </CarouselRoot>
    );
  },
);
CarouselFlat.displayName = "Carousel";

export const Carousel = Object.assign(CarouselFlat, {
  Root: CarouselRoot,
  Viewport: CarouselViewport,
  Slide: CarouselSlide,
  Previous: CarouselPrevious,
  Next: CarouselNext,
  PlayPause: CarouselPlayPause,
  Indicators: CarouselIndicators,
});
