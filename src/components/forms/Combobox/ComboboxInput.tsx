"use client";

import { forwardRef, useEffect } from "react";
import { useComboboxContext } from "./Combobox.context";
import { ComboboxInputProps } from "./Combobox.types";
import { Input } from "../Input";

function orderedFilteredValues(
  ctx: ReturnType<typeof useComboboxContext>,
  query: string,
) {
  const q = query.trim().toLowerCase();
  return [...ctx.items.entries()]
    .filter(([, meta]) => !meta.disabled)
    .filter(([, meta]) => !q || String(meta.label).toLowerCase().includes(q))
    .map(([val]) => val);
}

export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  (
    {
      variant = "outline",
      size = "md",
      placeholder,
      clearable = false,
      allowFreeText = false,
      className,
      rounded,
      ...props
    },
    ref,
  ) => {
    const ctx = useComboboxContext("ComboboxInput");
    const showClear = clearable && ctx?.inputValue?.length > 0 && !ctx.disabled;

    useEffect(() => {
      if (ctx.value === undefined) return;

      const meta = ctx.items.get(ctx.value);
      if (meta && !ctx.open) {
        ctx.setInputValue(String(meta.label));
      }
    }, [ctx.value, ctx.open, ctx.items]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      ctx.setInputValue(e.target.value);
      if (!ctx.open) ctx.setOpen(true);
      ctx.setActiveValue(undefined);
      if (allowFreeText) ctx.onValueChange(e.target.value || undefined);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      const order = orderedFilteredValues(ctx, ctx.inputValue);
      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          if (!ctx.open) {
            ctx.setOpen(true);
            return;
          }
          const i = ctx.activeValue ? order.indexOf(ctx.activeValue) : -1;
          ctx.setActiveValue(order[(i + 1) % order.length]);
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          if (!ctx.open) {
            ctx.setOpen(true);
            return;
          }
          const i = ctx.activeValue ? order.indexOf(ctx.activeValue) : -1;
          ctx.setActiveValue(order[(i - 1 + order.length) % order.length]);
          break;
        }
        case "Enter":
          e.preventDefault();
          if (ctx.activeValue !== undefined) ctx.onValueChange(ctx.activeValue);
          else if (allowFreeText) ctx.setOpen(false);
          break;
        case "Escape":
          if (ctx.open) {
            e.preventDefault();
            ctx.setOpen(false);
          }
          break;
        default:
          break;
      }
    }

    function handleBlur() {
      if (!allowFreeText && ctx.value === undefined) ctx.setInputValue("");
      setTimeout(() => ctx.setOpen(false), 120);
    }

    return (
      <>
        <Input
          ref={(node) => {
            (
              ctx.triggerRef as React.RefObject<HTMLInputElement | null>
            ).current = node;
            if (typeof ref === "function") ref(node);
            else if (ref)
              (ref as React.RefObject<HTMLInputElement | null>).current = node;
          }}
          id={ctx.triggerId}
          role="combobox"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-expanded={ctx.open}
          aria-controls={ctx.contentId}
          aria-activedescendant={
            ctx.open && ctx.activeValue
              ? ctx.optionId(ctx.activeValue)
              : undefined
          }
          variant={variant}
          size={size}
          className={className}
          aria-invalid={ctx.isInvalid || undefined}
          aria-describedby={ctx.describedBy}
          disabled={ctx.disabled}
          value={ctx.inputValue}
          placeholder={placeholder}
          defaultValue={ctx.defaultValue}
          onChange={handleChange}
          onFocus={() => ctx.setOpen(true)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          error={ctx.isInvalid}
          success={ctx.isSuccess}
          warning={ctx.isWarning}
          clearable={showClear}
          data-state={ctx.open ? "open" : "closed"}
          {...props}
        />
      </>
    );
  },
);

ComboboxInput.displayName = "ComboboxInput";
