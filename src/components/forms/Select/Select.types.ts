import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { InputVariant, InputSize } from "../Input/Input.types";

export interface SelectProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  className?: string;
  rounded?: boolean;

  error?: boolean;
  success?: boolean;

  value?: string;

  placeholder?: string;

  defaultValue?: string;

  onValueChange?(value: string | undefined): void;

  required?: boolean;
  name?: string;
  disabled?: boolean;

  clearable?: boolean;

  variant?: InputVariant;

  size?: InputSize;

  children: ReactNode;
}

export interface SelectTriggerProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "value"
> {
  className?: string;
}

export interface SelectContentProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export interface SelectItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
  children: ReactNode;
}

export interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

export interface SelectGroupProps {
  children: ReactNode;
  className?: string;
}

export interface SelectLabelProps {
  children: ReactNode;
  className?: string;
}
