"use client";

import * as React from "react";

import { composeRefs } from "@splenddev/kreativ-core";

import { useFormContext } from "./Form.context";

export interface FormSubmitButtonProps {
  children: React.ReactElement;
}

/**
 * asChild-style: injects type="submit" + disabled (while invalid or
 * submitting) + aria-busy (while submitting) onto the supplied child.
 * Owns no visual content/spinner of its own — pending state is
 * exposed for the child's own Button to react to.
 *
 * Not a createComponent. It renders no DOM node of its own; the ref is
 * forwarded onto the child. Submit is a one-shot action and is not a
 * video.controlled value.
 */
export const FormSubmitButton = React.forwardRef<
  unknown,
  FormSubmitButtonProps
>(function FormSubmitButton({ children }, ref) {
  const form = useFormContext();
  if (!form) {
    throw new Error(
      "[kreativ-ui/Form.SubmitButton]: must be rendered inside <Form>.",
    );
  }
  console.log(form.errors);

  if (!React.isValidElement(children)) {
    throw new Error(
      "[kreativ-ui/Form.SubmitButton]: requires exactly one React element child.",
    );
  }

  const child = children as React.ReactElement<Record<string, unknown>>;
  const hasErrors = Object.keys(form.errors).length > 0;

  return React.cloneElement(child, {
    type: "submit",
    disabled: hasErrors || form.isSubmitting,
    "aria-busy": form.isSubmitting || undefined,
    ref: composeRefs(
      (child as unknown as { ref?: React.Ref<unknown> }).ref,
      ref,
    ),
  });
});

export interface FormResetButtonProps {
  children: React.ReactElement;
}

/**
 * asChild-style: injects type="button" + an internal reset handler
 * (native type="reset" isn't used since Form's values are
 * controlled/context-owned, not native-form-reset-compatible) +
 * disabled gated on isDirty rather than validity — resetting an
 * invalid, untouched form is a no-op state that should read as
 * disabled; resetting a dirty form should be available regardless of
 * validity.
 *
 * Not a createComponent. Same reason as FormSubmitButton. Reset is a
 * one-shot action and is not a video.controlled value.
 */
export const FormResetButton = React.forwardRef<unknown, FormResetButtonProps>(
  function FormResetButton({ children }, ref) {
    const form = useFormContext();
    if (!form) {
      throw new Error(
        "[kreativ-ui/Form.ResetButton]: must be rendered inside <Form>.",
      );
    }

    if (!React.isValidElement(children)) {
      throw new Error(
        "[kreativ-ui/Form.ResetButton]: requires exactly one React element child.",
      );
    }

    const child = children as React.ReactElement<Record<string, unknown>>;
    const existingOnClick = child.props.onClick as
      | ((e: unknown) => void)
      | undefined;

    return React.cloneElement(child, {
      type: "button",
      disabled: !form.isDirty,
      onClick: (event: unknown) => {
        existingOnClick?.(event);
        form.reset();
      },
      ref: composeRefs(
        (child as unknown as { ref?: React.Ref<unknown> }).ref,
        ref,
      ),
    });
  },
);
