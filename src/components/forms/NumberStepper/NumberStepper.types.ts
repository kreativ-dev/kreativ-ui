import type * as React from "react";
import { BaseInputProps, InputVariant } from "../Input";

export interface NumberStepperValidationResult {
  valid: boolean;
  value: number | null;
  errors: Array<"required" | "invalid" | "min" | "max" | "step">;
}

export type NumberStepperClampOn = "change" | "blur" | "commit" | "never";
export type NumberStepperButtonLayout = "vertical" | "horizontal";

export interface NumberStepperProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: BaseInputProps["onValueChange"];

  min?: number;
  max?: number;
  step?: number;
  precision?: number;

  variant?: InputVariant;

  error?: boolean;
  success?: boolean;

  rounded?: boolean;
  fullWidth?: boolean;

  clampOn?: NumberStepperClampOn;
  onValidate?: (result: NumberStepperValidationResult) => void;

  buttonLayout?: NumberStepperButtonLayout;
  disabled?: boolean;
  required?: boolean;
  name?: string;

  size?: "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
}
