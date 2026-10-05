import { useEffect, useMemo, useState } from "react";
import type { SizeToken, ThemeOverride } from "@/types";
import { cn } from "@/utils/cn";
import { SIZE_KEYS } from "./theme.constants";
import { Input, Select } from "../../../src";
import { TextField } from "../shared/TextField";
import {  ChevronDown, Plus, Trash2 } from "lucide-react";

interface SizeEditorProps {
  theme: ThemeOverride;
  onChange(theme: ThemeOverride): void;
}

const KEYWORDS = ["auto", "min-content", "max-content", "fit-content"] as const;

const REAL_UNITS = [
  "px",
  "rem",
  "em",
  "%",
  "vw",
  "vh",
  "vmin",
  "vmax",
  "ch",
  "ex",
  "cm",
  "mm",
  "in",
  "pt",
  "pc",
  "fr",
] as const;

const NUMERIC_RE = /^-?(\d+\.?\d*|\.\d+)$/;

function parseSizeValue(raw: string): {
  value: string;
  unit: string;
  isKeyword: boolean;
} {
  if (!raw) {
    return {
      value: "",
      unit: "rem",
      isKeyword: false,
    };
  }

  if ((KEYWORDS as readonly string[]).includes(raw)) {
    return {
      value: "",
      unit: raw,
      isKeyword: true,
    };
  }

  const match = raw.match(/^(-?\d*\.?\d+)([a-z%]*)$/i);

  if (match) {
    return {
      value: match[1],
      unit: match[2] || "rem",
      isKeyword: false,
    };
  }

  return {
    value: "",
    unit: "rem",
    isKeyword: false,
  };
}

function SizeValueField({
  sizeName,
  keyName,
  raw,
  onCommitValue,
  onCommitUnit,
}: {
  sizeName: string;
  keyName: keyof SizeToken;
  raw: string;
  onCommitValue: (value: string) => void;
  onCommitUnit: (unit: string) => void;
}) {
  const parsed = parseSizeValue(raw);

  const [draft, setDraft] = useState(parsed.value);

  useEffect(() => {
    setDraft(parsed.value);
  }, [parsed.value]);

  const isValid = draft.trim() === "" || NUMERIC_RE.test(draft.trim());

  const fieldId = `${sizeName}-${String(keyName)}`;

  function commit() {
    if (isValid) {
      onCommitValue(draft);
    } else {
      setDraft(parsed.value);
    }
  }

  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_6rem] items-center gap-2">
      <label
        htmlFor={fieldId}
        className="truncate font-mono text-[11px] text-text-muted"
      >
        {String(keyName)}
      </label>

      <TextField
        id={fieldId}
        type="text"
        inputMode="decimal"
        placeholder="0"
        value={draft}
        disabled={parsed.isKeyword}
        onChange={setDraft}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commit();
          }
        }}
        status={!isValid ? "error" : "none"}
        size="sm"
        fullWidth
        className="font-mono"
      />

      <Select
        id={`${fieldId}-unit`}
        size="sm"
        value={parsed.unit}
        onValueChange={(unit) => {
          if (unit) onCommitUnit(unit);
        }}
        className="w-full"
      >
        <Select.Trigger>{parsed.unit || "unit"}</Select.Trigger>

        <Select.Content>
          {REAL_UNITS.map((unit) => (
            <Select.Item key={unit} value={unit}>
              {unit}
            </Select.Item>
          ))}

          <div className="my-1 border-t border-border" aria-hidden="true" />

          {KEYWORDS.map((keyword) => (
            <Select.Item key={keyword} value={keyword}>
              {keyword}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  );
}

function SizePreview({ size }: { size: SizeToken }) {
  const height = size.height;
  const paddingX = size.paddingX;
  const fontSize = size.fontSize;
  const radius = size.radius;

  return (
    <div className="flex h-26 items-center justify-center rounded-md bg-surface">
      <span
        className="inline-flex items-center justify-center border border-brand/40 bg-brand/10 px-3 text-brand"
        style={{
          height,
          paddingInline: paddingX,
          fontSize,
          borderRadius: radius,
        }}
      >
        Aa
      </span>
    </div>
  );
}

function SizeCard({
  name,
  size,
  isOpen,
  onToggle,
  onRemove,
  onCommitValue,
  onCommitUnit,
}: {
  name: string;
  size: SizeToken;
  isOpen: boolean;
  onToggle(): void;
  onRemove(): void;
  onCommitValue(key: keyof SizeToken, value: string): void;
  onCommitUnit(key: keyof SizeToken, currentValue: string, unit: string): void;
}) {
  const definedCount = SIZE_KEYS.filter(
    (key) => size[key] !== undefined,
  ).length;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border transition-colors",
        isOpen ? "border-brand/50" : "border-border hover:border-brand/50",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="group flex w-full items-center gap-3 p-3 text-left"
      >
        {/* Preview */}
        <div className="w-30 shrink-0 overflow-hidden rounded-md border border-border">
          <SizePreview size={size} />
        </div>

        {/* Information */}
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="font-medium text-text">{name}</span>

            {isOpen && (
              <span className="rounded-full bg-brand/10 px-1.5 py-0.5 font-mono text-[9px] uppercase text-brand">
                editing
              </span>
            )}
          </span>

          <span className="mt-1 block font-mono text-[10px] text-text-muted">
            {definedCount}/{SIZE_KEYS.length} properties
          </span>
        </span>

        {/* Actions */}
        <span className="flex shrink-0 items-center gap-2">
          <span
            role="button"
            tabIndex={0}
            aria-label={`Remove ${name}`}
            onClick={(event) => {
              event.stopPropagation();
              onRemove();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                event.stopPropagation();
                onRemove();
              }
            }}
            className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted opacity-0 transition-colors group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 size={13} />
          </span>

          <ChevronDown
            size={16}
            className={cn(
              "text-text-muted transition-transform",
              isOpen && "rotate-180 text-brand",
            )}
          />
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-border bg-surface/30 p-3">
          <div className="space-y-2">
            {SIZE_KEYS.map((key) => (
              <SizeValueField
                key={key}
                sizeName={name}
                keyName={key}
                raw={size[key] ?? ""}
                onCommitValue={(value) => onCommitValue(key, value)}
                onCommitUnit={(unit) =>
                  onCommitUnit(key, parseSizeValue(size[key] ?? "").value, unit)
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function SizeEditor({ theme, onChange }: SizeEditorProps) {
  const sizes = theme.sizes ?? {};

  const [openSize, setOpenSize] = useState<string | null>(null);

  const [newName, setNewName] = useState("");

  const sizeEntries = useMemo(() => Object.entries(sizes), [sizes]);

  function updateSize(name: string, updater: (token: SizeToken) => SizeToken) {
    const current = sizes[name] ?? {};

    onChange({
      ...theme,
      sizes: {
        ...sizes,
        [name]: updater({ ...current }),
      },
    });
  }

  function commitValue(name: string, key: keyof SizeToken, rawValue: string) {
    const current = sizes[name] ?? {};
    const { unit } = parseSizeValue(current[key] ?? "");

    const trimmed = rawValue.trim();

    updateSize(name, (token) => {
      if (trimmed === "") {
        delete token[key];
      } else {
        token[key] = `${trimmed}${unit}`;
      }

      return token;
    });
  }

  function commitUnit(
    name: string,
    key: keyof SizeToken,
    currentValue: string,
    nextUnit: string,
  ) {
    updateSize(name, (token) => {
      if ((KEYWORDS as readonly string[]).includes(nextUnit)) {
        token[key] = nextUnit;
      } else if (currentValue.trim() === "") {
        delete token[key];
      } else {
        token[key] = `${currentValue}${nextUnit}`;
      }

      return token;
    });
  }

  function addSize() {
    const name = newName.trim();

    if (!name || sizes[name]) return;

    onChange({
      ...theme,
      sizes: {
        ...sizes,
        [name]: {},
      },
    });

    setNewName(name);
    setOpenSize(name);
    setNewName("");
  }

  function removeSize(name: string) {
    const { [name]: _, ...rest } = sizes;

    onChange({
      ...theme,
      sizes: rest,
    });

    setOpenSize((current) => (current === name ? null : current));
  }

  return (
    <section className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="font-mono text-xs uppercase text-text-muted">Sizes</h3>

        <p className="mt-1 text-xs text-text-muted">
          Configure the dimensions and spacing used by component size recipes.
        </p>
      </div>

      {/* Sizes */}
      {sizeEntries.length > 0 && (
        <div className="space-y-2">
          {sizeEntries.map(([name, size]) => (
            <SizeCard
              key={name}
              name={name}
              size={size}
              isOpen={openSize === name}
              onToggle={() =>
                setOpenSize((current) => (current === name ? null : name))
              }
              onRemove={() => removeSize(name)}
              onCommitValue={(key, value) => commitValue(name, key, value)}
              onCommitUnit={(key, value, unit) =>
                commitUnit(name, key, value, unit)
              }
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {sizeEntries.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-6 text-center">
          <p className="text-sm text-text-muted">
            No override sizes defined yet.
          </p>

          <p className="mt-1 text-xs text-text-muted">
            Add a size below to start customizing it.
          </p>
        </div>
      )}

      {/* Add size */}
      <div className="rounded-lg border border-border bg-surface/30 p-3">
        <div className="mb-2">
          <p className="text-sm font-medium text-text">Add size</p>

          <p className="text-xs text-text-muted">
            Create a custom size such as <code className="font-mono">xl</code>{" "}
            or <code className="font-mono">compact</code>.
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            size="sm"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addSize();
              }
            }}
            placeholder="Size name"
            className="flex-1"
          />

          <button
            type="button"
            onClick={addSize}
            disabled={!newName.trim() || Boolean(sizes[newName.trim()])}
            className={cn(
              "inline-flex items-center gap-1.5",
              "rounded-md border border-border",
              "px-3 text-sm text-text-muted",
              "transition-colors",
              "hover:border-brand hover:text-brand",
              "disabled:pointer-events-none disabled:opacity-50",
            )}
          >
            <Plus size={14} />
            Add
          </button>
        </div>
      </div>
    </section>
  );
}
