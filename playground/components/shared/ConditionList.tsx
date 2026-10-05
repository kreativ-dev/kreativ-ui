import { Trash2 } from "lucide-react";

import type { RecipeVariantValue } from "@/types";
import { TextField } from "./TextField";
import { AddInput } from "./AddInput";

interface ConditionListProps {
  conditions: Record<string, RecipeVariantValue>;
  onUpdate(conditions: Record<string, RecipeVariantValue>): void;
  onAddCondition(key: string): void;
  onRemoveCondition(key: string): void;
  onChangeValue(key: string, value: string): void;
}

export function ConditionList({
  conditions,
  onUpdate,
  onAddCondition,
  onRemoveCondition,
  onChangeValue,
}: ConditionListProps) {
  const entries = Object.entries(conditions);

  const handleUpdate = (key: string) => {
    onUpdate(conditions);
    onAddCondition(key);
  };

  return (
    <div className="space-y-2">
      {entries.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto kui-scrollbar pr-1">
          {entries.map(([key, conditionValue]) => (
            <div
              key={key}
              className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-2 items-start"
            >
              <TextField size="xs" value={key} onChange={() => {}} readOnly />
              <TextField
                size="xs"
                value={String(conditionValue)}
                onChange={(value) => onChangeValue(key, value)}
                placeholder="Value"
              />
              <button
                type="button"
                onClick={() => onRemoveCondition(key)}
                className="px-1 py-1.5 text-text-muted hover:text-destructive transition-colors"
                aria-label={`Remove ${key} condition`}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      <AddInput
        placeholder="Variant key (e.g., size, variant)"
        onAdd={handleUpdate}
        buttonLabel="Condition"
      />
    </div>
  );
}
