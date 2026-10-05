import React from "react";
import { RotateCcw } from "lucide-react";

interface ResetButtonProps {
  onClick(): void;
}

export function ResetButton({ onClick }: ResetButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 font-mono text-[10px] text-text-muted hover:text-destructive transition-colors"
    >
      <RotateCcw size={11} />
      <span>Reset</span>
    </button>
  );
}
