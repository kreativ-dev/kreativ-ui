"use client";

import * as React from "react";

import { composeRefs, createComponent } from "@splenddev/kreativ-core";
import { ReportedValidity } from "@splenddev/kreativ-core/types";

import { FormFieldContext, FormFieldContextValue } from "./FormField.context";
import { FormFieldMessage } from "./FormField.Message";
import { cn } from "@/utils";
import { isDev } from "@/utils/env";
import { useFormContext } from "../form";
import { FormFieldRootProps } from "./FormField.types";

function countMessageComponents(children: React.ReactNode): number {
  let count = 0;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) {
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

export const FormFieldRoot = createComponent<
  FormFieldRootProps,
  HTMLDivElement
>({
  displayName: "FormField.Root",
  __kui: {
    role: "formControl",
    formControl: "compound",
    skeleton: "preserve",
    video: {
      id: "form-field",
      safe: true,
      acceptsChildren: true,
      interactionStates: [],
      controlled: ["invalid", "required"],
    },
  },
  render: (props, ref) => {
    const {
      id: externalId,
      name,
      status: statusProp = "none",
      message: formMessage,
      required = false,
      disabled,
      invalid: invalidProp,
      className,
      children,
      validateOn,
      valuePropConvention,
    } = props;
    const form = useFormContext();
    const fieldRef = React.useRef<HTMLDivElement>(null);
    const generatedId = React.useId();
    const id = externalId ?? generatedId;

    const labelId = `${id}-label`;
    const descriptionId = `${id}-description`;
    const messageId = `${id}-message`;

    const [reportedValidity, setReportedValidity] =
      React.useState<ReportedValidity | null>(null);

    const reportValidity = React.useCallback(
      (result: ReportedValidity | null) => {
        setReportedValidity(result);
        if(name){
          form?.setFieldError(name,result?.invalid?result.message:undefined)
        }
      },
      [name,form],
    );

    const reportedMessage = reportedValidity?.invalid
      ? reportedValidity.message
      : undefined;

    const [labelCount, setLabelCount] = React.useState(0);
    const [descriptionCount, setDescriptionCount] = React.useState(0);

    const registerLabel = React.useCallback((present: boolean) => {
      setLabelCount((count) => count + (present ? 1 : -1));
    }, []);

    const registerDescription = React.useCallback((present: boolean) => {
      setDescriptionCount((count) => count + (present ? 1 : -1));
    }, []);

    const hasExternalLabel = labelCount > 0;

    const schemaMessage = name ? form?.errors?.[name] : undefined;
    const message = formMessage ?? schemaMessage ?? reportedMessage;
    const status =
      statusProp === "none" && (schemaMessage || reportedValidity?.invalid)
        ? "error"
        : statusProp;

    const invalid =
      Boolean(invalidProp) ||
      status === "error" ||
      Boolean(formMessage) ||
      Boolean(schemaMessage) ||
      Boolean(reportedValidity?.invalid);

    const hasCustomMessage = countMessageComponents(children) > 0;

    const describedBy =
      [
        descriptionCount > 0 ? descriptionId : undefined,
        message || hasCustomMessage ? messageId : undefined,
      ]
        .filter(Boolean)
        .join(" ") || undefined;

    React.useEffect(() => {
      if (!isDev()) {
        return;
      }

      if (countMessageComponents(children) > 1) {
        console.warn(
          "[kreativ-ui/FormField.Root]: multiple FormField.Message components " +
            "were detected inside the same FormField. " +
            "Only one custom message should be provided.",
        );
      }
    }, [children]);
    React.useEffect(() => {
      if (!name) return;
      form?.registerField(name, fieldRef.current);
      return () => form?.registerField(name, null);
    }, [name, form]);

    const contextValue: FormFieldContextValue = React.useMemo(
      () => ({
        id,
        name,
        labelId,
        descriptionId,
        messageId,
        message,
        status,
        describedBy,
        invalid,
        required,
        disabled,
        reportValidity,
        registerLabel,
        registerDescription,
        hasExternalLabel,
        validateOn: validateOn,
        valuePropConvention,
      }),
      [
        id,
        name,
        labelId,
        descriptionId,
        messageId,
        message,
        status,
        describedBy,
        invalid,
        required,
        disabled,
        reportValidity,
        registerLabel,
        registerDescription,
        hasExternalLabel,
        validateOn,
        valuePropConvention,
      ],
    );

    return (
      <FormFieldContext.Provider value={contextValue}>
        <div ref={composeRefs(fieldRef,ref)} className={cn("flex flex-col gap-2", className)}>
          {children}
          {!hasCustomMessage && <FormFieldMessage />}
        </div>
      </FormFieldContext.Provider>
    );
  },
});
