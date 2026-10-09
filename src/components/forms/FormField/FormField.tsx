"use client";

import * as React from "react";

import { FormFieldRoot } from "./FormField.Root";
import { FormFieldLabel } from "./FormField.Label";
import { FormFieldDescription } from "./FormField.Description";
import { FormFieldMessage } from "./FormField.Message";
import { FormFieldControl } from "./FormField.Control";
import { warnOnFlatCompoundConflict } from "@splenddev/kreativ-core";
import { FormFieldProps } from "./FormField.types";

function FormFieldImpl<P extends object>(
  {
    as: As,
    controlProps,
    label,
    description,
    message,
    children,
    ...rootProps
  }: FormFieldProps<P>,
  ref: React.Ref<unknown>,
) {
  const childArray = React.Children.toArray(children);

  const labelChildPresent = warnOnFlatCompoundConflict({
    flatValue: label,
    children,
    matchType: FormFieldLabel,
    componentName: "FormField",
    propName: "label",
    childName: "FormField.Label",
  });

  const descriptionChildPresent = warnOnFlatCompoundConflict({
    flatValue: description,
    children,
    matchType: FormFieldDescription,
    componentName: "FormField",
    propName: "description",
    childName: "FormField.Description",
  });

  const messageChildPresent = warnOnFlatCompoundConflict({
    flatValue: message,
    children,
    matchType: FormFieldMessage,
    componentName: "FormField",
    propName: "message",
    childName: "FormField.Message",
  });

  const labelNode =
    !labelChildPresent && label ? (
      <FormFieldLabel>{label}</FormFieldLabel>
    ) : null;
  const descriptionNode =
    !descriptionChildPresent && description ? (
      <FormFieldDescription>{description}</FormFieldDescription>
    ) : null;
  const messageNode =
    !messageChildPresent && message ? (
      <FormFieldMessage>{message}</FormFieldMessage>
    ) : null;

  if (As === undefined && childArray.length > 0) {
    return (
      <FormFieldRoot {...rootProps} message={message}>
        {labelNode}
        {descriptionNode}
        {children}
        {messageNode}
      </FormFieldRoot>
    );
  }

  return (
    <FormFieldRoot {...rootProps} message={message}>
      {labelNode}
      {descriptionNode}
      <FormFieldControl ref={ref}>
        {As ? (
          React.createElement(
            As,
            controlProps as React.PropsWithoutRef<P> &
              React.RefAttributes<unknown>,
          )
        ) : (
          <></>
        )}
      </FormFieldControl>
      {messageNode}
    </FormFieldRoot>
  );
}

const FormFieldForwardRef = React.forwardRef(FormFieldImpl) as <
  P extends object,
>(
  props: FormFieldProps<P> & { ref?: React.Ref<unknown> },
) => React.ReactElement | null;

export const FormField = Object.assign(FormFieldForwardRef, {
  Root: FormFieldRoot,
  Label: FormFieldLabel,
  Description: FormFieldDescription,
  Message: FormFieldMessage,
  Control: FormFieldControl,
});
