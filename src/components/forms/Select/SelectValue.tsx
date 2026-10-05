import { cn } from "@/utils/cn";
import { useSelectContext } from "./Select.context";
import type { SelectValueProps } from "./Select.types";

export function SelectValue({ placeholder, className }: SelectValueProps) {
  const ctx = useSelectContext("SelectValue");

  const displayLabel = ctx.selectedLabel ?? placeholder ?? ctx.placeholder;

  return (
    <span className={cn("min-w-0 truncate", className)}>{displayLabel}</span>
  );
}
