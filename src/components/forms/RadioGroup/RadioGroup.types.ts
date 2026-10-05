import type { ReactNode } from "react";
import type { Styleable } from "@/types/common";
import type { RadioSize } from "./Radio.types";

export interface RadioGroupProps extends Styleable {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  orientation?: "horizontal" | "vertical";
  size?: RadioSize;
  error?: boolean;
  success?: boolean;
  children: ReactNode;
}