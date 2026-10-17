"use client";

import { useEffect } from "react";

import {
  createComponent,
  isMotionGated,
  MotionGatedProps,
  useTheme,
} from "@splenddev/kreativ-core";
import { useSizeToken } from "@splenddev/kreativ-core/hooks";

import { resolveRecipe } from "@/theme/recipes/resolveRecipe";
import { defaultTransition } from "./ThemeToggler.constants";
import { CycleMode } from "./ThemeTogglerCycleMode";
import { ButtonsMode } from "./ThemeTogglerButtonsMode";
import type { ThemeTogglerProps } from "./ThemeToggler.types";
import { getModeIcons } from "./ThemeToggler.icons";

export const ThemeToggler = createComponent<
  ThemeTogglerProps & MotionGatedProps,
  HTMLElement
>({
  displayName: "ThemeToggler",
  __kui: {
    role: "action",
    skeleton: "preserve",
    video: {
      id: "theme-toggler",
      safe: true,
      acceptsChildren: false,
      interactionStates: ["hover", "pressed"],
      motionGated: true,
    },
  },
  render: (
    {
      variant = "ghost",
      color = "neutral",
      activeVariant = "solid",
      activeColor = "brand",
      size = "sm",
      iconOnly = false,
      allowSystem = false,
      orientation = "horizontal",
      rounded = false,
      unstyled = false,
      labels,
      icons,
      className,
      buttonProps = {},
      display = "buttons",
      animated = false,
      transition = defaultTransition,
      ...rest
    },
    _ref,
  ) => {
    const { mode, setMode, resolvedMode, theme } = useTheme();
    const motionGated = isMotionGated(rest);

    const resolvedSize = size;
    const wrapperRadius = useSizeToken(resolvedSize, "radius");
    const indicatorRadius = useSizeToken(resolvedSize, "radius", "4px");
    const buttonWidth = useSizeToken(resolvedSize, "width");

    const activeMode = allowSystem ? mode : resolvedMode;
    const modes = getModeIcons(allowSystem, labels, icons);
    const allowedModes = modes.map((item) => item.key);

    const currentMode = modes.find(({ key }) => key === activeMode) ?? modes[0];

    const indicatorClasses = resolveRecipe(theme.recipes.Button, {
      variant: activeVariant,
      color: activeColor,
    });

    const effectiveRounded =
      rounded && !(orientation === "vertical" && !iconOnly && !unstyled);

    useEffect(() => {
      if (!rounded || effectiveRounded) return;
      const reasons: string[] = [];
      if (orientation === "vertical" && !iconOnly) {
        reasons.push("orientation is vertical with iconOnly false");
      }
      if (unstyled) reasons.push("unstyled is true");
      if (reasons.length > 0) {
        console.warn(
          `[kreativ-ui/ThemeToggler]: rounded is ignored when ${reasons.join(" and ")}.`,
        );
      }
    }, [rounded, effectiveRounded, orientation, iconOnly, unstyled]);

    const handleCycle = () => {
      const index = allowedModes.indexOf(
        activeMode as (typeof allowedModes)[number],
      );
      setMode(allowedModes[(index + 1) % allowedModes.length]);
    };

    const isActive = (key: string) =>
      key === "system" ? mode === "system" : activeMode === key;

    const containerStyle = {
      ...(!effectiveRounded && {
        "--kui-theme-toggler-radius": wrapperRadius,
      }),
    } as React.CSSProperties;

    const indicatorTransition =
      animated && !motionGated
        ? { type: "spring", stiffness: 300, damping: 30, mass: 0.8 }
        : { duration: 0 };

    if (display === "cycle") {
      return (
        <CycleMode
          size={resolvedSize}
          variant={variant}
          color={color}
          iconOnly={iconOnly}
          buttonProps={buttonProps}
          animated={animated && !motionGated}
          transition={transition}
          rounded={effectiveRounded}
          currentMode={currentMode}
          onCycle={handleCycle}
        />
      );
    }

    return (
      <ButtonsMode
        size={resolvedSize}
        color={color}
        iconOnly={iconOnly}
        buttonProps={buttonProps}
        rounded={rounded}
        unstyled={unstyled}
        className={className}
        modes={modes}
        activeMode={activeMode}
        onSelect={setMode}
        containerStyle={containerStyle}
        isActive={isActive}
        orientation={orientation}
        indicatorClasses={indicatorClasses}
        indicatorRadius={indicatorRadius!}
        buttonWidth={buttonWidth!}
        indicatorTransition={indicatorTransition}
      />
    );
  },
});
