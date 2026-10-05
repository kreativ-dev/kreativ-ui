import { cn } from "@/utils";
import { type ReactNode } from "react";

interface AdornmentItemProps {
  children: ReactNode;
  size?: string | number;
  interactive?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
}

export function AdornmentItem({
  children,
  size,
  interactive = false,
  ...props
}: AdornmentItemProps) {
  const className = cn(
    "flex shrink-0 items-center justify-center",
    interactive && [
      "text-text-muted",
      "transition-colors",
      "hover:text-text",
      "focus-visible:outline",
      "focus-visible:outline-2",
      "focus-visible:outline-offset-2",
    ],
  );

  if (interactive) {
    return (
      <button type="button" className={className} {...props}>
        {children}
      </button>
    );
  }

  return (
    <span className={className} aria-hidden="true">
      {children}
    </span>
  );
}
