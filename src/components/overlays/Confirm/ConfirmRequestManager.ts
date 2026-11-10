import { ConfirmConflictError, type ConfirmOptions } from "./Confirm.types";

export interface PendingConfirm {
  id: string;
  options: ConfirmOptions;
  promise: Promise<boolean>;
}

interface Entry extends PendingConfirm {
  settle: (result: boolean) => void;
  /** Callers that asked for this request; a shared promise only cancels when all are gone. */
  owners: Set<symbol>;
  ownerless: boolean;
}

/**
 * Owns ONLY dedupe/conflict logic and the single pending slot.
 * It never touches dialog suspension — that is DialogStack's domain, and
 * DialogStack never touches dedupe. No shared state machine between them.
 */
export class ConfirmRequestManager {
  private entry: Entry | null = null;
  private listeners = new Set<() => void>();
  private snapshot: PendingConfirm | null = null;
  private seq = 0;

  request = (options: ConfirmOptions, owner?: symbol): Promise<boolean> => {
    const current = this.entry;

    if (current) {
      const sameKey = current.options.key === options.key;
      const sameMessage = current.options.message === options.message;
      if (sameKey && sameMessage) {
        // Same request: reuse the pending promise, no new dialog.
        if (owner) current.owners.add(owner);
        else current.ownerless = true;
        return current.promise;
      }
      // Different message under same key, or a different key: reject outright.
      // The first request's dialog is left completely untouched. No queueing.
      return Promise.reject(
        new ConfirmConflictError(current.options.key, options.key),
      );
    }

    let settle!: (result: boolean) => void;
    const promise = new Promise<boolean>((res) => (settle = res));
    this.entry = {
      id: `kui-confirm-${++this.seq}`,
      options,
      promise,
      settle,
      owners: new Set(owner ? [owner] : []),
      ownerless: !owner,
    };
    this.publish();
    return promise;
  };

  /** Called by the dialog when the user acts. No-op if `id` is no longer the pending request. */
  resolve = (id: string, result: boolean) => {
    const current = this.entry;
    if (!current || current.id !== id) return;
    this.entry = null;
    current.settle(result);
    this.publish();
  };

  /** Termination (unmount / navigation) resolves `false`, never rejects. */
  cancelAll = () => {
    const current = this.entry;
    if (!current) return;
    this.entry = null;
    current.settle(false);
    this.publish();
  };

  /** Drop one caller. Cancels only if nobody else (incl. ownerless callers) still wants it. */
  cancelOwner = (owner: symbol) => {
    const current = this.entry;
    if (!current || !current.owners.delete(owner)) return;
    if (current.owners.size === 0 && !current.ownerless) this.cancelAll();
  };

  getPending = (): PendingConfirm | null => this.snapshot;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private publish() {
    // Stable snapshot object per pending entry (required by useSyncExternalStore).
    const e = this.entry;
    this.snapshot = e
      ? { id: e.id, options: e.options, promise: e.promise }
      : null;
    this.listeners.forEach((l) => l());
  }
}

export const createConfirmRequestManager = () => new ConfirmRequestManager();

/** Default app-wide manager used by the module-level confirmAction(). */
export const defaultConfirmManager = createConfirmRequestManager();
