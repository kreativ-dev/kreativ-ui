import { FeedbackStatusProps } from "@/types";
import { type ReactNode } from "react";

export interface ConfirmOptions extends FeedbackStatusProps {
  /** Identity of the request. Dedupe/conflict matching uses key AND message together. */
  key: string;
  title: string;
  /** Plain string (not ReactNode) so key+message equality is well-defined. */
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: ReactNode;
  /** Semantic meaning; "warning"/"error" style the confirm button accordingly and default focus to Cancel. */
}

export class ConfirmConflictError extends Error {
  readonly name = "ConfirmConflictError";
  constructor(
    public readonly pendingKey: string,
    public readonly requestedKey: string,
  ) {
    super(
      `confirmAction("${requestedKey}") rejected: a confirm ("${pendingKey}") is already pending. ` +
        `Confirms do not stack or queue.`,
    );
  }
}
