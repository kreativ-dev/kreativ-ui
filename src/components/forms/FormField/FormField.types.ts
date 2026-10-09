import { SingleFormControlComponent, ValuePropConvention } from "@/types";
import type {
  FormFieldStatus,
  ValidateOn,
} from "@splenddev/kreativ-core/types";
import * as React from "react";
import { type ReactNode } from "react";

export interface FormFieldMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
  forceMount?: boolean;
  "data-kui-motion-gated"?: "true" | "false";
}

export interface FormFieldError {
  name: string;
  message: React.ReactNode;
}

export interface FormFieldMessageProps {
  children?: ReactNode;
}

export interface FormFieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
}

export interface FormFieldDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

export interface FormFieldRootProps {
  id?: string;
  name?: string;
  status?: FormFieldStatus;
  message?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  children?: React.ReactNode;
  validateOn?: ValidateOn;
  valuePropConvention?: ValuePropConvention;
}

export interface FormFieldProps<
  P extends object = Record<string, never>,
> extends Omit<FormFieldRootProps, "children"> {
  as?: SingleFormControlComponent<P>;
  controlProps?: Partial<P>;
  label?: React.ReactNode;
  description?: React.ReactNode;
  message?: React.ReactNode;
  children?: React.ReactNode;
}
