import type { ReactNode } from "react";
import type { Styleable } from "@/types/common";
import type { InputVariant, InputSize } from "../Input/Input.types";

export interface MultiSelectProps extends Styleable {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  success?: boolean;
  rounded?: boolean;
  clearable?: boolean;
  name?: string;
  variant?: InputVariant;
  size?: InputSize;
  placeholder?: string;
  maxVisibleChips?: number;
  children: ReactNode;
}

export interface MultiSelectItemProps {
  value: string;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}
