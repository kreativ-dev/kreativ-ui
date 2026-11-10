import type { ReactNode } from "react";
import type {
  ToastEntry,
  ToastOptions,
  ToastPromiseMessages,
  ToastStatus,
  ToastUpdateOptions,
} from "./Toast.types";
import { isDev } from "@/utils/env";

let viewportCount = 0;
let warned = false;

export function registerViewport() {
  viewportCount++;
  return () => {
    viewportCount--;
  };
}

export function warnIfNoViewport() {
  if (!isDev() || warned || viewportCount > 0) return;
  setTimeout(() => {
    if (viewportCount > 0 || warned) return;
    warned = true;
    console.warn(
      "[kreativ-ui/Toast] toast() was called but no <Toast.Viewport> is mounted, so nothing will be displayed. " +
        "Render <Toast.Viewport /> inside <Toast.Provider> (included by default in UIProvider).",
    );
  }, 0);
}

export const TOAST_FALLBACK_DURATION = 5000;
const DEFAULT_MAX_VISIBLE = 5;

type EntryFields = Partial<Omit<ToastEntry, "id" | "rev">>;

const EMPTY: readonly ToastEntry[] = [];
let entries: readonly ToastEntry[] = EMPTY;
let config = {
  maxVisible: DEFAULT_MAX_VISIBLE,
  duration: TOAST_FALLBACK_DURATION,
};
let counter = 0;
const listeners = new Set<() => void>();

function commit(next: readonly ToastEntry[]) {
  entries = next;
  listeners.forEach((l) => l());
}

function enforceMax(list: ToastEntry[]): ToastEntry[] {
  const overflow = list.length - config.maxVisible;
  if (overflow <= 0) return list;
  const evicted = list.slice(0, overflow);
  queueMicrotask(() => evicted.forEach((e) => e.onDismiss?.(e.id)));
  return list.slice(overflow);
}

export const toastStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot: () => entries,
  getServerSnapshot: () => EMPTY,
  getConfig: () => config,

  configure(next: Partial<typeof config>) {
    config = { ...config, ...next };
    commit(enforceMax([...entries]));
  },

  upsert(
    id: string,
    fields: EntryFields,
    opts: { restartTimer?: boolean } = {},
  ) {
    const i = entries.findIndex((e) => e.id === id);
    if (i === -1) {
      commit(
        enforceMax([...entries, { status: "neutral", rev: 0, ...fields, id }]),
      );
      return id;
    }
    const prev = entries[i];
    if (prev.closing) {
      const without = entries.filter((e) => e.id !== id);
      commit(
        enforceMax([
          ...without,
          { status: "neutral", rev: prev.rev + 1, ...fields, id },
        ]),
      );
      return id;
    }
    commit(
      entries.map((e, idx) =>
        idx === i ? merge(prev, fields, opts.restartTimer) : e,
      ),
    );
    return id;
  },

  patch(id: string, fields: EntryFields) {
    const i = entries.findIndex((e) => e.id === id);
    if (i === -1 || entries[i].closing) return;
    commit(entries.map((e, idx) => (idx === i ? merge(e, fields) : e)));
  },

  dismiss(id?: string) {
    const targets = entries.filter(
      (e) => (id == null || e.id === id) && !e.closing,
    );
    if (!targets.length) return;
    commit(
      entries.map((e) => (targets.includes(e) ? { ...e, closing: true } : e)),
    );
    targets.forEach((e) => e.onDismiss?.(e.id));
  },

  remove(id: string) {
    if (!entries.some((e) => e.id === id)) return;
    commit(entries.filter((e) => e.id !== id));
  },

  deregister(id: string) {
    const e = entries.find((x) => x.id === id);
    if (e && !e.closing) toastStore.remove(id);
  },
};

function merge(
  prev: ToastEntry,
  fields: EntryFields,
  restart = false,
): ToastEntry {
  const next = { ...prev, ...fields };
  const changed =
    restart ||
    prev.status !== next.status ||
    prev.duration !== next.duration ||
    prev.loading !== next.loading;
  return { ...next, rev: changed ? prev.rev + 1 : prev.rev };
}

const nextId = () => `kui-toast-${++counter}`;

function create(
  status: ToastStatus,
  message: ReactNode,
  options: ToastOptions = {},
): string {
  const id = options.id ?? nextId();
  warnIfNoViewport();
  return toastStore.upsert(
    id,
    {
      status,
      loading: false,
      title: options.title ?? message,
      description: options.description,
      icon: options.icon,
      action: options.action,
      duration: options.duration,
      dismissible: options.dismissible,
      onDismiss: options.onDismiss,
    },
    { restartTimer: true },
  );
}

function promise<T>(
  source: Promise<T> | (() => Promise<T>),
  messages: ToastPromiseMessages<T>,
  options: ToastOptions = {},
): string {
  const id = options.id ?? nextId();
  toastStore.upsert(
    id,
    {
      status: "neutral",
      loading: true,
      title: messages.loading,
      description: options.description,
      icon: options.icon,
      action: options.action,
      duration: options.duration,
      dismissible: options.dismissible,
      onDismiss: options.onDismiss,
    },
    { restartTimer: true },
  );

  const p = typeof source === "function" ? source() : source;
  // Settle mutates the same entry (queue position kept); status/loading change restarts the timer.
  p.then(
    (data) =>
      toastStore.patch(id, {
        status: "success",
        loading: false,
        title:
          typeof messages.success === "function"
            ? messages.success(data)
            : messages.success,
      }),
    (error) =>
      toastStore.patch(id, {
        status: "error",
        loading: false,
        title:
          typeof messages.error === "function"
            ? messages.error(error)
            : messages.error,
      }),
  );
  return id;
}

function update(id: string, options: ToastUpdateOptions) {
  const { message, ...rest } = options;
  const fields: EntryFields = { ...rest };
  if (message !== undefined && rest.title === undefined) fields.title = message;
  toastStore.patch(id, fields);
}

type ToastFn = ((message: ReactNode, options?: ToastOptions) => string) & {
  success: (message: ReactNode, options?: ToastOptions) => string;
  error: (message: ReactNode, options?: ToastOptions) => string;
  warning: (message: ReactNode, options?: ToastOptions) => string;
  info: (message: ReactNode, options?: ToastOptions) => string;
  brand: (message: ReactNode, options?: ToastOptions) => string;
  promise: typeof promise;
  update: typeof update;
  dismiss: (id?: string) => void;
};

export const toast: ToastFn = Object.assign(
  (message: ReactNode, options?: ToastOptions) =>
    create("neutral", message, options),
  {
    success: (message: ReactNode, options?: ToastOptions) =>
      create("success", message, options),
    error: (message: ReactNode, options?: ToastOptions) =>
      create("error", message, options),
    warning: (message: ReactNode, options?: ToastOptions) =>
      create("warning", message, options),
    info: (message: ReactNode, options?: ToastOptions) =>
      create("info", message, options),
    brand: (message: ReactNode, options?: ToastOptions) =>
      create("brand", message, options),
    promise,
    update,
    dismiss: (id?: string) => toastStore.dismiss(id),
  },
);
