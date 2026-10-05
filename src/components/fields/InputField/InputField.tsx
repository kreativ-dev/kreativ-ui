"use client";

import { FormField } from "@/components/forms/FormField";
import { forwardRef } from "react";
import { InputFieldProps } from "./InputField.types";
import { Input } from "@/components/forms/Input";

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      id,
      label,
      description,
      message,
      required,
      optional,
      labelStart,
      labelEnd,
      labelClassName,
      status = "none",
      ...inputProps
    },
    ref,
  ) => {
    const error = status === "error";
    const success = status === "success";
    const warning = status === "warning";

    return (
      <FormField id={id} message={message} required={required}>
        {label && (
          <FormField.Label className={labelClassName}>
            {labelStart}
            {label}
            {optional && <span className="text-text-muted"> (optional)</span>}
            {labelEnd}
          </FormField.Label>
        )}

        <FormField.Control>
          <Input
            {...inputProps}
            ref={ref}
            id={id}
            error={error}
            success={success}
            warning={warning}
            required={required}
          />
        </FormField.Control>

        {description && (
          <FormField.Description>{description}</FormField.Description>
        )}
        <FormField.Message>{message}</FormField.Message>
      </FormField>
    );
  },
);

InputField.displayName = "InputField";
