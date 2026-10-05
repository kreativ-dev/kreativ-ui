import { Button } from "@/components/Button";
import { motion } from "framer-motion";
import { cn } from "@/utils";

import { useIndicator } from "./hooks/useIndicator";
import type { ThemeTogglerProps } from "./ThemeToggler.types";
import { ColorMode } from "@/types";

interface ButtonsModeProps extends Pick<
  ThemeTogglerProps,
  | "size"
  | "color"
  | "iconOnly"
  | "buttonProps"
  | "rounded"
  | "unstyled"
  | "className"
> {
  modes: {
    key: string;
    label: string;
    icon: React.ReactNode;
  }[];

  activeMode: string;

  onSelect: (key: ColorMode) => void;

  containerStyle: React.CSSProperties;

  isActive: (key: string) => boolean;

  orientation: "horizontal" | "vertical";

  indicatorClasses: string;

  indicatorRadius: string;

  buttonWidth: string;

  indicatorTransition: any;
}

export const ButtonsMode = ({
  size,
  color,
  iconOnly,
  buttonProps,
  rounded,
  unstyled,
  className,
  modes,
  activeMode,
  onSelect,
  containerStyle,
  isActive,
  orientation,
  indicatorClasses,
  indicatorRadius,
  buttonWidth,
  indicatorTransition,
}: ButtonsModeProps) => {
  const { groupRef, buttonRefs, indicatorRect } = useIndicator(activeMode, [
    size,
    orientation,
    iconOnly,
    unstyled,
    rounded,
  ]);

  const effectiveRounded =
    rounded && !(orientation === "vertical" && !iconOnly && !unstyled);

  const containerClasses = cn(
    "inline-flex gap-1",
    orientation === "vertical" && "flex-col",

    !unstyled && [
      "border border-border bg-surface p-1",
      effectiveRounded
        ? "rounded-full"
        : "rounded-[var(--kui-theme-toggler-radius)]",
    ],

    className,
  );

  const isVerticalIconOnly = orientation === "vertical" && iconOnly;

  const buttons = modes.map(({ key, label, icon }) => {
    const active = isActive(key);

    return (
      <div
        key={key}
        ref={(element) => {
          if (element) {
            buttonRefs.current.set(key, element);
          } else {
            buttonRefs.current.delete(key);
          }
        }}
        className={cn(
          "relative flex",
          orientation === "vertical" && "w-full",
          isVerticalIconOnly && "justify-start",
        )}
      >
        <Button
          size={size}
          variant="ghost"
          color={color}
          onClick={() => onSelect(key as ColorMode)}
          fullWidth={orientation === "vertical" && !iconOnly}
          className={cn(
            "relative z-10",
            "bg-transparent hover:bg-transparent",

            !effectiveRounded && "rounded-(--kui-theme-toggler-radius)",

            effectiveRounded && "rounded-full",

            active && "text-brand-fg",

            iconOnly && "aspect-square",

            buttonProps?.className,
          )}
          aria-pressed={active}
          leftIcon={icon}
          {...buttonProps}
        >
          {!iconOnly && label}
        </Button>
      </div>
    );
  });

  return (
    <div
      ref={groupRef}
      role="group"
      aria-label="Theme selector"
      className={cn(containerClasses, "relative")}
      style={containerStyle}
      data-kui-theme-toggler=""
      data-kui-display="buttons"
      data-kui-orientation={orientation}
    >
      {indicatorRect && (
        <motion.div
          data-kui-theme-transition="none"
          className={cn("pointer-events-none absolute z-0", indicatorClasses)}
          style={{
            borderRadius: effectiveRounded ? "999px" : indicatorRadius,
          }}
          initial={false}
          animate={{
            top: indicatorRect.top,
            left: indicatorRect.left,
            width: isVerticalIconOnly ? buttonWidth : indicatorRect.width,
            height: indicatorRect.height,
          }}
          transition={{ duration: 0 }}
          aria-hidden="true"
        />
      )}

      {buttons}
    </div>
  );
};
