import { FormFieldStatus, type BaseProps } from "@splenddev/kreativ-core/types";
import { type ReactNode } from "react";


export interface FormFieldProps extends Omit<BaseProps, "unstyled"> {
  id?: string;

  error?: string;

  message?: ReactNode;

  status?: FormFieldStatus;

  required?: boolean;
}

export interface FormFieldMessageProps {
  children?: ReactNode;
}
