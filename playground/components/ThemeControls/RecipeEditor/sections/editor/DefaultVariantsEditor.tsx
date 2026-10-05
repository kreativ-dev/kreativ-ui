import { useCallback, useState } from "react";
import { Trash2 } from "lucide-react";

import type {
  RecipeDefinition,
  RecipeVariantValue,
  DefaultRecipeCollection,
} from "@/types";

import { SectionHeader } from "../../../../shared/SectionHeader";
import { EmptyState } from "../../../../shared/EmptyState";
import { CardPagination } from "../../../../shared/CardPagination";
import { TextField } from "../../../../shared/TextField";
import { AddInput } from "../../../../shared/AddInput";

type ComponentName = keyof DefaultRecipeCollection;

interface DefaultVariantsEditorProps {
  component: ComponentName;
  value?: RecipeDefinition["defaultVariants"];
  onChange(value: NonNullable<RecipeDefinition["defaultVariants"]>): void;
  onReset(): void;
}

export function DefaultVariantsEditor({
  component,
  value,
  onChange,
  onReset,
}: DefaultVariantsEditorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const entries = Object.entries(value ?? {});

  const update = useCallback(
    (name: string, rawValue: string) => {
      let parsed: RecipeVariantValue = rawValue;
      if (rawValue === "true") parsed = true;
      else if (rawValue === "false") parsed = false;
      else if (rawValue.trim() !== "" && !isNaN(Number(rawValue))) {
        parsed = Number(rawValue);
      }
      onChange({ ...(value ?? {}), [name]: parsed });
    },
    [value, onChange],
  );

  const remove = useCallback(
    (name: string) => {
      const next = { ...(value ?? {}) };
      delete next[name];
      if (Object.keys(next).length === 0) {
        onReset();
        setCurrentIndex(0);
      } else {
        onChange(next);
        setCurrentIndex(Math.min(currentIndex, Object.keys(next).length - 1));
      }
    },
    [value, onChange, onReset, currentIndex],
  );

  return (
    <div className="p-3">
      <SectionHeader
        title="Default variants"
        description={`Set the default variant values for ${component}.`}
        hasValue={entries.length > 0}
        onReset={onReset}
      />

      {entries.length === 0 ? (
        <EmptyState
          text="No default variants defined."
          action="Add default"
          onClick={() => onChange({ variant: "" })}
        />
      ) : (
        <>
          <CardPagination
            items={entries}
            currentIndex={currentIndex}
            onIndexChange={setCurrentIndex}
            renderCard={([name, variantValue]) => (
              <div
                key={name}
                className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-2"
              >
                <TextField
                  value={name}
                  onChange={() => {}}
                  readOnly
                  size="xs"
                  className="min-w-0 rounded border border-border bg-surface/30 px-2 py-1.5 font-mono text-xs text-text"
                />
                <TextField
                  size="xs"
                  value={String(variantValue)}
                  onChange={(value) => update(name, value)}
                  placeholder="Value"
                />
                <button
                  type="button"
                  onClick={() => remove(name)}
                  className="px-1 text-text-muted hover:text-destructive"
                  aria-label={`Remove default ${name}`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )}
          />

          <div className="mt-3">
            <AddInput
              placeholder="Variant name"
              onAdd={(name) => {
                if (!name || value?.[name] !== undefined) return;
                const newDefaults = { ...(value ?? {}), [name]: "" };
                onChange(newDefaults);
                setCurrentIndex(Object.keys(newDefaults).length - 1);
              }}
              buttonLabel="Default"
            />
          </div>
        </>
      )}
    </div>
  );
}
