import { cn } from "@/utils";
import { useFormField } from "./FormField.context";
import type { FormFieldMessageProps, FormFieldStatus } from "./FormField.types";

const statusClasses: Record<Exclude<FormFieldStatus, "none">, string> = {
  error: "text-destructive animate-kui-shake [animation-delay:500ms]",
  success: "text-success",
  warning: "text-warning",
};

export function FormFieldMessage({ children }: FormFieldMessageProps) {
  const { messageId, message, status, invalid } = useFormField();

  const content = children ?? message;

  if (!content) {
    return null;
  }

  const effectiveStatus: FormFieldStatus =
    status !== "none" ? status : invalid ? "error" : "none";

  return (
    <p
      id={messageId}
      role={effectiveStatus === "error" ? "alert" : undefined}
      aria-live={effectiveStatus === "error" ? "assertive" : "polite"}
      data-status={effectiveStatus}
      className={cn(
        "text-sm",
        effectiveStatus !== "none" && statusClasses[effectiveStatus],
      )}
    >
      {content}
    </p>
  );
}
