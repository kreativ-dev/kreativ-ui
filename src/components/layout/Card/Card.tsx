import type {
  CardBodyProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
} from "./Card.types";

import { cn } from "@/utils/cn";

const cardVariants: Record<NonNullable<CardProps["variant"]>, string> = {
  solid: "bg-surface",
  outline: "border border-border bg-surface",
  ghost: "bg-transparent",
  elevated: "bg-surface shadow-md",
  compact: "bg-surface",
};

const cardSizes: Record<NonNullable<CardProps["size"]>, string> = {
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

function Card({
  variant = "outline",
  size = "md",
  hasImage = false,
  fullWidth = false,
  noPadding = false,
  className,
  children,
  ...props
}: CardProps) {
  const basePadding =
    variant === "compact" ? "p-3" : hasImage ? "p-0" : cardSizes[size];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-(--kui-radii-lg)",
        cardVariants[variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      <div className={cn(!noPadding && basePadding)}>{children}</div>
    </div>
  );
}

function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-(--kui-spacing-md)",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CardBody({ className, children, ...props }: CardBodyProps) {
  return (
    <div className={cn("min-w-0", className)} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div
      className={cn("flex items-center gap-(--kui-spacing-md)", className)}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export { Card };
