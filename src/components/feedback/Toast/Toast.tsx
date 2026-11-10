"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { useTheme } from "@splenddev/kreativ-core";
import { useValidateChildren } from "@splenddev/kreativ-core";
import { createComponent } from "@splenddev/kreativ-core/utils";

import { cn } from "@/utils";
import { resolveRecipe } from "@/theme/recipes/resolveRecipe";

import { prefersReducedMotion, useToastTimer, useToasts } from "./Toast.hooks";
import { registerViewport, toastStore } from "./Toast.store";
import type {
  ToastEntry,
  ToastOptions,
  ToastPlacement,
  ToastStatus,
} from "./Toast.types";

const EXIT_MS = 160;

interface ViewportContextValue {
  paused: boolean;
  placement: ToastPlacement;
}
const ViewportContext = createContext<ViewportContextValue>({
  paused: false,
  placement: "bottom-end",
});

interface ToastItemContextValue {
  id: string;
  status: ToastStatus;
  loading: boolean;
  dismiss: () => void;
  pause: () => void;
  resume: () => void;
}
const ToastItemContext = createContext<ToastItemContextValue | null>(null);

function useToastItem(part: string) {
  const ctx = useContext(ToastItemContext);
  if (!ctx) throw new Error(`<${part}> must be rendered inside a Toast.`);
  return ctx;
}

function Svg({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

function DefaultIcon({
  status,
  loading,
}: {
  status: ToastStatus;
  loading: boolean;
}) {
  if (loading) {
    return (
      <Svg className="animate-spin">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </Svg>
    );
  }
  switch (status) {
    case "success":
      return (
        <Svg>
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </Svg>
      );
    case "error":
      return (
        <Svg>
          <circle cx="12" cy="12" r="10" />
          <path d="m15 9-6 6M9 9l6 6" />
        </Svg>
      );
    case "warning":
      return (
        <Svg>
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
          <path d="M12 9v4M12 17h.01" />
        </Svg>
      );
    default:
      return (
        <Svg>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </Svg>
      );
  }
}

export const ToastIcon = createComponent<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>({
  displayName: "Toast.Icon",
  __kui: { groupSlot: "Toast" },
  render: ({ className, children, ...rest }, ref) => {
    const { theme } = useTheme();
    const { status, loading } = useToastItem("Toast.Icon");
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          resolveRecipe(theme.recipes.ToastIcon, { status }),
          className,
        )}
        {...rest}
      >
        {children ?? <DefaultIcon status={status} loading={loading} />}
      </div>
    );
  },
});

export const ToastContent = createComponent<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>({
  displayName: "Toast.Content",
  __kui: { groupSlot: "Toast" },
  render: ({ className, ...rest }, ref) => {
    const { theme } = useTheme();
    return (
      <div
        ref={ref}
        className={cn(resolveRecipe(theme.recipes.ToastContent, {}), className)}
        {...rest}
      />
    );
  },
});

export const ToastTitle = createComponent<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>({
  displayName: "Toast.Title",
  __kui: { groupSlot: "Toast" },
  render: ({ className, ...rest }, ref) => {
    const { theme } = useTheme();
    return (
      <div
        ref={ref}
        className={cn(resolveRecipe(theme.recipes.ToastTitle, {}), className)}
        {...rest}
      />
    );
  },
});

export const ToastDescription = createComponent<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>({
  displayName: "Toast.Description",
  __kui: { groupSlot: "Toast" },
  render: ({ className, ...rest }, ref) => {
    const { theme } = useTheme();
    return (
      <div
        ref={ref}
        className={cn(
          resolveRecipe(theme.recipes.ToastDescription, {}),
          className,
        )}
        {...rest}
      />
    );
  },
});

export interface ToastActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  dismissOnAction?: boolean;
}

export const ToastAction = createComponent<ToastActionProps, HTMLButtonElement>(
  {
    displayName: "Toast.Action",
    __kui: { groupSlot: "Toast" },
    render: ({ className, dismissOnAction = true, onClick, ...rest }, ref) => {
      const { theme } = useTheme();
      const { dismiss } = useToastItem("Toast.Action");
      return (
        <button
          ref={ref}
          type="button"
          className={cn(
            resolveRecipe(theme.recipes.ToastAction, {}),
            className,
          )}
          {...rest}
          onClick={(e) => {
            onClick?.(e);
            if (dismissOnAction && !e.defaultPrevented) dismiss();
          }}
        />
      );
    },
  },
);

export const ToastClose = createComponent<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>({
  displayName: "Toast.Close",
  __kui: { groupSlot: "Toast" },
  render: ({ className, children, onClick, ...rest }, ref) => {
    const { theme } = useTheme();
    const { dismiss } = useToastItem("Toast.Close");
    return (
      <button
        ref={ref}
        type="button"
        aria-label="Dismiss notification"
        className={cn(resolveRecipe(theme.recipes.ToastClose, {}), className)}
        {...rest}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) dismiss();
        }}
      >
        {children ?? (
          <Svg className="size-4">
            <path d="M18 6 6 18M6 6l12 12" />
          </Svg>
        )}
      </button>
    );
  },
});

const progressColors: Record<ToastStatus, string> = {
  neutral: "bg-kui-border",
  success: "bg-kui-success",
  error: "bg-kui-destructive",
  warning: "bg-kui-warning",
  info: "bg-kui-info",
  brand: "bg-kui-brand",
};

interface SwipeState {
  startX: number;
  startY: number;
  startedAt: number;
}

const SWIPE_DISTANCE = 80;
const SWIPE_VELOCITY = 0.5;
const STACK_PEEK_HEIGHT = 12;

function ToastItem({
  entry,
  placement,
  stackIndex,
  expanded,
}: {
  entry: ToastEntry;
  placement: ToastPlacement;
  stackIndex: number;
  expanded: boolean;
}) {
  const { theme } = useTheme();
  const viewport = useContext(ViewportContext);
  const [localPaused, setLocalPaused] = useState(false);
  const swipeRef = useRef<SwipeState | null>(null);
  const [swipeX, setSwipeX] = useState(0);
  const [swiping, setSwiping] = useState(false);

  const isStacked = stackIndex > 0 && !expanded;
  const closing = !!entry.closing;
  const loading = !!entry.loading;

  const duration = loading
    ? Infinity
    : (entry.duration ?? toastStore.getConfig().duration);
  const dismiss = useCallback(() => toastStore.dismiss(entry.id), [entry.id]);

  const { progress } = useToastTimer({
    duration,
    paused: viewport.paused || localPaused || closing,
    resetKey: entry.rev,
    onExpire: dismiss,
  });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (closing || e.button !== 0) return;

    // Don't intercept clicks on interactive toast content.
    if (
      e.target instanceof Element &&
      e.target.closest(
        'button, a, input, textarea, select, [role="button"], [data-no-swipe]',
      )
    ) {
      return;
    }

    swipeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startedAt: performance.now(),
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = swipeRef.current;
    if (!start) return;

    const deltaX = e.clientX - start.startX;
    const deltaY = e.clientY - start.startY;

    // Let vertical scrolling and gestures behave normally.
    if (Math.abs(deltaY) > Math.abs(deltaX) && !swiping) return;

    if (Math.abs(deltaX) > 6) {
      setSwiping(true);
      setSwipeX(deltaX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = swipeRef.current;
    if (!start) return;

    const deltaX = e.clientX - start.startX;
    const elapsed = Math.max(performance.now() - start.startedAt, 1);
    const velocity = Math.abs(deltaX) / elapsed;

    swipeRef.current = null;
    setSwiping(false);

    if (
      Math.abs(deltaX) >= SWIPE_DISTANCE ||
      (Math.abs(deltaX) >= 30 && velocity >= SWIPE_VELOCITY)
    ) {
      dismiss();
      return;
    }

    setSwipeX(0);
  };

  const handlePointerCancel = () => {
    swipeRef.current = null;
    setSwiping(false);
    setSwipeX(0);
  };

  useEffect(() => {
    if (!closing) return;
    const t = setTimeout(
      () => toastStore.remove(entry.id),
      prefersReducedMotion() ? 0 : EXIT_MS,
    );
    return () => clearTimeout(t);
  }, [closing, entry.id]);

  useValidateChildren("Toast", entry.children);

  const ctx = useMemo<ToastItemContextValue>(
    () => ({
      id: entry.id,
      status: entry.status,
      loading,
      dismiss,
      pause: () => setLocalPaused(true),
      resume: () => setLocalPaused(false),
    }),
    [entry.id, entry.status, loading, dismiss],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") dismiss();
  };

  const compound = entry.children != null;

  return (
    <ToastItemContext.Provider value={ctx}>
      <div
        role={entry.status === "error" ? "alert" : "status"}
        aria-atomic="true"
        data-kui-toast=""
        data-status={entry.status}
        data-state={closing ? "closed" : "open"}
        data-placement={placement}
        data-stacked={isStacked ? "" : undefined}
        data-swiping={swiping ? "" : undefined}
        className={resolveRecipe(theme.recipes.Toast, { status: entry.status })}
        style={{
          translate: `${swipeX}px 0`,
          transition: swiping ? "none" : "translate 180ms ease-out",
          maxHeight: isStacked ? STACK_PEEK_HEIGHT : 500,
          overflow: isStacked ? "hidden" : undefined,
          touchAction: "pan-y",
          zIndex: 100 - stackIndex,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onKeyDown={onKeyDown}
      >
        {compound ? (
          entry.children
        ) : (
          <>
            <ToastIcon>{entry.icon}</ToastIcon>
            <ToastContent>
              {entry.title != null && <ToastTitle>{entry.title}</ToastTitle>}
              {entry.description != null && (
                <ToastDescription>{entry.description}</ToastDescription>
              )}
            </ToastContent>
            {entry.action && (
              <ToastAction
                dismissOnAction={entry.action.dismissOnAction}
                onClick={entry.action.onClick}
              >
                {entry.action.label}
              </ToastAction>
            )}
            {entry.dismissible !== false && <ToastClose />}
          </>
        )}
        {entry.showProgress !== false &&
          !loading &&
          Number.isFinite(duration) &&
          duration > 0 && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 overflow-hidden rounded-b-xl bg-kui-border/40"
            >
              <div
                className={cn(
                  "h-full origin-left rtl:origin-right",
                  progressColors[entry.status],
                )}
                style={{
                  transform: `scaleX(${progress / 100})`,
                }}
              />
            </div>
          )}
      </div>
    </ToastItemContext.Provider>
  );
}

export interface ToastViewportProps extends HTMLAttributes<HTMLDivElement> {
  placement?: ToastPlacement;
  offset?: number;
  gap?: number;
  label?: string;
  container?: HTMLElement | null;
}

export const ToastViewport = createComponent<
  ToastViewportProps,
  HTMLDivElement
>({
  displayName: "Toast.Viewport",
  __kui: { role: "display" },
  render: (
    {
      placement = "bottom-end",
      offset = 16,
      gap = 8,
      label = "Notifications",
      container,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const { theme } = useTheme();
    const entries = useToasts();
    const [mounted, setMounted] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const [hidden, setHidden] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
      const sync = () => setHidden(document.hidden);
      sync();
      document.addEventListener("visibilitychange", sync);
      return () => document.removeEventListener("visibilitychange", sync);
    }, []);

    useEffect(() => registerViewport(), []);

    const empty = entries.length === 0;
    const expanded = hovered || focused;

    useEffect(() => {
      if (empty) {
        setHovered(false);
        setFocused(false);
      }
    }, [empty]);

    const ctx = useMemo<ViewportContextValue>(
      () => ({ paused: hovered || focused || hidden, placement }),
      [hovered, focused, hidden, placement],
    );

    if (!mounted || empty) return null;

    const pad = (side: "top" | "right" | "bottom" | "left") =>
      `calc(${offset}px + env(safe-area-inset-${side}, 0px))`;

    return createPortal(
      <ViewportContext.Provider value={ctx}>
        <div
          ref={ref}
          role="region"
          aria-label={label}
          tabIndex={-1}
          data-kui-toast-viewport=""
          className={cn(
            resolveRecipe(theme.recipes.ToastViewport, { placement }),
            className,
          )}
          style={{
            paddingTop: pad("top"),
            paddingRight: pad("right"),
            paddingBottom: pad("bottom"),
            paddingLeft: pad("left"),
            gap: expanded ? gap : 0,
            ...style,
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null))
              setFocused(false);
          }}
          {...rest}
        >
          {entries.map((entry, index) => {
            const stackIndex = entries.length - index - 1;

            return (
              <ToastItem
                key={entry.id}
                entry={entry}
                placement={placement}
                stackIndex={stackIndex}
                expanded={expanded}
              />
            );
          })}
        </div>
      </ViewportContext.Provider>,
      container ?? document.body,
    );
  },
});

export interface ToastProviderProps {
  children?: ReactNode;
  maxVisible?: number;
  duration?: number;
  // TODO: read these through KreativUIProvider's component-defaults pipeline once it exists.
}

export const ToastProvider = createComponent<ToastProviderProps, HTMLElement>({
  displayName: "Toast.Provider",
  __kui: { role: "display" },
  render: ({ children, maxVisible, duration }, _ref) => {
    useEffect(() => {
      toastStore.configure({
        ...(maxVisible != null && { maxVisible }),
        ...(duration != null && { duration }),
      });
    }, [maxVisible, duration]);
    return <>{children}</>;
  },
});

export interface ToastRootProps extends ToastOptions {
  status?: ToastStatus;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

export const ToastRoot = createComponent<ToastRootProps, HTMLElement>({
  displayName: "Toast.Root",
  __kui: {
    role: "display",
    video: { id: "toast", safe: false },
  },
  render: (
    {
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      onDismiss,
      children,
      id: idProp,
      status = "neutral",
      title,
      description,
      icon,
      action,
      duration,
      dismissible,
      showProgress = true,
    },
    _ref,
  ) => {
    const autoId = useId();
    const id = idProp ?? `kui-toast-${autoId}`;

    const [inner, setInner] = useState(defaultOpen);
    const controlled = openProp !== undefined;
    const open = controlled ? openProp : inner;

    const latest = useRef({ onOpenChange, onDismiss, controlled });
    latest.current = { onOpenChange, onDismiss, controlled };

    const fields = {
      status,
      title,
      description,
      icon,
      action,
      duration,
      dismissible,
      children,
      showProgress,
    };
    const fieldsRef = useRef(fields);
    fieldsRef.current = fields;

    useEffect(() => {
      if (!open) return;
      toastStore.upsert(id, {
        ...fieldsRef.current,
        onDismiss: () => {
          latest.current.onDismiss?.(id);
          if (!latest.current.controlled) setInner(false);
          latest.current.onOpenChange?.(false);
        },
      });
      return () => toastStore.deregister(id);
    }, [open, id]);

    useEffect(() => {
      if (open) toastStore.patch(id, fields);
    });

    return null;
  },
});

export const Toast = {
  Provider: ToastProvider,
  Viewport: ToastViewport,
  Root: ToastRoot,
  Icon: ToastIcon,
  Content: ToastContent,
  Title: ToastTitle,
  Description: ToastDescription,
  Action: ToastAction,
  Close: ToastClose,
};
