import { Plus } from "lucide-react";

interface EmptyStateProps {
  text: string;
  action: string;
  onClick(): void;
}

export function EmptyState({ text, action, onClick }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-between rounded-md border border-dashed border-border bg-surface/20 px-3 py-3">
      <span className="text-[10px] text-text-muted">{text}</span>
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-1 font-mono text-[10px] text-text-muted hover:text-brand transition-colors"
      >
        <Plus size={11} />
        {action}
      </button>
    </div>
  );
}
