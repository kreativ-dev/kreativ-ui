import { forwardRef } from "react";
import { cn } from "@/utils";
import { ButtonGroupTextProps } from "./ButtonGroup.types";

export const ButtonGroupText = forwardRef<
  HTMLSpanElement,
  ButtonGroupTextProps
>(({ className, children, ...rest }, ref) => {
  return (
    <span
      ref={ref}
      data-kui-button-group-text=""
      className={cn(
        "inline-flex items-center text-sm text-muted-foreground",
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
});

ButtonGroupText.displayName = "ButtonGroup.Text";
