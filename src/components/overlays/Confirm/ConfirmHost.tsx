import * as React from "react";
import { ConfirmDialog } from "./ConfirmDialog";
import { defaultConfirmManager, type ConfirmRequestManager } from "./ConfirmRequestManager";

export interface ConfirmHostProps {
  manager?: ConfirmRequestManager;
  /** Resolve a pending confirm `false` on browser back/forward. Default true. */
  cancelOnNavigation?: boolean;
}

/**
 * Mount once, inside <DialogProvider> (renders through the shared DialogStack).
 * Bridges the imperative manager to the rendered dialog.
 */
export function ConfirmHost({ manager = defaultConfirmManager, cancelOnNavigation = true }: ConfirmHostProps) {
  const pending = React.useSyncExternalStore(manager.subscribe, manager.getPending, manager.getPending);

  // Host unmount (incl. app teardown / route unmount) => pending resolves false.
  React.useEffect(() => () => manager.cancelAll(), [manager]);

  React.useEffect(() => {
    if (!cancelOnNavigation) return;
    window.addEventListener("popstate", manager.cancelAll);
    return () => window.removeEventListener("popstate", manager.cancelAll);
  }, [manager, cancelOnNavigation]);

  if (!pending) return null;
  const { key: _key, ...dialogOptions } = pending.options;
  return (
    <ConfirmDialog
      key={pending.id}
      id={pending.id}
      {...dialogOptions}
      onResolve={(result) => manager.resolve(pending.id, result)}
    />
  );
}
