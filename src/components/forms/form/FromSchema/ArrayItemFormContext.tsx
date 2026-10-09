import * as React from "react";
import { FormContext, type FormContextValue } from "../Form.context";
import { useFormContext } from "../Form.context";

export function ArrayItemFormProvider({
  arrayName,
  index,
  children,
}: {
  arrayName: string;
  index: number;
  children: React.ReactNode;
}) {
  const parentForm = useFormContext();

  if (!parentForm) {
    throw new Error("ArrayItemFormProvider requires an enclosing <Form>.");
  }

  const itemPrefix = `${arrayName}.${index}.`;

  const setValue = React.useCallback<FormContextValue["setValue"]>(
    (fieldName, value) => {
      if (!fieldName.startsWith(itemPrefix)) {
        parentForm.setValue(fieldName, value);
        return;
      }
      const fieldKey = fieldName.slice(itemPrefix.length);
      const current = parentForm.getValue(arrayName);
      const arr = Array.isArray(current) ? current.slice() : [];
      const currentItem =
        arr[index] && typeof arr[index] === "object" ? arr[index] : {};
      arr[index] = { ...currentItem, [fieldKey]: value };
      parentForm.setValue(arrayName, arr);
    },
    [parentForm, arrayName, index, itemPrefix],
  );

  const getValue = React.useCallback<FormContextValue["getValue"]>(
    (fieldName) => {
      if (!fieldName.startsWith(itemPrefix)) {
        return parentForm.getValue(fieldName);
      }
      const fieldKey = fieldName.slice(itemPrefix.length);
      const current = parentForm.getValue(arrayName);
      const arr = Array.isArray(current) ? current : [];
      const item = arr[index];
      return item && typeof item === "object"
        ? (item as Record<string, unknown>)[fieldKey]
        : undefined;
    },
    [parentForm, arrayName, index, itemPrefix],
  );

  const contextValue = React.useMemo<FormContextValue>(
    () => ({ ...parentForm, setValue, getValue }),
    [parentForm, setValue, getValue],
  );

  return (
    <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
  );
}
