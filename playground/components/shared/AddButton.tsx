import React from "react";
import { Plus } from "lucide-react";

interface AddButtonProps {
  onClick(): void;
  children: React.ReactNode;
}

export function AddButton({ onClick, children }: AddButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 rounded-md border border-border px-2 py-1 font-mono text-[10px] text-text-muted transition-colors hover:border-brand hover:text-brand"
    >
      <Plus size={11} />
      {children}
    </button>
  );
}
