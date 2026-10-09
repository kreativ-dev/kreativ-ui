"use client";

import { useEffect } from "react";

import { createComponent } from "@splenddev/kreativ-core";

import { cn } from "@/utils";
import { useFormField } from "./FormField.context";
import { FormFieldDescriptionProps } from "./FormField.types";

export const FormFieldDescription = createComponent<
  FormFieldDescriptionProps,
  HTMLParagraphElement
>({
  displayName: "FormField.Description",
  __kui: {
    role: "display",
    groupSlot: "FormField",
    skeleton: "text",
    video: {
      id: "form-field-description",
      safe: true,
      acceptsChildren: true,
      interactionStates: [],
    },
  },
  render: ({ children, className, ...props }, ref) => {
    const { descriptionId, registerDescription } = useFormField(
      "FormField.Description",
    );

    useEffect(() => {
      registerDescription(true);
      return () => registerDescription(false);
    }, []);

    return (
      <p
        {...props}
        ref={ref}
        id={descriptionId}
        className={cn("text-sm text-kui-muted", className)}
      >
        {children}
      </p>
    );
  },
});
