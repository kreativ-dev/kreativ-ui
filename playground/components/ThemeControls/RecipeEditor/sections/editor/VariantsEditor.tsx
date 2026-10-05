import { useCallback, useState } from "react";

import type { RecipeDefinition, DefaultRecipeCollection } from "@/types";

import { SectionHeader } from "../../../../shared/SectionHeader";
import { EmptyState } from "../../../../shared/EmptyState";
import { AddButton } from "../../../../shared/AddButton";
import { CardPagination } from "../../../../shared/CardPagination";
import { VariantItem } from "../items/VariantItem";

type ComponentName = keyof DefaultRecipeCollection;

interface VariantsEditorProps {
  component: ComponentName;
  variants?: RecipeDefinition["variants"];
  onChange(variants: NonNullable<RecipeDefinition["variants"]>): void;
  onReset(): void;
}

export function VariantsEditor({
  component,
  variants,
  onChange,
  onReset,
}: VariantsEditorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const variantEntries = Object.entries(variants ?? {});

  const addVariant = useCallback(() => {
    let index = variantEntries.length + 1;
    let name = `variant${index}`;
    while (variants?.[name]) {
      index++;
      name = `variant${index}`;
    }
    const newVariants = { ...(variants ?? {}), [name]: {} };
    onChange(newVariants);
    setCurrentIndex(Object.keys(newVariants).length - 1);
  }, [variants, onChange, variantEntries.length]);

  const removeVariant = useCallback(
    (name: string) => {
      const next = { ...(variants ?? {}) };
      delete next[name];
      if (Object.keys(next).length === 0) {
        onReset();
        setCurrentIndex(0);
        return;
      }
      onChange(next);
      setCurrentIndex(Math.min(currentIndex, Object.keys(next).length - 1));
    },
    [variants, onChange, onReset, currentIndex],
  );

  const renameVariant = useCallback(
    (oldName: string, newName: string) => {
      const trimmed = newName.trim();
      if (!trimmed || trimmed === oldName || variants?.[trimmed]) return;
      const next: NonNullable<RecipeDefinition["variants"]> = {};
      for (const [key, value] of Object.entries(variants ?? {})) {
        next[key === oldName ? trimmed : key] = value;
      }
      onChange(next);
    },
    [variants, onChange],
  );

  const updateVariantOption = useCallback(
    (variantName: string, optionName: string, className: string) => {
      onChange({
        ...(variants ?? {}),
        [variantName]: {
          ...(variants?.[variantName] ?? {}),
          [optionName]: className,
        },
      });
    },
    [variants, onChange],
  );

  const removeOption = useCallback(
    (variantName: string, optionName: string) => {
      const current = variants?.[variantName] ?? {};
      const nextVariant = { ...current };
      delete nextVariant[optionName];
      const next = { ...(variants ?? {}), [variantName]: nextVariant };
      if (Object.keys(nextVariant).length === 0) {
        delete next[variantName];
      }
      if (Object.keys(next).length === 0) {
        onReset();
      } else {
        onChange(next);
      }
    },
    [variants, onChange, onReset],
  );


  return (
    <div className="p-3">
      <SectionHeader
        title="Variants"
        description="Define variant groups and the styles for each option."
        hasValue={variantEntries.length > 0}
        onReset={onReset}
        action={<AddButton onClick={addVariant}>Variant</AddButton>}
      />

      {variantEntries.length === 0 ? (
        <EmptyState
          text={`No ${component} variants defined.`}
          action="Add variant"
          onClick={addVariant}
        />
      ) : (
        <CardPagination
          items={variantEntries}
          currentIndex={currentIndex}
          onIndexChange={setCurrentIndex}
          renderCard={([variantName, options]) => (
            <VariantItem
              key={variantName}
              name={variantName}
              options={options}
              onRename={(newName) => renameVariant(variantName, newName)}
              onRemove={() => removeVariant(variantName)}
              onOptionUpdate={(optionName, className) =>
                updateVariantOption(variantName, optionName, className)
              }
              onOptionRemove={(optionName) =>
                removeOption(variantName, optionName)
              }
            />
          )}
        />
      )}
    </div>
  );
}
