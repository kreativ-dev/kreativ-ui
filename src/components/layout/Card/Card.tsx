import { cn } from "@/utils";
import type {
  CardBodyProps,
  CardFooterProps,
  CardHeaderProps,
  // CardMediaBlend,
  // CardMediaFit,
  // CardMediaProps,
  // CardOverlayProps,
  CardProps,
} from "./Card.types";

import {
  createComponent,
  // useValidateChildren,
} from "@splenddev/kreativ-core";

const cardVariants: Record<NonNullable<CardProps["variant"]>, string> = {
  solid: "bg-kui-surface",
  outline: "border border-kui-border bg-kui-surface",
  ghost: "bg-transparent",
  elevated: "bg-kui-surface shadow-md",
  compact: "bg-kui-surface",
};

const cardSizes: Record<NonNullable<CardProps["size"]>, string> = {
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

// const mediaFitClasses: Record<CardMediaFit, string> = {
//   cover: "object-cover",
//   contain: "object-contain",
//   fill: "object-fill",
//   none: "object-none",
// };

// const mediaBlendClasses: Record<CardMediaBlend, string> = {
//   normal: "mix-blend-normal",
//   multiply: "mix-blend-multiply",
//   screen: "mix-blend-screen",
//   overlay: "mix-blend-overlay",
//   darken: "mix-blend-darken",
//   lighten: "mix-blend-lighten",
// };

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
      hasImage = false,
      fullWidth = false,
      noPadding = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const basePadding =
      variant === "compact" ? "p-3" : hasImage ? "p-0" : cardSizes[size];

    return (
      <div
        ref={ref}
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
  },
});

const CardHeader = createComponent<CardHeaderProps, HTMLDivElement>({
  __kui: {
    groupSlot: "Card",
  },
  displayName: "Card.Header",
  render: ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between gap-(--kui-spacing-md)",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
});

const CardBody = createComponent<CardBodyProps, HTMLDivElement>({
  __kui: {
    groupSlot: "Card",
  },
  displayName: "Card.Body",
  render: ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("min-w-0", className)} {...props}>
      {children}
    </div>
  ),
});

const CardFooter = createComponent<CardFooterProps, HTMLDivElement>({
  __kui: {
    groupSlot: "Card",
  },
  displayName: "Card.Footer",
  render: ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-(--kui-spacing-md)", className)}
      {...props}
    >
      {children}
    </div>
  ),
});

// const CardMedia = createComponent<CardMediaProps, HTMLImageElement>({
//   __kui: {
//     groupSlot: "Card",
//   },
//   displayName: "Card.Media",
//   render: (
//     {
//       fit = "cover",
//       blend = "normal",
//       aspectRatio,
//       className,
//       style,
//       ...props
//     },
//     ref,
//   ) => (
//     <img
//       ref={ref}
//       className={cn(
//         "h-full w-full",
//         mediaFitClasses[fit],
//         mediaBlendClasses[blend],
//         className,
//       )}
//       style={{
//         ...(aspectRatio !== undefined ? { aspectRatio } : null),
//         ...style,
//       }}
//       {...props}
//     />
//   ),
// });

// const CardOverlay = createComponent<CardOverlayProps, HTMLDivElement>({
//   __kui: {
//     groupSlot: "Card",
//   },
//   displayName: "Card.Overlay",
//   render: (
//     { color, opacity, blur, className, style, children, ...props },
//     ref,
//   ) => (
//     <div
//       ref={ref}
//       className={cn("absolute inset-0", className)}
//       style={{
//         ...(color !== undefined ? { backgroundColor: color } : null),
//         ...(opacity !== undefined ? { opacity } : null),
//         ...(blur !== undefined
//           ? {
//               backdropFilter: `blur(${
//                 typeof blur === "number" ? `${blur}px` : blur
//               })`,
//             }
//           : null),
//         ...style,
//       }}
//       {...props}
//     >
//       {children}
//     </div>
//   ),
// });

const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
  // Media: CardMedia,
  // Overlay: CardOverlay,
});

export { Card };
