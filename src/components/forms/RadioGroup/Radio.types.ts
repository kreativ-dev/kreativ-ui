import type { InputHTMLAttributes, ReactNode } from "react";
import type { Styleable } from "@splenddev/kreativ-core/types";

export type RadioSize = "sm" | "md" | "lg";

export interface RadioProps
  extends
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
      | "size"
      | "type"
      | "checked"
      | "defaultChecked"
      | "onChange"
      | "name"
      | "value"
    >,
    Styleable {
  value: string;
  disabled?: boolean;
  label?: ReactNode;
  description?: ReactNode;
}
