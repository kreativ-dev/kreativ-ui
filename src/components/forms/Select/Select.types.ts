import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { InputVariant, InputSize } from "../Input/Input.types";
import type {
  BaseProps,
  ClearableProps,
  DisabledProps,
  SizeProps,
  StateProps,
  Styleable,
  ValueProps,
  VariantProps,
} from "@splenddev/kreativ-core";

export interface SelectRootProps
  extends
    Omit<
      HTMLAttributes<HTMLDivElement>,
      "onChange" | "children" | "defaultValue"
    >,
    Omit<BaseProps, "children">,
    Omit<SizeProps, "size">,
    ValueProps<string | undefined>,
    VariantProps<InputVariant>,
    DisabledProps,
    Omit<ClearableProps, "onClear">,
    Omit<StateProps, "warning" | "scrollIntoViewOnError"> {
  rounded?: boolean;
  placeholder?: string;
  required?: boolean;
  name?: string;
  size?: InputSize;
  children: ReactNode;
}

export interface SelectTriggerProps
  extends
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "className">,
    Styleable {}

export interface SelectContentProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "className">, Styleable {}

export interface SelectItemProps
  extends
    Omit<HTMLAttributes<HTMLDivElement>, "children" | "className">,
    DisabledProps,
    Styleable {
  value: string;
  children: ReactNode;
}

export interface SelectValueProps extends Styleable {
  placeholder?: string;
}

export interface SelectGroupProps
  extends Styleable, Required<Pick<BaseProps, "children">> {}

export interface SelectLabelProps
  extends Styleable, Required<Pick<BaseProps, "children">> {}