import type { z } from "zod";
import type * as React from "react";
import type { ComponentKey, ComponentPropsMap } from "./ComponentPropsMap";
import type { FormControlProps } from "../Form.types";

export interface KuiFormControlValueProps<T = unknown> {
  value?: T;
  onValueChange: (value: T) => void;
}

export type KuiFormControlComponent<
  P extends KuiFormControlValueProps<any> = KuiFormControlValueProps<any>,
> = React.ComponentType<P> & {
  __kui: { formControl: "single" | "compound" };
};

export interface FieldState {
  error?: React.ReactNode;
  invalid: boolean;
  isDirty: boolean;
}

export interface FieldApi<T = unknown> {
  value: T;
  onChange: (value: T) => void;
  onBlur: () => void;
  name: string;
}

export type CustomFieldRenderer<T = unknown> = (args: {
  field: FieldApi<T>;
  fieldState: FieldState;
  controlProps: FormControlProps;
}) => React.ReactNode;

export interface FormFieldProps {
  tone?: "default" | "warning" | "info";
  orientation?: "vertical" | "horizontal";
}

export interface UISectionSchema {
  label?: React.ReactNode;
  description?: React.ReactNode;
  fields: string[];
  layout?: string;
  columns?: string;
  order?: number;
}

export interface UIFieldSchemaBase {
  label?: React.ReactNode;
  description?: React.ReactNode;
  order?: number;
  hidden?: boolean;
  formField?: FormFieldProps;
}

export interface UIFieldSchemaWidgetKey<
  K extends ComponentKey = ComponentKey,
> extends UIFieldSchemaBase {
  widget: K;
  props?: Partial<ComponentPropsMap[K]>;
  render?: never;
}

export interface UIFieldSchemaWidgetComponent<
  P extends KuiFormControlValueProps = KuiFormControlValueProps,
> extends UIFieldSchemaBase {
  widget: KuiFormControlComponent<P>;
  props?: Partial<P>;
  render?: never;
}

export interface UIFieldSchemaWidgetInferred extends UIFieldSchemaBase {
  widget?: never;
  props?: never;
  render?: never;
}

export interface UIFieldSchemaRender<T = unknown> extends UIFieldSchemaBase {
  widget?: never;
  props?: never;
  render: CustomFieldRenderer<T>;
}

export interface UIFieldSchemaBase {
  label?: React.ReactNode;
  description?: React.ReactNode;
  order?: number;
  hidden?: boolean;
  formField?: FormFieldProps;
  /**
   * CSS `grid-area` name used to place this field inside a `$sections`
   * grid. Only honored for leaf fields (widgets, inferred, custom
   * renderers) — object and array groups ignore it. When the field is
   * claimed by a section, the section's own `layout` grid takes precedence.
   */
  gridArea?: string;
}

export type UIFieldSchema<
  K extends ComponentKey = ComponentKey,
  P extends KuiFormControlValueProps = KuiFormControlValueProps,
  T = unknown,
> =
  | UIFieldSchemaWidgetKey<K>
  | UIFieldSchemaWidgetComponent<P>
  | UIFieldSchemaWidgetInferred
  | UIFieldSchemaRender<T>;

export type UIFieldSchemaFor<V> =
  V extends Array<infer Item>
    ? UIArraySchemaFor<Item>
    : V extends object
      ? UIObjectSchemaForShape<V> | UIFieldSchema<ComponentKey, any, V>
      : UIFieldSchema<ComponentKey, any, V>;

export type UIObjectSchema = {
  [key: string]: UIFieldSchema | UIObjectSchema | UIArraySchema;
} & { $sections?: UISectionSchema[] };

export interface UIArraySchema {
  label?: React.ReactNode;
  description?: React.ReactNode;
  item: UIFieldSchema | UIObjectSchema;
  addLabel?: React.ReactNode;
  itemLabel?: string;
  removable?: boolean;
  reorderable?: boolean;
  /**
   * CSS `grid-area` name used to place this field inside a `$sections`
   * grid. Only honored for leaf fields (widgets, inferred, custom
   * renderers) — object and array groups ignore it. When the field is
   * claimed by a section, the section's own `layout` grid takes precedence.
   */
  gridArea?: string;
}

export type UIObjectSchemaFor<Schema extends z.ZodObject<any>> = {
  [K in keyof z.infer<Schema>]?: UIFieldSchemaFor<z.infer<Schema>[K]>;
} & { $sections?: UISectionSchema[] };

export type UIObjectSchemaForShape<V> = {
  [K in keyof V]?: UIFieldSchemaFor<V[K]>;
};

export type UIArraySchemaFor<Item> = {
  label?: React.ReactNode;
  description?: React.ReactNode;
  item: UIFieldSchemaFor<Item>;
  addLabel?: React.ReactNode;
  itemLabel?: string;
  removable?: boolean;
  reorderable?: boolean;
  /**
   * CSS `grid-area` name used to place this field inside a `$sections`
   * grid. Only honored for leaf fields (widgets, inferred, custom
   * renderers) — object and array groups ignore it. When the field is
   * claimed by a section, the section's own `layout` grid takes precedence.
   */
  gridArea?: string;
};

/**
 * Object schema shape with unconstrained keys.
 *
 * @deprecated Use {@link UIObjectSchemaFor} for strict, Zod-inferred key and
 * widget checking. `UIObjectSchema` accepts any string key and any
 * `UIFieldSchema`, so it won't catch typos or wrong widget names — it exists
 * only as the fallback shape when no Zod schema is in scope (e.g. inside a
 * `<Form>` when `Schema` isn't supplied as a type argument). Prefer typing
 * `uiSchema` against the inferred shape:
 *
 * @example
 * const ui: UIObjectSchemaFor<typeof profileSchema> = { ... };
 */
export type UISchema = UIObjectSchema;
