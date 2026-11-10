import * as React from "react";
import type { ConfirmOptions } from "./Confirm.types";
import { defaultConfirmManager, type ConfirmRequestManager } from "./ConfirmRequestManager";

export type ConfirmActionFn = (options: ConfirmOptions) => Promise<boolean>;

export function createConfirmAction(manager: ConfirmRequestManager): ConfirmActionFn {
  return (options) => manager.request(options);
}

/**
 * Imperative, async, window.confirm-shaped:
 *   if (await confirmAction({ key: "delete-project", title: "Delete project?" })) { ... }
 * Resolves true/false. Rejects with ConfirmConflictError if a different confirm is pending.
 */
export const confirmAction: ConfirmActionFn = createConfirmAction(defaultConfirmManager);

/**
 * Same behaviour, but requests are tied to the calling component's lifetime:
 * if it unmounts while its confirm is pending, the confirm resolves `false`.
 */
export function useConfirmAction(manager: ConfirmRequestManager = defaultConfirmManager): ConfirmActionFn {
  const [owner] = React.useState(() => Symbol("confirm-owner"));
  React.useEffect(() => () => manager.cancelOwner(owner), [manager, owner]);
  return React.useCallback((options) => manager.request(options, owner), [manager, owner]);
}
