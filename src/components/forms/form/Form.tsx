import { FormRoot } from "./Form.Root";
import { FormSubmitButton, FormResetButton } from "./Form.Buttons";
import { FormFromSchema } from "./FromSchema/FormFromSchema";

/**
 * Form owns real orchestration, not a thin semantic <form> wrapper —
 * submit handling, validation orchestration across its FormFields,
 * and error aggregation are all Form's responsibility. It provides a
 * FormContext that FormField reads to auto-wire validation/errors/
 * disabled state.
 *
 * Usage:
 * ```tsx
 * <Form schema={zodSchema} onSubmit={handleSubmit}>
 *   <FormField name="email" as={Input} label="Email" />
 *   <Form.SubmitButton><Button>Submit</Button></Form.SubmitButton>
 * </Form>
 *```
 * Or, schema-driven field generation:
 * ```tsx
 * <Form schema={zodSchema} onSubmit={handleSubmit}>
 *   <Form.FromSchema uiSchema={uiSchema} />
 *   <Form.SubmitButton><Button>Submit</Button></Form.SubmitButton>
 * </Form>
 * ```
 */
export const Form = Object.assign(FormRoot, {
  SubmitButton: FormSubmitButton,
  ResetButton: FormResetButton,
  FromSchema: FormFromSchema,
});

export { useFormContext } from "./Form.context";
export type { FormValues, FormErrors, FormContextValue } from "./Form.context";
export type { SchemaLike, ManualValidator, FormRootProps } from "./Form.Root";
export type {
  UISchema,
  UIObjectSchema,
  UIArraySchema,
  UIFieldSchema,
  UIArraySchemaFor,
  UIFieldSchemaFor,
  UIObjectSchemaFor,
  UIObjectSchemaForShape,
  KuiFormControlComponent,
  CustomFieldRenderer,
  UIFieldSchemaRender,
} from "./FromSchema/uiSchema.types";
export { defineUIField } from "./FromSchema/defineUIField";
export type {
  ComponentPropsMap,
  ComponentKey,
} from "./FromSchema/ComponentPropsMap";
