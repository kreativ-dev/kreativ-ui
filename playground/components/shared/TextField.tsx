import { FormField, Input, InputProps } from "@/components";

export interface TextFieldProps extends Omit<
  InputProps,
  "onChange" | "value" | "label" | "onBlur"
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
  ...rest
}: TextFieldProps) {
  return (
    <FormField
      className="mb-2"
      as={Input}
      controlProps={{
        onValueChange: onChange,
        value,
        placeholder,
        size,
        clearable,
        onBlur,
        ...rest,
      }}
      label={label}
    />
  );
}
