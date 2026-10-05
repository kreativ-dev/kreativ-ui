import { InputField } from "@/components";
import type { ComponentProps } from "react";

type InputFieldProps = ComponentProps<typeof InputField>;

export interface TextFieldProps extends Omit<
  InputFieldProps,
  | "onChange"
  | "value"
  | "label"
  | "onBlur"
> {
  label?: string;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
}

export function TextField({
  label,
  value,
  onChange,
  onBlur,
  placeholder = "",
  size = "sm",
  clearable = true,
  undoable = true,
  labelClassName = "text-text-muted font-normal text-xs font-mono",
  ...rest
}: TextFieldProps) {
  return (
    <InputField
      className="mb-2"
      onChange={(e) => onChange(e.target.value)}
      label={label}
      value={value}
      placeholder={placeholder}
      size={size}
      clearable={clearable}
      labelClassName={labelClassName}
      onBlur={onBlur}
      {...rest}
    />
  );
}
