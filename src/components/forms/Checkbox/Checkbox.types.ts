import type { InputHTMLAttributes, ReactNode } from "react";
import type {
  ControlledProps,
  StateProps,
  StatusProps,
  Styleable,
} from "@/types/common";
import { InputSize } from "../Input/Input.types";

export interface CheckboxProps
  extends
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "size" | "type" | "checked" | "defaultChecked"
    >,
    Styleable,
    StateProps,
    StatusProps,
    ControlledProps<boolean, "checked", "defaultChecked", "onCheckedChange"> {
  indeterminate?: boolean;
  size?: InputSize;
  disabled?: boolean;
  label?: ReactNode;
  description?: ReactNode;
}
