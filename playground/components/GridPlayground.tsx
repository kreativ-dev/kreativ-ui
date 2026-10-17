"use client";

import { useMemo, useState } from "react";
import { Playground } from "./shared/Playground";
import { FormField, Grid, Input, Select } from "@/components";
import { getAttrs } from "./shared/getAttributes";

type Mode = "columns" | "minChildWidth";
type Align = "stretch" | "start" | "center";
type SpanOption = "1" | "2" | "3" | "full";

const ITEMS = Array.from({ length: 6 }, (_, i) => `Item ${i + 1}`);

/** Computed CSS properties we want to surface for a <Grid>. */
const GRID_STYLE_PROPS = [
  "display",
  "grid-template-columns",
  "gap",
  "align-items",
];

/** getAttrs always reports these; they aren't meaningful for a Grid. */
const BASE_ATTRS_TO_EXCLUDE = [
  "id",
  "aria-invalid",
  "aria-describedby",
  "disabled",
];

const MODES: readonly Mode[] = ["columns", "minChildWidth"];
const ALIGNS: readonly Align[] = ["stretch", "start", "center"];
const SPAN_OPTIONS: readonly SpanOption[] = ["1", "2", "3", "full"];

// ─── field wrappers ───────────────────────────────────────────────────────

function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly T[];
}) {
  return (
    <FormField label={label}>
      <FormField.Control>
        <Select
          value={value}
          onValueChange={(v) => onChange(v as T)}
          options={options.map((opt) => ({ value: opt, label: opt }))}
        />
      </FormField.Control>
    </FormField>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <FormField label={label}>
      <FormField.Control>
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      </FormField.Control>
    </FormField>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <FormField label={label}>
      <FormField.Control>
        <Input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </FormField.Control>
    </FormField>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <FormField label={label}>
      <FormField.Control>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="size-4 accent-kui-text"
        />
      </FormField.Control>
    </FormField>
  );
}

// ─── playground ───────────────────────────────────────────────────────────

export function GridPlayground() {
  const [mode, setMode] = useState<Mode>("columns");
  const [columns, setColumns] = useState(3);
  const [minChildWidth, setMinChildWidth] = useState("160px");
  const [gap, setGap] = useState("16");
  const [align, setAlign] = useState<Align>("stretch");
  const [inline, setInline] = useState(false);
  const [span, setSpan] = useState<number | "full">(2);

  /** Accept either a number (e.g. "16") or any CSS length (e.g. "1rem"). */
  const gapValue = useMemo<number | string>(() => {
    const n = Number(gap);
    return Number.isNaN(n) ? gap : n;
  }, [gap]);

  const spanOption: SpanOption = String(span) as SpanOption;

  const code = useMemo(() => {
    const track =
      mode === "columns"
        ? `  columns={${columns}}`
        : `  minChildWidth="${minChildWidth}"`;
    return [
      "<Grid",
      track,
      `  gap={${typeof gapValue === "number" ? gapValue : `"${gapValue}"`}}`,
      `  align="${align}"`,
      inline ? "  inline" : null,
      ">",
      `  <Grid.Item span={${typeof span === "number" ? span : `"${span}"`}}>Featured</Grid.Item>`,
      "  {items}",
      "</Grid>",
    ]
      .filter(Boolean)
      .join("\n");
  }, [mode, columns, minChildWidth, gapValue, align, inline, span]);

  return (
    <Playground
      title="Grid"
      description="Equal columns, wrapping columns, gap, alignment, and item span."
      attributeSelector="[data-kui-responsive]"
      getAttributes={(el) =>
        getAttrs(el, [], BASE_ATTRS_TO_EXCLUDE, undefined, GRID_STYLE_PROPS)
      }
      code={code}
      controls={
        <div className="grid gap-3 text-sm">
          <SelectField
            label="mode"
            value={mode}
            onChange={setMode}
            options={MODES}
          />

          {mode === "columns" ? (
            <NumberField
              label="columns"
              value={columns}
              onChange={setColumns}
              min={1}
              max={6}
            />
          ) : (
            <TextField
              label="minChildWidth"
              value={minChildWidth}
              onChange={setMinChildWidth}
            />
          )}

          <TextField label="gap" value={gap} onChange={setGap} />

          <SelectField
            label="align"
            value={align}
            onChange={setAlign}
            options={ALIGNS}
          />

          <SelectField
            label="first item span"
            value={spanOption}
            onChange={(v) => setSpan(v === "full" ? "full" : Number(v))}
            options={SPAN_OPTIONS}
          />

          <ToggleField label="inline" checked={inline} onChange={setInline} />
        </div>
      }
      preview={
        <Grid
          columns={mode === "columns" ? columns : undefined}
          minChildWidth={mode === "minChildWidth" ? minChildWidth : undefined}
          gap={gapValue}
          align={align}
          inline={inline}
          className="w-full"
        >
          <Grid.Item
            span={span}
            className="rounded-lg bg-kui-brand/15 p-3 text-sm"
          >
            Featured
          </Grid.Item>
          {ITEMS.map((item) => (
            <div
              key={item}
              className="rounded-lg border border-kui-border bg-kui-surface p-3 text-sm"
            >
              {item}
            </div>
          ))}
        </Grid>
      }
    />
  );
}
