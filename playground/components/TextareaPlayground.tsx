import { useState } from "react";
<<<<<<< HEAD
import { Textarea } from "@/components/Textarea";
import { InputSize, InputVariant } from "@/components/Input/Input.types";
import { TextareaResize } from "@/components/Textarea/Textarea.types";
import { FormField } from "@/components/FormField";
import { Playground } from "./shared/Playground";
import { SegmentedControl } from "./shared/SegmentedControl";
import { Chip } from "./shared/Chip";
import { Input } from "@/components";
=======
import { Textarea } from "@/components/forms/Textarea";
import { InputSize, InputVariant } from "@/components/forms/Input/Input.types";
import { TextareaResize } from "@/components/forms/Textarea/Textarea.types";
import { FormField } from "@/components/forms/FormField";
import { Playground } from "./shared/Playground";
import { SegmentedControl } from "./shared/SegmentedControl";
import { Chip } from "./shared/Chip";
import { InputField } from "@/components";
import { TextField } from "./shared/TextField";
import { ValidateOn } from "@/types";
import { getAttrs } from "./shared/getAttributes";
>>>>>>> refactoring

const SIZES: InputSize[] = ["sm", "md", "lg"];

const VARIANTS: InputVariant[] = ["outline", "filled", "ghost"];
<<<<<<< HEAD
=======

>>>>>>> refactoring
const RESIZE_OPTIONS: TextareaResize[] = [
  "none",
  "both",
  "horizontal",
  "vertical",
];
<<<<<<< HEAD
=======
const VALIDATE_ON: ValidateOn[] = ["both", "change", "blur"];
>>>>>>> refactoring

export function TextareaPlayground() {
  const [value, setValue] = useState("");
  const [size, setSize] = useState<InputSize>("md");
  const [variant, setVariant] = useState<InputVariant>("outline");
  const [resize, setResize] = useState<TextareaResize>("vertical");
<<<<<<< HEAD
  const [fullWidth, setFullWidth] = useState(true);
  const [autoResize, setAutoResize] = useState(false);
  const [minRows, setMinRows] = useState<number | undefined>(undefined);
  const [maxRows, setMaxRows] = useState<number | undefined>(undefined);
  const [clearable, setClearable] = useState(false);
  const [characterCounter, setCharacterCounter] = useState(false);
  const [trimOnBlur, setTrimOnBlur] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [required, setRequired] = useState(false);
  const [useFormField, setUseFormField] = useState(true);
  const [placeholder, setPlaceholder] = useState("Write a message...");
  const [maxLength, setMaxLength] = useState<number | undefined>(undefined);
  const [enableValidation, setEnableValidation] = useState(false);

  const validationRule = enableValidation
    ? (v: string) => {
        if (typeof v !== "string") return "Value must be a string";
        return v.length >= 3 || "Must be at least 3 characters";
      }
    : undefined;

=======
  const [validateOn, setValidateOn] = useState<ValidateOn>("blur");

  const [fullWidth, setFullWidth] = useState(true);
  const [embedded, setEmbedded] = useState(false);

  const [autoResize, setAutoResize] = useState(false);
  const [minRows, setMinRows] = useState<number | undefined>();
  const [maxRows, setMaxRows] = useState<number | undefined>();

  const [clearable, setClearable] = useState(false);
  const [characterCounter, setCharacterCounter] = useState(false);

  const [trim, setTrim] = useState(false);
  const [debounceDelay, setDebounceDelay] = useState(0);

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [warning, setWarning] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [required, setRequired] = useState(false);

  const [allowMarkdown, setAllowMarkdown] = useState(false);
  const [useFormField, setUseFormField] = useState(true);

  const [placeholder, setPlaceholder] = useState("Write a message...");
  const [maxLength, setMaxLength] = useState<number | undefined>();

  const [enableValidation, setEnableValidation] = useState(false);

  const validationRule = enableValidation
    ? (v: string) => {
        return v.length >= 3 || "Must be at least 3 characters";
      }
    : undefined;
  const state = error
    ? "error"
    : success
      ? "success"
      : warning
        ? "warning"
        : "none";

>>>>>>> refactoring
  const textareaElement = (
    <Textarea
      value={value}
      onValueChange={setValue}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
<<<<<<< HEAD
      //   resize={resize}
=======
      resize={resize}
      embedded={embedded}
>>>>>>> refactoring
      autoResize={autoResize}
      minRows={minRows}
      maxRows={maxRows}
      clearable={clearable}
      characterCounter={characterCounter}
<<<<<<< HEAD
      trimOnBlur={trimOnBlur}
      error={error}
      success={success}
=======
      trim={trim}
      debounceDelay={debounceDelay}
      error={error}
      success={success}
      warning={warning}
>>>>>>> refactoring
      disabled={disabled}
      required={required}
      placeholder={placeholder}
      maxLength={maxLength}
<<<<<<< HEAD
      onValidate={validationRule}
      allowMarkdown
    />
  );

  const preview = useFormField ? (
    <FormField
      required={required}
      error={error ? "This field has an error" : undefined}
    >
      <FormField.Label>Message</FormField.Label>
      <FormField.Control>{textareaElement}</FormField.Control>
    </FormField>
  ) : (
    textareaElement
  );

  // Controls
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
      <SegmentedControl
        label="resize"
        value={resize}
        options={RESIZE_OPTIONS}
        onChange={setResize}
      />

      <div className="mb-4 space-y-2">
        <div>
          <label className="block text-xs font-mono text-text-muted mb-1">
            placeholder
          </label>
          <input
            type="text"
            value={placeholder}
            onChange={(e) => setPlaceholder(e.target.value)}
            className="w-full rounded border border-border bg-bg px-2 py-1.5 text-sm outline-none focus:border-brand"
          />
        </div>
        <div className="flex gap-2">
          <FormField className="flex-1">
            <FormField.Label className="block text-xs font-mono text-text-muted">
              minRows
            </FormField.Label>
            <FormField.Control>
              <Input
                size="sm"
                kind="number"
                placeholder="2"
                hideKindIcon
                value={minRows ?? ""}
                onChange={(e) =>
                  setMinRows(
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
            </FormField.Control>
          </FormField>

          <FormField className="flex-1">
            <FormField.Label className="block text-xs font-mono text-text-muted">
              maxRows
            </FormField.Label>
            <FormField.Control>
              <Input
                size="sm"
                kind="number"
                placeholder="10"
                hideKindIcon
                value={maxRows ?? ""}
                onChange={(e) =>
                  setMaxRows(
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
            </FormField.Control>
          </FormField>
        </div>
        <div>
          <FormField className="flex-1">
            <FormField.Label className="block text-xs font-mono text-text-muted">
              maxLength
            </FormField.Label>
            <FormField.Control>
              <Input
                size="sm"
                kind="number"
                placeholder="500"
                hideKindIcon
                value={maxLength ?? ""}
                onChange={(e) =>
                  setMaxLength(
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
            </FormField.Control>
          </FormField>
=======
      validate={validationRule}
      validateOn={validateOn}
      allowMarkdown={allowMarkdown}
      typography="mono"
      //   vali
    />
  );

  const preview = useFormField ? (
    <FormField
      required={required}
      message={error ? "This field has an error" : undefined}
      status={state}
    >
      <FormField.Label>Message</FormField.Label>

      <FormField.Control>{textareaElement}</FormField.Control>
    </FormField>
  ) : (
    textareaElement
  );

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

      <SegmentedControl
        label="resize"
        value={resize}
        options={RESIZE_OPTIONS}
        onChange={setResize}
      />
      <SegmentedControl
        label="validateOn"
        value={validateOn}
        options={VALIDATE_ON}
        onChange={setValidateOn}
      />

      <div className="mb-4 space-y-2">
        <TextField
          label="placeholder"
          value={placeholder}
          onChange={setPlaceholder}
        />

        <div className="grid grid-cols-2 gap-2">
          <InputField
            label="minRows"
            labelClassName="block text-xs font-mono text-text-muted"
            size="sm"
            kind="number"
            placeholder="2"
            hideKindIcon
            clearable
            value={minRows ?? ""}
            onChange={(e) =>
              setMinRows(e.target.value ? Number(e.target.value) : undefined)
            }
          />
          <InputField
            label="maxRows"
            labelClassName="block text-xs font-mono text-text-muted"
            size="sm"
            kind="number"
            placeholder="10"
            hideKindIcon
            clearable
            value={maxRows ?? ""}
            onChange={(e) =>
              setMaxRows(e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <InputField
            label="maxLength"
            labelClassName="block text-xs font-mono text-text-muted"
            size="sm"
            kind="number"
            placeholder="500"
            hideKindIcon
            clearable
            value={maxLength ?? ""}
            onChange={(e) =>
              setMaxLength(e.target.value ? Number(e.target.value) : undefined)
            }
          />

          <InputField
            label="debounceDelay"
            labelClassName="block text-xs font-mono text-text-muted"
            size="sm"
            kind="number"
            placeholder="0"
            hideKindIcon
            clearable
            value={debounceDelay ?? ""}
            onChange={(e) => setDebounceDelay(Number(e.target.value) || 0)}
          />
>>>>>>> refactoring
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Chip active={fullWidth} onClick={() => setFullWidth((v) => !v)}>
          fullWidth
        </Chip>
<<<<<<< HEAD
        <Chip active={autoResize} onClick={() => setAutoResize((v) => !v)}>
          autoResize
        </Chip>
        <Chip active={clearable} onClick={() => setClearable((v) => !v)}>
          clearable
        </Chip>
=======

        <Chip active={embedded} onClick={() => setEmbedded((v) => !v)}>
          embedded
        </Chip>

        <Chip active={autoResize} onClick={() => setAutoResize((v) => !v)}>
          autoResize
        </Chip>

        <Chip active={clearable} onClick={() => setClearable((v) => !v)}>
          clearable
        </Chip>

>>>>>>> refactoring
        <Chip
          active={characterCounter}
          onClick={() => setCharacterCounter((v) => !v)}
        >
          characterCounter
        </Chip>
<<<<<<< HEAD
        <Chip active={trimOnBlur} onClick={() => setTrimOnBlur((v) => !v)}>
          trimOnBlur
        </Chip>
        <Chip active={error} onClick={() => setError((v) => !v)}>
          error
        </Chip>
        <Chip active={success} onClick={() => setSuccess((v) => !v)}>
          success
        </Chip>
        <Chip active={disabled} onClick={() => setDisabled((v) => !v)}>
          disabled
        </Chip>
        <Chip active={required} onClick={() => setRequired((v) => !v)}>
          required
        </Chip>
        <Chip
          active={enableValidation}
          onClick={() => setEnableValidation((v) => !v)}
        >
          validation
        </Chip>
        <Chip active={useFormField} onClick={() => setUseFormField((v) => !v)}>
          FormField
        </Chip>
      </div>
    </>
  );

  // Generate code
  const propsList = [
    value && `value="${value}"`,
    `onValueChange={setValue}`,
    size !== "md" && `size="${size}"`,
    resize !== "vertical" && `resize="${resize}"`,
    !fullWidth && `fullWidth={false}`,
    autoResize && `autoResize`,
    minRows && `minRows={${minRows}}`,
    maxRows && `maxRows={${maxRows}}`,
    clearable && `clearable`,
    characterCounter && `characterCounter`,
    trimOnBlur && `trimOnBlur`,
    error && `error`,
    success && `success`,
    disabled && `disabled`,
    required && `required`,
    placeholder !== "Write a message..." && `placeholder="${placeholder}"`,
    maxLength && `maxLength={${maxLength}}`,
    validationRule && `onValidate={...}`,
  ]
    .filter(Boolean)
    .join("\n   ");

  const textareaJsx = `<Textarea${propsList ? `\n   ${propsList}` + "\n" : ""} />`;

  const formFieldJsx = `<FormField${required ? `\n  required` : ""}${
    error ? `\n  error="This field has an error"` : ""
=======

        <Chip active={trim} onClick={() => setTrim((v) => !v)}>
          trim
        </Chip>

        <Chip active={error} onClick={() => setError((v) => !v)}>
          error
        </Chip>

        <Chip active={success} onClick={() => setSuccess((v) => !v)}>
          success
        </Chip>

        <Chip active={warning} onClick={() => setWarning((v) => !v)}>
          warning
        </Chip>

        <Chip active={disabled} onClick={() => setDisabled((v) => !v)}>
          disabled
        </Chip>

        <Chip active={required} onClick={() => setRequired((v) => !v)}>
          required
        </Chip>

        <Chip
          active={allowMarkdown}
          onClick={() => setAllowMarkdown((v) => !v)}
        >
          allowMarkdown
        </Chip>

        <Chip
          active={enableValidation}
          onClick={() => setEnableValidation((v) => !v)}
        >
          validation
        </Chip>

        <Chip active={useFormField} onClick={() => setUseFormField((v) => !v)}>
          FormField
        </Chip>
      </div>
    </>
  );

  const propsList = [
    value && `value="${value}"`,
    `onValueChange={setValue}`,

    size !== "md" && `size="${size}"`,
    variant !== "outline" && `variant="${variant}"`,
    resize !== "vertical" && `resize="${resize}"`,

    !fullWidth && `fullWidth={false}`,
    embedded && `embedded`,

    autoResize && `autoResize`,
    minRows !== undefined && `minRows={${minRows}}`,
    maxRows !== undefined && `maxRows={${maxRows}}`,

    clearable && `clearable`,
    characterCounter && `characterCounter`,

    trim && `trim`,
    debounceDelay > 0 && `debounceDelay={${debounceDelay}}`,

    error && `error`,
    success && `success`,
    warning && `warning`,
    disabled && `disabled`,
    required && `required`,

    allowMarkdown && `allowMarkdown`,

    placeholder !== "Write a message..." && `placeholder="${placeholder}"`,

    maxLength !== undefined && `maxLength={${maxLength}}`,

    enableValidation && `validate={...}`,
    validateOn && `validateOn="${validateOn}"`,
  ]
    .filter(Boolean)
    .join("\n   ");

  const textareaJsx = `<Textarea${propsList ? `\n   ${propsList}\n` : ""} />`;

  const formFieldJsx = `<FormField${required ? `\n  required` : ""}${
    error ? `\n  message="This field has an error"` : ""
>>>>>>> refactoring
  }\n>
  <FormField.Label>Message</FormField.Label>
  <FormField.Control>
    ${"\n  " + textareaJsx}
  </FormField.Control>
</FormField>`;

  const code = useFormField ? formFieldJsx : textareaJsx;

<<<<<<< HEAD
  const getAttributes = (el: HTMLElement | null) => {
    const textarea = el?.querySelector("textarea");
    return {
      id: textarea?.getAttribute("id") ?? null,
      "aria-invalid": textarea?.getAttribute("aria-invalid") ?? null,
      "aria-describedby": textarea?.getAttribute("aria-describedby") ?? null,
      "aria-required": textarea?.getAttribute("aria-required") ?? null,
      disabled: textarea?.disabled ? "true" : null,
      rows: textarea?.getAttribute("rows") ?? null,
      "data-autoresize": textarea?.getAttribute("data-autoresize") ?? null,
    };
  };

  return (
    <Playground
      title="Textarea"
      description="Flexible textarea with auto-resize, validation, counters, and FormField integration."
      controls={controls}
      preview={preview}
      code={code}
      getAttributes={getAttributes}
=======
  const extraAttributes = [
    "aria-invalid",
    "aria-describedby",
    "aria-required",
    "rows",

    "data-size",
    "data-invalid",
    "data-success",
    "data-warning",
    "data-disabled",
    "data-autoresize",
    "data-maxlength-reached",
  ];

  return (
    <Playground
      title="Textarea"
      description="Flexible textarea with auto-resize, validation, counters, Markdown editing, and FormField integration."
      controls={controls}
      preview={preview}
      code={code}
      attributeSelector="textarea"
      getAttributes={(el) => getAttrs(el, extraAttributes)}
>>>>>>> refactoring
    />
  );
}
