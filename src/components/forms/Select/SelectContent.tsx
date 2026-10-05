"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { useSelectContext } from "./Select.context";
import type { SelectContentProps } from "./Select.types";

const VIEWPORT_PADDING = 8;

export function SelectContent({
  className,
  children,
  ...props
}: SelectContentProps) {
  const ctx = useSelectContext("SelectContent");
  const contentRef = useRef<HTMLDivElement>(null);
  const [side, setSide] = useState<"top" | "bottom">("bottom");

  useLayoutEffect(() => {
    if (!ctx.open) return;
    const trigger = ctx.triggerRef.current!;
    const content = contentRef.current;
    if (!trigger || !content) return;

    function measure() {
      const triggerRect = trigger.getBoundingClientRect();
      const contentHeight = content?.offsetHeight;
      const spaceBelow =
        window.innerHeight - triggerRect.bottom - VIEWPORT_PADDING;
      const spaceAbove = triggerRect.top - VIEWPORT_PADDING;

      setSide(
        contentHeight && contentHeight > spaceBelow && spaceAbove > spaceBelow
          ? "top"
          : "bottom",
      );
    }

    measure();

    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [ctx.open, ctx.triggerRef]);

  return (
    <div
      ref={contentRef}
      id={ctx.contentId}
      role="listbox"
      aria-labelledby={ctx.triggerId}
      data-state={ctx.open ? "open" : "closed"}
      data-side={side}
      className={cn(
        "absolute z-50 max-h-64 w-full overflow-auto rounded-(--kui-radii-md) border border-border bg-surface p-1 shadow-lg kui-scrollbar space-y-0.75",
        "pointer-events-none opacity-0 scale-95",
        "data-[state=open]:pointer-events-auto data-[state=open]:opacity-100 data-[state=open]:scale-100",
        "transition-[opacity,transform] duration-150 ease-out",
        side === "bottom" ? "top-full mt-1" : "bottom-full mb-1",
        className,
      )}
      onMouseLeave={() => {
        ctx.setActiveValue(undefined);
      }}
      {...props}
    >
      {children}
    </div>
  );
}
