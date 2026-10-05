import { useCallback, useEffect, useState } from "react";

import type {
  DefaultRecipeCollection,
  RecipeCompoundVariant,
  RecipeDefinition,
} from "@/types";

import { SectionHeader } from "../../../../shared/SectionHeader";
import { EmptyState } from "../../../../shared/EmptyState";
import { AddButton } from "../../../../shared/AddButton";
import { CompoundItem } from "../items/CompoundItem";
import { CardPagination } from "../../../../shared/CardPagination";

type ComponentName = keyof DefaultRecipeCollection;

interface CompoundVariantsEditorProps {
  component: ComponentName;
  value?: RecipeDefinition["compoundVariants"];
  onChange(value: RecipeCompoundVariant[]): void;
  onReset(): void;
}

export function CompoundVariantsEditor({
  component,
  value,
  onChange,
  onReset,
}: CompoundVariantsEditorProps) {
  const compounds = value ?? [];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex((index) =>
      compounds.length === 0 ? 0 : Math.min(index, compounds.length - 1),
    );
  }, [compounds.length]);

  const addCompound = useCallback(() => {
    const newArray = [...compounds, { conditions: {}, className: "" }];
    onChange(newArray);
    setCurrentIndex(compounds.length);
  }, [compounds, onChange]);

  const updateCompound = useCallback(
    (index: number, update: Partial<RecipeCompoundVariant>) => {
      const updated = compounds.map((compound, i) =>
        i === index ? { ...compound, ...update } : compound,
      );
      onChange(updated);
    },
    [compounds, onChange],
  );

  const removeCompound = useCallback(
    (index: number) => {
      if (compounds.length <= 1) {
        onReset();
        setCurrentIndex(0);
        return;
      }

      const updated = compounds.filter((_, i) => i !== index);
      onChange(updated);
      setCurrentIndex((current) => Math.min(current, updated.length - 1));
    },
    [compounds, onChange, onReset],
  );

  const handleAddClick = () => {
    addCompound();
  };

  return (
    <div className="p-3">
      <SectionHeader
        title="Compound variants"
        description={`Apply styles when multiple ${component} variants match.`}
        hasValue={compounds.length > 0}
        onReset={onReset}
        action={<AddButton onClick={handleAddClick}>Compound</AddButton>}
      />

      {compounds.length === 0 ? (
        <EmptyState
          text="No compound variants defined."
          action="Add compound"
          onClick={handleAddClick}
        />
      ) : (
        <CardPagination
          items={compounds.map((compound, index) => ({
            compound,
            index,
          }))}
          currentIndex={currentIndex}
          onIndexChange={setCurrentIndex}
          renderCard={({ compound, index }) => (
            <CompoundItem
              key={index}
              index={index}
              compound={compound}
              onUpdate={updateCompound}
              onRemove={removeCompound}
            />
          )}
        />
      )}
    </div>
  );
}
