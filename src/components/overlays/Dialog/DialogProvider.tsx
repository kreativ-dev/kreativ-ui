import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { DialogStack } from "./DialogStack";

const DialogStackContext = createContext<DialogStack | null>(null);

/** Used only when no DialogProvider is mounted, so standalone use still works. */
const fallbackStack = new DialogStack();

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const stack = useMemo(() => new DialogStack(), []);
  return <DialogStackContext.Provider value={stack}>{children}</DialogStackContext.Provider>;
}

/** Nearest provider is the only stack-selection axis (no stackId prop). */
export function useDialogStack(): DialogStack {
  return useContext(DialogStackContext) ?? fallbackStack;
}

/** Subscribes to the stack and returns this dialog's derived state. */
export function useDialogState(id: string) {
  const stack = useDialogStack();
  useSyncExternalStore(stack.subscribe, stack.getSnapshot, stack.getSnapshot);
  return {
    stack,
    isRegistered: stack.isRegistered(id),
    isTopmost: stack.isTopmost(id),
    isSuspended: stack.isSuspended(id),
  };
}
