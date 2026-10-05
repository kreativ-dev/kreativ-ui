"use client";

import { forwardRef } from "react";
import { useTheme } from "@/hooks/useTheme";
import { resolveResponsiveValue } from "@/utils/responsive";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import type { ContainerProps } from "./Container.types";
import type { ResponsiveStyles } from "@/types";
import { cn } from "@/utils";
import { ResponsiveStyle } from "@/components/internal/ResponsiveStyle";
import { resolveRecipe } from "@/theme/recipes/resolveRecipe";

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      maxWidth = "lg",
      padding,
      centered = true,
      as: Tag = "div",
      className,
      style,
      unstyled,
      children,
      ...rest
    },
    ref,
  ) => {
    const { theme } = useTheme();

    const recipeClassName = unstyled
      ? ""
      : resolveRecipe(theme.recipes.Container, { maxWidth });

    const responsiveStyles: ResponsiveStyles = {};
    if (padding !== undefined) {
      const { base, responsive } = resolveResponsiveValue(padding);
      if (base !== undefined) {
        responsiveStyles.base = { paddingInline: `var(--kui-spacing-${base})` };
      }
      for (const [bp, value] of Object.entries(responsive)) {
        responsiveStyles[bp] = { paddingInline: `var(--kui-spacing-${value})` };
      }
    }

    const { attribute, style: responsiveCss } =
      useResponsiveStyles(responsiveStyles);

    return (
      <>
        <ResponsiveStyle css={responsiveCss} />
        <Tag
          ref={ref}
          data-kui-responsive={attribute}
          className={cn(recipeClassName, centered && "mx-auto", className)}
          style={style}
          {...rest}
        >
          {children}
        </Tag>
      </>
    );
  },
);

Container.displayName = "Container";
