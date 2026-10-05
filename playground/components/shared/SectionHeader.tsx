import React from "react";
import { ResetButton } from "./ResetButton";

interface SectionHeaderProps {
  title: string;
  description: string;
  hasValue: boolean;
  onReset(): void;
  action?: React.ReactNode;
}

export function SectionHeader({
  title,
  description,
  hasValue,
  onReset,
  action,
}: SectionHeaderProps) {
  return (
    <div className="mb-3 flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-medium text-text">{title}</h4>
        <p className="mt-0.5 text-[10px] text-text-muted">{description}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {hasValue && <ResetButton onClick={onReset} />}
        {action}
      </div>
    </div>
  );
}
