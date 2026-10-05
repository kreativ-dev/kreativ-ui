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
   * Controls the card's padding and overall density.
   */
  size?: CardSize;

  /**
   * Indicates that the card contains an image.
   */
  hasImage?: boolean;

  /**
   * Makes the card span the full available width.
   */
  fullWidth?: boolean;

  /**
   * Removes the card's default padding.
   */
  noPadding?: boolean;

  /**
   * Card content.
   */
  children?: ReactNode;
}

export interface CardHeaderProps extends ComponentPropsWithoutRef<"div"> {
  children?: ReactNode;
}

export interface CardBodyProps extends ComponentPropsWithoutRef<"div"> {
  children?: ReactNode;
}

export interface CardFooterProps extends ComponentPropsWithoutRef<"div"> {
  children?: ReactNode;
}
