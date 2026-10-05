import { forwardRef } from "react";

import { cn } from "@/utils";
import { AdornmentProps } from "./Adornment.types";

export const Adornment = forwardRef<HTMLSpanElement, AdornmentProps>(
  ({ children, position, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        data-kui-adornment
        data-kui-adornment-position={position}
        className={cn(
          "flex shrink-0 items-center justify-center",
          position === "end" && "gap-1.5",
          className,
        )}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Adornment.displayName = "Adornment";
