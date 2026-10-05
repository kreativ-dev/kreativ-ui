"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

import { cn } from "@/utils/cn";

import { useSelectContext } from "./Select.context";

import type { SelectItemProps } from "./Select.types";

export function SelectItem({
  value,
  disabled = false,
  children,
  className,
  ...props
}: SelectItemProps) {
  const ctx = useSelectContext("SelectItem");

  const selected = ctx.value === value;
  const active = ctx.activeValue === value;

  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    return ctx.registerItem(value, {
      label: children,
      disabled,
    });
  }, [value, disabled, children]);

  useEffect(() => {
    if (active) {
      ref.current?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [active]);

  return (
    <div
      ref={ref}
      id={ctx.optionId(value)}
      role="option"
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      data-state={selected ? "selected" : undefined}
      data-active={active || undefined}
      data-disabled={disabled || undefined}
      onMouseEnter={() => {
        if (!disabled) {
          ctx.setActiveValue(value);
        }
      }}
      onClick={() => {
        if (!disabled) {
          ctx.onValueChange(value);
        }
      }}
      className={cn(
        "flex cursor-pointer items-center rounded-[calc(var(--kui-radii-md)-2px)] px-2.5 py-1.5 text-sm text-text transition-colors",
        selected && "bg-brand/10 text-brand hover:bg-brand/20",
        active && !selected && "bg-surface-sunken",
        disabled && "pointer-events-none cursor-not-allowed opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
