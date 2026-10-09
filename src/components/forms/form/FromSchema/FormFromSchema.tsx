import * as React from "react";
import { z } from "zod";
import { useFormContext } from "../Form.context";
import type {
  UIObjectSchemaFor,
  UIObjectSchemaForShape,
} from "./uiSchema.types";
import { generateFields, InferShape } from "./generateFields";

/**
 * Pulls `.shape` off a Zod object schema, or returns undefined if it isn't
 * one. We check this instead of letting the generator blow up on a
 * non-object schema somewhere less obvious.
 */
function getObjectShape(
  zodType: z.ZodTypeAny,
): Record<string, z.ZodTypeAny> | undefined {
  const asObject = zodType as unknown as {
    shape?: Record<string, z.ZodTypeAny>;
  };
  return asObject.shape;
}

/**
 * Props for using Form.FromSchema inside a parent `<Form schema={...}>`.
 * The schema comes from context, so `schema` is typed `never` here — passing
 * one is a compile error rather than a silent override.
 */
export interface FormFromSchemaContextProps<Schema extends z.ZodObject<any>> {
  /**
   * Zod object schema to generate fields from. When omitted, the enclosing
   * `<Form>`'s schema is used. Providing it here also drives inference of
   * `Schema` for `uiSchema`.
   */
  uiSchema?: UIObjectSchemaFor<Schema>;
  /**
   * Presentation overlay keyed by the schema's field names. When `Schema`
   * is known, keys and per-field props are checked against the inferred
   * shape; otherwise keys are unconstrained.
   */
  schema?: never;
}

/**
 * Props for using Form.FromSchema on its own, with `schema` passed directly.
 */
export interface FormFromSchemaStandaloneProps<
  Schema extends z.ZodObject<any>,
> {
  /**
   * Zod object schema to generate fields from. When omitted, the enclosing
   * `<Form>`'s schema is used. Providing it here also drives inference of
   * `Schema` for `uiSchema`.
   */
  uiSchema?: UIObjectSchemaFor<Schema>;
  /**
   * Presentation overlay keyed by the schema's field names. When `Schema`
   * is known, keys and per-field props are checked against the inferred
   * shape; otherwise keys are unconstrained.
   */
  schema: Schema;
}

/**
 * Props for `<Form.FromSchema>`.
 *
 * `Schema` is inferred from the `schema` prop in standalone mode; when used
 * inside a `<Form>`, supply it explicitly as a type argument to get
 * key-checking on `uiSchema`. Otherwise `uiSchema` falls back to the
 * unconstrained `UIObjectSchema` shape.
 *
 * ### Strict vs. loose `uiSchema` typing
 *
 * - **Strict**: type `uiSchema` as `UIObjectSchemaFor<typeof schema>` (or let
 *   it be inferred by passing `schema` directly). Keys, nested field names,
 *   widget keys, and per-field `props` are all checked against the Zod
 *   output. This is what you want almost everywhere.
 * - **Loose**: `UIObjectSchema` / `UISchema`. Any string key, any
 *   `UIFieldSchema`. Used only as the fallback when `Schema` can't be
 *   inferred (e.g. `<Form.FromSchema uiSchema={...} />` inside a `<Form>`).
 *   Wrong keys, misspelled widgets, and mismatched `props` all type-check.
 *
 * `UISchema` is deprecated for this reason — reach for `UIObjectSchemaFor`
 * whenever you have a Zod schema available.
 */
export type FormFromSchemaProps<
  Schema extends z.ZodObject<any> = z.ZodObject<any>,
> = FormFromSchemaContextProps<Schema> | FormFromSchemaStandaloneProps<Schema>;

/**
 * Generates a set of fields from a Zod object schema.
 *
 * Write the shape once in Zod, optionally layer presentation on top with a
 * `uiSchema`, and skip writing a `<Field>` for every property. Fields you
 * don't mention in `uiSchema` still render — the generator picks a widget
 * based on the Zod type. Use `uiSchema` only for the ones you want to
 * override.
 *
 * `Schema` is inferred automatically when you pass `schema` directly
 * (standalone mode) — `uiSchema`'s keys are checked against that schema's
 * shape with no extra annotation needed. Inside a `<Form>`, there's no
 * `schema` prop for inference to key off, so `Schema` must be supplied
 * explicitly as a type argument for `uiSchema` to get the same
 * key-checking; omitted, it falls back to the unconstrained shape.
 *
 * Schema resolution, in order:
 * 1. The `schema` prop, if you passed one.
 * 2. The enclosing `<Form>`'s schema, if there is one.
 *
 * If neither exists, or the result isn't a `z.object({...})`, this throws.
 * Errors are prefixed `[kreativ-ui/Form.FromSchema]` so they're easy to
 * grep for.
 *
 * Renders a fragment — no wrapper element — so the fields land directly
 * inside whatever container you put this in.
 *
 * @example
 * // Schema from context — Schema isn't inferable here, so uiSchema is
 * // checked against profileSchema only if you supply the type argument:
 * <Form schema={profileSchema}>
 *   <Form.FromSchema<typeof profileSchema> uiSchema={profileUiSchema} />
 * </Form>
 *
 * @example
 * // Schema passed in — Schema is inferred from `schema`, uiSchema is
 * // checked automatically, no type argument needed:
 * <Form.FromSchema schema={profileSchema} uiSchema={profileUiSchema} />
 */
export function FormFromSchema<
  Schema extends z.ZodObject<any> = z.ZodObject<any>,
>({ uiSchema, schema: standaloneSchema }: FormFromSchemaProps<Schema>) {
  const form = useFormContext();

  if (form && standaloneSchema) {
    throw new Error(
      "[kreativ-ui/Form.FromSchema]: don't pass `schema` when rendered inside a <Form> — " +
        "pass it to <Form schema={...}> instead. Having both risks the two schemas diverging.",
    );
  }

  const zodSchema =
    standaloneSchema ?? (form?.schema as z.ZodObject<any> | undefined);

  if (!zodSchema) {
    throw new Error(
      "[kreativ-ui/Form.FromSchema]: requires either a schema prop (standalone mode) or an enclosing " +
        "<Form schema={...}> to read from.",
    );
  }

  const shape = getObjectShape(zodSchema);
  if (!shape) {
    throw new Error(
      "[kreativ-ui/Form.FromSchema]: the resolved schema doesn't look like a Zod object schema " +
        "(z.object({...})). Form.FromSchema only generates fields for object schemas.",
    );
  }

  const fields = generateFields(
    shape,
    uiSchema as
      | UIObjectSchemaForShape<InferShape<Record<string, z.ZodTypeAny>>>
      | undefined,
  );

  return <React.Fragment>{fields}</React.Fragment>;
}
