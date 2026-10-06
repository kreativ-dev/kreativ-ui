"use client";

import { forwardRef, type ReactNode } from "react";

import { cn } from "@/utils/cn";
import { resolveRecipe } from "@/theme/recipes/resolveRecipe";

import type { ButtonProps } from "./Button.types";
import { ResponsiveStyle } from "../internal/ResponsiveStyle";
import { useOptionalButtonGroupContext } from "../ButtonGroup";
import { useTheme } from "@splenddev/kreativ-core";
import { useResponsiveStyles, useSizeStyle, useSizeToken, useTypography } from "@splenddev/kreativ-core/hooks";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "solid",
      color = "brand",
      size,
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled = false,
      typography: typographyName = "body",
      className,
      style,
      iconOnly,
      children,
      render,
      ...rest
    },
    ref,
  ) => {
    const { theme } = useTheme();
    const typography = useTypography(typographyName);
    const group = useOptionalButtonGroupContext();

    const resolvedSize = size ?? group?.size ?? "md";

    const { style: sizeStyle, responsiveStyles } = useSizeStyle
    (
      resolvedSize,
      iconOnly,
      "button",
    );

    const { attribute: responsiveAttribute, style: responsiveCss } =
      useResponsiveStyles(responsiveStyles);

    const iconSize = useSizeToken(resolvedSize, "iconSize");

    const isDisabled = disabled || isLoading;
    const isInButtonGroup = !!group;

    const recipeClasses = resolveRecipe(theme.recipes.Button, {
      variant,
      color,
    });

    const resolvedClassName = cn(
      recipeClasses,
      fullWidth && "w-full",
      isLoading && "opacity-90 pointer-events-none",
      className,
    );

    const resolvedStyle = {
      ...typography,
      ...sizeStyle,
      ...style,
    };

    const groupDataAttributes = {
      "data-kui-button-group-item": isInButtonGroup || undefined,
      "data-kui-group-attached": group?.attached || undefined,
      "data-kui-group-orientation": group?.orientation || undefined,
    };

    const content: ReactNode = (
      <>
        {isLoading && (
          <span
            className="animate-kui-spin rounded-full border-2 border-current border-t-transparent"
            style={{
              width: iconSize,
              height: iconSize,
            }}
            aria-hidden="true"
          />
        )}

        {!isLoading && leftIcon && (
          <span
            className="inline-flex shrink-0 items-center justify-center"
            style={{
              width: iconSize,
              height: iconSize,
            }}
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        )}

        {iconOnly && isLoading ? null : children}

        {!isLoading && rightIcon && (
          <span
            className="inline-flex shrink-0 items-center justify-center"
            style={{
              width: iconSize,
              height: iconSize,
            }}
            aria-hidden="true"
          >
            {rightIcon}
          </span>
        )}
      </>
    );

    const buttonElement = render ? (
      render({
        ...rest,
        className: resolvedClassName,
        style: resolvedStyle,
        disabled: isDisabled,
        "aria-disabled": isDisabled || undefined,
        "aria-busy": isLoading || undefined,
        "data-kui-responsive": responsiveAttribute,
        children: content,
      })
    ) : (
      <button
        ref={ref}
        disabled={isDisabled}
        className={resolvedClassName}
        style={resolvedStyle}
        aria-busy={isLoading || undefined}
        aria-disabled={isDisabled || undefined}
        data-kui-themeable
        data-kui-responsive={responsiveAttribute}
        type="button"
        {...groupDataAttributes}
        {...rest}
      >
        {content}
      </button>
    );

    return (
      <>
        {responsiveCss && <ResponsiveStyle css={responsiveCss} />}
        {buttonElement}
      </>
    );
  },
);

Button.displayName = "Button";
