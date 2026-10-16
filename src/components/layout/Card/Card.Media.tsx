import type { CardMediaProps } from "./Card.types";

import {  createComponent, useTheme,  } from "@splenddev/kreativ-core";

import { cn } from "@/utils";
import { resolveRecipe } from "@/theme/recipes/resolveRecipe";

export const CardMedia = createComponent<CardMediaProps, HTMLDivElement>({
  __kui: {
    groupSlot: "Card",
  },
  displayName: "Card.Media",
  render: (
    {
      src,
      alt,
      fit = "cover",
      blend = "normal",
      aspectRatio,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const {theme} = useTheme()
    return(
    <div
      ref={ref}
      className={cn(resolveRecipe(theme.recipes.CardMedia), className)}
      style={{
        ...(aspectRatio !== undefined ? { aspectRatio } : null),
        ...style,
      }}
      {...props}
    >
      <img
        src={src}
        alt={alt}
        className={resolveRecipe(theme.recipes.CardMediaImage, { fit, blend })}
      />
      {children}
    </div>
  )},
});
