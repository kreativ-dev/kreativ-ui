import React from "react";
import { Trash2 } from "lucide-react";

import type { RecipeCompoundVariant, RecipeVariantValue } from "@/types";
import { ConditionList } from "../../../../shared/ConditionList";
import { TextField } from "../../../../shared/TextField";

interface CompoundItemProps {
  index: number;
  compound: RecipeCompoundVariant;
  onUpdate: (index: number, update: Partial<RecipeCompoundVariant>) => void;
  onRemove: (index: number) => void;
}

export const CompoundItem = React.memo(function CompoundItem({
  index,
  compound,
  onUpdate,
  onRemove,
}: CompoundItemProps) {
  return (
    <div className="space-y-3 rounded-lg border border-border bg-linear-to-br from-surface/40 to-surface/20 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-text">
          Compound {index + 1}
        </span>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-text-muted hover:text-destructive transition-colors"
          aria-label={`Remove compound ${index + 1}`}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div>
        <label className="block text-xs font-medium text-text-muted mb-2">
          Conditions
        </label>
        <ConditionList
          conditions={compound.conditions}
          onUpdate={(conditions) => onUpdate(index, { conditions })}
          onAddCondition={(key) =>
            onUpdate(index, {
              conditions: { ...compound.conditions, [key]: "" },
            })
          }
          onRemoveCondition={(key) => {
            const next = { ...compound.conditions };
            delete next[key];
            onUpdate(index, { conditions: next });
          }}
          onChangeValue={(key, rawValue) => {
            let parsed: RecipeVariantValue = rawValue;
            if (rawValue === "true") parsed = true;
            else if (rawValue === "false") parsed = false;
            else if (rawValue.trim() !== "" && !isNaN(Number(rawValue))) {
              parsed = Number(rawValue);
            }
            onUpdate(index, {
              conditions: {
                ...compound.conditions,
                [key]: parsed,
              },
            });
          }}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-text-muted mb-2">
          Applied class
        </label>
        <TextField
          size="xs"
          value={compound.className}
          onChange={(value) => onUpdate(index, { className: value })}
          placeholder="CSS classes applied when conditions match..."
        />
      </div>
    </div>
  );
});
