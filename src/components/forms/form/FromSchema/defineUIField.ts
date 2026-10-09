import type { ComponentKey } from "./ComponentPropsMap";
import type {
  KuiFormControlValueProps,
  UIFieldSchema,
  UIFieldSchemaRender,
  UIFieldSchemaWidgetComponent,
  UIFieldSchemaWidgetInferred,
  UIFieldSchemaWidgetKey,
} from "./uiSchema.types";

export function defineUIField<K extends ComponentKey>(
  field: UIFieldSchemaWidgetKey<K>,
): UIFieldSchemaWidgetKey<K>;
export function defineUIField<P extends KuiFormControlValueProps<any>>(
  field: UIFieldSchemaWidgetComponent<P>,
): UIFieldSchemaWidgetComponent<P>;
export function defineUIField(
  field: UIFieldSchemaWidgetInferred,
): UIFieldSchemaWidgetInferred;
export function defineUIField<T>(
  field: UIFieldSchemaRender<T>,
): UIFieldSchemaRender<T>;
export function defineUIField(field: UIFieldSchema): UIFieldSchema {
  return field;
}
