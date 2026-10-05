import { type BaseProps } from "@/types";
import { type ReactNode } from "react";

export type FormFieldStatus = "none" | "error" | "success" | "warning";

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
