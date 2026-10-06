import { useState } from "react";
import { FormField, Select, InputSize, InputVariant } from "../../src";
import { getAttrs } from "./shared/getAttributes";
import { Playground } from "./shared/Playground";
import { Chip } from "./shared/Chip";
import { TextField } from "./shared/TextField";
import { SegmentedControl } from "./shared/SegmentedControl";

const SIZES: InputSize[] = ["sm", "md", "lg"];
const VARIANTS: InputVariant[] = ["outline", "filled", "ghost"];

const COUNTRIES = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "mx", label: "Mexico" },
];

export function SelectDemo() {
  const [variant, setVariant] = useState<InputVariant>("outline");
  const [size, setSize] = useState<InputSize>("md");

  const [disabled, setDisabled] = useState(false);
  const [clearable, setClearable] = useState(true);
  const [rounded, setRounded] = useState(false);
  const [required, setRequired] = useState(false);

  const [value, setValue] = useState<string | undefined>("us");

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const [placeholder, setPlaceholder] = useState("Select a country");

  const [useFormField, setUseFormField] = useState(true);

  const [label, setLabel] = useState("Country");
  const [description, setDescription] = useState(
    "Select your country of residence.",
  );
  const [errorMessage, setErrorMessage] = useState("Please select a country.");

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
        <p className="mb-2 font-mono text-[11px] text-kui-text-muted">flags</p>

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

          <Chip active={clearable} onClick={() => setClearable((v) => !v)}>
            clearable
          </Chip>

          <Chip active={rounded} onClick={() => setRounded((v) => !v)}>
            rounded
          </Chip>

          <Chip active={required} onClick={() => setRequired((v) => !v)}>
            required
          </Chip>

          <Chip
            active={useFormField}
            onClick={() => setUseFormField((v) => !v)}
          >
            FormField
          </Chip>
        </div>
      </div>

      <TextField
        label="placeholder"
        value={placeholder}
        onChange={setPlaceholder}
      />

      {useFormField && (
        <div>
          <p className="mb-2 font-mono text-[11px] text-kui-text-muted">
            FormField copy
          </p>

          <TextField label="label" value={label} onChange={setLabel} />

          <TextField
            label="description"
            value={description}
            onChange={setDescription}
          />

          <TextField
            label="error"
            value={errorMessage}
            onChange={setErrorMessage}
          />
        </div>
      )}
    </>
  );

  const select = (
    <Select
      value={value}
      onValueChange={setValue}
      variant={variant}
      size={size}
      disabled={disabled}
      error={error}
      success={success}
      clearable={clearable}
      rounded={rounded}
      placeholder={placeholder}
    >
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>

      <Select.Content>
        {COUNTRIES.map((country) => (
          <Select.Item key={country.value} value={country.value}>
            {country.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  );

  const preview = useFormField ? (
    <FormField required={required} error={error ? errorMessage : undefined}>
      <FormField.Label>{label}</FormField.Label>

      <FormField.Control>{select}</FormField.Control>

      <FormField.Description>{description}</FormField.Description>
    </FormField>
  ) : (
    select
  );

  const attrLines = [
    variant !== "outline" && `variant="${variant}"`,
    size !== "md" && `size="${size}"`,
    disabled && "disabled",
    error && "error",
    success && "success",
    clearable && "clearable",
    rounded && "rounded",
    required && "required",
    placeholder !== "Select a country" && `placeholder="${placeholder}"`,
  ].filter(Boolean) as string[];

  const code = useFormField
    ? [
        `<FormField${required ? " required" : ""}${error ? ` error="${errorMessage}"` : ""}>`,
        `  <FormField.Label>${label}</FormField.Label>`,
        `  <FormField.Control>`,
        `    <Select${attrLines.length ? "\n      " + attrLines.join("\n      ") : ""}>`,
        `      <Select.Trigger>`,
        `        <Select.Value />`,
        `      </Select.Trigger>`,
        `      <Select.Content>`,
        `        {countries.map(c => (`,
        `          <Select.Item key={c.value} value={c.value}>`,
        `            {c.label}`,
        `          </Select.Item>`,
        `        ))}`,
        `      </Select.Content>`,
        `    </Select>`,
        `  </FormField.Control>`,
        `  <FormField.Description>${description}</FormField.Description>`,
        `</FormField>`,
      ].join("\n")
    : [
        `<Select${attrLines.length ? "\n  " + attrLines.join("\n  ") : ""}>`,
        `  <Select.Trigger>`,
        `    <Select.Value />`,
        `  </Select.Trigger>`,
        `  <Select.Content>`,
        `    {countries.map(c => (`,
        `      <Select.Item key={c.value} value={c.value}>`,
        `        {c.label}`,
        `      </Select.Item>`,
        `    ))}`,
        `  </Select.Content>`,
        `</Select>`,
      ].join("\n");

  return (
    <Playground
      title="Select"
      description="Accessible compound select with keyboard navigation, validation states, clearable values, and FormField integration."
      controls={controls}
      preview={preview}
      code={code}
      getAttributes={(el) =>
        getAttrs(el, [
          "id",
          "role",
          "aria-expanded",
          "aria-controls",
          "aria-describedby",
          "aria-invalid",
          "aria-required",
          "data-state",
        ])
      }
    />
  );
}
