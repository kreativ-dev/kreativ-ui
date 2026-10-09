import * as React from "react";
import type { z } from "zod";
import { FormField } from "../../FormField/FormField";
import { resolveWidget } from "./widget";
import type { UIFieldSchema } from "./uiSchema.types";
import { isFieldRequired } from "./zodHelpers";

/**
 * Renders one non-object, non-array field. Single controls go through
 * `<FormField as={...}>`; compound controls go through `<FormField.Root>`.
 */
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

  if (formControl === "compound") {
    const CompoundWidget = component as React.ComponentType<
      Record<string, unknown>
    >;
    return (
      <FormField.Root
        key={fullName}
        name={fullName}
        required={required}
        valuePropConvention={valuePropConvention}
      >
        <FormField.Label>{label}</FormField.Label>
        <FormField.Control>
          <CompoundWidget {...props} />
        </FormField.Control>
        <FormField.Description>{description}</FormField.Description>
      </FormField.Root>
    );
  }

  return (
    <FormField
      key={fullName}
      name={fullName}
      as={component as Parameters<typeof FormField>[0]["as"]}
      controlProps={props}
      label={label}
      required={required}
      description={description}
      valuePropConvention={valuePropConvention}
    />
  );
}
