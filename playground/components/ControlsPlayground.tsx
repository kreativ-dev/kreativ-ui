import { useState } from "react";
import {
  Switch,
  Combobox,
  MultiSelect,
  type InputVariant,
  type InputSize,
  SwitchSize,
} from "../../src";
import { Playground } from "./shared/Playground";
import { SegmentedControl } from "./shared/SegmentedControl";
import { Chip } from "./shared/Chip";
import { TextField } from "./shared/TextField";
import { getAttrs } from "./shared/getAttributes";

const VARIANTS: InputVariant[] = ["outline", "filled", "ghost"];
const SIZES: SwitchSize[] = ["xs", "sm", "md", "lg"];

const PEOPLE = [
  "Ada Lovelace",
  "Alan Turing",
  "Grace Hopper",
  "Katherine Johnson",
  "Edsger Dijkstra",
];
const TAGS = [
  "bug",
  "feature",
  "design",
  "urgent",
  "backend",
  "frontend",
  "docs",
];

export function SwitchDemo() {
  const [size, setSize] = useState<SwitchSize>("md");
  const [disabled, setDisabled] = useState(false);
  const [checked, setChecked] = useState(true);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [required, setRequired] = useState(false);
  const [label, setLabel] = useState("Email notifications");
  const [description, setDescription] = useState(
    "Get notified when something changes.",
  );
  const [withDescription, setWithDescription] = useState(true);

  const controls = (
    <>
      <SegmentedControl
        label="size"
        value={size}
        options={SIZES}
        onChange={setSize}
      />
      <div className="mb-5">
        <p className="mb-2 font-mono text-[11px] text-text-muted">flags</p>
        <div className="flex flex-wrap gap-1.5">
          <Chip active={disabled} onClick={() => setDisabled((v) => !v)}>
            disabled
          </Chip>
          <Chip active={error} onClick={() => setError((v) => !v)}>
            error
          </Chip>
          <Chip active={success} onClick={() => setSuccess((v) => !v)}>
            success
          </Chip>
          <Chip active={required} onClick={() => setRequired((v) => !v)}>
            required
          </Chip>
          <Chip
            active={withDescription}
            onClick={() => setWithDescription((v) => !v)}
          >
            description
          </Chip>
        </div>
      </div>
      <TextField label="label" value={label} onChange={setLabel} />
      {withDescription && (
        <TextField
          label="description"
          value={description}
          onChange={setDescription}
        />
      )}
    </>
  );

  const preview = (
    <Switch
      size={size}
      disabled={disabled}
      checked={checked}
      onCheckedChange={setChecked}
      error={error}
      success={success}
      required={required}
      label={label}
      description={withDescription ? description : undefined}
    />
  );

  const attrLines = [
    size !== "md" && `size="${size}"`,
    disabled && "disabled",
    error && "error",
    success && "success",
    required && "required",
    `checked={${checked}}`,
    `onCheckedChange={setChecked}`,
    `label="${label}"`,
    withDescription && `description="${description}"`,
  ].filter(Boolean) as string[];

  const code = `<Switch\n  ${attrLines.join("\n  ")}\n/>`;

  return (
    <Playground
      title="Switch"
      description="A boolean toggle for settings/preferences. Supports error/success styling for validation feedback, rounded variant, and FormField integration."
      controls={controls}
      preview={preview}
      code={code}
      getAttributes={(el) => getAttrs(el, ["role", "aria-checked"])}
    />
  );
}

// ------------------------------------------------------------------------------
// Combobox Playground
// ------------------------------------------------------------------------------
export function ComboboxDemo() {
  const [variant, setVariant] = useState<InputVariant>("outline");
  const [size, setSize] = useState<InputSize>("md");
  const [disabled, setDisabled] = useState(false);
  const [clearable, setClearable] = useState(true);
  const [allowFreeText, setAllowFreeText] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [required, setRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rounded, setRounded] = useState(false);
  const [placeholder, setPlaceholder] = useState("Search people...");
  const [value, setValue] = useState<string | undefined>(undefined);

  const controls = (
    <>
      <SegmentedControl
        label="variant"
        value={variant}
        options={VARIANTS}
        onChange={setVariant}
      />
      <SegmentedControl
        label="size"
        value={size}
        options={SIZES}
        onChange={setSize}
      />
      <div className="mb-5">
        <p className="mb-2 font-mono text-[11px] text-text-muted">flags</p>
        <div className="flex flex-wrap gap-1.5">
          <Chip active={disabled} onClick={() => setDisabled((v) => !v)}>
            disabled
          </Chip>
          <Chip active={clearable} onClick={() => setClearable((v) => !v)}>
            clearable
          </Chip>
          <Chip
            active={allowFreeText}
            onClick={() => setAllowFreeText((v) => !v)}
          >
            allowFreeText
          </Chip>
          <Chip active={error} onClick={() => setError((v) => !v)}>
            error
          </Chip>
          <Chip active={success} onClick={() => setSuccess((v) => !v)}>
            success
          </Chip>
          <Chip active={required} onClick={() => setRequired((v) => !v)}>
            required
          </Chip>
          <Chip active={loading} onClick={() => setLoading((v) => !v)}>
            loading
          </Chip>
          <Chip active={rounded} onClick={() => setRounded((v) => !v)}>
            rounded
          </Chip>
        </div>
      </div>
      <TextField
        label="placeholder"
        value={placeholder}
        onChange={setPlaceholder}
      />
      <p className="font-mono text-[10px] text-text-muted">
        type to filter — arrows to move, enter to select
      </p>
    </>
  );

  const preview = (
    <Combobox
      value={value}
      onValueChange={setValue}
      disabled={disabled}
      error={error}
      success={success}
      required={required}
      rounded={rounded}
      defaultInputValue="Ada  Lovelace"
    >
      <Combobox.Input
        variant={variant}
        size={size}
        placeholder={placeholder}
        clearable={clearable}
        allowFreeText={allowFreeText}
      />
      <Combobox.Content>
        <Combobox.Empty>No results found</Combobox.Empty>
        {PEOPLE.map((p) => (
          <Combobox.Item key={p} value={p}>
            {p}
          </Combobox.Item>
        ))}
        {loading && <Combobox.Loading />}
      </Combobox.Content>
    </Combobox>
  );

  const attrLines = [
    variant !== "outline" && `variant="${variant}"`,
    size !== "md" && `size="${size}"`,
    disabled && "disabled",
    clearable && "clearable",
    allowFreeText && "allowFreeText",
    error && "error",
    success && "success",
    required && "required",
    rounded && "rounded",
    `placeholder="${placeholder}"`,
  ].filter(Boolean) as string[];

  const code = [
    `<Combobox value={value} onValueChange={setValue}${
      disabled ? " disabled" : ""
    }${error ? " error" : ""}${success ? " success" : ""}${
      required ? " required" : ""
    }${rounded ? " rounded" : ""}>`,
    `  <Combobox.Input\n    ${attrLines.join("\n    ")}\n  />`,
    `  <Combobox.Content>`,
    `    {people.map(p => <Combobox.Item key={p} value={p}>{p}</Combobox.Item>)}`,
    `  </Combobox.Content>`,
    `</Combobox>`,
  ].join("\n");

  return (
    <Playground
      title="Combobox"
      description="Text input + filterable listbox. Supports validation states, clearable, free‑text, and FormField integration."
      controls={controls}
      preview={preview}
      code={code}
      getAttributes={(el) =>
        getAttrs(el, ["aria-activedescendant", "aria-autocomplete"])
      }
    />
  );
}

// ------------------------------------------------------------------------------
// MultiSelect Playground
// ------------------------------------------------------------------------------
export function MultiSelectDemo() {
  const [variant, setVariant] = useState<InputVariant>("outline");
  const [size, setSize] = useState<InputSize>("md");
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [required, setRequired] = useState(false);
  const [rounded, setRounded] = useState(false);
  const [clearable, setClearable] = useState(false);
  const [capChips, setCapChips] = useState(true);
  const [maxChips, setMaxChips] = useState(3);
  const [placeholder, setPlaceholder] = useState("Select tags");
  const [value, setValue] = useState<string[]>(["bug", "urgent"]);

  const maxVisibleChips = capChips ? maxChips : undefined;

  const controls = (
    <>
      <SegmentedControl
        label="variant"
        value={variant}
        options={VARIANTS}
        onChange={setVariant}
      />
      <SegmentedControl
        label="size"
        value={size}
        options={SIZES}
        onChange={setSize}
      />
      <div className="mb-5">
        <p className="mb-2 font-mono text-[11px] text-text-muted">flags</p>
        <div className="flex flex-wrap gap-1.5">
          <Chip active={disabled} onClick={() => setDisabled((v) => !v)}>
            disabled
          </Chip>
          <Chip active={error} onClick={() => setError((v) => !v)}>
            error
          </Chip>
          <Chip active={success} onClick={() => setSuccess((v) => !v)}>
            success
          </Chip>
          <Chip active={required} onClick={() => setRequired((v) => !v)}>
            required
          </Chip>
          <Chip active={rounded} onClick={() => setRounded((v) => !v)}>
            rounded
          </Chip>
          <Chip active={clearable} onClick={() => setClearable((v) => !v)}>
            clearable
          </Chip>
          <Chip active={capChips} onClick={() => setCapChips((v) => !v)}>
            cap chips
          </Chip>
        </div>
      </div>
      {capChips && (
        <div className="mb-4">
          <label className="mb-1 block font-mono text-[11px] text-text-muted">
            maxVisibleChips
          </label>
          <input
            type="number"
            min={1}
            max={10}
            value={maxChips}
            onChange={(e) => setMaxChips(Number(e.target.value))}
            className="w-full rounded-(--kui-radii-md) border border-border bg-bg px-2 py-1.5 text-sm text-text outline-none focus:border-brand"
          />
        </div>
      )}
      <TextField
        label="placeholder"
        value={placeholder}
        onChange={setPlaceholder}
      />
      <p className="font-mono text-[10px] text-text-muted">
        chip removal is mouse-only for now — see the open design note on the
        trigger nesting
      </p>
    </>
  );

  const preview = (
    <MultiSelect
      value={value}
      onValueChange={setValue}
      variant={variant}
      size={size}
      disabled={disabled}
      error={error}
      success={success}
      required={required}
      rounded={rounded}
      clearable={clearable}
      placeholder={placeholder}
      maxVisibleChips={maxVisibleChips}
    >
      <MultiSelect.Trigger />
      <MultiSelect.Content>
        {TAGS.map((t) => (
          <MultiSelect.Item key={t} value={t}>
            {t}
          </MultiSelect.Item>
        ))}
      </MultiSelect.Content>
    </MultiSelect>
  );

  const attrLines = [
    variant !== "outline" && `variant="${variant}"`,
    size !== "md" && `size="${size}"`,
    disabled && "disabled",
    error && "error",
    success && "success",
    required && "required",
    rounded && "rounded",
    clearable && "clearable",
    `placeholder="${placeholder}"`,
    maxVisibleChips && `maxVisibleChips={${maxVisibleChips}}`,
  ].filter(Boolean) as string[];

  const code = [
    `<MultiSelect\n  value={tags}\n  onValueChange={setTags}\n  ${attrLines.join(
      "\n  ",
    )}\n>`,
    `  <MultiSelect.Trigger />`,
    `  <MultiSelect.Content>`,
    `    {options.map(t => <MultiSelect.Item key={t} value={t}>{t}</MultiSelect.Item>)}`,
    `  </MultiSelect.Content>`,
    `</MultiSelect>`,
  ].join("\n");

  return (
    <Playground
      title="MultiSelect"
      description="Select with an array value — content stays open across selections, trigger renders chips with an overflow count. Supports validation, clearable, and FormField."
      controls={controls}
      preview={preview}
      code={code}
      getAttributes={(el) => getAttrs(el, ["aria-expanded"])}
    />
  );
}
