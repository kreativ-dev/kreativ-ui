import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import { TextField } from "./TextField";

interface AddInputProps {
  placeholder: string;
  buttonLabel: string;
  onAdd(value: string): void;
}

export function AddInput({ placeholder, buttonLabel, onAdd }: AddInputProps) {
  const [value, setValue] = useState("");

  const submit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue("");
  }, [value, onAdd]);

  return (
    <div className="flex gap-2">
      <TextField
        value={value}
        onChange={(value) => setValue(value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder={placeholder}
        className="flex-1"
      />
      <button
        type="button"
        onClick={submit}
        disabled={!value.trim()}
        className="flex items-center gap-1 rounded border border-border px-2 py-1.5 font-mono text-[10px] text-text-muted hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-40 transition-colors"
      >
        <Plus size={11} />
        {buttonLabel}
      </button>
    </div>
  );
}
