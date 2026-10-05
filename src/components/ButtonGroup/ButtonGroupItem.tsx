"use client";

import { forwardRef } from "react";

import { cn } from "@/utils/cn";

import {
  ButtonGroupItemContext,
  useButtonGroupContext,
} from "./ButtonGroup.context";

import type { ButtonGroupItemProps } from "./ButtonGroup.types";

export const ButtonGroupItem = forwardRef<HTMLDivElement, ButtonGroupItemProps>(
  ({ className, children, ...props }, ref) => {
    const { orientation, attached } = useButtonGroupContext();

    return (
      <ButtonGroupItemContext.Provider value={{ embedded: true }}>
        <div
          ref={ref}
          data-kui-button-group-item="true"
          data-orientation={orientation}
          data-attached={attached || undefined}
          className={cn(
            "relative flex min-w-0 items-center",
            "transition-[background-color,box-shadow]",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </ButtonGroupItemContext.Provider>
    );
  },
);

ButtonGroupItem.displayName = "ButtonGroup.Item";
