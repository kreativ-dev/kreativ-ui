
import type { DefaultRecipeCollection } from "@/types";
import { Textarea } from "@/components";
import { SectionHeader } from "../../../../shared/SectionHeader";

type ComponentName = keyof DefaultRecipeCollection;

interface BaseEditorProps {
  component: ComponentName;
  value: string;
  onChange(value: string): void;
  onReset(): void;
}

export function BaseEditor({
  component,
  value,
  onChange,
  onReset,
}: BaseEditorProps) {
  const hasValue = Boolean(value.trim());

  return (
    <div className="p-3">
      <SectionHeader
        title="Base"
        description={`Shared styles applied to every ${component}.`}
        hasValue={hasValue}
        onReset={onReset}
      />
      <Textarea
        id={`recipe-${component}-base`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Add base classes..."
        autoResize
        size="xs"
        minRows={2}
        maxRows={4}
        spellCheck={false}
        typography="mono"
      />
    </div>
  );
}
