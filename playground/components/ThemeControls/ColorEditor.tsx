import { useEffect, useState } from "react";

import { hexToRgbString, rgbToHex } from "@/utils/color";
import { TextField } from "../shared/TextField";

interface ColorEditorProps {
  value: string;
  onChange(value: string): void;
}

export function ColorEditor({ value, onChange }: ColorEditorProps) {
  const [draft, setDraft] = useState(rgbToHex(value));

  useEffect(() => {
    setDraft(rgbToHex(value));
  }, [value]);

  const isValidDraft = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(draft);

  function commit(hex: string) {
    if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) {
      return;
    }

    const rgb = hexToRgbString(hex);

    if (rgb) {
      onChange(rgb);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <TextField
        value={draft}
        onChange={setDraft}
        onBlur={() => commit(draft)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commit(draft);
          }
        }}
        spellCheck={false}
        status={!isValidDraft ? "error" : "none"}
        className="w-full font-mono"
        size="xs"
      />

      <input
        type="color"
        value={isValidDraft ? draft : "#000000"}
        onChange={(event) => {
          const hex = event.target.value;

          setDraft(hex);

          const rgb = hexToRgbString(hex);

          if (rgb) {
            onChange(rgb);
          }
        }}
        aria-label="Color picker"
        className="h-7 w-7 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
      />
    </div>
  );
}