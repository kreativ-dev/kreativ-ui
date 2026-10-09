"use client";


import { createComponent } from "@splenddev/kreativ-core";
import type { FormFieldStatus } from "@splenddev/kreativ-core/types";

import { cn } from "@/utils";
import { useFormField } from "./FormField.context";
import { FormFieldMessageProps } from "./FormField.types";

const statusClasses: Record<Exclude<FormFieldStatus, "none">, string> = {
  error: "text-kui-destructive animate-kui-shake [animation-delay:500ms]",
  success: "text-kui-success",
  warning: "text-kui-warning",
};

export const FormFieldMessage = createComponent<
  FormFieldMessageProps,
  HTMLParagraphElement
>({
  displayName: "FormField.Message",
  __kui: {
    role: "display",
    groupSlot: "FormField",
    skeleton: "text",
    video: {
      id: "form-field-message",
      safe: true,
      acceptsChildren: true,
      interactionStates: [],
      motionGated: true,
      controlled: ["forceMount"],
    },
  },
  render: ({ children, forceMount, className, ...props }, ref) => {
    const { messageId, message, status, invalid } =
      useFormField("FormField.Message");

    if (!invalid && !forceMount) {
      return null;
    }

    const content = children ?? message;

    if (!content) {
      return null;
    }

    const effectiveStatus: FormFieldStatus =
      status !== "none" ? status : invalid ? "error" : "none";
    const motionGated = props["data-kui-motion-gated"] === "true";

    return (
      <p
        {...props}
        id={messageId}
        role={effectiveStatus === "error" ? "alert" : undefined}
        aria-live={effectiveStatus === "error" ? "assertive" : "polite"}
        data-status={effectiveStatus}
        ref={ref}
        className={cn(
          "text-sm",
          effectiveStatus !== "none" && statusClasses[effectiveStatus],
          motionGated && "animate-none",
          className,
        )}
      >
        {content}
      </p>
    );
  },
});
