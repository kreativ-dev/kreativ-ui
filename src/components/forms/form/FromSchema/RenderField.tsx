import { useFormContext } from "../Form.context";
import type { UIFieldSchema } from "./uiSchema.types";

/**
 * Runs a field whose uiSchema entry used the `render` arm. No `<FormField>`
 * wrapping — the caller owns the markup.
 */
export function RenderField({
  name,
  render,
}: {
  name: string;
  render: NonNullable<UIFieldSchema["render"]>;
}) {
  const form = useFormContext();
  if (!form) {
    throw new Error(
      "Form.FromSchema's `render` fields require an enclosing <Form>.",
    );
  }

  const value = form.getValue(name);
  const error = form.errors[name];

  const field = {
    value,
    onChange: (next: unknown) => form.setValue(name, next),
    onBlur: () => {},
    name,
  };

  const fieldState = {
    error,
    invalid: Boolean(error),
    isDirty: form.isDirty,
  };

  const controlProps = {
    id: `field-${name}`,
    "aria-invalid": Boolean(error) || undefined,
    "aria-required": undefined,
    "aria-describedby": undefined,
    disabled: false,
  };

  return <>{render({ field, fieldState, controlProps })}</>;
}
