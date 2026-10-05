// ThemeToggler.tsx
import { useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useSizeToken } from "@/hooks";
import { resolveRecipe } from "@/theme/recipes/resolveRecipe";
import { defaultTransition } from "./ThemeToggler.constants";
import { CycleMode } from "./ThemeTogglerCycleMode";
import { ButtonsMode } from "./ThemeTogglerButtonsMode";
import type { ThemeTogglerProps } from "./ThemeToggler.types";
import { getModeIcons } from "./ThemeToggler.icons";

export function ThemeToggler({
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
}: ThemeTogglerProps) {
  const { mode, setMode, resolvedMode, theme } = useTheme();

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
      reasons.push("orientation='vertical' with iconOnly={false}");
    }
    if (unstyled) reasons.push("unstyled={true}");
    if (reasons.length > 0) {
      console.warn(
        `[kreativ-ui/ThemeToggler] \`rounded\` is ignored when ${reasons.join(" and ")}.`,
      );
    }
  }, [rounded, effectiveRounded, orientation, iconOnly, unstyled]);

  const handleCycle = () => {
    const index = allowedModes.indexOf(activeMode as any);
    setMode(allowedModes[(index + 1) % allowedModes.length]);
  };

  const isActive = (key: string) =>
    key === "system" ? mode === "system" : activeMode === key;

  const containerStyle = {
    ...(!effectiveRounded && {
      "--kui-theme-toggler-radius": wrapperRadius,
    }),
  } as React.CSSProperties;

  const indicatorTransition = animated
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
        animated={animated}
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
}
