"use client";

import { type CSSProperties, forwardRef, useMemo } from "react";
import { cn } from "@/utils/cn";
import { useTheme } from "@/hooks/useTheme";
import { resolveRecipe } from "@/theme/recipes/resolveRecipe";
import { ButtonGroupContext } from "./ButtonGroup.context";
import type { ButtonGroupProps } from "./ButtonGroup.types";
import { ButtonGroupSeparator } from "./ButtonGroupSeparator";
import { ButtonGroupText } from "./ButtonGroupText";
import { ButtonGroupLabel } from "./ButtonGroupLabel";
import { useSizeToken } from "@/hooks";
import { ButtonGroupItem } from "./ButtonGroupItem";

const ButtonGroupRoot = forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      orientation = "horizontal",
      attached = false,
      spacing = "md",
      className,
      children,
      size,
      ...rest
    },
    ref,
  ) => {
    const { theme } = useTheme();

    const recipeClasses = resolveRecipe(theme.recipes.ButtonGroup, {
      orientation,
      attached,
      spacing,
    });

    const contextValue = useMemo(
      () => ({
        orientation,
        attached,
        spacing,
        size,
      }),
      [orientation, attached, spacing, size],
    );

    const separatorSizeToken = useSizeToken(size as string, "separatorSize");
    return (
      <ButtonGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="group"
          data-kui-button-group=""
          data-orientation={orientation}
          data-attached={attached || undefined}
          className={cn(
            recipeClasses,
            className,
          )}
          style={
            {
              "--kui-button-group-separator-size": separatorSizeToken,
            } as CSSProperties
          }
          {...rest}
        >
          {children}
        </div>
      </ButtonGroupContext.Provider>
    );
  },
);

ButtonGroupRoot.displayName = "ButtonGroup";

export const ButtonGroup = Object.assign(ButtonGroupRoot, {
  Separator: ButtonGroupSeparator,
  Text: ButtonGroupText,
  Label: ButtonGroupLabel,
  Item: ButtonGroupItem,
});

ButtonGroup.displayName = "ButtonGroup";
