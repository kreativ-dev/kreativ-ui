import { forwardRef } from "react";
import { useButtonGroupContext } from "./ButtonGroup.context";
import { ButtonGroupSeparatorProps } from "./ButtonGroup.types";
import { cn } from "@/utils";

export const ButtonGroupSeparator = forwardRef<
  HTMLDivElement,
  ButtonGroupSeparatorProps
>(({ orientation: explicitOrientation, className, ...rest }, ref) => {
  const context = useButtonGroupContext();

  const orientation =
    explicitOrientation ?? context?.orientation ?? "horizontal";


  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      data-kui-button-group-separator=""
      data-orientation={orientation}
      className={cn(
        "bg-border",
        className,
      )}
      {...rest}
    />
  );
});

ButtonGroupSeparator.displayName = "ButtonGroup.Separator";