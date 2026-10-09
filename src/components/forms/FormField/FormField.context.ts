"use client";

import { createContext, ReactNode, useContext } from "react";
import type {
  ReportedValidity,
  FormFieldStatus,
  ValidateOn,
} from "@splenddev/kreativ-core/types";
import { ValuePropConvention } from "@/types";

export interface FormFieldContextValue {
  id: string;
  name?: string;
  labelId: string;
  descriptionId?: string;
  describedBy?: string;
  messageId?: string;

  status: FormFieldStatus;
  message?: ReactNode;

  invalid: boolean;
  required: boolean;
  disabled?: boolean;

  validateOn?: ValidateOn;

  valuePropConvention?: ValuePropConvention;

  reportValidity: (result: ReportedValidity | null) => void;
  registerLabel: (present: boolean) => void;
  registerDescription: (present: boolean) => void;
  hasExternalLabel: boolean;

 
}

export const FormFieldContext = createContext<FormFieldContextValue | null>(
  null,
);

export function useFormField(partName?: string) {
  const context = useContext(FormFieldContext);

  if (!context) {
    const who = partName ?? "FormField component";
    throw new Error(
      `[kreativ-ui/FormField]: ${who} must be used inside <FormField />`,
    );
  }

  return context;
}

export function useOptionalFormField() {
  return useContext(FormFieldContext);
}
