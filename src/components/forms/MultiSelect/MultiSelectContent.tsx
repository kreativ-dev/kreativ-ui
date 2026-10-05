import { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { useMultiSelectContext } from "./MultiSelect.context";
import { useFloatingSide } from "@/hooks/useFloatingSide";

interface MultiSelectContentProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function MultiSelectContent({
  className,
  children,
  ...props
}: MultiSelectContentProps) {
  const ctx = useMultiSelectContext("MultiSelectContent");

  const { side, contentRef } = useFloatingSide(ctx.triggerRef, ctx.open);

  if (!ctx.open) return null;

  return (
    <div
      ref={contentRef}
      id={ctx.contentId}
      role="listbox"
      aria-labelledby={ctx.triggerId}
      data-state={ctx.open ? "open" : "closed"}
      data-side={side}
      className={cn(
        "animate-kui-scale-in absolute z-50 max-h-64 w-full overflow-auto rounded-[var(--kui-radii-md)] border border-border bg-surface p-1 shadow-lg",
        side === "bottom" ? "top-full mt-1" : "bottom-full mb-1",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
