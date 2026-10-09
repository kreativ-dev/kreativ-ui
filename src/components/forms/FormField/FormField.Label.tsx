"use client";

import { useEffect } from "react";

import { createComponent } from "@splenddev/kreativ-core";

import { cn } from "@/utils";
import { useFormField } from "./FormField.context";
import { FormFieldLabelProps } from "./FormField.types";

export const FormFieldLabel = createComponent<
  FormFieldLabelProps,
  HTMLLabelElement
>({
  displayName: "FormField.Label",
  __kui: {
    role: "display",
    groupSlot: "FormField",
    skeleton: "text",
    video: {
      id: "form-field-label",
      safe: true,
      acceptsChildren: true,
      interactionStates: [],
    },
  },
  render: ({ children, className, ...props }, ref) => {
    const { id, labelId, registerLabel, required } =
      useFormField("FormField.Label");

    useEffect(() => {
      registerLabel(true);
      return () => registerLabel(false);
    }, [registerLabel]);

    return (
      <label
        {...props}
        ref={ref}
        id={labelId}
        htmlFor={id}
        className={cn("text-sm font-medium", className)}
      >
        {children}
        {required ? (
          <span
            aria-hidden="true"
            data-form-field-required-indicator=""
            className="text-kui-destructive ml-1"
          >
            *
          </span>
        ) : null}
      </label>
    );
  },
});
