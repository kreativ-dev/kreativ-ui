import React from "react";
import { Trash2 } from "lucide-react";

import { TextField } from "../../../../shared/TextField";
import { AddInput } from "../../../../shared/AddInput";

interface VariantItemProps {
  name: string;
  options: Record<string, string>;
  onRename: (newName: string) => void;
  onRemove: () => void;
  onOptionUpdate: (optionName: string, className: string) => void;
  onOptionRemove: (optionName: string) => void;
}

export const VariantItem = React.memo(function VariantItem({
  name,
  options,
  onRename,
  onRemove,
  onOptionUpdate,
  onOptionRemove,
}: VariantItemProps) {
  const optionEntries = Object.entries(options);

  return (
    <div className="space-y-3 rounded-lg border border-border bg-linear-to-br from-surface/40 to-surface/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-medium text-text-muted mb-1.5">
            Variant name
          </label>
          <TextField
            size="xs"
            value={name}
            onChange={(value) => onRename(value)}
            aria-label="Variant name"
          />
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="mt-6 text-text-muted hover:text-destructive transition-colors"
          aria-label={`Remove ${name}`}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div>
        <label className="block text-xs font-medium text-text-muted mb-2">
          Options ({optionEntries.length})
        </label>
        <div className="space-y-2">
          {optionEntries.map(([optName, className]) => (
            <div
              key={optName}
              className="grid grid-cols-[minmax(0,100px)_1fr_auto] gap-2 items-start"
            >
              <TextField
                value={optName}
                readOnly
                onChange={() => {}}
                clearable={false}
                aria-label="Variant option"
                className="bg-surface/50"
                size="xs"
              />
              <TextField
                value={className}
                onChange={(value) => onOptionUpdate(optName, value)}
                placeholder="CSS classes..."
                size="xs"
              />
              <button
                type="button"
                onClick={() => onOptionRemove(optName)}
                className="px-2 py-1.5 text-text-muted hover:text-destructive transition-colors"
                aria-label={`Remove ${optName}`}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <AddInput
        placeholder="New option name"
        onAdd={(value) => {
          if (!value || options[value]) return;
          onOptionUpdate(value, "");
        }}
        buttonLabel="Option"
      />
    </div>
  );
});
