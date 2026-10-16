import { cn } from "@/utils";
import type { CardOverlayProps } from "./Card.types";

import { createComponent, useTheme } from "@splenddev/kreativ-core";
import { resolveRecipe } from "@/theme/recipes/resolveRecipe";


function withAlpha(color: string, alpha: number): string {
  // color-mix keeps this working for any CSS color (hex, named, var(), rgb())
  // without needing to parse/rewrite the color string ourselves.
  return `color-mix(in srgb, ${color} ${Math.round(alpha * 100)}%, transparent)`;
}

function resolveOverlayBackground(
  color: CardOverlayProps["color"],
  opacity: CardOverlayProps["opacity"],
  gradient: CardOverlayProps["gradient"],
): string | undefined {
  if (!color && opacity === undefined) return undefined;

  const resolvedColor = color ?? "currentColor";

  if (!gradient) {
    return resolvedColor;
  }

  const startOpacity = opacity ?? 1;
  const startColor =
    startOpacity === 1 ? resolvedColor : withAlpha(resolvedColor, startOpacity);

  if (typeof gradient === "object") {
    const position = gradient.position ?? "center";
    return `radial-gradient(circle at ${position}, ${startColor} 0%, transparent 100%)`;
  }

  const directionMap: Record<typeof gradient, string> = {
    top: "to top",
    bottom: "to bottom",
    left: "to left",
    right: "to right",
  };

  return `linear-gradient(${directionMap[gradient]}, ${startColor} 0%, transparent 100%)`;
}

export const CardOverlay = createComponent<CardOverlayProps, HTMLDivElement>({
  __kui: {
    groupSlot: "Card",
  },
  displayName: "Card.Overlay",
  render: (
    { color, opacity, blur, gradient, className, style, children, ...props },
    ref,
  ) => {
    const background = resolveOverlayBackground(color, opacity, gradient);
    const {theme}=useTheme()

    return (
      <div
        ref={ref}
        className={cn(resolveRecipe(theme.recipes.CardOverlay), className)}
        style={{
          ...(background !== undefined
            ? gradient
              ? { backgroundImage: background }
              : { backgroundColor: background }
            : null),
          ...(!gradient && opacity !== undefined ? { opacity } : null),
          ...(blur !== undefined
            ? {
                backdropFilter: `blur(${
                  typeof blur === "number" ? `${blur}px` : blur
                })`,
              }
            : null),
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
});