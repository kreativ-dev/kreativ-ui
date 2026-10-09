import * as React from "react";
import type { z } from "zod";
import { useFormContext } from "../Form.context";
import { Repeater } from "../../Repeater/Repeater";
import { ChevronDown, ChevronUp, Plus, Trash, Trash2, X } from "lucide-react";
import type { UIFieldSchema, UIObjectSchema } from "./uiSchema.types";
import {
  getObjectShape,
  getZodTypeName,
  synthesizeDefault,
  unwrap,
} from "./zodHelpers";
import { isUIFieldSchema, isUIObjectSchema } from "./uiSchemaGuards";
import { renderLeafField } from "./renderLeafField";
import { keyFor, stampKey } from "./generatedKeys";
import { generateFieldsInternal } from "./generateFieldsInternal";
import { ArrayItemFormProvider } from "./ArrayItemFormContext";

export function ArrayField({
  name,
  label,
  description,
  elementType,
  itemUiSchema,
  addLabel,
  itemLabel = "Item",
  removable,
  reorderable,
}: {
  name: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  elementType: z.ZodTypeAny;
  itemUiSchema: UIFieldSchema | UIObjectSchema | undefined;
  addLabel?: React.ReactNode;
  itemLabel?: string;
  removable: boolean;
  reorderable: boolean;
}) {
  const form = useFormContext();

  if (!form) {
    throw new Error(
      "Form.FromSchema's array fields require an enclosing <Form>.",
    );
  }

  const rawValue = form.getValue(name);
  const value = Array.isArray(rawValue) ? rawValue : [];

  const setValue = React.useCallback(
    (next: unknown[]) => {
      form.setValue(name, next);
    },
    [form, name],
  );

  const unwrappedElement = unwrap(elementType);
  const elementIsObject = getZodTypeName(unwrappedElement) === "ZodObject";

  const fieldUiEntry = isUIFieldSchema(itemUiSchema) ? itemUiSchema : undefined;
  const objectUiSchema = isUIObjectSchema(itemUiSchema)
    ? itemUiSchema
    : undefined;

  const itemName = (index: number) => `${itemLabel} ${index + 1}`;

  return (
    <div
      data-form-from-schema-array={name}
      className="kui-form-from-schema-array space-y-3"
    >
      {(label || description) && (
        <div className="space-y-1">
          {label ? (
            <div
              data-form-from-schema-array-label=""
              className="flex items-center gap-2 font-medium"
            >
              <span>{label}</span>
              {value.length > 0 ? (
                <span
                  aria-label={`${value.length} ${itemLabel.toLowerCase()}s`}
                  className="text-sm font-normal text-kui-text-muted"
                >
                  ({value.length})
                </span>
              ) : null}
            </div>
          ) : null}

          {description ? (
            <div
              data-form-from-schema-array-description=""
              className="text-sm text-kui-text-muted"
            >
              {description}
            </div>
          ) : null}
        </div>
      )}

      <Repeater.Root
        value={value}
        onValueChange={setValue}
        getKey={(item) => keyFor(item)}
      >
        {value.length === 0 ? (
          <div
            data-form-from-schema-array-empty=""
            className="flex flex-col items-center justify-center gap-2 rounded-md border border-kui-border border-dashed p-6 text-center"
          >
            <div className="text-sm font-medium">
              No {itemLabel.toLowerCase()}s yet
            </div>
            <div className="text-sm text-kui-text-muted">
              Add{" "}
              {itemLabel.toLowerCase() === "item"
                ? "an item"
                : `a ${itemLabel.toLowerCase()}`}{" "}
              to get started.
            </div>
            <Repeater.Add
              createItem={() => stampKey(synthesizeDefault(elementType))}
            >
              <Plus className="h-4 w-4" />
              {addLabel ?? `Add ${itemLabel.toLowerCase()}`}
            </Repeater.Add>
          </div>
        ) : (
          <Repeater.Items>
            {(_item, index) => (
              <Repeater.Item
                index={index}
                className="rounded-(--kui-radii-lg) border border-kui-border"
              >
                <div className="flex items-center justify-between gap-3 border-b border-kui-border px-3 py-2">
                  <div className="min-w-0 font-medium">{itemName(index)}</div>

                  {(reorderable || removable) && (
                    <div
                      className="flex shrink-0 items-center gap-1"
                      aria-label={`${itemName(index)} actions`}
                    >
                      {reorderable ? (
                        <>
                          <Repeater.MoveUp
                            aria-label={`Move ${itemLabel.toLowerCase()} ${index + 1} up`}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Repeater.MoveUp>
                          <Repeater.MoveDown
                            aria-label={`Move ${itemLabel.toLowerCase()} ${index + 1} down`}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Repeater.MoveDown>
                        </>
                      ) : null}
                      {removable ? (
                        <Repeater.Remove
                          aria-label={`Remove ${itemLabel.toLowerCase()} ${index + 1}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Repeater.Remove>
                      ) : null}
                    </div>
                  )}
                </div>

                <div className="min-w-0 p-3 space-y-2">
                  <ArrayItemFormProvider arrayName={name} index={index}>
                    {elementIsObject
                      ? generateFieldsInternal(
                          getObjectShape(unwrappedElement) ?? {},
                          objectUiSchema,
                          { pathPrefix: `${name}.${index}` },
                        )
                      : renderLeafField(
                          `${name}.${index}`,
                          unwrappedElement,
                          fieldUiEntry,
                          undefined,
                          undefined,
                        )}
                  </ArrayItemFormProvider>
                </div>
              </Repeater.Item>
            )}
          </Repeater.Items>
        )}

        {value.length > 0 ? (
          <div className="pt-1">
            <Repeater.Add
              createItem={() => stampKey(synthesizeDefault(elementType))}
            >
              <Plus className="h-4 w-4" />
              {addLabel ?? `Add ${itemLabel.toLowerCase()}`}
            </Repeater.Add>
          </div>
        ) : null}
      </Repeater.Root>
    </div>
  );
}
