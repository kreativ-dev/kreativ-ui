// CycleMode.tsx
import { Button } from "@/components/Button";
import { motion } from "framer-motion";
import { cn } from "@/utils";
import type { ThemeTogglerProps } from "./ThemeToggler.types";
import { getIconVariants } from "./ThemeToggler.constants";

interface CycleModeProps extends Pick<
  ThemeTogglerProps,
  | "size"
  | "variant"
  | "color"
  | "iconOnly"
  | "buttonProps"
  | "animated"
  | "transition"
  | "rounded"
> {
  currentMode: { key: string; label: string; icon: React.ReactNode };
  onCycle: () => void;
}

export const CycleMode = ({
  size,
  variant,
  color,
  iconOnly,
  buttonProps,
  animated,
  transition = { type: "none" },
  rounded,
  currentMode,
  onCycle,
}: CycleModeProps) => {
  const animateIcon = animated && transition.type !== "none";
  const iconVariants = getIconVariants(transition.type ?? "none");
  const motionTransition = {
    duration: (transition.duration ?? 300) / 1000,
    delay: (transition.delay ?? 0) / 1000,
    ease: transition.easing as any,
  };

  return (
    <Button
      size={size}
      variant={variant}
      color={color}
      onClick={onCycle}
      aria-label={`Current theme: ${currentMode.label}`}
      className={cn(rounded && "rounded-full", "py-5 overflow-hidden", buttonProps?.className)}
      {...buttonProps}
    >
      <motion.span
        key={currentMode.key}
        initial={animateIcon ? iconVariants.initial : undefined}
        animate={animateIcon ? iconVariants.animate : undefined}
        exit={animateIcon ? iconVariants.exit : undefined}
        transition={motionTransition}
      >
        {currentMode.icon}
      </motion.span>
      {!iconOnly && currentMode.label}
    </Button>
  );
};
