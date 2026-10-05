"use client";

import { forwardRef, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";
import { ClearIcon } from "../Input/Input.icons";
import { useSelectContext } from "./Select.context";
import type { SelectTriggerProps } from "./Select.types";
import { useSizeStyle, useTheme } from "@/hooks";
import { resolveRecipe } from "@/theme/recipes/resolveRecipe";

function orderedEnabledValues(
  items: Map<string, { label: React.ReactNode; disabled?: boolean }>,
) {
  return [...items.entries()]
    .filter(([, meta]) => !meta.disabled)
    .map(([value]) => value);
}

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, onKeyDown, ...props }, ref) => {
    const ctx = useSelectContext("SelectTrigger");

    const { theme } = useTheme();
    const { style: sizeStyle, iconSize } = useSizeStyle(
      ctx.size,
      false,
      "select",
    );

    const state = ctx.isInvalid ? "error" : ctx.isSuccess ? "success" : "none";

    const wrapperClasses = cn(
      resolveRecipe(theme.recipes.FormControl, {
        variant: ctx.variant,
        state,
        rounded: Boolean(ctx.rounded),
        fullWidth: true,
        disabled: ctx.disabled,
        hasAdornment: true,
      }),
      className,
    );
    const showClear = ctx.clearable && ctx.value !== undefined && !ctx.disabled;

    const move = useCallback(
      (delta: 1 | -1) => {
        const values = orderedEnabledValues(ctx.items);
        if (!values.length) return;
        const currentIndex = ctx.activeValue
          ? values.indexOf(ctx.activeValue)
          : -1;
        const nextIndex =
          currentIndex === -1
            ? delta === 1
              ? 0
              : values.length - 1
            : (currentIndex + delta + values.length) % values.length;
        ctx.setActiveValue(values[nextIndex]);
      },
      [ctx],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;

        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            if (!ctx.open) ctx.setOpen(true);
            else move(1);
            break;
          case "ArrowUp":
            e.preventDefault();
            if (!ctx.open) ctx.setOpen(true);
            else move(-1);
            break;
          case "Home": {
            if (!ctx.open) break;
            e.preventDefault();
            const values = orderedEnabledValues(ctx.items);
            if (values.length) ctx.setActiveValue(values[0]);
            break;
          }
          case "End": {
            if (!ctx.open) break;
            e.preventDefault();
            const values = orderedEnabledValues(ctx.items);
            if (values.length) ctx.setActiveValue(values[values.length - 1]);
            break;
          }
          case "Enter":
          case " ":
            e.preventDefault();
            if (!ctx.open) ctx.setOpen(true);
            else if (ctx.activeValue !== undefined)
              ctx.onValueChange(ctx.activeValue);
            break;
          case "Escape":
            if (ctx.open) {
              e.preventDefault();
              ctx.setOpen(false);
            }
            break;
          case "Backspace":
          case "Delete":
            if (ctx.clearable && ctx.value !== undefined && !ctx.open) {
              e.preventDefault();
              ctx.onClear();
            }
            break;
          default:
            break;
        }
      },
      [ctx, move, onKeyDown],
    );

    return (
      <div ref={ctx.triggerRef} className={wrapperClasses} style={sizeStyle}>
        <button
          ref={ref}
          type="button"
          id={ctx.triggerId}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={ctx.open}
          aria-labelledby={ctx.labelId}
          aria-controls={ctx.contentId}
          aria-activedescendant={
            ctx.open && ctx.activeValue
              ? ctx.optionId(ctx.activeValue)
              : undefined
          }
          tabIndex={ctx.tabIndex}
          aria-invalid={ctx.isInvalid || undefined}
          aria-describedby={ctx.describedBy}
          aria-required={ctx.required || undefined}
          disabled={ctx.disabled}
          data-state={ctx.open ? "open" : "closed"}
          onClick={() => !ctx.disabled && ctx.setOpen(!ctx.open)}
          onKeyDown={handleKeyDown}
          className="relative min-w-0 flex-1 bg-transparent cursor-pointer text-left outline-none disabled:cursor-not-allowed h-full"
          {...props}
        >
          {children}
          <span
            aria-hidden
            className="pointer-events-none absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-1.5 text-text-muted"
          >
            <ChevronDown
              size={14}
              className={cn(
                "transition-transform duration-200",
                ctx.open && "rotate-180",
              )}
            />
          </span>
        </button>

        {showClear && (
          <button
            type="button"
            tabIndex={-1}
            aria-label="Clear selection"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              ctx.onClear();
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="flex h-4 w-4 items-center justify-center text-text-muted transition-colors hover:text-text"
          >
            <ClearIcon size={Number(iconSize) || 14} />
          </button>
        )}
      </div>
    );
  },
);

SelectTrigger.displayName = "SelectTrigger";
