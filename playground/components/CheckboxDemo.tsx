import { useState } from "react";

import { Checkbox } from "@/components/forms/Checkbox";
import { InputSize } from "@/components/forms/Input/Input.types";
import { FormField, FormFieldStatus } from "@/components/forms/FormField";

import { Playground } from "./shared/Playground";
import { SegmentedControl } from "./shared/SegmentedControl";
import { Chip } from "./shared/Chip";
import { TextField } from "./shared/TextField";
import { getAttrs } from "./shared/getAttributes";

const SIZES: InputSize[] = ["xs", "sm", "md", "lg"];
const STATES: FormFieldStatus[] = ["none", "error", "success", "warning"];

export function CheckboxDemo() {
  const [checked, setChecked] = useState(false);
  const [size, setSize] = useState<InputSize>("md");
  const [state, setState] = useState<FormFieldStatus>("none");

  const [disabled, setDisabled] = useState(false);
  const [required, setRequired] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [useFormField, setUseFormField] = useState(true);

  const [label, setLabel] = useState("Accept terms and conditions");
  const [description, setDescription] = useState("You must agree to continue.");

  const error = state === "error";

  const hasLabel = Boolean(label.trim());
  const hasDescription = Boolean(description.trim());

  const checkboxElement = (
    <Checkbox
      checked={checked}
      onCheckedChange={setChecked}
      size={size}
      status={state}
      disabled={disabled}
      required={required}
      indeterminate={indeterminate}
      label={hasLabel ? label : undefined}
      description={hasDescription ? description : undefined}
    />
  );

  const preview = useFormField ? (
    <FormField
      message={error ? "This field is required" : undefined}
      required={required}
    >
      <FormField.Control>{checkboxElement}</FormField.Control>
    </FormField>
  ) : (
    checkboxElement
  );

  const controls = (
    <>
      <SegmentedControl
        label="size"
        value={size}
        options={SIZES}
        onChange={setSize}
      />

      <SegmentedControl
        label="state"
        value={state}
        options={STATES}
        onChange={setState}
      />

      <div className="mb-4 space-y-2">
        <TextField value={label} onChange={setLabel} label="label" />

        <TextField
          value={description}
          onChange={setDescription}
          label="description"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Chip active={disabled} onClick={() => setDisabled((value) => !value)}>
          disabled
        </Chip>

        <Chip active={required} onClick={() => setRequired((value) => !value)}>
          required
        </Chip>

        <Chip
          active={indeterminate}
          onClick={() => setIndeterminate((value) => !value)}
        >
          indeterminate
        </Chip>

        <Chip
          active={useFormField}
          onClick={() => setUseFormField((value) => !value)}
        >
          FormField
        </Chip>
      </div>
    </>
  );

  const propsList = [
    checked && `checked`,
    `onCheckedChange={setChecked}`,
    size !== "sm" && `size="${size}"`,
    state !== "none" && `status="${state}"`,
    disabled && `disabled`,
    required && `required`,
    indeterminate && `indeterminate`,
    hasLabel && `label="${label}"`,
    hasDescription && `description="${description}"`,
  ]
    .filter(Boolean)
    .join("\n      ");

  const checkboxJsx = `\n    <Checkbox${propsList ? `\n      ${propsList}` : ""}\n    />`;

  const formFieldJsx = `<FormField${
    error ? `\n  error="This field is required"` : ""
  }${required ? `\n  required` : ""}>
  <FormField.Control>
    ${checkboxJsx}
  </FormField.Control>
</FormField>`;

  const code = useFormField ? formFieldJsx : checkboxJsx;

  const extraAttributes = [
    "type",
    "indeterminate",
    "aria-invalid",
    "aria-describedby",
    "data-state-transition",
  ];

  return (
    <Playground
      title="Checkbox"
      description="A customizable checkbox with size-aware typography, validation states, indeterminate state, and FormField integration."
      controls={controls}
      preview={preview}
      code={code}
      attributeSelector="input"
      getAttributes={(el) =>
        getAttrs(el, extraAttributes, [], {
          indeterminate: indeterminate ? "true" : "false",
        })
      }
    />
  );
}
