import * as React from "react";
import { FormFieldError } from "../FormField/FormField.types";

export type FormValues = Record<string, unknown>;
export type FormErrors = Record<string, React.ReactNode | undefined>;

export interface FormContextValue {
  values: FormValues;
  isSubmitting: boolean;
  isDirty: boolean;

  schema: unknown;

  setValue: (name: string, value: unknown) => void;
  getValue: (name: string) => unknown;

  setFieldError: (name: string, message: React.ReactNode | undefined) => void;
  registerField: (name: string, element: HTMLElement | null) => void;

  submit: () => void;
  reset: () => void;

  errors: FormErrors;
  errorList: FormFieldError[];
}

export const FormContext = React.createContext<FormContextValue | null>(null);

export function useFormContext(): FormContextValue | null {
  return React.useContext(FormContext);
}
