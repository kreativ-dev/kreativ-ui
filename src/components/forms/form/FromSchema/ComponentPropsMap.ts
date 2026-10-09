import { CheckboxProps } from "../../Checkbox";
import { InputProps } from "../../Input";
import { NumberStepperProps } from "../../NumberStepper";
import { SelectProps } from "../../Select";
import { SwitchProps } from "../../Switch";
import { TextareaProps } from "../../Textarea";

export interface ComponentPropsMap {
  input: InputProps;
  select: SelectProps;
  switch: SwitchProps;
  textarea: TextareaProps;
  checkbox: CheckboxProps;
  'number-stepper':NumberStepperProps
}

export type ComponentKey = keyof ComponentPropsMap;
