"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/utils/cn";
import { useComboboxContext } from "./Combobox.context";
import type { ComboboxItemProps } from "./Combobox.types";

export function ComboboxItem({
  value,
  disabled = false,
  children,
  className,
}: ComboboxItemProps) {
  const ctx = useComboboxContext("ComboboxItem");
  const ref = useRef<HTMLDivElement>(null);
  const active = ctx.activeValue === value;
  const selected = ctx.value === value;

  useEffect(
    () => ctx.registerItem(value, { label: children, disabled, visible: true }),
    [value, disabled, children],
  );
  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const query = ctx.inputValue.trim().toLowerCase();

  const matches = !query || String(children).toLowerCase().includes(query);

  useEffect(() => {
    ctx.setItemVisibility(value, matches);
  }, [matches, value]);

  if (!matches) return null;

  return (
    <div
      ref={ref}
      id={ctx.optionId(value)}
      role="option"
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      onMouseEnter={() => !disabled && ctx.setActiveValue(value)}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => !disabled && ctx.onValueChange(value)}
      className={cn(
        "flex cursor-pointer items-center rounded-[calc(var(--kui-radii-md)-2px)] px-2.5 py-1.5 text-sm text-text transition-colors",
        active && "bg-brand/15 text-brand",
        selected && !active && "bg-surface-raised",
        disabled && "pointer-events-none cursor-not-allowed opacity-50",
        className,
      )}
    >
      {children}
    </div>
  );
}
