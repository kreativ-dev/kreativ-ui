import { cn } from "@/utils/cn";
import { useComboboxContext } from "./Combobox.context";
import { useFloatingSide } from "@/hooks/useFloatingSide";

export function ComboboxContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = useComboboxContext("ComboboxContent");

  const { contentRef, side } = useFloatingSide(ctx.triggerRef, ctx.open);

  if (!ctx.open) return null;

  return (
    <div
      ref={contentRef}
      id={ctx.contentId}
      role="listbox"
      aria-labelledby={ctx.triggerId}
      data-side={side}
      className={cn(
        "animate-kui-scale-in absolute z-50 max-h-64 w-full overflow-auto rounded-[var(--kui-radii-md)] border border-border bg-surface p-1 shadow-lg",
        side === "bottom" ? "top-full mt-1" : "bottom-full mb-1",
        className,
      )}
    >
      {children}
    </div>
  );
}
