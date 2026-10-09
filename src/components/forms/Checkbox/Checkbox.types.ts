import type { InputHTMLAttributes, ReactNode } from "react";
import type {
  ControlledProps,
  StateProps,
  StatusProps,
  Styleable,
} from "@splenddev/kreativ-core/types";
import { InputSize } from "../Input/Input.types";
import { MotionGatedProps } from "@/types";

export interface CheckboxProps
  extends
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "size" | "type" | "checked" | "defaultChecked" | "children"
    >,
    Styleable,
    StateProps,
    StatusProps,
    MotionGatedProps,
    ControlledProps<boolean, "checked", "defaultChecked", "onCheckedChange"> {
  indeterminate?: boolean;
  size?: InputSize;
  disabled?: boolean;
  label?: ReactNode;
  description?: ReactNode;
}
