"use client";

import {
  Children,
  isValidElement,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useState,
} from "react";

import { FormFieldContext } from "./FormField.context";
import type { FormFieldProps } from "./FormField.types";

import {
  FormFieldLabel,
  FormFieldDescription,
  FormFieldMessage,
  FormFieldControl,
} from ".";

import { cn } from "@/utils";
import { isDev } from "@/utils/env";
import { ReportedValidity } from "@/types";

export function FormField({
  id: externalId,
  status = "none",
  message: formMessage,
  required = false,
  className,
  children,
}: FormFieldProps) {
  const generatedId = useId();

  const id = externalId ?? generatedId;

  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  const messageId = `${id}-message`;

  const [reportedValidity, setReportedValidity] =
    useState<ReportedValidity | null>(null);

  const reportValidity = useCallback((result: ReportedValidity | null) => {
    setReportedValidity(result);
  }, []);

  const reportedMessage = reportedValidity?.invalid
    ? reportedValidity.message
    : undefined;

  const [labelCount, setLabelCount] = useState(0);

  function countMessageComponents(children: ReactNode): number {
    let count = 0;

    Children.forEach(children, (child) => {
      if (!isValidElement<{ children?: ReactNode }>(child)) {
        return;
      }

      if (child.type === FormFieldMessage) {
        count += 1;
        return;
      }

      if (child.props.children) {
        count += countMessageComponents(child.props.children);
      }
    });

    return count;
  }

  const registerLabel = useCallback(() => {
    setLabelCount((count) => count + 1);

    return () => {
      setLabelCount((count) => count - 1);
    };
  }, []);

  const hasExternalLabel = labelCount > 0;

  const displayedMessage = formMessage ?? reportedMessage;

  const message = displayedMessage;

  const invalid =
    status === "error" ||
    Boolean(formMessage) ||
    Boolean(reportedValidity?.invalid);

  const messageCount = countMessageComponents(children);
  const hasCustomMessage = messageCount > 0;

  const describedBy =
    [descriptionId, message || hasCustomMessage ? messageId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  useEffect(() => {
    if (!isDev()) {
      return;
    }

    if (messageCount > 1) {
      console.warn(
        "[Kreativ UI] Multiple <FormField.Message /> components " +
          "were detected inside the same <FormField>. " +
          "Only one custom message should be provided.",
      );
    }
  }, [messageCount]);

  return (
    <FormFieldContext.Provider
      value={{
        id,
        labelId,
        descriptionId,
        messageId,

        message,
        status,

        describedBy,

        invalid,
        required,

        reportValidity,
        registerLabel,

        hasExternalLabel,
      }}
    >
      <div className={cn("flex flex-col gap-2", className)}>
        {children}

        {!hasCustomMessage && <FormFieldMessage />}
      </div>
    </FormFieldContext.Provider>
  );
}

FormField.Label = FormFieldLabel;
FormField.Control = FormFieldControl;
FormField.Description = FormFieldDescription;
FormField.Message = FormFieldMessage;
