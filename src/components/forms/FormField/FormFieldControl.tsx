import {  type ReactElement } from "react";

type FormFieldControlProps<T = Record<string, unknown>> = {
  children: ReactElement<T>;
};

export function FormFieldControl<T = Record<string, unknown>>({
  children,
}: FormFieldControlProps<T>) {

  return <>{children}</>
}
