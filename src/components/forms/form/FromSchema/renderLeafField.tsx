import * as React from "react";
import type { z } from "zod";
import { FormField } from "../../FormField/FormField";
import { resolveWidget } from "./widget";
import type { UIFieldSchema } from "./uiSchema.types";
import { isFieldRequired } from "./zodHelpers";
import { useFormContext } from "../Form.context";
import { ValuePropConvention } from "@/types";

function BoundLeafField({
  fullName,
  component,
  props,
  formControl,
  valuePropConvention,
  required,
  label,
  description,
}: {
  fullName: string;
  label: React.ReactNode;
  component: React.ComponentType<any> & {
    __kui: {
      formControl: "single" | "compound";
    };
  };
  props: Record<string, unknown>;
  formControl: "single" | "compound";
  valuePropConvention: ValuePropConvention;
  required: boolean;
  description: React.ReactNode;
}) {
  const form = useFormContext();

  const boundProps = React.useMemo(() => {
    if (!form) return props;
    const value = form.getValue(fullName);
    const onChangeHandler = (next: unknown) => form.setValue(fullName, next);
    return valuePropConvention === "checked"
      ? { ...props, checked: value ?? false, onCheckedChange: onChangeHandler }
      : { ...props, value, onValueChange: onChangeHandler };
  }, [form, fullName, valuePropConvention, props]);

  if (formControl === "compound") {
    const CompoundWidget = component as React.ComponentType<
      Record<string, unknown>
    >;
    return (
      <FormField.Root
        name={fullName}
        required={required}
        valuePropConvention={valuePropConvention}
      >
        <FormField.Label>{label}</FormField.Label>
        <FormField.Control>
          <CompoundWidget {...boundProps} />
        </FormField.Control>
        <FormField.Description>{description}</FormField.Description>
      </FormField.Root>
    );
  }

  return (
    <FormField
      as={component as Parameters<typeof FormField>[0]["as"]}
      name={fullName}
      controlProps={boundProps}
      label={label}
      required={required}
      description={description}
      valuePropConvention={valuePropConvention}
    />
  );
}

export function renderLeafField(
  fullName: string,
  zodType: z.ZodTypeAny,
  fieldUiEntry: UIFieldSchema | undefined,
  label: React.ReactNode,
  description: React.ReactNode | undefined,
): React.ReactNode {
  const { component, props, formControl, valuePropConvention } = resolveWidget(
    zodType,
    fieldUiEntry,
  );
  const required = isFieldRequired(zodType);

  return (
    <BoundLeafField
      key={fullName}
      fullName={fullName}
      component={component}
      props={props}
      formControl={formControl}
      valuePropConvention={valuePropConvention}
      required={required}
      label={label}
      description={description}
    />
  );
}