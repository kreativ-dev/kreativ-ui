import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { inputWrapperVariants } from "../Input/Input.styles";
import { ClearIcon } from "../Input/Input.icons";
import { useMultiSelectContext } from "./MultiSelect.context";
import {
  multiSelectSizeVariants,
  chipSizeVariants,
} from "./MultiSelect.styles";

function orderedEnabledValues(items: Map<string, { disabled?: boolean }>) {
  return [...items.entries()]
    .filter(([, meta]) => !meta.disabled)
    .map(([val]) => val);
}

export const MultiSelectTrigger = forwardRef<
  HTMLButtonElement,
  { className?: string }
>(({ className }, ref) => {
  const ctx = useMultiSelectContext("MultiSelectTrigger");
  const state = ctx.isInvalid ? "error" : ctx.isSuccess ? "success" : "none";
  const showClear = ctx.clearable && ctx.value.length > 0 && !ctx.disabled;
  const visible = ctx.maxVisibleChips
    ? ctx.value.slice(0, ctx.maxVisibleChips)
    : ctx.value;
  const overflow = ctx.value.length - visible.length;

  function move(delta: 1 | -1) {
    const order = orderedEnabledValues(ctx.items);
    if (!order.length) return;
    const i = ctx.activeValue ? order.indexOf(ctx.activeValue) : -1;
    ctx.setActiveValue(order[(i + delta + order.length) % order.length]);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        ctx.open ? move(1) : ctx.setOpen(true);
        break;
      case "ArrowUp":
        e.preventDefault();
        ctx.open ? move(-1) : ctx.setOpen(true);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (!ctx.open) ctx.setOpen(true);
        else if (ctx.activeValue) ctx.toggleValue(ctx.activeValue);
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

  return (
    <div
      ref={ctx.triggerRef}
      className={cn(
        inputWrapperVariants({
          variant: ctx.variant,
          state,
          fullWidth: true,
          disabled: ctx.disabled,
          rounded: ctx.rounded,
        }),
        multiSelectSizeVariants({}),
        "flex flex-wrap items-center gap-1",
        className,
      )}
    >
      <button
        ref={ref}
        type="button"
        id={ctx.triggerId}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={ctx.open}
        aria-controls={ctx.contentId}
        aria-invalid={ctx.isInvalid || undefined}
        aria-describedby={ctx.describedBy}
        aria-required={ctx.required || undefined}
        disabled={ctx.disabled}
        onClick={() => !ctx.disabled && ctx.setOpen(!ctx.open)}
        onKeyDown={handleKeyDown}
        className="flex flex-1 flex-wrap items-center gap-1 bg-transparent text-left outline-none cursor-pointer disabled:cursor-not-allowed"
      >
        {ctx.value.length === 0 && (
          <span className="text-text-muted">{ctx.placeholder}</span>
        )}
        {visible.map((v) => {
          const meta = ctx.items.get(v);
          return (
            <span
              key={v}
              className={cn(chipSizeVariants({}), "bg-brand/15 text-brand")}
            >
              {meta?.label ?? v}
              <span
                role="button"
                tabIndex={-1}
                aria-label={`Remove ${meta?.label ?? v}`}
                onClick={(e) => {
                  e.stopPropagation();
                  ctx.removeValue(v);
                }}
                className="hover:opacity-70"
              >
                <ClearIcon
                  size={ctx.size === "sm" ? 8 : ctx.size === "md" ? 10 : 12}
                />
              </span>
            </span>
          );
        })}
        {overflow > 0 && (
          <span
            className={cn(
              "text-text-muted",
              ctx.size === "sm"
                ? "text-[10px]"
                : ctx.size === "md"
                  ? "text-xs"
                  : "text-sm",
            )}
          >
            +{overflow} more
          </span>
        )}
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
          className="flex h-4 w-4 shrink-0 items-center justify-center text-text-muted transition-colors hover:text-text"
        >
          <ClearIcon size={14} />
        </button>
      )}
    </div>
  );
});

MultiSelectTrigger.displayName = "MultiSelectTrigger";
