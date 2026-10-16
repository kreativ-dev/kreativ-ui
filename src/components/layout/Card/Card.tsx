import type {
  CardBodyProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
} from "./Card.types";

import {
  createComponent,
  useTheme,
  useValidateChildren,
} from "@splenddev/kreativ-core";

import { CardOverlay } from "./Card.Overlay";
import { CardMedia } from "./Card.Media";

import { resolveRecipe } from "@/theme/recipes/resolveRecipe";
import { cn } from "@/utils";

const CardRoot = createComponent<CardProps, HTMLDivElement>({
  __kui: {
    role: "display",
    skeleton: "preserve",
  },
  displayName: "Card",
  render: (
    {
      variant = "outline",
      size = "md",
      fullWidth = false,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    useValidateChildren("Card", children);
    const { theme } = useTheme();

    return (
      <div
        ref={ref}
        className={cn(
          resolveRecipe(theme.recipes.Card, { variant, size, fullWidth }),
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
});

const CardHeader = createComponent<CardHeaderProps, HTMLDivElement>({
  __kui: {
    groupSlot: "Card",
  },
  displayName: "Card.Header",
  render: (
    { className, children, noPadding = false, size = "md", ...props },
    ref,
  ) => {
    const { theme } = useTheme();
    return (
      <div
        ref={ref}
        className={cn(
          resolveRecipe(theme.recipes.CardHeader, { size, noPadding }),
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
});

const CardBody = createComponent<CardBodyProps, HTMLDivElement>({
  __kui: {
    groupSlot: "Card",
  },
  displayName: "Card.Body",
  render: (
    { size = "md", noPadding = false, className, children, ...props },
    ref,
  ) => {
    const { theme } = useTheme();
    return (
      <div
        ref={ref}
        className={cn(
          resolveRecipe(theme.recipes.CardBody, { size, noPadding }),
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
});

const CardFooter = createComponent<CardFooterProps, HTMLDivElement>({
  __kui: {
    groupSlot: "Card",
  },
  displayName: "Card.Footer",
  render: (
    { size = "md", noPadding = false, className, children, ...props },
    ref,
  ) => {
    const { theme } = useTheme();
    return (
      <div
        ref={ref}
        className={cn(
          resolveRecipe(theme.recipes.CardFooter, { size, noPadding }),
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
});

const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
  Media: CardMedia,
  Overlay: CardOverlay,
});

export { Card };
