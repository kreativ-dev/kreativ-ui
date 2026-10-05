import type { ReactNode } from "react";
import type {
  BaseProps,
  BaseVariant,
  ClearableProps,
  ControlledProps,
  DisabledProps,
  SizeProps,
  StateProps,
  StatusProps,
  ValueProps,
  VariantProps,
} from "@/types/common";
import type { InputProps } from "../Input/Input.types";

export interface ComboboxProps
  extends
    Omit<BaseProps, "unstyled">,
    ValueProps<string | undefined>,
    ControlledProps<
      string | undefined,
      "inputValue",
      "defaultInputValue",
      "onInputChange"
    >,
    DisabledProps,
    VariantProps<BaseVariant>,
    SizeProps,
    ClearableProps,
    StatusProps,
    StateProps {
  required?: boolean;

  rounded?: boolean;

  name?: string;
  placeholder?: string;
  allowFreeText?: boolean;
}

export interface ComboboxItemProps {
  value: string;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

export interface ComboboxInputProps extends InputProps {
  allowFreeText?: boolean;
}
