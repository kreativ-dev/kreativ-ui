import type { InputHTMLAttributes, ReactNode } from "react";

import type { Styleable } from "@/types/common";

export type SwitchSize = "xs" | "sm" | "md" | "lg";

export interface SwitchProps
  extends
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "size" | "type" | "checked" | "defaultChecked"
    >,
    Styleable {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;

  size?: SwitchSize;

  error?: boolean;
  success?: boolean;

  label?: ReactNode;
  description?: ReactNode;
}
