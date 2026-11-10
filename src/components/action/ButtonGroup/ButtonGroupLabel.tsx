import { forwardRef } from "react";
import { cn } from "@/utils";
import { ButtonGroupLabelProps } from "./ButtonGroup.types";

export const ButtonGroupLabel = forwardRef<
  HTMLSpanElement,
  ButtonGroupLabelProps
>(({ className, children, ...rest }, ref) => {
  return (
    <span
      ref={ref}
      data-kui-button-group-label=""
      className={cn("text-sm font-medium text-foreground", className)}
      {...rest}
    >
      {children}
    </span>
  );
});

ButtonGroupLabel.displayName = "ButtonGroup.Label";
