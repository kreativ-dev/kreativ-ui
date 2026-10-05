"use client";

import { createContext, ReactNode, useContext } from "react";
import { FormFieldStatus } from "./FormField.types";
import { ReportedValidity } from "@/types";

export interface FormFieldContextValue {
  id: string;
  labelId: string;
  descriptionId?: string;
  describedBy?: string;
  messageId?: string;

  status: FormFieldStatus;
  message?: ReactNode;

  invalid: boolean;
  required: boolean;

  reportValidity: (result: ReportedValidity | null) => void;
  registerLabel: () => () => void;
  hasExternalLabel: boolean;
}

export const FormFieldContext = createContext<FormFieldContextValue | null>(
  null,
);

export function useFormField() {
  const context = useContext(FormFieldContext);

  if (!context) {
    throw new Error("FormField components must be used inside <FormField />");
  }

  return context;
}

export function useOptionalFormField() {
  return useContext(FormFieldContext);
}
