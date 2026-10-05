import { useState } from "react";
import { RadioGroup, Radio } from "@/components/forms/RadioGroup";
import { RadioSize } from "@/components/forms/RadioGroup/Radio.types";
import { FormField } from "@/components/forms/FormField";
import { Playground } from "./shared/Playground";
import { SegmentedControl } from "./shared/SegmentedControl";
import { Chip } from "./shared/Chip";
import { Orientation } from "@/types";

type State = "none" | "error" | "success";
const SIZES: RadioSize[] = ["sm", "md", "lg"];
const STATES: State[] = ["none", "error", "success"];
const ORIENTATIONS: Orientation[] = ["horizontal", "vertical"];

const OPTIONS = [
  { value: "option1", label: "Option 1", description: "First option" },
  { value: "option2", label: "Option 2", description: "Second option" },
  { value: "option3", label: "Option 3", description: "Third option" },
];

export function RadioGroupPlayground() {
  const [value, setValue] = useState("");
  const [size, setSize] = useState<RadioSize>("md");
  const [state, setState] = useState<State>("none");
  const [disabled, setDisabled] = useState(false);
  const [required, setRequired] = useState(false);
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
    "vertical",
  );
  const [useFormField, setUseFormField] = useState(true);

  const error = state === "error";
  const success = state === "success";

  const radioGroupElement = (
    <RadioGroup
      value={value}
      onValueChange={setValue}
      size={size}
      error={error}
      success={success}
      disabled={disabled}
      required={required}
      orientation={orientation}
    >
      {OPTIONS.map((option) => (
        <Radio
          key={option.value}
          value={option.value}
          label={option.label}
          description={option.description}
        />
      ))}
    </RadioGroup>
  );

  const preview = useFormField ? (
    <FormField
      error={error ? "Please select an option" : undefined}
      required={required}
    >
      <FormField.Label>Choose an option</FormField.Label>

      {radioGroupElement}
    </FormField>
  ) : (
    radioGroupElement
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
      <SegmentedControl
        label="orientation"
        value={orientation}
        options={ORIENTATIONS}
        onChange={setOrientation}
      />

      <div className="flex flex-wrap gap-1.5">
        <Chip active={disabled} onClick={() => setDisabled((v) => !v)}>
          disabled
        </Chip>
        <Chip active={required} onClick={() => setRequired((v) => !v)}>
          required
        </Chip>
        <Chip active={useFormField} onClick={() => setUseFormField((v) => !v)}>
          FormField
        </Chip>
      </div>
    </>
  );

  const propsList = [
    `value={${value ? `"${value}"` : "undefined"}}`,
    `onValueChange={setValue}`,
    size !== "md" && `size="${size}"`,
    error && `error`,
    success && `success`,
    disabled && `disabled`,
    required && `required`,
    orientation !== "vertical" && `orientation="${orientation}"`,
  ]
    .filter(Boolean)
    .join("\n  ");

  const itemsCode = OPTIONS.map(
    (option) =>
      `<Radio
    value="${option.value}"
    label="${option.label}"
    description="${option.description}"
  />`,
  ).join("\n  ");

  const radioGroupJsx = `<RadioGroup${propsList ? `\n  ${propsList}` : ""}>
  ${itemsCode}
</RadioGroup>`;

  const formFieldJsx = `<FormField${error ? `\n  error="Please select an option"` : ""}${
    required ? `\n  required` : ""
  }>
  <FormField.Label>Choose an option</FormField.Label>
  ${radioGroupJsx}
</FormField>`;

  const code = useFormField ? formFieldJsx : radioGroupJsx;

  const getAttributes = (el: HTMLElement | null) => {
    const firstRadio = el?.querySelector("input[type='radio']");
    return {
      name: firstRadio?.getAttribute("name") ?? null,
      "aria-required": el?.getAttribute("aria-required") ?? null,
      "aria-invalid": el?.getAttribute("aria-invalid") ?? null,
      disabled: firstRadio?.getAttribute("disabled") ? "true" : null,
    };
  };

  return (
    <Playground
      title="RadioGroup"
      description="A group of radio buttons with labels, descriptions, validation states, and FormField integration."
      controls={controls}
      preview={preview}
      code={code}
      getAttributes={getAttributes}
    />
  );
}
