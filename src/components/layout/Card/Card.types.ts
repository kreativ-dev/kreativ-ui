import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type CardVariant =
  | "solid"
  | "outline"
  | "ghost"
  | "elevated"
  | "compact";

export type CardSize = "sm" | "md" | "lg";

export interface CardProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Visual style of the card.
   */
  variant?: CardVariant;

  /**
   * Controls each section's padding and overall density. Read by
   * Card.Header/Card.Body/Card.Footer, not applied by Card itself.
   */
  size?: CardSize;

  /**
   * Makes the card span the full available width.
   */
  fullWidth?: boolean;

  /**
   * Card content.
   */
  children?: ReactNode;
}

export interface CardHeaderProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Controls this section's padding. Defaults to the nearest Card's
   * `size`, settable per-section when it needs to differ.
   */
  size?: CardSize;

  /**
   * Removes this section's padding — for a section that should bleed,
   * independent of its siblings.
   */
  noPadding?: boolean;

  children?: ReactNode;
}

export interface CardBodyProps extends ComponentPropsWithoutRef<"div"> {
  size?: CardSize;
  noPadding?: boolean;
  children?: ReactNode;
}

export interface CardFooterProps extends ComponentPropsWithoutRef<"div"> {
  size?: CardSize;
  noPadding?: boolean;
  children?: ReactNode;
}

export type CardMediaFit = "cover" | "contain" | "fill" | "none";

export type CardMediaBlend =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten";

export interface CardMediaProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Image source, rendered by Media's internal `<img>`.
   */
  src: string;

  /**
   * Alt text for the internal `<img>`.
   */
  alt: string;

  /**
   * Controls how the image fills Media's box, mirroring `object-fit`.
   */
  fit?: CardMediaFit;

  /**
   * Blend mode applied to the image, mirroring `mix-blend-mode`.
   */
  blend?: CardMediaBlend;

  /**
   * Fixed aspect ratio for Media's box (e.g. `16 / 9`). Media is the
   * sizing context for the card's media area — content stacked inside it
   * (Card.Overlay, custom children) positions against this box.
   */
  aspectRatio?: number | string;

  /**
   * Content stacked on top of the image — Card.Overlay, text, controls.
   */
  children?: ReactNode;
}

export type CardOverlayGradientEdge = "top" | "bottom" | "left" | "right";

export interface CardOverlayRadialGradient {
  type: "radial";

  /**
   * CSS position for the radial's center (e.g. "center", "top left").
   * Defaults to "center".
   */
  position?: string;
}

export type CardOverlayGradient =
  | CardOverlayGradientEdge
  | CardOverlayRadialGradient;

export interface CardOverlayProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Scrim tint color drawn over the underlying layer. When `gradient` is
   * set, this is the gradient's solid stop color rather than a flat wash.
   */
  color?: string;

  /**
   * Opacity of the scrim tint, 0–1. When `gradient` is set, this is the
   * gradient's starting-stop opacity rather than a uniform multiply.
   */
  opacity?: number;

  /**
   * Blur applied over the composited layer beneath the overlay. Independent
   * of `gradient` — the two compose freely (a frosted panel that also
   * fades out).
   */
  blur?: number | string;

  /**
   * Fades `color` to transparent instead of painting a uniform flat wash —
   * either linear from a named edge, or radial from a position (default
   * "center").
   */
  gradient?: CardOverlayGradient;

  /**
   * Content rendered above the overlay (title, actions, etc.). Usable
   * inside Card.Media (over an image) or inside Card.Header/Body/Footer
   * (as a decorative background layer behind section content) — any of
   * these are a positioned ancestor Overlay can fill.
   */
  children?: ReactNode;
}
