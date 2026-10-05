"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/utils/cn";
import { useMultiSelectContext } from "./MultiSelect.context";
import type { MultiSelectItemProps } from "./MultiSelect.types";

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function MultiSelectItem({
  value,
  disabled = false,
  children,
  className,
}: MultiSelectItemProps) {
  const ctx = useMultiSelectContext("MultiSelectItem");
  const ref = useRef<HTMLDivElement>(null);
  const selected = ctx.value.includes(value);
  const active = ctx.activeValue === value;

  useEffect(
    () => ctx.registerItem(value, { label: children, disabled }),
    [value, disabled, children],
  );
  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <div
      ref={ref}
      id={ctx.optionId(value)}
      role="option"
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      onMouseEnter={() => !disabled && ctx.setActiveValue(value)}
      onClick={() => !disabled && ctx.toggleValue(value)}
      className={cn(
        "flex cursor-pointer items-center justify-between rounded-[calc(var(--kui-radii-md)-2px)] px-2.5 py-1.5 text-sm text-text transition-colors",
        active && "bg-brand/15 text-brand",
        disabled && "pointer-events-none cursor-not-allowed opacity-50",
        className,
      )}
    >
      <span>{children}</span>
      {selected && <CheckIcon />}
    </div>
  );
}
